"use client";

import Link from "next/link";
import { ChevronRight, Cpu, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function CtaSection() {
    return (
        <section className="relative py-32 overflow-hidden bg-slate-900 selection:bg-slate-700">
            {/* HUD Blueprint Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 pointer-events-none" />
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white to-transparent opacity-[0.03] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-4xl mx-auto text-center space-y-10">
                    
                    {/* Diagnostic Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-800/50 border border-slate-700 text-slate-400 text-[10px] font-bold uppercase tracking-[0.25em] font-mono"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-500"></span>
                        </span>
                        System Readiness: OPTIMAL
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                        className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-[1.05]"
                    >
                        Initialize clinical-grade <br />
                        <span className="text-slate-500 italic font-light">diagnostic workflows</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium"
                    >
                        Deploy high-precision retinal abnormality detection across your institution. Secured by multi-tenant encryption and medical-grade AI.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-6"
                    >
                        <Link
                            href="/dashboard"
                            className="px-10 py-5 bg-white text-slate-900 font-bold rounded-2xl hover:bg-slate-100 transition-all shadow-2xl shadow-white/5 inline-flex items-center justify-center gap-3 active:scale-[0.98] text-lg"
                        >
                            Start Screening <ChevronRight className="w-4 h-4" />
                        </Link>
                        
                        <div className="flex items-center gap-8">
                            <div className="flex flex-col items-start gap-1">
                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">
                                    <ShieldCheck className="w-3 h-3" />
                                    Security
                                </div>
                                <span className="text-xs font-bold text-slate-300 font-mono tracking-tight">AES-256V2</span>
                            </div>
                            <div className="h-8 w-px bg-slate-800" />
                            <div className="flex flex-col items-start gap-1">
                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">
                                    <Cpu className="w-3 h-3" />
                                    Engine
                                    </div>
                                <span className="text-xs font-bold text-slate-300 font-mono tracking-tight">STABLE_V4</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Corner Technical Detail */}
                <div className="absolute bottom-10 left-10 opacity-10 pointer-events-none hidden lg:block">
                    <span className="text-[10px] font-mono text-slate-400 [writing-mode:vertical-rl] tracking-[0.5em]">INITIALIZE_SEQUENCE_INIT_4.0</span>
                </div>
                <div className="absolute top-10 right-10 opacity-10 pointer-events-none hidden lg:block">
                    <span className="text-[10px] font-mono text-slate-400 tracking-[0.3em]">SECURE_SERVER_NODE: LB-X1</span>
                </div>
            </div>
        </section>
    );
}
