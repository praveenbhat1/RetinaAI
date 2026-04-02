"use client";

import { motion } from "framer-motion";
import { Database, Network, ShieldCheck, Activity, Target } from "lucide-react";

const stats = [
    { icon: Database, value: "5.2M", label: "ANALYZED_SCANS", detail: "Clinical dataset" },
    { icon: Activity, value: "87.0%", label: "ACCURACY_ROC", detail: "EfficientNet-B3 v4.2" },
    { icon: ShieldCheck, value: "HIPAA", label: "SECURITY_COMPLIANCE", detail: "End-to-end encrypted" },
    { icon: Target, value: "INSTANT", label: "DIAGNOSTIC_REPORT", detail: "Edge optimized" },
];

export default function TrustSection() {
    return (
        <section className="py-24 border-y border-slate-100 bg-white relative overflow-hidden selection:bg-slate-200">
            {/* Subtle Grid Accent */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px)] bg-[size:10rem] opacity-20 pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-start justify-between gap-16 lg:gap-24">

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="flex-shrink-0 space-y-6 max-w-md"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-50 border border-slate-200 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 font-mono">
                            Institutional Verification
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight leading-[1.1]">
                            Trusted by global diagnostic networks
                        </h2>
                        <p className="text-lg text-slate-500 font-medium leading-relaxed">
                            Our neural architectures are validated against massive clinical datasets, ensuring medical-grade reliability in every inference.
                        </p>
                    </motion.div>

                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-px bg-slate-100 border border-slate-100 rounded-3xl overflow-hidden shadow-2xl shadow-slate-200/20">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.8 }}
                                className="group relative bg-white p-8 hover:bg-slate-50/50 transition-colors"
                            >
                                <div className="flex flex-col h-full space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="p-2 bg-slate-900/5 rounded-lg border border-slate-900/5 group-hover:scale-110 transition-transform duration-500">
                                            <stat.icon className="w-4 h-4 text-slate-900" />
                                        </div>
                                        <span className="text-[9px] font-mono text-slate-300 uppercase tracking-widest">PTCL_{i + 1}</span>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-4xl font-bold text-slate-900 font-mono tracking-tighter tracking-[-0.05em]">{stat.value}</div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] font-mono">{stat.label}</div>
                                    </div>
                                    <p className="text-xs text-slate-500 font-medium leading-relaxed pt-2 border-t border-slate-50 group-hover:border-slate-100 transition-colors">
                                        {stat.detail}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}
