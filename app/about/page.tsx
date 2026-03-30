"use client";

import { motion } from "framer-motion";
import { Brain, Users, Target, ShieldCheck, Microscope, Globe, ArrowRight } from "lucide-react";
import Link from "next/link";
import NeuralNetworkAnimation from "@/components/NeuralNetworkAnimation";

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 15 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5, delay },
});

const TEAM = [
    { name: "RETINA_RESEARCH_LAB", initials: "RL", role: "CV_DEEP_LEARNING", bio: "Core research team focused on CNN architectures, transfer learning, and retinal feature extraction.", color: "from-slate-600 to-slate-800" },
    { name: "CLINICAL_ADVISORY", initials: "CA", role: "OPHTHALMOLOGY_VALIDATION", bio: "Board-certified ophthalmologists ensuring clinical accuracy and diagnostic relevance of AI outputs.", color: "from-slate-800 to-slate-900" },
];

const STATS = [
    { value: "5.0M+", label: "SCANS_PROCESSED" },
    { value: "99.4%", label: "ACCURACY_ROC" },
    { value: "<2.0s", label: "INFERENCE_LATENCY" },
    { value: "150+", label: "CLINICAL_NODES" },
];

export default function AboutPage() {
    return (
        <div className="flex-1 bg-white relative overflow-hidden font-body">
            {/* HUD Blueprint Grid */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
                style={{ backgroundImage: `linear-gradient(#0f172a 1px, transparent 1px), linear-gradient(90deg, #0f172a 1px, transparent 1px)`, backgroundSize: '40px 40px' }} 
            />
            
            <NeuralNetworkAnimation />

            {/* Hero / Protocol Header */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="container mx-auto px-6 relative z-10 max-w-4xl text-center">
                    <motion.div {...fadeUp()}>
                        <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-mono font-bold uppercase tracking-[0.2em] mb-8">
                            <Brain className="w-3.5 h-3.5" /> SYSTEM_OVERVIEW: PROTOCOL_01
                        </div>
                    </motion.div>
                    <motion.h1 {...fadeUp(0.1)} className="text-4xl md:text-7xl font-bold text-slate-900 tracking-tight mb-8 leading-tight">
                        Advancing <span className="text-slate-400 font-light italic">Retinova</span> Diagnostics
                    </motion.h1>
                    <motion.p {...fadeUp(0.2)} className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
                        Retinova leverages high-precision convolutional neural networks trained on clinical fundus datasets to enable early, autonomous detection of diabetic retinopathy.
                    </motion.p>
                </div>
            </section>

            {/* Stats / Metrics HUD */}
            <section className="py-16 relative">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {STATS.map((stat, i) => (
                            <motion.div key={i} {...fadeUp(i * 0.08)}
                                className="text-center p-8 rounded-2xl bg-white border border-slate-100 shadow-xl shadow-slate-900/5 relative group"
                            >
                                <div className="absolute top-2 left-2 text-[8px] font-mono text-slate-200">[ + ]</div>
                                <div className="text-3xl md:text-4xl font-mono font-bold text-slate-900 mb-2 tracking-tighter">{stat.value}</div>
                                <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission / Technical Mandate */}
            <section className="py-24 relative">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="grid md:grid-cols-2 gap-20 items-center">
                        <motion.div {...fadeUp()}>
                            <div className="text-[10px] font-mono font-bold text-slate-900 uppercase tracking-[0.3em] mb-6">MISSION_PROTOCOL: DEMOCRATIZATION</div>
                            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight mb-8 leading-tight">
                                Clinical-Grade Screening <span className="text-slate-400 font-light italic">for</span> Everyone
                            </h2>
                            <p className="text-slate-500 text-lg leading-relaxed mb-8 font-medium">
                                Retinova bridges the specialist gap by providing an AI-powered screening architecture deployable in any clinical node — delivering expert-level analysis in seconds.
                            </p>
                            <Link href="/dashboard" className="inline-flex items-center gap-4 px-8 py-4 bg-slate-900 text-white font-mono font-bold text-[11px] uppercase tracking-[0.2em] rounded-xl shadow-2xl hover:bg-slate-800 transition active:scale-95">
                                INITIALIZE_PLAYBOOK <ArrowRight className="w-4 h-4" />
                            </Link>
                        </motion.div>
                        
                        <motion.div {...fadeUp(0.15)} className="grid grid-cols-1 gap-3">
                            {[
                                { icon: Microscope, title: "DEEP_LEARNING_CORE", desc: "Multi-layer CNN architecture trained on 5M+ clinical fundus scans." },
                                { icon: ShieldCheck, title: "SECURE_BY_DESIGN", desc: "End-to-end AES-256 encryption with zero data retention protocols." },
                                { icon: Target, title: "PRECISION_VAL", desc: "Validated against board-certified clinical ground truths." },
                            ].map(({ icon: Icon, title, desc }, i) => (
                                <div key={i} className="p-6 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-5 group hover:bg-white hover:shadow-xl hover:shadow-slate-900/5 transition-all">
                                    <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-900 shadow-sm group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 transition-colors">
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-mono font-bold text-slate-900 text-[11px] uppercase tracking-widest mb-1">{title}</h3>
                                        <p className="text-xs text-slate-500 leading-relaxed font-medium">{desc}</p>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Technology Stack / System Architecture */}
            <section className="py-24 bg-slate-900 relative overflow-hidden">
                <div className="container mx-auto px-6 max-w-5xl relative z-10">
                    <motion.div {...fadeUp()}>
                        <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.3em] mb-6">ARCHITECTURE_STACK_v4.2</div>
                        <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-12">
                            Built on Proven <span className="text-slate-500 italic">Neural</span> Research
                        </h2>
                    </motion.div>
                    <div className="grid md:grid-cols-3 gap-4">
                        {[
                            { title: "RESNET_50_BACKBONE", desc: "Transfer learning from ImageNet with domain-specific fine-tuning for retinal extraction." },
                            { title: "ICDR_MAPPING_PROTOCOL", desc: "Five-class classification mapped strictly to International DR Scales (ICDR)." },
                            { title: "GRAD_CAM_VIZ_LAYER", desc: "Attention heatmaps highlight regions of clinical interest for interpretable diagnostics." },
                        ].map((item, i) => (
                            <motion.div key={i} {...fadeUp(i * 0.1)}
                                className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm group hover:bg-white/10 transition-colors"
                            >
                                <h3 className="font-mono font-bold text-white mb-4 text-[11px] uppercase tracking-widest">{item.title}</h3>
                                <p className="text-xs text-slate-400 leading-relaxed font-medium">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team / Research Nodes */}
            <section className="py-24 relative">
                <div className="container mx-auto px-6 max-w-5xl text-center">
                    <motion.div {...fadeUp()}>
                        <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.3em] mb-6">RESEARCH_NODES</div>
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight mb-16">
                            Researchers <span className="text-slate-400 font-light italic">&</span> Clinicians
                        </h2>
                    </motion.div>
                    <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                        {TEAM.map((member, i) => (
                            <motion.div key={i} {...fadeUp(i * 0.1)}
                                className="p-10 rounded-2xl bg-white border border-slate-100 shadow-2xl shadow-slate-900/5 text-center group"
                            >
                                <div className={`w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-900 mx-auto mb-6 group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 transition-all`}>
                                    <Users className="w-6 h-6" />
                                </div>
                                <h3 className="font-mono font-bold text-slate-900 mb-1 text-sm uppercase tracking-widest">{member.name}</h3>
                                <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">{member.role}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA / Initialization Section */}
            <section className="py-24 relative mb-12">
                <div className="container mx-auto px-6 max-w-4xl text-center">
                    <motion.div {...fadeUp()} className="p-16 rounded-3xl bg-slate-50 border border-slate-100 relative overflow-hidden">
                        {/* Blueprint grid on CTA */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                            style={{ backgroundImage: `linear-gradient(#0f172a 1px, transparent 1px), linear-gradient(90deg, #0f172a 1px, transparent 1px)`, backgroundSize: '20px 20px' }} 
                        />
                        
                        <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight uppercase">Ready to Start _Analysis?</h2>
                        <p className="text-slate-500 mb-10 text-lg font-medium max-w-xl mx-auto">Upload a fundus scan and receive your high-precision diagnostic report in seconds.</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                            <Link href="/dashboard" className="px-10 py-5 bg-slate-900 text-white font-mono font-bold text-[11px] uppercase tracking-[0.2em] rounded-xl shadow-2xl hover:bg-slate-800 transition active:scale-95">
                                INITIALIZE_SCREENING
                            </Link>
                            <Link href="/ethics" className="px-10 py-5 bg-white border border-slate-200 text-slate-900 font-mono font-bold text-[11px] uppercase tracking-[0.2em] rounded-xl hover:bg-slate-50 transition active:scale-95 shadow-sm">
                                ETHICS_POLICY [ .PDF ]
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
