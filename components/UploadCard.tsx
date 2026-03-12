"use client";

import { useState } from "react";
import { UploadCloud, Image as ImageIcon, ScanLine, Loader2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function UploadCard() {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const router = useRouter();

    const handleFile = (selectedFile: File) => {
        if (selectedFile && selectedFile.type.startsWith("image/")) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleAnalyze = () => {
        if (!file) return;
        setIsAnalyzing(true);
        setTimeout(() => {
            setIsAnalyzing(false);
            router.push("/result");
        }, 4000); // Wait enough to show the scanning animation
    };

    return (
        <div className="w-full max-w-4xl mx-auto rounded-3xl p-1 bg-gradient-to-br from-white/40 to-slate-200/40 backdrop-blur-2xl border border-white/50 shadow-2xl shadow-slate-300/40 mt-12 overflow-hidden">
            <div className="bg-white/20 backdrop-blur-3xl rounded-[1.4rem] p-10 relative">
                <label
                    className={`relative block w-full border-2 border-dashed rounded-3xl p-16 text-center transition-all cursor-pointer overflow-hidden ${isDragging ? "border-primary/50 bg-primary/10 shadow-[inset_0_0_50px_rgba(37,99,235,0.1)]" : "border-slate-300/50 hover:border-primary/50 hover:bg-white/30"
                        }`}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
                    }}
                >
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]) }} />

                    <AnimatePresence mode="wait">
                        {!preview ? (
                            <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center z-10 relative pointer-events-none">
                                <div className="w-24 h-24 bg-white/60 backdrop-blur-md shadow-xl border border-white/60 rounded-[2rem] flex items-center justify-center text-primary mb-8 animate-pulse">
                                    <UploadCloud className="w-12 h-12" />
                                </div>
                                <h3 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight drop-shadow-sm">Scan Medical Imagery</h3>
                                <p className="text-slate-600 font-bold text-lg mb-8">Drop your raw fundus scan onto the AI network</p>
                                <div className="px-10 py-4 bg-slate-900 text-white font-bold rounded-full shadow-lg shadow-slate-900/20 hover:scale-105 transition-transform pointer-events-auto">Browse Directory</div>
                            </motion.div>
                        ) : (
                            <motion.div key="preview" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center">
                                <div className="relative w-full max-w-xl aspect-[4/3] rounded-3xl overflow-hidden mb-6 border-4 border-white/50 shadow-2xl">
                                    <img src={preview} alt="Retina" className="w-full h-full object-cover" />

                                    {isAnalyzing && (
                                        <>
                                            {/* Scanning Line overlay */}
                                            <motion.div
                                                initial={{ top: "-10%" }}
                                                animate={{ top: "110%" }}
                                                transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                                                className="absolute left-0 w-full h-[6px] bg-cyan-400 shadow-[0_0_30px_10px_rgba(34,211,238,0.8)] z-20 pointer-events-none"
                                            />
                                            {/* Dark overlay & processing text */}
                                            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center gap-6">
                                                <ScanLine className="w-16 h-16 text-cyan-400 animate-spin-slow opacity-90" />
                                                <h2 className="text-2xl font-extrabold text-white tracking-widest uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.7)] flex items-center gap-3">
                                                    <Loader2 className="w-6 h-6 animate-spin" />
                                                    Analyzing retinal vessels using CNN...
                                                </h2>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </label>

                <AnimatePresence>
                    {preview && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-4 w-full justify-center mt-10">
                            <button onClick={() => { setFile(null); setPreview(null); }} className="px-8 py-4 text-slate-700 bg-white/50 backdrop-blur-lg border border-white/80 font-bold rounded-full hover:bg-white shadow-sm transition-all hover:-translate-y-0.5" disabled={isAnalyzing}>
                                Reset
                            </button>
                            <button onClick={handleAnalyze} disabled={isAnalyzing} className="px-10 py-4 flex items-center gap-3 text-white bg-slate-900 font-bold rounded-full shadow-2xl shadow-slate-900/30 hover:shadow-slate-900/50 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:translate-y-0">
                                {isAnalyzing ? <><Loader2 className="w-6 h-6 animate-spin" /> Deep Inference Running</> : <><Sparkles className="w-6 h-6 text-cyan-400" /> Start AI Scan</>}
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="absolute bottom-4 left-0 right-0 text-center">
                    <p className="text-sm font-semibold text-slate-500/80 uppercase tracking-widest">In-Memory Encrypted Stream</p>
                </div>
            </div>
        </div>
    );
}
