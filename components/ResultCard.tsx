"use client";

import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2, ChevronRight, ActivitySquare, ShieldCheck } from "lucide-react";
import SeverityBadge, { SeverityType } from "./SeverityBadge";
import Link from "next/link";

export default function ResultCard({
    prediction = "Moderate",
    confidence = 94.2
}: {
    prediction?: SeverityType;
    confidence?: number;
}) {
    const isHealthy = prediction === "No DR";
    const radius = 55;
    const stroke = 10;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (confidence / 100) * circumference;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full max-w-4xl mx-auto rounded-3xl p-1 bg-gradient-to-br from-white/50 to-slate-200/50 backdrop-blur-xl border border-white/60 shadow-[0_20px_50px_rgba(0,0,0,0.08)] mt-12 overflow-hidden relative"
        >
            <div className="bg-white/30 backdrop-blur-2xl rounded-[1.4rem] overflow-hidden relative z-10 flex flex-col">

                <div className="p-8 md:p-12 pb-8 border-b border-white/40 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
                    <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-cyan-400/10 rounded-full blur-[80px] pointer-events-none" />

                    <div className="flex-1 text-center md:text-left relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/60 border border-white box-shadow-sm text-slate-500 font-bold text-xs uppercase tracking-widest mb-4">
                            <ShieldCheck className="w-4 h-4 text-emerald-500" /> Medical Grade Diagnostic
                        </div>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight flex flex-col gap-2">
                            Neural Network Classification
                            <span className="text-xl font-bold text-slate-500">Scan ID: #RX-{Math.floor(Math.random() * 90000) + 10000}</span>
                        </h2>
                    </div>

                    <div className="flex flex-col items-center justify-center p-6 bg-white/60 backdrop-blur-md rounded-3xl border border-white/80 shadow-lg relative z-10">
                        <h3 className="text-sm text-slate-500 font-bold uppercase tracking-widest mb-4">CNN Confidence</h3>
                        <div className="relative w-36 h-36 flex items-center justify-center">
                            <svg height="144" width="144" className="rotate-[-90deg] drop-shadow-lg">
                                <circle stroke="rgba(255,255,255,0.5)" fill="transparent" strokeWidth={stroke} r={normalizedRadius} cx="72" cy="72" />
                                <motion.circle
                                    initial={{ strokeDashoffset: circumference }}
                                    animate={{ strokeDashoffset }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    stroke={isHealthy ? "#10b981" : "#2563eb"} // emerald or primary
                                    fill="transparent"
                                    strokeWidth={stroke}
                                    strokeLinecap="round"
                                    strokeDasharray={circumference + " " + circumference}
                                    r={normalizedRadius}
                                    cx="72"
                                    cy="72"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-4xl font-extrabold text-slate-900 tracking-tighter drop-shadow-md">{confidence}<span className="text-xl text-slate-400">%</span></span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-8 md:p-12 pt-8 flex flex-col gap-8">
                    <div className="bg-white/40 p-8 rounded-3xl border border-white/60 shadow-inner flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                        <div className="flex-1">
                            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Severity</h4>
                            <div className="text-5xl font-extrabold text-slate-900 mb-4">{prediction}</div>
                            <SeverityBadge severity={prediction} className="text-base px-6 py-2.5" />
                        </div>
                        <div className="hidden md:block w-px h-32 bg-slate-300 rounded-full" />
                        <div className="flex-[2]">
                            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2 md:justify-start justify-center"><ActivitySquare className="w-5 h-5 text-primary" /> Pathology Insights</h4>
                            <p className="text-lg text-slate-700 leading-relaxed font-medium">
                                {isHealthy
                                    ? "The neural map highlights robust macular architecture. Vascular networks exhibit typical bifurcation integrity devoid of aneurysmal swellings."
                                    : `The inference grid actively highlights vascular lesions highly correlated with ${prediction.toLowerCase()} retinopathy parameters. Exudates and microaneurysms detected.`}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4">
                        <p className="text-xs text-slate-500 font-bold max-w-sm uppercase tracking-widest leading-relaxed">
                            * Always solicit ophthalmologic review prior to clinical decisions.
                        </p>
                        <Link href="/dashboard" className="w-full sm:w-auto px-8 py-4 flex items-center justify-center gap-2 text-white bg-slate-900 font-bold rounded-full hover:bg-slate-800 transition shadow-xl sm:shadow-2xl hover:-translate-y-1">
                            Process New Image <ChevronRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
