"use client";

import { Zap, BrainCircuit, ShieldCheck, ActivitySquare, Eye, Dna } from "lucide-react";
import { motion } from "framer-motion";

export default function FeatureCards() {
    const features = [
        { icon: Zap, title: "Instant Inference", description: "Edge-optimized neural pipelines delivering sub-second clinical predictions.", tag: "SPEED_ v4.2" },
        { icon: BrainCircuit, title: "Deep Learning", description: "Massive CNN architectures trained on non-biased multi-ethnic datasets.", tag: "MODEL_NRT" },
        { icon: ShieldCheck, title: "Privacy Focused", description: "Zero-retention protocols ensuring patient data never persists beyond inference.", tag: "SEC_HIPAA" },
        { icon: Eye, title: "Automated Grading", description: "Precise classification from DR-Mild to Proliferative abnormalities.", tag: "GRADE_ML" },
        { icon: ActivitySquare, title: "High Precision", description: "Verified 99.4% AUC-ROC sensitivity for critical retinal pathologies.", tag: "KPI_99.4" },
        { icon: Dna, title: "Clinical Workflow", description: "Seamless HL7/FHIR integration for standard hospital screening routines.", tag: "INTG_SYS" }
    ];

    return (
        <section id="features" className="py-24 bg-white border-t border-slate-100 relative selection:bg-slate-200">
            {/* Background HUD Grid */}
            <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-[size:32px_32px] opacity-30 pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-20 max-w-2xl mx-auto space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-50 border border-slate-200 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 font-mono mb-4">
                            Platform Protocol
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight leading-[1.1]">
                            System Capabilities
                        </h2>
                        <p className="text-lg text-slate-500 font-medium leading-relaxed">
                            Advanced diagnostic utility engineered for high-resolution retinal observation and automated grading.
                        </p>
                    </motion.div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-100 border border-slate-100 rounded-3xl overflow-hidden shadow-2xl shadow-slate-200/20">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: idx * 0.05 }}
                            className="group relative bg-white p-10 hover:bg-slate-50/50 transition-all duration-500"
                        >
                            <div className="flex flex-col h-full space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="p-3 bg-slate-900/5 rounded-xl border border-slate-900/5 group-hover:bg-slate-900/10 group-hover:scale-105 transition-all duration-500">
                                        <feature.icon className="w-5 h-5 text-slate-900" />
                                    </div>
                                    <span className="text-[9px] font-mono text-slate-300 uppercase tracking-[0.2em] font-bold">
                                        [{feature.tag}]
                                    </span>
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                                        {feature.title}
                                        <div className="h-px flex-1 bg-slate-100 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </h3>
                                    <p className="text-sm text-slate-500 font-medium leading-[1.7]">
                                        {feature.description}
                                    </p>
                                </div>
                                <div className="pt-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                                    <div className="h-1.5 w-1.5 rounded-full bg-slate-900 animate-pulse" />
                                    <span className="text-[8px] font-mono text-slate-400 font-bold uppercase tracking-widest">Active_Node_{idx + 1}</span>
                                </div>
                            </div>
                            
                            {/* Decorative corner accent */}
                            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-30 transition-opacity">
                                <div className="w-4 h-4 border-t-2 border-r-2 border-slate-900 rounded-tr-sm" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
