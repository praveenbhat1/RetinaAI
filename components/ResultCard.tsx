"use client";

import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2, ChevronRight, ActivitySquare, ShieldCheck, Download, Share2, Printer, Target } from "lucide-react";
import SeverityBadge, { SeverityType } from "./SeverityBadge";
import Link from "next/link";
import { useState } from "react";

export default function ResultCard({
    prediction = "Moderate",
    confidence = 94.2,
    scanId = "RX-73685"
}: {
    prediction?: SeverityType;
    confidence?: number;
    scanId?: string;
}) {
    const isHealthy = prediction === "No DR";
    const radius = 55;
    const stroke = 10;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (confidence / 100) * circumference;

    const [copied, setCopied] = useState(false);

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({ title: "Retinex Report", text: `Scan ${scanId} — ${prediction} (${confidence}%)`, url: window.location.href });
        } else {
            navigator.clipboard.writeText(window.location.href).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            });
        }
    };

    const handlePrint = () => window.print();

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full rounded-2xl bg-white border border-slate-200 shadow-2xl shadow-slate-900/5 overflow-hidden relative font-body group"
        >
            <div className="bg-white overflow-hidden relative z-10 flex flex-col">
                {/* Header Section */}
                <div className="p-8 md:p-12 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-10 bg-slate-50/50">
                    <div className="flex-1 text-center md:text-left">
                        <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-500 font-mono font-bold text-[10px] uppercase tracking-widest mb-6 shadow-sm">
                            <ShieldCheck className="w-3.5 h-3.5 text-slate-900" /> SECURE_CLINICAL_REPORT
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight leading-tight mb-4 uppercase">
                            NEURAL_MAPPING_RESULT
                            <span className="block text-sm font-mono font-bold text-slate-400 mt-2 tracking-widest">VERIFIED_SIGNATURE: [ {scanId} ]</span>
                        </h2>
                    </div>

                    {/* Confidence HUD Gauge */}
                    <div className="flex flex-col items-center justify-center p-8 bg-white border border-slate-100 rounded-2xl shadow-sm min-w-[200px] transition-transform group-hover:scale-105 duration-500">
                        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.2em] mb-6 inline-flex items-center gap-2"><Target className="w-3.5 h-3.5" /> CERTAINTY_INDEX</span>
                        <div className="relative w-32 h-32">
                            <svg height="128" width="128" className="-rotate-90">
                                <circle stroke="#f1f5f9" fill="transparent" strokeWidth={6} r={normalizedRadius} cx="64" cy="64" />
                                <motion.circle
                                    initial={{ strokeDashoffset: circumference }}
                                    animate={{ strokeDashoffset }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    stroke="#0f172a"
                                    fill="transparent"
                                    strokeWidth={6}
                                    strokeLinecap="round"
                                    strokeDasharray={circumference + " " + circumference}
                                    r={normalizedRadius}
                                    cx="64"
                                    cy="64"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="flex items-baseline justify-center ml-2">
                                    <span className="text-3xl font-mono font-bold text-slate-900 tracking-tighter tabular-nums leading-none">{confidence.toFixed(1)}</span>
                                    <span className="text-lg font-mono font-bold text-slate-400 ml-0.5">%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Report Body */}
                <div className="p-8 md:p-12 flex flex-col gap-8">
                    {/* Diagnostic Summary Terminal */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-1 shadow-sm border border-slate-100 rounded-xl overflow-hidden">
                        <div className="bg-slate-50 p-8 flex flex-col justify-center border-b md:border-b-0 md:border-r border-slate-100">
                            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-3">CLASSIFICATION:</span>
                            <div className="text-4xl font-bold text-slate-900 mb-4 tracking-tighter uppercase">{prediction}</div>
                            <SeverityBadge severity={prediction} />
                        </div>
                        <div className="bg-white p-8 md:col-span-2 relative overflow-hidden group/terminal">
                            <div className="absolute inset-0 bg-slate-50/50 opacity-0 group-hover/terminal:opacity-100 transition-opacity pointer-events-none" />
                            <div className="flex items-center gap-2 mb-4 relative z-10">
                                <ActivitySquare className="w-4 h-4 text-slate-900" />
                                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">PATHOLOGY_INSIGHTS_LOG:</span>
                            </div>
                            <p className="text-sm text-slate-900 leading-relaxed font-mono relative z-10">
                                <span className="text-slate-300 mr-2 opacity-50">&gt;&gt;</span>
                                {prediction === "No DR" ? "Neural map highlights robust macular architecture. Vascular networks exhibit typical bifurcation integrity. No aneurysmal swellings detected."
                                    : prediction === "Mild" ? "This indicates mild diabetic retinopathy. Early microaneurysms detected. Routine monitoring is advised."
                                    : prediction === "Moderate" ? "This indicates moderate diabetic retinopathy. Please consult an ophthalmologist for further evaluation."
                                    : prediction === "Severe" ? "This indicates severe diabetic retinopathy. Extensive vascular damage detected. Urgent ophthalmology consultation is required."
                                    : "This indicates proliferative diabetic retinopathy. Critical vascular changes detected. Immediate medical intervention is highly recommended."}
                            </p>
                        </div>
                    </div>

                    {/* Technical Protocols (Recommendations) */}
                    <div className="flex flex-col gap-4">
                        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.2em]">CLINICAL_PROTOCOLS:</span>
                        <div className="flex flex-wrap gap-2">
                            {isHealthy ? (
                                <>
                                    <span className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-slate-100 transition-colors">
                                        <CheckCircle2 className="w-4 h-4 text-slate-500" /> [ SEQ_ANNUAL_FOLLOWUP ]
                                    </span>
                                    <span className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-slate-100 transition-colors">
                                        <CheckCircle2 className="w-4 h-4 text-slate-500" /> [ INTERVENTION_NOT_REQUIRED ]
                                    </span>
                                </>
                            ) : (
                                <>
                                    <span className="px-4 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-900 font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4" /> [ REFER_OPHTHALMOLOGY ]
                                    </span>
                                    <span className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4 text-slate-400" /> [ 3_MONTH_INTERVAL ]
                                    </span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Report Footer / Actions */}
                    <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-4 text-slate-300">
                            {[Download, Share2, Printer].map((Icon, i) => (
                                <button
                                    key={i}
                                    onClick={i === 0 ? handlePrint : i === 1 ? handleShare : handlePrint}
                                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all active:scale-95 shadow-sm text-slate-600"
                                >
                                    <Icon className="w-4 h-4" />
                                </button>
                            ))}
                            <span className="h-4 w-px bg-slate-200 mx-2" />
                            <p className="text-[9px] font-mono font-bold uppercase tracking-widest max-w-[200px] leading-tight opacity-60">
                                * VERIFY VIA CLINICAL_REVIEW PRIOR TO DECISION_SEQUENCE
                            </p>
                        </div>

                        <Link
                            href="/dashboard"
                            className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 text-white font-mono font-bold text-[11px] uppercase tracking-[0.2em] rounded-xl shadow-2xl hover:bg-slate-800 transition-all active:scale-95"
                        >
                            <span className="animate-pulse w-1.5 h-1.5 bg-white rounded-full"></span> INITIALIZE_NEW_SCAN <ChevronRight className="w-4 h-4 ml-1" />
                        </Link>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
