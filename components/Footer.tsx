"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Activity, Twitter, Linkedin, Github } from "lucide-react";

export default function Footer() {
    return (
        <footer className="border-t border-slate-100 bg-white pt-24 pb-12 overflow-hidden relative selection:bg-slate-200">
            {/* Subtle technical background detail */}
            <div className="absolute right-0 bottom-0 p-10 opacity-[0.02] pointer-events-none select-none">
                <div className="text-[10rem] font-bold font-mono leading-none tracking-tighter">RETINOVA_SYSTEM</div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid md:grid-cols-4 gap-16 mb-20">
                    <div className="col-span-1 md:col-span-2 space-y-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-900 rounded-xl flex items-center justify-center">
                                <Activity className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-2xl font-bold text-slate-900 tracking-tight">
                                Retinova
                            </span>
                        </div>
                        <p className="text-slate-500 text-sm max-w-sm leading-relaxed font-medium">
                            Standardizing clinical workflows through high-resolution retinal scan analysis and automated abnormality grading.
                        </p>
                        <div className="flex items-center gap-4">
                            {[Twitter, Linkedin, Github].map((Icon, i) => (
                                <motion.a
                                    whileHover={{ y: -2 }}
                                    key={i}
                                    href="#"
                                    className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-white hover:border-slate-200 transition-all shadow-sm"
                                >
                                    <Icon className="w-4 h-4" />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-12 col-span-1 md:col-span-2">
                        <div className="space-y-6">
                            <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-[0.2em] font-mono">Platform_Index</h4>
                            <ul className="space-y-4">
                                <li><Link href="/" className="text-sm text-slate-500 hover:text-slate-900 transition-colors font-medium"> Home</Link></li>
                                <li><Link href="/dashboard" className="text-sm text-slate-500 hover:text-slate-900 transition-colors font-medium">Neural Engine</Link></li>
                                <li><Link href="/history" className="text-sm text-slate-500 hover:text-slate-900 transition-colors font-medium">Clinical Records</Link></li>
                                <li><Link href="/about" className="text-sm text-slate-500 hover:text-slate-900 transition-colors font-medium">Protocol Info</Link></li>
                            </ul>
                        </div>
                        <div className="space-y-6">
                            <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-[0.2em] font-mono">Governance</h4>
                            <ul className="space-y-4">
                                <li><Link href="/ethics" className="text-sm text-slate-500 hover:text-slate-900 transition-colors font-medium">Clinical Policy</Link></li>
                                <li><Link href="/login" className="text-sm text-slate-500 hover:text-slate-900 transition-colors font-medium">Terminal Auth</Link></li>
                                <li><Link href="/signup" className="text-sm text-slate-500 hover:text-slate-900 transition-colors font-medium">Account Provision</Link></li>
                                <li><a href="#" className="text-sm text-slate-500 hover:text-slate-900 transition-colors font-medium">Data Privacy</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="pt-10 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <p className="text-[10px] font-bold text-slate-400 font-mono tracking-widest leading-none">
                            &copy; {new Date().getFullYear()} RETINOVA_SYSTEMS
                        </p>
                        <div className="h-4 w-px bg-slate-200" />
                        <span className="text-[10px] font-bold text-slate-300 font-mono tracking-widest leading-none uppercase">
                            STABLE_REL_4.2.0
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.15em] font-mono text-center md:text-right max-w-sm">
                            Certified clinical observation required for diagnostic finality
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
