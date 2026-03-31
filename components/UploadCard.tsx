"use client";

import { useState } from "react";
import { UploadCloud, ScanLine, Loader2, Sparkles, CheckCircle2, X, AlertCircle, FileWarning } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";

const ANALYSIS_STEPS = [
    { label: "Extracting retinal features…", duration: 400 },
    { label: "Analyzing CNN layers…", duration: 600 },
    { label: "Detecting abnormalities…", duration: 550 },
    { label: "Generating diagnostic report…", duration: 350 },
];

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/tiff", "image/bmp"];

export default function UploadCard() {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [stepIndex, setStepIndex] = useState(0);
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleFile = (selectedFile: File) => {
        setError(null);
        if (!selectedFile) return;

        // ⭐ Error handling: wrong file type
        if (!ACCEPTED_TYPES.includes(selectedFile.type)) {
            setError(`Invalid file type "${selectedFile.name.split('.').pop()}". Please upload a valid image (PNG, JPG, WebP, TIFF, BMP).`);
            return;
        }

        // ⭐ Error handling: file too large (>20MB)
        if (selectedFile.size > 20 * 1024 * 1024) {
            setError("File exceeds 20MB limit. Please upload a smaller fundus image.");
            return;
        }

        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
    };

    const handleReset = () => {
        setFile(null);
        setPreview(null);
        setIsAnalyzing(false);
        setProgress(0);
        setStepIndex(0);
        setCompletedSteps([]);
        setError(null);
    };

    const handleAnalyze = () => {
        // ⭐ Error handling: no image uploaded
        if (!file) {
            setError("No image uploaded. Please upload a fundus scan before running analysis.");
            return;
        }

        setError(null);
        setIsAnalyzing(true);
        setProgress(0);
        setStepIndex(0);
        setCompletedSteps([]);

        // Start API request concurrently with animation
        const formData = new FormData();
        formData.append("file", file);

        let apiResult: any = null;
        let apiError = false;

        fetch("https://retinaai-d1zs.onrender.com/predict", {
            method: "POST",
            body: formData
        }).then(res => {
            if (!res.ok) throw new Error("API Route Failed");
            return res.json();
        }).then(data => {
            apiResult = data;
        }).catch(err => {
            console.error(err);
            apiError = true;
        });

        let elapsed = 0;
        const total = ANALYSIS_STEPS.reduce((s, st) => s + st.duration, 0);

        // Step ticker
        const stepTimers: ReturnType<typeof setTimeout>[] = [];
        let acc = 0;
        ANALYSIS_STEPS.forEach((step, idx) => {
            const t = setTimeout(() => {
                setStepIndex(idx);
                if (idx > 0) setCompletedSteps(prev => [...prev, idx - 1]);
            }, acc);
            stepTimers.push(t);
            acc += step.duration;
        });

        // Progress bar
        const interval = setInterval(() => {
            elapsed += 50;
            const pct = Math.min(Math.round((elapsed / total) * 100), 99);
            setProgress(pct);
            
            // Try to finish once elapsed reaches total time
            if (elapsed >= total) {
                if (apiError) {
                    clearInterval(interval);
                    setIsAnalyzing(false);
                    setError("Failed to connect to diagnostic engine. Is the backend running?");
                } else if (apiResult) {
                    clearInterval(interval);
                    setProgress(100);
                    setCompletedSteps([0, 1, 2, 3]);
                    const scanId = `SCN-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
                    
                    if (auth.currentUser) {
                        addDoc(collection(db, "predictions"), {
                            userId: auth.currentUser.uid,
                            prediction: apiResult.prediction,
                            confidence: apiResult.confidence,
                            scanId: scanId,
                            timestamp: new Date()
                        }).catch(console.error);
                    }

                    // Navigate to Result Page with API properties
                    setTimeout(() => router.push(`/result?prediction=${apiResult.prediction}&confidence=${apiResult.confidence}&scanId=${scanId}`), 400);
                }
                // If API is just slow, progress stops at 99% until apiError or apiResult is set
            }
        }, 50);
    };

    return (
        <div className="w-full max-w-4xl mx-auto rounded-2xl p-[1px] bg-slate-200 shadow-2xl shadow-slate-900/10 mt-12 overflow-hidden relative">
            {/* HUD Corner Markers */}
            <div className="absolute top-2 left-2 text-[10px] font-mono text-slate-300 pointer-events-none">[ + ]</div>
            <div className="absolute top-2 right-2 text-[10px] font-mono text-slate-300 pointer-events-none">[ + ]</div>
            <div className="absolute bottom-2 left-2 text-[10px] font-mono text-slate-300 pointer-events-none">[ + ]</div>
            <div className="absolute bottom-2 right-2 text-[10px] font-mono text-slate-300 pointer-events-none">[ + ]</div>

            <div className="bg-white rounded-[calc(1rem-1px)] p-8 md:p-10 relative">
                {/* ⭐ Error Toast */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="flex items-start gap-4 p-5 rounded-xl bg-slate-900 text-white mb-8 border border-white/10"
                        >
                            <div className="w-10 h-10 rounded-lg bg-red-500 flex items-center justify-center text-white flex-shrink-0">
                                <FileWarning className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-mono font-bold uppercase tracking-widest text-red-400 mb-1">SYSTEM_ALER_ERR_01</p>
                                <p className="text-sm font-medium leading-relaxed text-slate-300">{error}</p>
                            </div>
                            <button onClick={() => setError(null)} className="text-slate-500 hover:text-white transition flex-shrink-0">
                                <X className="w-5 h-5" />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Drop zone / Preview */}
                <label
                    className={`relative block w-full border border-slate-200 rounded-xl transition-all cursor-pointer overflow-hidden group ${isDragging
                        ? "bg-slate-50 border-slate-900/20"
                        : preview
                            ? "border-transparent cursor-default"
                            : "bg-slate-50 hover:bg-white hover:border-slate-300"
                        }`}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                        e.preventDefault(); setIsDragging(false);
                        if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
                    }}
                >
                    <input type="file" className="hidden" accept="image/*" disabled={!!preview}
                        onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />

                    <AnimatePresence mode="wait">
                        {!preview ? (
                            <motion.div
                                key="upload"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="flex flex-col items-center py-20 px-6 pointer-events-none"
                            >
                                <div className="w-16 h-16 bg-white border border-slate-100 shadow-sm rounded-2xl flex items-center justify-center text-slate-900 mb-8 transition-transform group-hover:scale-105">
                                    <UploadCloud className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight font-mono uppercase tracking-[0.2em]">INITIALIZE_SCAN_SEQUENCE</h3>
                                <p className="text-slate-500 font-medium text-sm mb-1">Drop clinical imagery or browse local directory</p>
                                <p className="text-[10px] font-mono text-slate-400 mb-8 tracking-wider">PROTOCOLS: PNG, JPG, WEBP, TIFF, BMP | MAX_SIZE: 20MB</p>
                                <div className="px-10 py-4 bg-slate-900 text-white text-xs font-bold rounded-xl shadow-xl hover:bg-slate-800 transition pointer-events-auto uppercase tracking-widest active:scale-95">
                                    Select Directory
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="preview"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="relative w-full aspect-[16/9] max-h-[400px] overflow-hidden rounded-xl border border-slate-100"
                            >
                                <img src={preview} alt="Fundus scan preview" className="w-full h-full object-cover saturate-[0.8] contrast-[1.1]" />

                                {/* Clinical Scanner Overlay */}
                                {isAnalyzing && (
                                    <>
                                        <motion.div
                                            initial={{ top: "-5%" }}
                                            animate={{ top: "105%" }}
                                            transition={{ repeat: Infinity, duration: 1.8, ease: "linear" }}
                                            className="absolute left-0 w-full h-[1px] bg-slate-900 shadow-[0_0_15px_rgba(15,23,42,0.8)] z-20 pointer-events-none"
                                        />
                                        <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center gap-4">
                                            <div className="p-4 rounded-2xl bg-white shadow-2xl border border-slate-100">
                                                <ScanLine className="w-8 h-8 text-slate-900 animate-pulse" />
                                            </div>
                                            <div className="text-center">
                                                <motion.p
                                                    key={stepIndex}
                                                    initial={{ opacity: 0, y: 5 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="text-slate-900 font-mono font-bold text-xs uppercase tracking-[0.2em] mb-2"
                                                >
                                                    {ANALYSIS_STEPS[stepIndex]?.label}
                                                </motion.p>
                                                <div className="flex items-center justify-center gap-2">
                                                    <Loader2 className="w-3 h-3 text-slate-400 animate-spin" />
                                                    <span className="text-slate-900 text-[10px] font-mono font-bold tabular-nums">{progress}%_COMPLETE</span>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Reset button */}
                                {!isAnalyzing && (
                                    <button
                                        onClick={(e) => { e.preventDefault(); handleReset(); }}
                                        className="absolute top-4 right-4 z-30 w-10 h-10 bg-white/90 backdrop-blur-md rounded-xl border border-slate-200 flex items-center justify-center text-slate-900 hover:bg-white shadow-lg transition active:scale-95"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </label>

                {/* Analysis UI */}
                <AnimatePresence>
                    {isAnalyzing && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="mt-10 pt-10 border-t border-slate-100"
                        >
                            <div className="flex items-center justify-between mb-3 px-1">
                                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Diagnostic_Engine_Thread</span>
                                <span className="text-xs font-mono font-bold text-slate-900 tabular-nums">{progress}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-8">
                                <motion.div
                                    className="h-full bg-slate-900 rounded-full"
                                    animate={{ width: `${progress}%` }}
                                    transition={{ ease: "linear", duration: 0.05 }}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {ANALYSIS_STEPS.map((step, i) => {
                                    const done = completedSteps.includes(i);
                                    const active = stepIndex === i && !done;
                                    return (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, scale: 0.98 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className={`flex items-center gap-4 px-5 py-4 rounded-xl border transition-all ${done
                                                ? "bg-slate-50 border-slate-100 text-slate-900"
                                                : active
                                                    ? "bg-white border-slate-900/10 text-slate-900 shadow-sm"
                                                    : "bg-white/50 border-slate-50 text-slate-300"
                                                }`}
                                        >
                                            <div className={`w-2 h-2 rounded-full ${done ? "bg-slate-900" : active ? "bg-slate-400 animate-pulse" : "bg-slate-100"}`} />
                                            <span className={`text-[11px] font-mono font-bold uppercase tracking-wider ${active ? "text-slate-900" : ""}`}>
                                                {step.label}
                                            </span>
                                            {done && (
                                                <div className="ml-auto text-[10px] font-mono text-slate-400">[ OK ]</div>
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Footer Controls */}
                <AnimatePresence>
                    {preview && !isAnalyzing && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex gap-4 justify-end mt-10"
                        >
                            <button
                                onClick={handleReset}
                                className="px-8 py-3.5 text-slate-500 font-mono text-xs font-bold uppercase tracking-widest hover:text-slate-900 transition active:scale-95"
                            >
                                [ Terminate ]
                            </button>
                            <button
                                onClick={handleAnalyze}
                                className="px-10 py-4 flex items-center gap-3 text-white bg-slate-900 font-bold rounded-xl shadow-2xl hover:bg-slate-800 transition-all uppercase tracking-widest text-xs active:scale-95"
                            >
                                <Sparkles className="w-4 h-4 text-slate-400" /> Run Clinical Diagnostic
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {!preview && !isAnalyzing && !error && (
                    <div className="mt-8 flex items-center gap-2 justify-center opacity-40">
                        <div className="w-1 h-1 rounded-full bg-slate-400 animate-pulse" />
                        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Awaiting_Input_Signal</span>
                    </div>
                )}
            </div>
        </div>
    );
}
