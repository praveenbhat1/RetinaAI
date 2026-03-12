"use client";

import { motion } from "framer-motion";
import SeverityBadge, { SeverityType } from "./SeverityBadge";

export default function HistoryTable() {
    const dummyHistory = [
        { id: "1", date: "2026-03-12 10:24", patientId: "PT-0894", prediction: "Mild", confidence: 89.4 },
        { id: "2", date: "2026-03-11 09:15", patientId: "PT-1102", prediction: "No DR", confidence: 98.1 },
        { id: "3", date: "2026-03-08 16:45", patientId: "PT-0731", prediction: "Moderate", confidence: 92.7 },
        { id: "4", date: "2026-03-01 11:10", patientId: "PT-0422", prediction: "Severe", confidence: 95.2 },
        { id: "5", date: "2026-02-28 10:05", patientId: "PT-0991", prediction: "Proliferative", confidence: 97.4 },
    ] as const;

    return (
        <div className="w-full rounded-3xl p-1 bg-gradient-to-br from-white/50 to-slate-200/50 backdrop-blur-xl border border-white/60 shadow-[0_20px_50px_rgba(0,0,0,0.08)] mt-12 overflow-hidden">
            <div className="bg-white/30 backdrop-blur-2xl rounded-[1.4rem] overflow-x-auto text-left relative">
                <table className="w-full text-left border-collapse whitespace-nowrap min-w-[700px]">
                    <thead>
                        <tr className="bg-white/40 border-b border-white/60">
                            <th className="px-8 py-6 font-extrabold text-slate-600 text-[11px] tracking-[0.2em] uppercase">Timestamp</th>
                            <th className="px-8 py-6 font-extrabold text-slate-600 text-[11px] tracking-[0.2em] uppercase">Anonymous Patient ID</th>
                            <th className="px-8 py-6 font-extrabold text-slate-600 text-[11px] tracking-[0.2em] uppercase">Diagnostic Class</th>
                            <th className="px-8 py-6 font-extrabold text-slate-600 text-[11px] tracking-[0.2em] uppercase">Confidence</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/40">
                        {dummyHistory.map((row, idx) => (
                            <motion.tr
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                key={row.id}
                                className="hover:bg-white/50 transition-colors group cursor-pointer"
                            >
                                <td className="px-8 py-6 text-slate-900 font-bold group-hover:text-primary transition-colors text-sm">{row.date}</td>
                                <td className="px-8 py-6 text-slate-500 font-bold font-mono text-sm tracking-wide bg-slate-50/50 inline-block mt-4 mb-4 mx-8 rounded-full border border-slate-200/50 px-4">{row.patientId}</td>
                                <td className="px-8 py-6">
                                    <SeverityBadge severity={row.prediction as SeverityType} className="shadow-lg shadow-black/5" />
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-24 h-2.5 bg-slate-200/50 border border-white rounded-full overflow-hidden shadow-inner">
                                            <div
                                                className={`h-full opacity-90 rounded-full ${row.confidence > 96 ? "bg-emerald-500" : row.confidence > 90 ? "bg-primary" : "bg-amber-500"}`}
                                                style={{ width: `${row.confidence}%` }}
                                            />
                                        </div>
                                        <span className="text-slate-800 font-extrabold text-sm tracking-tight drop-shadow-sm">{row.confidence}%</span>
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
