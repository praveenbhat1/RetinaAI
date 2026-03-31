"use client";

import { motion } from "framer-motion";
import { Clock, ArrowLeft, LogOut, ShieldCheck, FileCheck, UserCheck, Stethoscope, CheckCircle2, Mail } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: "easeOut" as const },
});

const STEPS = [
    {
        icon: FileCheck,
        label: "Application Submitted",
        sublabel: "Your registration details have been received.",
        status: "done",
    },
    {
        icon: ShieldCheck,
        label: "Credential Verification",
        sublabel: "License number and documents under review.",
        status: "active",
    },
    {
        icon: UserCheck,
        label: "Admin Approval",
        sublabel: "Awaiting final clearance from the system administrator.",
        status: "pending",
    },
    {
        icon: Stethoscope,
        label: "Access Granted",
        sublabel: "Full access to the Retinex diagnostic engine.",
        status: "pending",
    },
];

export default function PendingPage() {
    const { user, logout } = useAuth();

    return (
        <ProtectedRoute>
            <div className="flex-1 relative overflow-hidden bg-white min-h-screen font-body">
                {/* Blueprint Grid */}
                <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
                    style={{ backgroundImage: `linear-gradient(#0f172a 1px, transparent 1px), linear-gradient(90deg, #0f172a 1px, transparent 1px)`, backgroundSize: "40px 40px" }}
                />

                {/* Top glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70vw] h-[50vh] bg-gradient-to-b from-slate-50 to-transparent pointer-events-none" />

                {/* Floating animated orb */}
                <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-amber-50 blur-3xl opacity-60 pointer-events-none animate-pulse" />
                <div className="absolute bottom-20 left-10 w-64 h-64 rounded-full bg-slate-50 blur-3xl opacity-80 pointer-events-none" />

                <div className="relative z-10 flex items-center justify-center py-20 px-6 min-h-screen">
                    <div className="w-full max-w-2xl">

                        {/* ── Main Card ── */}
                        <motion.div {...fadeUp()} className="relative bg-white rounded-3xl shadow-2xl shadow-slate-900/8 border border-slate-200/80 overflow-hidden">

                            {/* Amber top accent bar */}
                            <div className="h-1 w-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400" />

                            {/* HUD corner markers */}
                            <div className="absolute top-4 left-4 text-[9px] font-mono text-slate-200 pointer-events-none select-none">[ SYS ]</div>
                            <div className="absolute top-4 right-4 text-[9px] font-mono text-slate-200 pointer-events-none select-none">[ v4.2 ]</div>

                            <div className="p-10 md:p-12">

                                {/* Icon + Status Badge */}
                                <motion.div {...fadeUp(0.1)} className="flex flex-col items-center mb-10">
                                    {/* Animated clock icon */}
                                    <div className="relative mb-6">
                                        <div className="w-20 h-20 rounded-2xl bg-amber-50 border border-amber-200/60 flex items-center justify-center shadow-lg shadow-amber-100">
                                            <Clock className="w-9 h-9 text-amber-500" />
                                        </div>
                                        {/* Pulsing ring */}
                                        <motion.div
                                            animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
                                            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                                            className="absolute inset-0 rounded-2xl border-2 border-amber-400"
                                        />
                                    </div>

                                    {/* Status chip */}
                                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-200 mb-5">
                                        <motion.div
                                            animate={{ opacity: [1, 0.3, 1] }}
                                            transition={{ repeat: Infinity, duration: 1.5 }}
                                            className="w-2 h-2 rounded-full bg-amber-400"
                                        />
                                        <span className="text-[11px] font-mono font-bold text-amber-700 uppercase tracking-widest">
                                            ACCESS_STATUS: PENDING_VERIFICATION
                                        </span>
                                    </div>

                                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight text-center mb-3">
                                        Verification in Progress
                                    </h1>
                                    <p className="text-slate-500 text-base leading-relaxed text-center max-w-md">
                                        Your medical credentials are being validated by our clinical team.
                                        You'll receive an email once your account is approved.
                                    </p>
                                </motion.div>

                                {/* ── Progress Steps ── */}
                                <motion.div {...fadeUp(0.2)} className="mb-10">
                                    <div className="relative">
                                        {/* Vertical connector line */}
                                        <div className="absolute left-[23px] top-8 bottom-8 w-px bg-slate-100" />

                                        <div className="space-y-4">
                                            {STEPS.map((step, i) => {
                                                const Icon = step.icon;
                                                const isDone = step.status === "done";
                                                const isActive = step.status === "active";
                                                return (
                                                    <motion.div
                                                        key={i}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: 0.3 + i * 0.1 }}
                                                        className={`relative flex items-start gap-4 p-4 rounded-xl border transition-all ${
                                                            isDone ? "bg-emerald-50/50 border-emerald-100"
                                                            : isActive ? "bg-amber-50/60 border-amber-200"
                                                            : "bg-slate-50/50 border-slate-100"
                                                        }`}
                                                    >
                                                        {/* Step Icon */}
                                                        <div className={`relative flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center z-10 ${
                                                            isDone ? "bg-emerald-100 border border-emerald-200"
                                                            : isActive ? "bg-amber-100 border border-amber-200"
                                                            : "bg-slate-100 border border-slate-200"
                                                        }`}>
                                                            {isDone
                                                                ? <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                                                : isActive
                                                                    ? <motion.div animate={{ opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 1.8 }}>
                                                                        <Icon className="w-5 h-5 text-amber-600" />
                                                                      </motion.div>
                                                                    : <Icon className="w-5 h-5 text-slate-300" />
                                                            }
                                                        </div>

                                                        {/* Step Text */}
                                                        <div className="flex-1 min-w-0 pt-0.5">
                                                            <div className="flex items-center gap-2 mb-0.5">
                                                                <p className={`text-sm font-bold tracking-tight ${isDone ? "text-emerald-700" : isActive ? "text-amber-700" : "text-slate-400"}`}>
                                                                    {step.label}
                                                                </p>
                                                                {isDone && <span className="text-[9px] font-mono font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full uppercase tracking-widest">Done</span>}
                                                                {isActive && <span className="text-[9px] font-mono font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full uppercase tracking-widest">In Progress</span>}
                                                            </div>
                                                            <p className={`text-xs leading-relaxed ${isDone ? "text-emerald-600/70" : isActive ? "text-amber-600/70" : "text-slate-400"}`}>
                                                                {step.sublabel}
                                                            </p>
                                                        </div>

                                                        {/* Step number */}
                                                        <span className="text-[10px] font-mono text-slate-300 flex-shrink-0 pt-1">0{i + 1}</span>
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </motion.div>

                                {/* ── User Info Card ── */}
                                {user && (
                                    <motion.div {...fadeUp(0.4)} className="mb-8 p-5 rounded-2xl bg-slate-50 border border-slate-100">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">REGISTRATION_IDENTITY</span>
                                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 rounded-lg">
                                                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                                                <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">Pending</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-900 font-bold text-lg shadow-sm">
                                                {user.name?.[0]?.toUpperCase() ?? "D"}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">{user.name}</p>
                                                <p className="text-xs text-slate-400 font-mono">{user.email}</p>
                                            </div>
                                            <div className="ml-auto hidden sm:flex items-center gap-1.5 text-slate-400">
                                                <Mail className="w-3.5 h-3.5" />
                                                <span className="text-[10px] font-mono uppercase tracking-widest">Notification sent</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* ── Action Buttons ── */}
                                <motion.div {...fadeUp(0.5)} className="flex flex-col sm:flex-row gap-3">
                                    <Link href="/"
                                        className="flex-1 flex items-center justify-center gap-2.5 py-3.5 px-6 bg-white border border-slate-200 text-slate-700 font-mono font-bold text-[11px] uppercase tracking-widest rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 shadow-sm">
                                        <ArrowLeft className="w-4 h-4" />
                                        Return Home
                                    </Link>
                                    <button
                                        onClick={() => logout()}
                                        className="flex-1 flex items-center justify-center gap-2.5 py-3.5 px-6 bg-slate-900 text-white font-mono font-bold text-[11px] uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-900/20"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Sign Out
                                    </button>
                                </motion.div>
                            </div>

                            {/* Bottom HUD Footer */}
                            <div className="px-10 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                                <span className="text-[9px] font-mono text-slate-300 uppercase tracking-[0.2em]">RETINEX_DOCTOR_QUEUE</span>
                                <span className="text-[9px] font-mono text-slate-300 uppercase tracking-[0.2em]">EST_REVIEW: 24–48H</span>
                            </div>
                        </motion.div>

                        {/* Help note below card */}
                        <motion.p {...fadeUp(0.6)} className="text-center text-xs text-slate-400 mt-6 font-medium">
                            Need help?{" "}
                            <a href="mailto:support@retinex.ai" className="text-slate-600 font-semibold hover:text-slate-900 transition-colors underline underline-offset-2">
                                Contact support
                            </a>
                        </motion.p>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
