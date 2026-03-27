"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronRight, Filter, X, Shield, User } from "lucide-react";
import SeverityBadge, { SeverityType } from "./SeverityBadge";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const ALL_HISTORY = [
    { id: "1", date: "2026-03-12 10:24", patientId: "PT-0894", patientName: "Self", prediction: "Mild", confidence: 89.4, doctor: "Dr. Agarwal", isOwn: true },
    { id: "2", date: "2026-03-11 09:15", patientId: "PT-1102", patientName: "R. Sharma", prediction: "No DR", confidence: 98.1, doctor: "Dr. Patel", isOwn: false },
    { id: "3", date: "2026-03-08 16:45", patientId: "PT-0731", patientName: "K. Nair", prediction: "Moderate", confidence: 92.7, doctor: "Dr. Agarwal", isOwn: false },
    { id: "4", date: "2026-03-01 11:10", patientId: "PT-0422", patientName: "M. Reddy", prediction: "Severe", confidence: 95.2, doctor: "Dr. Singh", isOwn: false },
    { id: "5", date: "2026-02-28 10:05", patientId: "PT-0991", patientName: "Self", prediction: "Proliferative", confidence: 97.4, doctor: "Dr. Patel", isOwn: true },
    { id: "6", date: "2026-02-20 14:33", patientId: "PT-0105", patientName: "S. Gupta", prediction: "No DR", confidence: 99.0, doctor: "Dr. Agarwal", isOwn: false },
    { id: "7", date: "2026-02-15 08:50", patientId: "PT-0278", patientName: "Self", prediction: "Mild", confidence: 87.6, doctor: "Dr. Singh", isOwn: true },
    { id: "8", date: "2026-02-10 13:22", patientId: "PT-0640", patientName: "A. Joseph", prediction: "Moderate", confidence: 91.3, doctor: "Dr. Patel", isOwn: false },
];

const SEVERITY_FILTERS = ["All", "No DR", "Mild", "Moderate", "Severe", "Proliferative"] as const;

export default function HistoryTable() {
    const [search, setSearch] = useState("");
    const [activeFilter, setActiveFilter] = useState<string>("All");
    const { user } = useAuth();

    // Role from auth context — patient sees only own, doctor/admin sees all
    const isFullAccess = user?.role === "doctor" || user?.role === "admin";

    const roleFiltered = useMemo(() => {
        if (!isFullAccess) {
            return ALL_HISTORY.filter(row => row.isOwn);
        }
        return ALL_HISTORY;
    }, [isFullAccess]);

    const filtered = useMemo(() => {
        return roleFiltered.filter(row => {
            const matchesSearch =
                row.patientId.toLowerCase().includes(search.toLowerCase()) ||
                row.prediction.toLowerCase().includes(search.toLowerCase()) ||
                row.patientName.toLowerCase().includes(search.toLowerCase()) ||
                row.date.includes(search);
            const matchesSeverity = activeFilter === "All" || row.prediction === activeFilter;
            return matchesSearch && matchesSeverity;
        });
    }, [search, activeFilter, roleFiltered]);

    return (
        <div className="w-full mt-6 space-y-6">
            {/* System Status Banner */}
            <div className={`flex items-center justify-between gap-4 px-6 py-4 rounded-xl text-[11px] font-mono font-bold border ${isFullAccess
                ? "bg-slate-900 border-slate-800 text-white"
                : "bg-slate-50 border-slate-200 text-slate-600"
                }`}>
                <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${isFullAccess ? "bg-emerald-400 animate-pulse" : "bg-slate-400"}`} />
                    <span className="tracking-[0.1em]">
                        {isFullAccess ? "SECURE_ADMIN_STREAM: [ ACCESS_GRANTED ]" : "USER_DATA_STREAM: [ PRIVACY_LOCKED ]"}
                    </span>
                </div>
                <span className="opacity-50">NODE_ID: 0x92..F8</span>
            </div>

            {/* HUD Control Bar */}
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                <div className="relative w-full lg:max-w-md">
                    <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="INPUT_QUERY: ID_OR_TIMESTAMP..."
                        className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-900 transition"
                    />
                    {search && (
                        <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition">
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mr-2">Filter_Type:</span>
                    {SEVERITY_FILTERS.map(f => (
                        <button
                            key={f}
                            onClick={() => setActiveFilter(f)}
                            className={`px-3 py-2 rounded-lg text-[10px] font-mono font-bold transition-all border uppercase tracking-wider ${activeFilter === f
                                ? "bg-slate-900 text-white border-slate-900 shadow-xl"
                                : "bg-white text-slate-400 border-slate-200 hover:border-slate-300"
                                }`}
                        >
                            {f.replace(" ", "_")}
                        </button>
                    ))}
                </div>
            </div>

            {/* Record Count HUD */}
            <div className="flex items-center gap-3 opacity-60">
                <div className="h-[1px] w-6 bg-slate-300" />
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-[0.2em]">
                    Entries_Matched: [ {filtered.length.toString().padStart(2, '0')} ]
                </span>
            </div>

            {/* HUD Data Grid */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl shadow-slate-900/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse whitespace-nowrap min-w-[800px] font-mono">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 font-bold text-slate-400 text-[10px] uppercase tracking-[0.2em]">Timestamp</th>
                                <th className="px-6 py-4 font-bold text-slate-400 text-[10px] uppercase tracking-[0.2em]">Scan_ID</th>
                                {isFullAccess && (
                                    <th className="px-6 py-4 font-bold text-slate-400 text-[10px] uppercase tracking-[0.2em]">Patient_Name</th>
                                )}
                                <th className="px-6 py-4 font-bold text-slate-400 text-[10px] uppercase tracking-[0.2em]">Diag_Status</th>
                                <th className="px-6 py-4 font-bold text-slate-400 text-[10px] uppercase tracking-[0.2em]">Confidence</th>
                                {isFullAccess && (
                                    <th className="px-6 py-4 font-bold text-slate-400 text-[10px] uppercase tracking-[0.2em]">Reviewer</th>
                                )}
                                <th className="px-10 py-4 font-bold text-slate-400 text-[10px] uppercase tracking-[0.2em] text-right">Data_Access</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-[12px]">
                            <AnimatePresence initial={false}>
                                {filtered.length > 0 ? filtered.map((row, idx) => (
                                    <motion.tr
                                        key={row.id}
                                        initial={{ opacity: 0, x: -5 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="group hover:bg-slate-50 transition-colors"
                                    >
                                        <td className="px-6 py-5 text-slate-500 tabular-nums">{row.date}</td>
                                        <td className="px-6 py-5">
                                            <span className="text-slate-900 font-bold tracking-tighter">
                                                #{row.patientId}
                                            </span>
                                        </td>
                                        {isFullAccess && (
                                            <td className="px-6 py-5 text-slate-900 font-bold uppercase tracking-tight">{row.patientName}</td>
                                        )}
                                        <td className="px-6 py-5">
                                            <SeverityBadge severity={row.prediction as SeverityType} />
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${row.confidence > 96 ? "bg-slate-900" : row.confidence > 90 ? "bg-slate-400" : "bg-red-400"}`}
                                                        style={{ width: `${row.confidence}%` }}
                                                    />
                                                </div>
                                                <span className="font-bold text-slate-900 tabular-nums tracking-tighter">{row.confidence}%_MATCH</span>
                                            </div>
                                        </td>
                                        {isFullAccess && (
                                            <td className="px-6 py-5 text-slate-500 uppercase tracking-widest text-[10px] font-bold">{row.doctor}</td>
                                        )}
                                        <td className="px-10 py-5 text-right">
                                            <Link
                                                href="/result"
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-900 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition active:scale-95 shadow-sm uppercase tracking-widest"
                                            >
                                                Initialize_View <ChevronRight className="w-3 h-3" />
                                            </Link>
                                        </td>
                                    </motion.tr>
                                )) : (
                                    <tr>
                                        <td colSpan={isFullAccess ? 7 : 5} className="px-6 py-16 text-center text-slate-400 font-mono text-xs uppercase tracking-[0.2em] italic">
                                            !! Null_Set_Returned: [ No_Matches_Found ] !!
                                        </td>
                                    </tr>
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
