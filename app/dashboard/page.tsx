"use client";

import UploadCard from "@/components/UploadCard";
import { motion } from "framer-motion";
import { Brain, Activity, Zap, ShieldCheck } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay },
});

const STATS = [
    { icon: Brain, label: "Model", value: "ResNet-50", accent: "from-blue-500 to-blue-700" },
    { icon: Activity, label: "Accuracy", value: "99.4%", accent: "from-slate-600 to-slate-800" },
    { icon: Zap, label: "Speed", value: "<2s", accent: "from-amber-500 to-amber-600" },
    { icon: ShieldCheck, label: "Security", value: "AES-256", accent: "from-emerald-500 to-emerald-700" },
];

export default function DashboardPage() {
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
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse"></span>
                                    CORE_STATUS: ACTIVE_v4.2.0
                                </div>
                            </motion.div>
                            <motion.h1 {...fadeUp(0.1)} className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
                                Neural Engine <span className="text-slate-400 font-light italic">/</span> Workstation
                            </motion.h1>
                            <motion.p {...fadeUp(0.2)} className="text-slate-500 text-lg leading-relaxed font-medium">
                                Initialize high-resolution diagnostic sequence via fundus photograph analysis.
                            </motion.p>
                        </div>

                        {/* Quick Metadata HUD */}
                        <motion.div {...fadeUp(0.3)} className="hidden lg:flex flex-col items-end text-right">
                            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1">Station_Coordinate</span>
                            <span className="text-xs font-mono text-slate-900 font-bold">LAT: 40.7128° N | LON: 74.0060° W</span>
                        </motion.div>
                    </div>

                    {/* Technical Stat Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                        {STATS.map((stat, i) => {
                            const Icon = stat.icon;
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 + i * 0.08 }}
                                    className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-slate-300 transition-all group"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-900 transition-transform group-hover:scale-110">
                                            <Icon className="w-4 h-4" />
                                        </div>
                                        <span className="text-[10px] font-mono text-slate-300">0{i + 1}</span>
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-1 font-mono">{stat.label}</p>
                                    <p className="text-xl font-bold text-slate-900 font-mono tracking-tighter">{stat.value}</p>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Workstation Frame */}
                    <div className="relative">
                        {/* HUD Corner Accents */}
                        <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-slate-200 rounded-tl-xl pointer-events-none" />
                        <div className="absolute -top-4 -right-4 w-8 h-8 border-t-2 border-r-2 border-slate-200 rounded-tr-xl pointer-events-none" />
                        <div className="absolute -bottom-4 -left-4 w-8 h-8 border-b-2 border-l-2 border-slate-200 rounded-bl-xl pointer-events-none" />
                        <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-slate-200 rounded-br-xl pointer-events-none" />

                        <UploadCard />
                    </div>

                    {/* System Index Footer */}
                    <div className="mt-20 pt-8 border-t border-slate-100 flex justify-between items-center opacity-40 font-mono">
                        <span className="text-[10px] text-slate-400 uppercase tracking-widest">SESSION_QUERY: ACTIVE</span>
                        <span className="text-[10px] text-slate-400 uppercase tracking-widest">RETINA_SYSTEM_DIAGNOSTICS_ENABLED</span>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
