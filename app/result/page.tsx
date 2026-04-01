"use client";

import { motion } from "framer-motion";
import ResultCard from "@/components/ResultCard";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Zap, Activity, ShieldCheck, Database, Target, Clock, Fingerprint } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay },
});

function ResultContent() {
    const searchParams = useSearchParams();
    const confidence = searchParams.get("confidence") || "94.2";
    const prediction = searchParams.get("prediction") || "Moderate";
    const scanId = searchParams.get("scanId") || `RX-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

    return (
        <ProtectedRoute>
            <div className="flex-1 bg-white py-24 px-6 relative overflow-hidden min-h-screen font-body">
                {/* HUD Blueprint Grid Archive Effect */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{ backgroundImage: `linear-gradient(#0f172a 1px, transparent 1px), linear-gradient(90deg, #0f172a 1px, transparent 1px)`, backgroundSize: '40px 40px' }}
                />

                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[60vh] bg-gradient-to-b from-slate-50 to-transparent pointer-events-none" />

                <div className="container mx-auto max-w-6xl relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                        <div className="max-w-2xl">
                            <motion.div {...fadeUp()}>
                                <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-bold uppercase tracking-[0.2em] mb-6 font-mono">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                    ANALYSIS_COMPLETE_v4.2.0
                                </div>
                            </motion.div>
                            <motion.h1 {...fadeUp(0.1)} className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
                                Neural Diagnostic <span className="text-slate-400 font-light italic">/</span> Report
                            </motion.h1>
                            <motion.p {...fadeUp(0.2)} className="text-slate-500 text-lg leading-relaxed font-medium">
                                High-resolution inference grid generated. Review clinical classification parameters below.
                            </motion.p>
                        </div>

                        {/* Quick Metadata HUD */}
                        <motion.div {...fadeUp(0.3)} className="hidden lg:flex flex-col items-end text-right">
                            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1 font-bold">SEQUENCE_ID</span>
                            <span className="text-xs font-mono text-slate-900 font-bold uppercase tracking-tight">{scanId}</span>
                        </motion.div>
                    </div>

                    {/* Technical Stat Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                        {[
                            { label: "Certainty_Index", value: `${Math.round(Number(confidence)*10)/10}%`, icon: Target, color: "text-slate-900" },
                            { label: "Classification", value: String(prediction).toUpperCase(), icon: ShieldCheck, color: "text-slate-900" },
                            { label: "Neural_Engine", value: "EfficientNet-B3", icon: Database, color: "text-slate-400" },
                            { label: "Clinical_Target", value: "87.0%_ACC", icon: Activity, color: "text-emerald-600" },
                        ].map((stat, i) => (
                            <motion.div key={i} {...fadeUp(i * 0.08 + 0.3)}
                                className="p-8 rounded-2xl bg-white border border-slate-100 shadow-2xl shadow-slate-900/5 relative group"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-900 group-hover:bg-slate-900 group-hover:text-white transition-all">
                                        <stat.icon className="w-4 h-4" />
                                    </div>
                                    <span className="text-[10px] font-mono text-slate-200">PRO_v4.2</span>
                                </div>
                                <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</div>
                                <div className={`text-2xl font-mono font-bold ${stat.color} tracking-tighter uppercase truncate`}>{stat.value}</div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Workstation Frame */}
                    <div className="relative max-w-4xl mx-auto">
                        {/* HUD Corner Accents */}
                        <div className="absolute -top-4 -left-4 w-10 h-10 border-t-2 border-l-2 border-slate-200 rounded-tl-xl pointer-events-none" />
                        <div className="absolute -top-4 -right-4 w-10 h-10 border-t-2 border-r-2 border-slate-200 rounded-tr-xl pointer-events-none" />
                        <div className="absolute -bottom-4 -left-4 w-10 h-10 border-b-2 border-l-2 border-slate-200 rounded-bl-xl pointer-events-none" />
                        <div className="absolute -bottom-4 -right-4 w-10 h-10 border-b-2 border-r-2 border-slate-200 rounded-br-xl pointer-events-none" />

                        <ResultCard prediction={prediction as any} confidence={Number(confidence)} scanId={scanId} />
                    </div>

                    {/* System Index Footer */}
                    <div className="max-w-4xl mx-auto mt-20 pt-8 border-t border-slate-100 flex justify-between items-center opacity-40 font-mono">
                        <span className="text-[10px] text-slate-400 uppercase tracking-widest">SESSION_QUERY: ARCHIVED</span>
                        <span className="text-[10px] text-slate-400 uppercase tracking-widest">RETINEX_ANALYTICS_ENABLED</span>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}

export default function ResultPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
                <div className="w-8 h-8 border-2 border-slate-100 border-t-slate-900 rounded-full animate-spin"></div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">INITIALIZING_REPORT...</span>
            </div>
        }>
            <ResultContent />
        </Suspense>
    );
}
