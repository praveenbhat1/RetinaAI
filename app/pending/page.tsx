"use client";

import { motion } from "framer-motion";
import { Clock, ArrowLeft, LogOut } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay },
});

export default function PendingPage() {
    const { user, logout } = useAuth();

    return (
        <ProtectedRoute>
            <div className="flex-1 relative overflow-hidden bg-white min-h-screen font-body">
                {/* HUD Blueprint Grid */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                    style={{ backgroundImage: `linear-gradient(#0f172a 1px, transparent 1px), linear-gradient(90deg, #0f172a 1px, transparent 1px)`, backgroundSize: '40px 40px' }} 
                />
                
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[50vh] bg-gradient-to-b from-slate-50 to-transparent pointer-events-none" />

                <div className="relative z-10 flex items-center justify-center py-24 px-6 min-h-screen">
                    <motion.div
                        {...fadeUp()}
                        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl shadow-slate-900/5 border border-slate-200 p-12 text-center relative"
                    >
                        {/* HUD Corner Accents */}
                        <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-slate-200 rounded-tl-lg pointer-events-none" />
                        <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-slate-200 rounded-tr-lg pointer-events-none" />
                        <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-slate-200 rounded-bl-lg pointer-events-none" />
                        <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-slate-200 rounded-br-lg pointer-events-none" />

                        <div className="w-16 h-16 bg-slate-50 border border-slate-200 mx-auto rounded-xl flex items-center justify-center text-slate-900 mb-8">
                            <Clock className="w-7 h-7 animate-pulse" />
                        </div>

                        <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.3em] mb-4">ACCESS_STATUS: PENDING_VERIFICATION</div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight uppercase">Credential Review</h1>
                        <p className="text-slate-500 text-lg leading-relaxed mb-10 font-medium">
                            Your medical affiliation is currently undergoing clinical validation. Access to the high-precision neural engine will be granted upon administrative approval.
                        </p>

                        {user && (
                            <div className="mb-10 p-6 rounded-xl bg-slate-50 border border-slate-100 text-left font-mono">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">REGISTRATION_IDENTITY</span>
                                    <span className="px-2 py-0.5 bg-white border border-slate-200 text-slate-900 text-[10px] font-bold rounded uppercase">STATION: 01</span>
                                </div>
                                <p className="text-xs font-bold text-slate-900 mb-0.5 uppercase tracking-wide">{user.name}</p>
                                <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-4">{user.email}</p>
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-200 animate-pulse" />
                                    STATUS: DOCTOR_v_PENDING
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/" className="flex-1 flex items-center justify-center gap-3 py-4 px-6 bg-white border border-slate-200 text-slate-900 font-mono font-bold text-[11px] uppercase tracking-widest rounded-xl hover:bg-slate-50 transition active:scale-95 shadow-sm">
                                <ArrowLeft className="w-4 h-4" /> RETURN_HOME
                            </Link>
                            <button
                                onClick={() => logout()}
                                className="flex-1 flex items-center justify-center gap-3 py-4 px-6 bg-slate-900 text-white font-mono font-bold text-[11px] uppercase tracking-widest rounded-xl hover:bg-slate-800 transition active:scale-95 shadow-2xl"
                            >
                                <LogOut className="w-4 h-4" /> TERMINATE_SESSION
                            </button>
                        </div>

                        {/* HUD Meta Footer */}
                        <div className="mt-12 pt-8 border-t border-slate-100 flex justify-center opacity-30 font-mono">
                            <span className="text-[9px] text-slate-400 uppercase tracking-[0.2em]">SYSTEM_WAIT_PROTOCOL: 72H_EST</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
