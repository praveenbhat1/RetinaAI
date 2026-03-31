"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, FileText, ChevronRight, Loader2, X, Activity } from "lucide-react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

interface ScanRecord {
    id: string;
    patientId?: string;
    patientName?: string;
    prediction: string;
    confidence: number;
    scanId: string;
    timestamp: any;
    doctorId?: string;
}

const SEVERITY_COLOR: Record<string, string> = {
    "No DR": "bg-emerald-50 text-emerald-700 border-emerald-200",
    "Mild": "bg-amber-50 text-amber-700 border-amber-200",
    "Moderate": "bg-orange-50 text-orange-700 border-orange-200",
    "Severe": "bg-red-50 text-red-700 border-red-200",
    "Proliferative": "bg-rose-100 text-rose-800 border-rose-300",
};

export default function HistoryTable() {
    const { user } = useAuth();
    const [records, setRecords] = useState<ScanRecord[]>([]);
    const [filtered, setFiltered] = useState<ScanRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchType, setSearchType] = useState<"name" | "id">("name");

    const isDoctor = user?.role === "doctor";

    const fetchRecords = useCallback(async () => {
        if (!auth.currentUser || !db) return;
        setLoading(true);
        try {
            const q = isDoctor
                ? query(collection(db, "predictions"), where("doctorId", "==", auth.currentUser.uid))
                : query(collection(db, "predictions"), where("userId", "==", auth.currentUser.uid));

            const snap = await getDocs(q);
            const data: ScanRecord[] = snap.docs.map(d => ({
                id: d.id,
                ...(d.data() as Omit<ScanRecord, "id">),
            }));
            // Sort by timestamp descending client-side
            data.sort((a, b) => {
                const ta = a.timestamp?.seconds ?? 0;
                const tb = b.timestamp?.seconds ?? 0;
                return tb - ta;
            });
            setRecords(data);
            setFiltered(data);
        } catch (err) {
            console.error("History fetch error:", err);
        } finally {
            setLoading(false);
        }
    }, [isDoctor]);

    useEffect(() => { fetchRecords(); }, [fetchRecords]);

    // Search logic
    useEffect(() => {
        if (!searchQuery.trim()) {
            setFiltered(records);
            return;
        }
        const q = searchQuery.trim().toLowerCase();
        setFiltered(records.filter(r => {
            if (searchType === "name") return r.patientName?.toLowerCase().includes(q);
            if (searchType === "id") return r.patientId?.toLowerCase().includes(q) || r.scanId?.toLowerCase().includes(q);
            return false;
        }));
    }, [searchQuery, searchType, records]);

    const formatDate = (ts: any) => {
        if (!ts) return "—";
        const d = ts.seconds ? new Date(ts.seconds * 1000) : new Date(ts);
        return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
    };

    return (
        <div className="w-full">
            {/* Search Bar */}
            <div className="p-6 border-b border-slate-100">
                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Search Type Toggle (doctors only) */}
                    {isDoctor && (
                        <div className="flex rounded-xl overflow-hidden border border-slate-200 flex-shrink-0">
                            {(["name", "id"] as const).map(t => (
                                <button key={t} onClick={() => setSearchType(t)}
                                    className={`px-4 py-2 text-[11px] font-mono font-bold uppercase tracking-widest transition-colors ${searchType === t ? "bg-slate-900 text-white" : "bg-white text-slate-500 hover:bg-slate-50"}`}>
                                    By {t === "name" ? "Name" : "ID"}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Search Input */}
                    <div className="relative flex-1">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder={isDoctor
                                ? searchType === "name" ? "Search by patient name…" : "Search by Patient ID (e.g. PAT-1234)…"
                                : "Search records…"
                            }
                            className="w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:bg-white transition-all"
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition">
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
                {searchQuery && (
                    <p className="text-[10px] font-mono text-slate-400 mt-2">
                        {filtered.length} result{filtered.length !== 1 ? "s" : ""} found
                    </p>
                )}
            </div>

            {/* Table Header */}
            <div className={`grid ${isDoctor ? "grid-cols-[1fr_1fr_1fr_1fr_auto]" : "grid-cols-[1fr_1fr_1fr_auto]"} gap-4 px-6 py-3 bg-slate-50 border-b border-slate-100`}>
                {isDoctor && <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Patient</span>}
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Scan ID</span>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Prediction</span>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Confidence</span>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Timestamp</span>
            </div>

            {/* Rows */}
            {loading ? (
                <div className="flex items-center justify-center py-20 gap-3">
                    <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                    <span className="text-sm font-mono text-slate-400 uppercase tracking-widest">Loading Records…</span>
                </div>
            ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-slate-300" />
                    </div>
                    <p className="text-sm font-mono text-slate-400 uppercase tracking-widest">
                        {searchQuery ? "No Matching Records Found" : "No Diagnostic Records Found"}
                    </p>
                </div>
            ) : (
                <AnimatePresence>
                    {filtered.map((record, i) => (
                        <motion.div key={record.id}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.04 }}
                            className={`grid ${isDoctor ? "grid-cols-[1fr_1fr_1fr_1fr_auto]" : "grid-cols-[1fr_1fr_1fr_auto]"} gap-4 items-center px-6 py-4 border-b border-slate-50 hover:bg-slate-50/50 transition-colors group`}
                        >
                            {/* Patient column (doctor only) */}
                            {isDoctor && (
                                <div>
                                    <p className="text-sm font-semibold text-slate-900">{record.patientName || "—"}</p>
                                    <p className="text-[10px] font-mono text-slate-400">{record.patientId || record.scanId}</p>
                                </div>
                            )}

                            {/* Scan ID */}
                            <span className="text-xs font-mono text-slate-500">{record.scanId}</span>

                            {/* Prediction badge */}
                            <span className={`inline-flex px-2.5 py-1 rounded-lg border text-[11px] font-bold font-mono w-fit ${SEVERITY_COLOR[record.prediction] ?? "bg-slate-50 text-slate-600 border-slate-200"}`}>
                                {record.prediction}
                            </span>

                            {/* Confidence */}
                            <div className="flex items-center gap-2">
                                <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-slate-900 rounded-full" style={{ width: `${Math.round(record.confidence)}%` }} />
                                </div>
                                <span className="text-xs font-mono text-slate-600 tabular-nums">{Math.round(record.confidence)}%</span>
                            </div>

                            {/* Timestamp + Link */}
                            <div className="flex items-center gap-3">
                                <span className="text-[11px] font-mono text-slate-400">{formatDate(record.timestamp)}</span>
                                <Link href={`/result?prediction=${record.prediction}&confidence=${record.confidence}&scanId=${record.scanId}${record.patientName ? `&patientName=${encodeURIComponent(record.patientName)}` : ""}`}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity w-7 h-7 bg-slate-900 rounded-lg flex items-center justify-center text-white">
                                    <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            )}

            {/* Footer */}
            {!loading && records.length > 0 && (
                <div className="px-6 py-4 flex items-center justify-between bg-slate-50/50">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                        {records.length} Total Record{records.length !== 1 ? "s" : ""}
                    </span>
                    <button onClick={fetchRecords} className="text-[10px] font-mono text-slate-500 hover:text-slate-900 uppercase tracking-widest font-bold transition flex items-center gap-1.5">
                        <Activity className="w-3 h-3" /> Refresh
                    </button>
                </div>
            )}
        </div>
    );
}
