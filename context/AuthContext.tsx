"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { auth, db } from "@/lib/firebase";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
    User as FirebaseUser,
} from "firebase/auth";
import {
    doc,
    setDoc,
    getDoc,
    getDocs,
    updateDoc,
    collection,
    query,
    where,
} from "firebase/firestore";

export type UserRole = "patient" | "doctor" | "pending_doctor" | "admin";

export interface DoctorProfileData {
    licenseNumber: string;
    practiceType: "hospital" | "clinic" | "both" | "";
    hospitalName: string;
    clinicName: string;
    specialization: string;
}

export interface AuthUser {
    uid: string;
    name: string;
    email: string;
    role: UserRole;
    licenseNumber?: string;
    practiceType?: string;
    hospitalName?: string;
    clinicName?: string;
    specialization?: string;
}

interface AuthContextType {
    user: AuthUser | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (name: string, email: string, password: string, role: "patient" | "doctor", doctorData?: DoctorProfileData) => Promise<void>;
    logout: () => Promise<void>;
    isAuthBusy: boolean;
    getPendingDoctors: () => Promise<AuthUser[]>;
    approveDoctor: (uid: string) => Promise<void>;
    rejectDoctor: (uid: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAuthBusy, setIsAuthBusy] = useState(false);

    // Listen to Firebase auth state
    useEffect(() => {
        if (!auth || !db) {
            setLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
            if (firebaseUser) {
                try {
                    const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
                    if (userDoc.exists()) {
                        const data = userDoc.data();
                        setUser({
                            uid: firebaseUser.uid,
                            name: data.name || firebaseUser.displayName || "",
                            email: firebaseUser.email || "",
                            role: data.role as UserRole,
                        });
                    } else {
                        setUser({
                            uid: firebaseUser.uid,
                            name: firebaseUser.displayName || "",
                            email: firebaseUser.email || "",
                            role: "patient",
                        });
                    }
                } catch (err) {
                    console.error("Auth initialization error:", err);
                    setUser(null);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signup = async (name: string, email: string, password: string, role: "patient" | "doctor", doctorData?: DoctorProfileData): Promise<void> => {
        if (!auth || !db) throw new Error("Firebase services are not available.");
        setIsAuthBusy(true);

        const executeSignup = async (attempt = 1): Promise<void> => {
            try {
                const credential = await createUserWithEmailAndPassword(auth, email, password);
                const firebaseUser = credential.user;
                await updateProfile(firebaseUser, { displayName: name });

                const assignedRole: UserRole = role === "doctor" ? "pending_doctor" : "patient";
                const userData: Record<string, any> = {
                    name, email, role: assignedRole,
                    status: role === "doctor" ? "pending" : "active",
                    createdAt: new Date().toISOString(),
                };

                if (role === "doctor" && doctorData) {
                    userData.licenseNumber = doctorData.licenseNumber;
                    userData.practiceType = doctorData.practiceType;
                    userData.hospitalName = doctorData.hospitalName;
                    userData.clinicName = doctorData.clinicName;
                    userData.specialization = doctorData.specialization;
                }

                await setDoc(doc(db, "users", firebaseUser.uid), userData);
                setUser({ uid: firebaseUser.uid, name, email, role: assignedRole });
            } catch (err: any) {
                if (err.code === "auth/network-request-failed" && attempt < 3) {
                    console.warn(`[Retinex Auth] Network failed. Retrying attempt ${attempt + 1}...`);
                    await new Promise(r => setTimeout(r, 1500));
                    return executeSignup(attempt + 1);
                }
                throw err;
            }
        };

        try {
            await executeSignup();
        } finally {
            setIsAuthBusy(false);
        }
    };

    const login = async (email: string, password: string): Promise<void> => {
        if (!auth || !db) throw new Error("Firebase services are not available.");
        setIsAuthBusy(true);

        const executeLogin = async (attempt = 1): Promise<void> => {
            try {
                const credential = await signInWithEmailAndPassword(auth, email, password);
                const firebaseUser = credential.user;
                const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    setUser({
                        uid: firebaseUser.uid,
                        name: data.name || firebaseUser.displayName || "",
                        email: firebaseUser.email || "",
                        role: data.role as UserRole,
                    });
                } else {
                    setUser({
                        uid: firebaseUser.uid,
                        name: firebaseUser.displayName || "",
                        email: firebaseUser.email || "",
                        role: "patient",
                    });
                }
            } catch (err: any) {
                if (err.code === "auth/network-request-failed" && attempt < 3) {
                    console.warn(`[Retinex Auth] Network failed. Retrying attempt ${attempt + 1}...`);
                    await new Promise(r => setTimeout(r, 1500));
                    return executeLogin(attempt + 1);
                }
                throw err;
            }
        };

        try {
            await executeLogin();
        } finally {
            setIsAuthBusy(false);
        }
    };

    const logout = async (): Promise<void> => {
        if (!auth) return;
        await signOut(auth);
        setUser(null);
    };

    const getPendingDoctors = async (): Promise<AuthUser[]> => {
        if (!db) return [];
        const q = query(collection(db, "users"), where("role", "==", "pending_doctor"));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(d => {
            const data = d.data();
            return {
                uid: d.id,
                name: data.name,
                email: data.email,
                role: data.role as UserRole,
                licenseNumber: data.licenseNumber,
                practiceType: data.practiceType,
                hospitalName: data.hospitalName,
                clinicName: data.clinicName,
                specialization: data.specialization,
            };
        }) as AuthUser[];
    };

    const approveDoctor = async (uid: string): Promise<void> => {
        if (!db) return;
        await updateDoc(doc(db, "users", uid), { role: "doctor" });
    };

    const rejectDoctor = async (uid: string): Promise<void> => {
        if (!db) return;
        await updateDoc(doc(db, "users", uid), { role: "patient" });
    };

    return (
        <AuthContext.Provider value={{ user, loading, isAuthBusy, login, signup, logout, getPendingDoctors, approveDoctor, rejectDoctor }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
