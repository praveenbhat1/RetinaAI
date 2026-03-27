"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScanLine, CheckCircle2, Activity, Eye, Loader2 } from "lucide-react";
import Link from "next/link";

const SCANNER_STEPS = [
    "Loading fundus image…",
    "Preprocessing retinal map…",
    "Extracting vascular features…",
    "Running CNN inference…",
    "Generating diagnostic report…",
];

export default function InteractiveDemo() {
    const [phase, setPhase] = useState<"idle" | "scanning" | "done">("idle");
    const [stepIdx, setStepIdx] = useState(0);
    const [progress, setProgress] = useState(0);

    const startDemo = () => {
        setPhase("scanning");
        setStepIdx(0);
        setProgress(0);
    };

    useEffect(() => {
        if (phase !== "scanning") return;
        const total = 4000;
        const start = Date.now();
        const iv = setInterval(() => {
            const elapsed = Date.now() - start;
            const pct = Math.min(Math.round((elapsed / total) * 100), 100);
            setProgress(pct);
            setStepIdx(Math.min(Math.floor((elapsed / total) * SCANNER_STEPS.length), SCANNER_STEPS.length - 1));
            if (elapsed >= total) {
                clearInterval(iv);
                setPhase("done");
            }
        }, 60);
        return () => clearInterval(iv);
    }, [phase]);

    const reset = () => { setPhase("idle"); setStepIdx(0); setProgress(0); };

    return (
        <section className="py-24 relative overflow-hidden bg-white" id="demo">
            

            <div className="container mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-14"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-xs font-bold uppercase tracking-widest mb-4">
                        <Eye className="w-4 h-4" /> Interactive Preview
                    </div>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
                        See the AI Scanner in Action
                    </h2>
                    <p className="text-slate-600 max-w-xl mx-auto text-sm">
                        Experience our clinical screening pipeline — from image upload to diagnostic classification — in a live preview.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 }}
                    className="max-w-3xl mx-auto"
                >
                    <div className="rounded-3xl p-[1px] bg-gradient-to-br from-blue-200/50 via-white to-teal-200/50 shadow-[0_20px_60px_rgba(0,0,0,0.08)] overflow-hidden">
                        <div className="bg-white/80 backdrop-blur-2xl rounded-[calc(1.5rem-1px)] p-8 md:p-10 relative overflow-hidden">

                            {/* Simulated fundus display */}
                            <div className="relative w-full aspect-video rounded-2xl bg-slate-900 overflow-hidden mb-6">
                                {/* Fake retina visual */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-orange-900 via-orange-700 to-red-900 relative shadow-2xl">
                                        {/* Optic disc */}
                                        <div className="absolute top-1/2 left-[45%] -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-yellow-200 to-orange-300 shadow-inner" />
                                        {/* Vessels */}
                                        <div className="absolute inset-0 rounded-full overflow-hidden opacity-60">
                                            <div className="absolute top-1/2 left-[45%] w-[120%] h-0.5 bg-red-800 -translate-x-1/2 rotate-12" />
                                            <div className="absolute top-1/2 left-[45%] w-[100%] h-0.5 bg-red-800 -translate-x-1/2 -rotate-15" />
                                            <div className="absolute top-1/2 left-[45%] w-[90%] h-0.5 bg-red-800/80 -translate-x-1/2 rotate-35" />
                                            <div className="absolute top-1/2 left-[45%] w-[80%] h-0.5 bg-red-800/70 -translate-x-1/2 -rotate-30" />
                                        </div>
                                        {/* Macula */}
                                        <div className="absolute top-1/2 left-[55%] -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-orange-950/60" />
                                    </div>
                                </div>

                                {/* Scan line animation */}
                                <AnimatePresence>
                                    {phase === "scanning" && (
                                        <motion.div
                                            initial={{ top: "-5%" }}
                                            animate={{ top: "105%" }}
                                            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                            className="absolute left-0 w-full h-[3px] bg-cyan-400 shadow-[0_0_20px_6px_rgba(34,211,238,0.6)] z-20 pointer-events-none"
                                        />
                                    )}
                                </AnimatePresence>

                                {/* Overlay during scan */}
                                <AnimatePresence>
                                    {phase === "scanning" && (
                                        <motion.div
                                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] z-10 flex items-center justify-center"
                                        >
                                            <div className="text-center">
                                                <ScanLine className="w-8 h-8 text-cyan-300 animate-pulse mx-auto mb-2" />
                                                <p className="text-cyan-200 font-bold text-xs uppercase tracking-widest">Analyzing retinal vessels using CNN…</p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Done overlay */}
                                <AnimatePresence>
                                    {phase === "done" && (
                                        <motion.div
                                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                            className="absolute inset-0 bg-emerald-900/50 z-10 flex items-center justify-center"
                                        >
                                            <div className="text-center">
                                                <CheckCircle2 className="w-10 h-10 text-emerald-300 mx-auto mb-2" />
                                                <p className="text-emerald-200 font-bold text-sm">Analysis Complete</p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Progress bar + step */}
                            <AnimatePresence>
                                {phase === "scanning" && (
                                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Processing</span>
                                            <span className="text-xs font-extrabold text-slate-900 tabular-nums">{progress}%</span>
                                        </div>
                                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <motion.div className="h-full bg-gradient-to-r from-slate-800 to-slate-900 rounded-full" animate={{ width: `${progress}%` }} />
                                        </div>
                                        <div className="flex items-center gap-2 mt-3">
                                            <Loader2 className="w-3 h-3 text-slate-900 animate-spin" />
                                            <p className="text-xs font-semibold text-slate-600">{SCANNER_STEPS[stepIdx]}</p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Result preview */}
                            <AnimatePresence>
                                {phase === "done" && (
                                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-6 p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                                        <div className="flex items-center gap-4 mb-3">
                                            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white">
                                                <Activity className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-extrabold text-slate-900 text-sm">Classification: No DR Detected</h4>
                                                <p className="text-xs text-slate-500">Confidence: <span className="font-bold text-emerald-600">98.7%</span></p>
                                            </div>
                                        </div>
                                        <p className="text-xs text-slate-600 leading-relaxed">
                                            The neural network identifies robust macular architecture. Vascular networks exhibit typical bifurcation integrity with no aneurysmal swellings detected.
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Actions */}
                            <div className="flex items-center justify-center gap-3">
                                {phase === "idle" && (
                                    <button onClick={startDemo} className="px-8 py-3 bg-slate-900 text-white font-bold rounded-full shadow-lg hover:bg-indigo-600 hover:shadow-slate-900/10 hover:-translate-y-0.5 transition-all text-sm">
                                        Run Demo Scan
                                    </button>
                                )}
                                {phase === "done" && (
                                    <>
                                        <button onClick={reset} className="px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-full shadow-sm hover:bg-slate-50 transition text-sm">
                                            Run Again
                                        </button>
                                        <Link href="/dashboard" className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-full shadow-lg hover:bg-blue-700 transition text-sm">
                                            Try with Your Image →
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
