"use client";

import { motion } from "framer-motion";
import ResultCard from "@/components/ResultCard";
import ProtectedRoute from "@/components/ProtectedRoute";

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay },
});

export default function ResultPage() {
    return (
        <ProtectedRoute>
            <div className="flex-1 bg-white py-24 px-6 relative overflow-hidden min-h-screen font-body">
                {/* HUD Blueprint Grid */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                    style={{ backgroundImage: `linear-gradient(#0f172a 1px, transparent 1px), linear-gradient(90deg, #0f172a 1px, transparent 1px)`, backgroundSize: '40px 40px' }} 
                />
                
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[60vh] bg-gradient-to-b from-slate-50 to-transparent pointer-events-none" />

                <div className="container mx-auto max-w-4xl relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                        <div className="max-w-2xl">
                            <motion.div {...fadeUp()}>
                                <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-mono font-bold uppercase tracking-[0.2em] mb-6">
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                                    REPORT_TYPE: NEURAL_LOG_v4.2
                                </div>
                            </motion.div>
                            <motion.h1 {...fadeUp(0.1)} className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
                                Diagnostic <span className="text-slate-400 font-light italic">Report</span>
                            </motion.h1>
                            <motion.p {...fadeUp(0.2)} className="text-slate-500 text-lg leading-relaxed font-medium">
                                Comprehensive AI-driven analysis of the provided retinal fundus sequence.
                            </motion.p>
                        </div>
                    </div>

                    {/* Result Card with HUD Framing */}
                    <div className="relative">
                        {/* HUD Corner Accents */}
                        <div className="absolute -top-4 -left-4 w-10 h-10 border-t-2 border-l-2 border-slate-200 rounded-tl-xl pointer-events-none" />
                        <div className="absolute -top-4 -right-4 w-10 h-10 border-t-2 border-r-2 border-slate-200 rounded-tr-xl pointer-events-none" />
                        <div className="absolute -bottom-4 -left-4 w-10 h-10 border-b-2 border-l-2 border-slate-200 rounded-bl-xl pointer-events-none" />
                        <div className="absolute -bottom-4 -right-4 w-10 h-10 border-b-2 border-r-2 border-slate-200 rounded-br-xl pointer-events-none" />
                        
                        <ResultCard />
                    </div>

                    {/* Technical Footer */}
                    <div className="mt-20 pt-8 border-t border-slate-100 flex justify-between items-center opacity-40 font-mono text-slate-400">
                        <span className="text-[10px] uppercase tracking-widest">VALIDATED_BY: NEURAL_ENGINE</span>
                        <span className="text-[10px] uppercase tracking-widest">TIMESTAMP: [SYSTEM_CLOCK]</span>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
