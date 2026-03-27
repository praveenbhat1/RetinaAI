"use client";

import Link from 'next/link';
import Retina3D from './Retina3D';
import NeuralNetworkAnimation from './NeuralNetworkAnimation';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Activity, ShieldCheck, Cpu, Target } from 'lucide-react';

const HUDLabel = ({ icon: Icon, label, value, className = "" }: { icon: any, label: string, value: string, className?: string }) => (
    <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`absolute z-30 flex items-center gap-3 px-4 py-2 bg-white/40 backdrop-blur-md border border-slate-200/50 rounded-lg shadow-[0_4px_24px_-1px_rgba(0,0,0,0.03)] selection:bg-slate-200 pointer-events-none ${className}`}
    >
        <div className="p-1.5 bg-slate-900/5 rounded-md border border-slate-900/5">
            <Icon className="w-3.5 h-3.5 text-slate-900" />
        </div>
        <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 font-mono leading-none mb-1">{label}</span>
            <span className="text-xs font-semibold text-slate-900 font-mono tracking-tight">{value}</span>
        </div>
    </motion.div>
);

export default function HeroSection() {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 100]);
    const y2 = useTransform(scrollY, [0, 500], [0, -50]);

    return (
        <section className="relative min-h-[110vh] pt-28 pb-20 flex items-center bg-white overflow-hidden selection:bg-slate-200">
            {/* Background Layers */}
            <NeuralNetworkAnimation />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none opacity-40 z-0" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8 min-h-[700px]">

                    {/* Left Side: Bespoke Editorial Content (60%) */}
                    <div className="flex-[1.4] relative z-20">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="mb-10 inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-[11px] font-bold uppercase tracking-[0.25em]"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            Diagnostic Protocol v4.2
                        </motion.div>

                        <motion.div style={{ y: y2 }}>
                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                                className="text-6xl sm:text-7xl lg:text-[7.5rem] font-bold text-slate-900 leading-[0.95] tracking-[-0.04em] mb-10"
                            >
                                AI-Powered<br />
                                <span className="text-slate-300 font-light italic">Deep Detection</span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                                className="text-xl md:text-2xl text-slate-500 font-medium leading-[1.6] max-w-xl mb-12"
                            >
                                Empowering clinical workflows with high-resolution retinal scan analysis and automated abnormality grading.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                className="flex flex-col sm:flex-row gap-5 items-start"
                            >
                                <Link href="/dashboard" className="px-10 py-5 text-base text-white bg-slate-900 font-semibold rounded-2xl hover:bg-slate-800 transition-all shadow-2xl shadow-slate-900/10 group flex items-center justify-center gap-4 active:scale-[0.98]">
                                    Initialize Screening <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link
                                    href="#demo"
                                    className="px-10 py-5 text-base text-slate-600 bg-slate-50 font-semibold rounded-2xl hover:bg-slate-100 transition-all border border-slate-200 group flex items-center justify-center gap-4 active:scale-[0.98]"
                                >
                                    Show Demo <Target className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                                </Link>
                            </motion.div>
                        </motion.div>

                        {/* Asymmetric Floating Coordinate */}
                        <div className="absolute -left-12 bottom-0 opacity-20 pointer-events-none hidden xl:block">
                            <span className="text-[10px] font-mono text-slate-400 [writing-mode:vertical-rl] tracking-[0.5em]">SYSTEM_COORDINATE_RES: 8140.22</span>
                        </div>
                    </div>

                    {/* Right Side: Interactive HUD Eye (40%) */}
                    <div className="flex-1 relative w-full h-[500px] lg:h-[700px] flex items-center justify-center">
                        <motion.div
                            style={{ y: y1 }}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className="relative w-full h-full max-w-[550px] aspect-square rounded-[3.5rem] bg-slate-50/80 border border-slate-200/60 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] overflow-visible group"
                        >
                            {/* Inner Stage Vignette */}
                            <div className="absolute inset-x-8 inset-y-8 rounded-[2.5rem] bg-white border border-slate-100 z-10 shadow-inner overflow-hidden pointer-events-auto">
                                <div className="absolute inset-0 z-20 pointer-events-none shadow-[inset_0_0_60px_rgba(241,245,249,0.9)]" />
                                <Retina3D />
                            </div>

                            {/* HUD Overlays (Absolute to the card) */}
                            <HUDLabel
                                icon={Activity}
                                label="Live Analysis"
                                value="24.8 Tflops/s"
                                className="-top-4 -right-8 w-44"
                            />
                            <HUDLabel
                                icon={Target}
                                label="Scan Accuracy"
                                value="Grade A+"
                                className="top-1/3 -left-12 w-44"
                            />
                            <HUDLabel
                                icon={ShieldCheck}
                                label="Secured Link"
                                value="Validated"
                                className="bottom-12 -right-10 w-40"
                            />
                            <HUDLabel
                                icon={Cpu}
                                label="Neural Map"
                                value="v4.2.0-STABLE"
                                className="-bottom-6 left-8 w-48"
                            />

                            {/* Coordinate Markers at corners */}
                            <div className="absolute top-8 left-8 text-[8px] font-mono text-slate-300 z-30 uppercase tracking-widest hidden sm:block italic">
                                [ 0.00 / 0.00 / 1.0 ]
                            </div>
                            <div className="absolute bottom-8 right-8 text-[8px] font-mono text-slate-300 z-30 uppercase tracking-widest hidden sm:block italic">
                                SECURE_NODE: L-B02
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}
