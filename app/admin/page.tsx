"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, Check, X, Users, RefreshCw, Loader2, Database, Clock } from "lucide-react";
import { useAuth, AuthUser } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay },
});

export default function AdminPage() {
    const { user, getPendingDoctors, approveDoctor, rejectDoctor, loading: authLoading } = useAuth();
    const [pending, setPending] = useState<AuthUser[]>([]);
    const [loadingList, setLoadingList] = useState(true);
    const [actionDone, setActionDone] = useState<Record<string, "approved" | "rejected">>({});
    const [processingId, setProcessingId] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (authLoading) return;
        if (user && user.role !== "admin") {
            router.push("/");
            return;
        }
        fetchPending();
    }, [user, authLoading, router]);

    const fetchPending = async () => {
        setLoadingList(true);
        try {
            const docs = await getPendingDoctors();
            setPending(docs);
        } catch (err) {
            console.error("Failed to fetch pending doctors:", err);
        }
        setLoadingList(false);
    };

    const handleApprove = async (uid: string) => {
        setProcessingId(uid);
        try {
            await approveDoctor(uid);
            setActionDone(prev => ({ ...prev, [uid]: "approved" }));
            setTimeout(() => fetchPending(), 800);
        } catch (err) {
            console.error("Approve failed:", err);
        }
        setProcessingId(null);
    };

    const handleReject = async (uid: string) => {
        setProcessingId(uid);
        try {
            await rejectDoctor(uid);
            setActionDone(prev => ({ ...prev, [uid]: "rejected" }));
            setTimeout(() => fetchPending(), 800);
        } catch (err) {
            console.error("Reject failed:", err);
        }
        setProcessingId(null);
    };

    return (
        <ProtectedRoute>
            <div className="flex-1 bg-white py-24 px-6 relative overflow-hidden min-h-screen font-body">
                {/* HUD Blueprint Grid */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                    style={{ backgroundImage: `linear-gradient(#0f172a 1px, transparent 1px), linear-gradient(90deg, #0f172a 1px, transparent 1px)`, backgroundSize: '40px 40px' }} 
                />
                
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[60vh] bg-gradient-to-b from-slate-50 to-transparent pointer-events-none" />

                <div className="container mx-auto max-w-6xl relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                        <div className="max-w-2xl">
                            <motion.div {...fadeUp()}>
                                <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-mono font-bold uppercase tracking-[0.2em] mb-6">
                                    <Shield className="w-3.5 h-3.5" /> ACCESS_NODE: ADMIN_PANEL_v4.2
                                </div>
                            </motion.div>
                            <motion.h1 {...fadeUp(0.1)} className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight uppercase">
                                Clinical <span className="text-slate-400 font-light italic">Registry</span>
                            </motion.h1>
                            <motion.p {...fadeUp(0.2)} className="text-slate-500 text-lg leading-relaxed font-medium">
                                Manage medical affiliation verification and system access authorization.
                            </motion.p>
                        </div>

                        {/* Quick Data HUD */}
                        <motion.div {...fadeUp(0.3)} className="hidden lg:flex flex-col items-end text-right">
                            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1 font-bold">REGISTRY_PATH</span>
                            <span className="text-xs font-mono text-slate-900 font-bold uppercase tracking-tight">/USERS/DOCTORS/PENDING</span>
                        </motion.div>
                    </div>

                    {/* Technical Registry Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                        {[
                            { label: "Pending_Approval", value: pending.length, icon: Clock, color: "text-amber-600" },
                            { label: "Session_Type", value: "AUTH_ADMIN", icon: Shield, color: "text-slate-900" },
                            { label: "Database_Link", value: "CLINICAL_v4", icon: Database, color: "text-slate-400" },
                            { label: "System_Health", value: "OPTIMAL", icon: Check, color: "text-slate-900" },
                        ].map((stat, i) => (
                            <motion.div key={i} {...fadeUp(i * 0.08 + 0.3)}
                                className="p-8 rounded-2xl bg-white border border-slate-100 shadow-2xl shadow-slate-900/5 relative group"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-900 group-hover:bg-slate-900 group-hover:text-white transition-all">
                                        <stat.icon className="w-4 h-4" />
                                    </div>
                                    <span className="text-[10px] font-mono text-slate-200">ID_0{i+1}</span>
                                </div>
                                <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</div>
                                <div className={`text-2xl font-mono font-bold ${stat.color} tracking-tighter uppercase`}>{stat.value}</div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Table Container with HUD Framing */}
                    <div className="relative">
                        {/* HUD Corner Accents */}
                        <div className="absolute -top-4 -left-4 w-10 h-10 border-t-2 border-l-2 border-slate-200 rounded-tl-xl pointer-events-none" />
                        <div className="absolute -top-4 -right-4 w-10 h-10 border-t-2 border-r-2 border-slate-200 rounded-tr-xl pointer-events-none" />
                        <div className="absolute -bottom-4 -left-4 w-10 h-10 border-b-2 border-l-2 border-slate-200 rounded-bl-xl pointer-events-none" />
                        <div className="absolute -bottom-4 -right-4 w-10 h-10 border-b-2 border-r-2 border-slate-200 rounded-br-xl pointer-events-none" />
                        
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl shadow-slate-900/5 overflow-hidden">
                            <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 bg-slate-50/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                                        <Users className="w-4 h-4" />
                                    </div>
                                    <h2 className="text-[10px] font-mono font-bold text-slate-900 uppercase tracking-widest">PENDING_DOCTOR_VERIFICATION</h2>
                                </div>
                                <button onClick={fetchPending} className="flex items-center gap-2 text-[10px] font-mono font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-[0.2em]">
                                    <RefreshCw className={`w-3.5 h-3.5 ${loadingList ? "animate-spin" : ""}`} /> REFRESH_LIST
                                </button>
                            </div>

                            {loadingList ? (
                                <div className="px-8 py-20 text-center">
                                    <div className="flex flex-col items-center gap-6">
                                        <div className="w-6 h-6 border-2 border-slate-100 border-t-slate-900 rounded-full animate-spin" />
                                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">QUERYING_CLINICAL_DATABASE...</span>
                                    </div>
                                </div>
                            ) : pending.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left font-mono">
                                        <thead>
                                            <tr className="bg-slate-50 border-b border-slate-100">
                                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">IDENTITY_NAME</th>
                                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">CONTACT_EMAIL</th>
                                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">VERIFICATION_STATUS</th>
                                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">AUTHORIZATION</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {pending.map((doc) => {
                                                const status = actionDone[doc.uid];
                                                const isProcessing = processingId === doc.uid;
                                                return (
                                                    <motion.tr
                                                        key={doc.uid}
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        className="hover:bg-slate-50/50 transition-colors"
                                                    >
                                                        <td className="px-8 py-6 text-xs font-bold text-slate-900 uppercase tracking-wide">{doc.name}</td>
                                                        <td className="px-8 py-6 text-[10px] text-slate-400 uppercase tracking-widest">{doc.email}</td>
                                                        <td className="px-8 py-6">
                                                            {status === "approved" ? (
                                                                <span className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase tracking-widest">
                                                                    <Check className="w-3 h-3" /> VERIFIED
                                                                </span>
                                                            ) : status === "rejected" ? (
                                                                <span className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-red-100 text-red-700 text-[10px] font-bold rounded uppercase tracking-widest">
                                                                    <X className="w-3 h-3" /> REJECTED
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-amber-100 text-amber-700 text-[10px] font-bold rounded uppercase tracking-widest">
                                                                    <div className="w-1 h-1 rounded-full bg-amber-400 animate-pulse" /> PENDING
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="px-8 py-6 text-right">
                                                            {!status && (
                                                                <div className="flex items-center gap-3 justify-end">
                                                                    <button
                                                                        onClick={() => handleApprove(doc.uid)}
                                                                        disabled={isProcessing}
                                                                        className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-[10px] font-bold rounded uppercase tracking-widest hover:bg-slate-800 transition disabled:opacity-50 shadow-xl shadow-slate-900/10 active:scale-95"
                                                                    >
                                                                        {isProcessing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />} VERIFY
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleReject(doc.uid)}
                                                                        disabled={isProcessing}
                                                                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-500 text-[10px] font-bold rounded uppercase tracking-widest hover:bg-slate-50 hover:text-red-600 transition disabled:opacity-50 active:scale-95"
                                                                    >
                                                                        <X className="w-3 h-3" /> REJECT
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </td>
                                                    </motion.tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="px-8 py-32 text-center">
                                    <span className="text-[10px] font-mono text-slate-300 uppercase tracking-widest italic">NO_PENDING_REGISTRATIONS_IDENTIFIED</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer Metadata */}
                    <div className="mt-20 pt-8 border-t border-slate-100 flex justify-between items-center opacity-40 font-mono text-slate-400">
                        <span className="text-[10px] uppercase tracking-widest">REGISTRY_MODAL: STABLE</span>
                        <span className="text-[10px] uppercase tracking-widest">ACCESS_TOKEN: AUTH_7749</span>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
