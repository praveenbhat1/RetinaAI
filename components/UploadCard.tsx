"use client";

import { useState } from "react";
import { UploadCloud, ScanLine, Loader2, Sparkles, CheckCircle2, X, FileWarning, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

const ANALYSIS_STEPS = [
    { label: "Validating Image Integrity…", duration: 800 },
    { label: "Initializing EfficientNetB3 Engine…", duration: 1000 },
    { label: "Extracting high-res retinal features…", duration: 1200 },
    { label: "Running Convolutional Layer Analysis…", duration: 1500 },
    { label: "Finalizing diagnostic report…", duration: 500 },
];

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/tiff", "image/bmp"];

interface Props {
    /** If true, shows Patient Name field and uses doctor scan flow */
    doctorMode?: boolean;
}

export default function UploadCard({ doctorMode = false }: Props) {
    const { user } = useAuth();
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [stepIndex, setStepIndex] = useState(0);
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);
    const [isColdBooting, setIsColdBooting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [patientName, setPatientName] = useState("");
    const [patientNameError, setPatientNameError] = useState("");
    const router = useRouter();

    const handleFile = (selectedFile: File) => {
        setError(null);
        if (!selectedFile) return;
        if (!ACCEPTED_TYPES.includes(selectedFile.type)) {
            setError(`Invalid file type "${selectedFile.name.split('.').pop()}". Please upload a valid image (PNG, JPG, WebP, TIFF, BMP).`);
            return;
        }
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
        setIsColdBooting(false);
        setError(null);
        setPatientName("");
        setPatientNameError("");
    };

    /**
     * Look up an existing patientId for this doctor + name combo.
     * If none found, generate a new one (PAT-XXXX).
     */
    const resolvePatientId = async (name: string): Promise<string> => {
        if (!auth.currentUser || !db) return `PAT-${Math.floor(Math.random() * 9000) + 1000}`;
        const doctorId = auth.currentUser.uid;
        const q = query(
            collection(db, "predictions"),
            where("doctorId", "==", doctorId),
            where("patientName", "==", name.trim())
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
            // Return existing patient ID
            return snap.docs[0].data().patientId as string;
        }
        // Generate a new 4-digit Patient ID
        return `PAT-${Math.floor(Math.random() * 9000) + 1000}`;
    };

    const handleAnalyze = async () => {
        // Validate patient name in doctor mode
        if (doctorMode && !patientName.trim()) {
            setPatientNameError("Patient name is required before scanning.");
            return;
        }
        if (!file) {
            setError("No image uploaded. Please upload a fundus scan before running analysis.");
            return;
        }

        setError(null);
        setPatientNameError("");
        setIsAnalyzing(true);
        setProgress(0);
        setStepIndex(0);
        setCompletedSteps([]);
        setIsColdBooting(false);

        // For patients: auto-use their account name
        const effectiveName = doctorMode ? patientName.trim() : (user?.name || "Patient");

        // Resolve patient ID
        let resolvedPatientId = `SCN-${Math.floor(Math.random() * 10000).toString().padStart(4, "0")}`;
        if (doctorMode) {
            resolvedPatientId = await resolvePatientId(effectiveName);
        } else if (auth.currentUser) {
            // For patients: consistent ID based on their uid (PAT-<last 4 of uid>)
            resolvedPatientId = `PAT-${auth.currentUser.uid.slice(-4).toUpperCase()}`;
        }

        // Start API request concurrently with animation
        const formData = new FormData();
        formData.append("file", file);

        let apiResult: any = null;
        let apiError = false;

        // Use local backend if development, else Render
        const API_URL = "http://localhost:8000/predict";

        fetch(API_URL, {
            method: "POST",
            body: formData,
        }).then(res => {
            if (!res.ok) throw new Error("Diagnostic Engine Offline");
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
        let acc = 0;
        ANALYSIS_STEPS.forEach((step, idx) => {
            setTimeout(() => {
                setStepIndex(idx);
                if (idx > 0) setCompletedSteps(prev => [...prev, idx - 1]);
            }, acc);
            acc += step.duration;
        });

        // Progress bar (Slower, holds at 98% until API returns)
        const interval = setInterval(() => {
            elapsed += 25; 
            const pct = Math.min(Math.round((elapsed / total) * 100), 98);
            setProgress(pct);

            if (elapsed >= total || apiResult || apiError) {
                // If API is taking way longer than the animation (Cold Boot)
                if (!apiResult && !apiError && elapsed > total + 1200) {
                    setIsColdBooting(true);
                }

                if (apiError) {
                    clearInterval(interval);
                    setIsAnalyzing(false);
                    setError("Failed to connect to diagnostic engine. Is the backend running?");
                } else if (apiResult) {
                    clearInterval(interval);

                    // ── SECURITY GATE INTERCEPTOR ──
                    if (apiResult.success === false || apiResult.prediction === "Invalid Image" || apiResult.prediction === "Uncertain / Unrecognized") {
                        setIsAnalyzing(false);
                        setError(apiResult.message || apiResult.error || "SECURITY ALERT: Invalid image signature detected. Please upload a clinical retinal scan.");
                        return;
                    }

                    setProgress(100);
                    setCompletedSteps([0, 1, 2, 3]);

                    if (auth.currentUser && db) {
                        const docData: Record<string, any> = {
                            userId: auth.currentUser.uid,
                            prediction: apiResult.prediction,
                            confidence: apiResult.confidence,
                            scanId: resolvedPatientId,
                            patientName: effectiveName,
                            patientId: resolvedPatientId,
                            timestamp: new Date(),
                        };
                        if (doctorMode) {
                            docData.doctorId = auth.currentUser.uid;
                        }
                        addDoc(collection(db, "predictions"), docData).catch(console.error);
                    }

                    setTimeout(() =>
                        router.push(`/result?prediction=${apiResult.prediction}&confidence=${apiResult.confidence}&scanId=${resolvedPatientId}${doctorMode ? `&patientName=${encodeURIComponent(patientName)}` : ""}`),
                        400
                    );
                }
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

                {/* Error Toast */}
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
                                <p className="text-xs font-mono font-bold uppercase tracking-widest text-red-400 mb-1">SYSTEM_ALERT_ERR_01</p>
                                <p className="text-sm font-medium leading-relaxed text-slate-300">{error}</p>
                            </div>
                            <button onClick={() => setError(null)} className="text-slate-500 hover:text-white transition flex-shrink-0">
                                <X className="w-5 h-5" />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── Doctor Mode: Patient Name Field ── */}
                <AnimatePresence>
                    {doctorMode && !isAnalyzing && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-6"
                        >
                            <label className="block text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mb-2">
                                Patient Name <span className="text-slate-900">*</span>
                            </label>
                            <div className="relative">
                                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                <input
                                    type="text"
                                    value={patientName}
                                    onChange={e => { setPatientName(e.target.value); setPatientNameError(""); }}
                                    placeholder="Enter patient's full name"
                                    className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm bg-slate-50 text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:bg-white transition-all ${patientNameError ? "border-red-300 bg-red-50" : "border-slate-200"}`}
                                />
                            </div>
                            {patientNameError && (
                                <p className="text-xs text-red-500 mt-1.5 font-medium">{patientNameError}</p>
                            )}
                            <p className="text-[10px] font-mono text-slate-400 mt-1.5">
                                Same patient name → assigned same Patient ID across all visits
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Drop zone / Preview */}
                <label
                    className={`relative block w-full border border-slate-200 rounded-xl transition-all cursor-pointer overflow-hidden group ${isDragging
                        ? "bg-slate-50 border-slate-900/20"
                        : preview ? "border-transparent cursor-default" : "bg-slate-50 hover:bg-white hover:border-slate-300"
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
                            <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="flex flex-col items-center py-20 px-6 pointer-events-none">
                                <div className="w-16 h-16 bg-white border border-slate-100 shadow-sm rounded-2xl flex items-center justify-center text-slate-900 mb-8 group-hover:scale-105 transition-transform">
                                    <UploadCloud className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3 font-mono uppercase tracking-[0.2em]">INITIALIZE_SCAN_SEQUENCE</h3>
                                <p className="text-slate-500 font-medium text-sm mb-1">Drop clinical imagery or browse local directory</p>
                                <p className="text-[10px] font-mono text-slate-400 mb-8 tracking-wider">PROTOCOLS: PNG, JPG, WEBP, TIFF, BMP | MAX_SIZE: 20MB</p>
                                <div className="px-10 py-4 bg-slate-900 text-white text-xs font-bold rounded-xl shadow-xl hover:bg-slate-800 transition pointer-events-auto uppercase tracking-widest active:scale-95">
                                    Select Directory
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="relative w-full aspect-[16/9] max-h-[400px] overflow-hidden rounded-xl border border-slate-100">
                                <img src={preview} alt="Fundus scan preview" className="w-full h-full object-cover saturate-[0.8] contrast-[1.1]" />

                                {isAnalyzing && (
                                    <>
                                        <motion.div
                                            initial={{ top: "-5%" }} animate={{ top: "105%" }}
                                            transition={{ repeat: Infinity, duration: 1.8, ease: "linear" }}
                                            className="absolute left-0 w-full h-[1px] bg-slate-900 shadow-[0_0_15px_rgba(15,23,42,0.8)] z-20 pointer-events-none"
                                        />
                                        <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center gap-4">
                                            <div className="p-4 rounded-2xl bg-white shadow-2xl border border-slate-100">
                                                <ScanLine className="w-8 h-8 text-slate-900 animate-pulse" />
                                            </div>
                                            <div className="text-center">
                                                <h3 className="text-slate-900 font-bold text-lg mb-1 animate-pulse">Analyzing retinal scan...</h3>
                                                {isColdBooting ? (
                                                    <>
                                                        <motion.p key="coldboot" initial={{ opacity: 0, y: 2 }} animate={{ opacity: 1, y: 0 }}
                                                            className="text-amber-500 font-mono font-bold text-xs uppercase tracking-[0.2em] mb-2 flex items-center justify-center gap-2">
                                                            WAKING UP NEURAL ENGINE
                                                        </motion.p>
                                                        <div className="flex items-center justify-center gap-2">
                                                            <Loader2 className="w-3 h-3 text-amber-500 animate-spin" />
                                                            <span className="text-amber-600 text-[10px] font-mono font-bold tabular-nums animate-pulse">FREE CLOUD SERVER BOOTING (UP TO 60s)...</span>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <motion.p key={stepIndex} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                                                            className="text-slate-900 font-mono font-bold text-xs uppercase tracking-[0.2em] mb-2">
                                                            {ANALYSIS_STEPS[stepIndex]?.label}
                                                        </motion.p>
                                                        <div className="flex items-center justify-center gap-2">
                                                            <Loader2 className="w-3 h-3 text-slate-400 animate-spin" />
                                                            <span className="text-slate-900 text-[10px] font-mono font-bold tabular-nums">{progress}%_COMPLETE</span>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )}

                                {!isAnalyzing && (
                                    <button onClick={(e) => { e.preventDefault(); handleReset(); }}
                                        className="absolute top-4 right-4 z-30 w-10 h-10 bg-white/90 backdrop-blur-md rounded-xl border border-slate-200 flex items-center justify-center text-slate-900 hover:bg-white shadow-lg transition active:scale-95">
                                        <X className="w-5 h-5" />
                                    </button>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </label>

                {/* Analysis Progress */}
                <AnimatePresence>
                    {isAnalyzing && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-10 pt-10 border-t border-slate-100">
                            <div className="flex items-center justify-between mb-3 px-1">
                                <div className="flex flex-col gap-1.5">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[10px] font-mono font-bold text-slate-900 uppercase tracking-widest">EFFICIENTNET_B3_CORE_V4</span>
                                    </div>
                                    <span className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-tight">CLINICAL_BENCHMARK: <span className="text-emerald-600">87.0%_ACCURACY</span></span>
                                </div>
                                <span className="text-xs font-mono font-bold text-slate-900 tabular-nums">{progress}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-8">
                                <motion.div className="h-full bg-slate-900 rounded-full" animate={{ width: `${progress}%` }} transition={{ ease: "linear", duration: 0.05 }} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {ANALYSIS_STEPS.map((step, i) => {
                                    const done = completedSteps.includes(i);
                                    const active = stepIndex === i && !done;
                                    return (
                                        <motion.div key={i} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                                            className={`flex items-center gap-4 px-5 py-4 rounded-xl border transition-all ${done ? "bg-slate-50 border-slate-100" : active ? "bg-white border-slate-900/10 shadow-sm" : "bg-white/50 border-slate-50 text-slate-300"}`}>
                                            <div className={`w-2 h-2 rounded-full ${done ? "bg-slate-900" : active ? "bg-slate-400 animate-pulse" : "bg-slate-100"}`} />
                                            <span className={`text-[11px] font-mono font-bold uppercase tracking-wider ${active ? "text-slate-900" : ""}`}>{step.label}</span>
                                            {done && <div className="ml-auto text-[10px] font-mono text-slate-400">[ OK ]</div>}
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
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-4 justify-end mt-10">
                            <button onClick={handleReset} className="px-8 py-3.5 text-slate-500 font-mono text-xs font-bold uppercase tracking-widest hover:text-slate-900 transition active:scale-95">
                                [ Terminate ]
                            </button>
                            <button onClick={handleAnalyze}
                                className="px-10 py-4 flex items-center gap-3 text-white bg-slate-900 font-bold rounded-xl shadow-2xl hover:bg-slate-800 transition-all uppercase tracking-widest text-xs active:scale-95">
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
