"use client";

import { Upload, Cpu, FileCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function HowItWorks() {
    const steps = [
        { 
            step: "PROTOCOL_01", 
            icon: Upload, 
            title: "Data Acquisition", 
            desc: "Secure intake of standardized fundus photographs via encrypted transmission layer.",
            status: "INPUT_READY"
        },
        { 
            step: "PROTOCOL_02", 
            icon: Cpu, 
            title: "Neural Inference", 
            desc: "CNN ensemble analysis detecting microaneurysms, hemorrhages, and exudates.",
            status: "PROCESSING"
        },
        { 
            step: "PROTOCOL_03", 
            icon: FileCheck, 
            title: "Abnormality Grading", 
            desc: "Final severity classification mapped to clinical diagnostic standards (DR-0 to DR-4).",
            status: "OUTPUT_FINAL"
        }
    ];

    return (
        <section className="py-24 bg-slate-50 border-y border-slate-100 relative overflow-hidden selection:bg-slate-200">
            {/* Technical Background Details */}
            <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
                <div className="text-[12rem] font-bold font-mono leading-none tracking-tighter">RETINA_AI</div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-20 max-w-2xl mx-auto space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white border border-slate-200 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 font-mono mb-4">
                            Workflow Methodology
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight leading-[1.1]">
                            Clinical Pipeline
                        </h2>
                        <p className="text-lg text-slate-500 font-medium leading-relaxed">
                            A high-precision sequence engineered for surgical accuracy in retinal diagnostic observation.
                        </p>
                    </motion.div>
                </div>

                <div className="relative">
                    {/* Connector SVG Lines — visible on md+ screens */}
                    <svg className="hidden lg:block absolute top-12 left-0 w-full h-px z-0 opacity-20" preserveAspectRatio="none">
                        <line x1="15%" y1="0" x2="85%" y2="0" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="text-slate-400" />
                    </svg>

                    <div className="grid lg:grid-cols-3 gap-12 lg:gap-8 relative z-10">
                        {steps.map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
                                className="flex flex-col items-center lg:items-start group"
                            >
                                {/* Step Indicator */}
                                <div className="mb-10 relative">
                                    <div className="w-20 h-20 bg-white border border-slate-200 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-slate-200/50 group-hover:border-slate-300 group-hover:scale-105 transition-all duration-500 relative z-20">
                                        <item.icon className="w-7 h-7 text-slate-900" />
                                    </div>
                                    <div className="absolute -top-3 -right-3 px-2 py-0.5 bg-slate-900 border border-slate-900 rounded-md text-white text-[9px] font-mono font-bold z-30 tracking-widest">
                                        {idx + 1}
                                    </div>
                                    {/* Pulse ring for active processing feel */}
                                    <div className="absolute inset-x-0 inset-y-0 rounded-[2rem] border border-slate-200 animate-ping opacity-0 group-hover:opacity-10 transition-opacity duration-1000 scale-125" />
                                </div>

                                {/* Step Content */}
                                <div className="space-y-4 text-center lg:text-left">
                                    <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] font-mono leading-none">
                                            {item.step}
                                        </span>
                                        <div className="hidden lg:block h-px w-8 bg-slate-100" />
                                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[8px] font-bold text-slate-500 uppercase tracking-widest leading-none mx-auto lg:mx-0">
                                            <div className="w-1 h-1 rounded-full bg-slate-400" />
                                            {item.status}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{item.title}</h3>
                                    <p className="text-sm text-slate-500 font-medium leading-[1.8] max-w-xs mx-auto lg:mx-0">
                                        {item.desc}
                                    </p>
                                </div>

                                {/* Bottom coordinates */}
                                <div className="mt-8 pt-8 border-t border-slate-100 w-full flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                                    <span className="text-[8px] font-mono text-slate-300 font-bold tracking-widest">X: [{(idx + 1) * 12}.4]</span>
                                    <span className="text-[8px] font-mono text-slate-300 font-bold tracking-widest">Y: [88.2]</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
