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

export interface AuthUser {
    uid: string;
    name: string;
    email: string;
    role: UserRole;
}

interface AuthContextType {
    user: AuthUser | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (name: string, email: string, password: string, role: "patient" | "doctor") => Promise<void>;
    logout: () => Promise<void>;
    getPendingDoctors: () => Promise<AuthUser[]>;
    approveDoctor: (uid: string) => Promise<void>;
    rejectDoctor: (uid: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    // Listen to Firebase auth state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
            if (firebaseUser) {
                // Fetch role from Firestore
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
                    // User exists in Auth but not Firestore (edge case)
                    setUser({
                        uid: firebaseUser.uid,
                        name: firebaseUser.displayName || "",
                        email: firebaseUser.email || "",
                        role: "patient",
                    });
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signup = async (name: string, email: string, password: string, role: "patient" | "doctor"): Promise<void> => {
        // Create Firebase Auth account
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser = credential.user;

        // Set display name
        await updateProfile(firebaseUser, { displayName: name });

        // Determine role: doctor → pending_doctor until admin approves
        const assignedRole: UserRole = role === "doctor" ? "pending_doctor" : "patient";

        // Store user data in Firestore
        await setDoc(doc(db, "users", firebaseUser.uid), {
            name,
            email,
            role: assignedRole,
            createdAt: new Date().toISOString(),
        });

        setUser({
            uid: firebaseUser.uid,
            name,
            email,
            role: assignedRole,
        });
    };

    const login = async (email: string, password: string): Promise<void> => {
        if (!auth) {
            throw new Error("Authentication service is not initialized.");
        }

        try {
            const credential = await signInWithEmailAndPassword(auth, email, password);
            const firebaseUser = credential.user;

            // Fetch role from Firestore (gracefully handle if Firestore rules block access)
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
                    return;
                }
            } catch (firestoreErr) {
                console.warn("Firestore read failed, using Auth data:", firestoreErr);
            }

            // Fallback: user exists in Auth but Firestore doc missing or inaccessible
            setUser({
                uid: firebaseUser.uid,
                name: firebaseUser.displayName || "",
                email: firebaseUser.email || "",
                role: "patient",
            });
        } catch (authError) {
            throw authError;
        }
    };

    const logout = async (): Promise<void> => {
        await signOut(auth);
        setUser(null);
    };

    const getPendingDoctors = async (): Promise<AuthUser[]> => {
        const q = query(collection(db, "users"), where("role", "==", "pending_doctor"));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(d => ({
            uid: d.id,
            name: d.data().name,
            email: d.data().email,
            role: d.data().role as UserRole,
        }));
    };

    const approveDoctor = async (uid: string): Promise<void> => {
        await updateDoc(doc(db, "users", uid), { role: "doctor" });
    };

    const rejectDoctor = async (uid: string): Promise<void> => {
        await updateDoc(doc(db, "users", uid), { role: "patient" });
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout, getPendingDoctors, approveDoctor, rejectDoctor }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
