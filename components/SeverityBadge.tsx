import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export type SeverityType = "No DR" | "Mild" | "Moderate" | "Severe" | "Proliferative";

export default function SeverityBadge({
    severity,
    className
}: {
    severity: SeverityType;
    className?: string;
}) {
    const styles = {
        "No DR": "bg-slate-50 text-slate-600 border-slate-200",
        "Mild": "bg-slate-50 text-slate-800 border-slate-200",
        "Moderate": "bg-slate-900 text-white border-slate-800",
        "Severe": "bg-slate-900 text-slate-100 border-slate-800",
        "Proliferative": "bg-red-50 text-red-900 border-red-200"
    };

    const labels = {
        "No DR": "STAT_NORMAL",
        "Mild": "STAT_PO_MILD",
        "Moderate": "STAT_PO_MOD",
        "Severe": "STAT_PO_SEV",
        "Proliferative": "STAT_URGENT"
    };

    return (
        <span className={cn("px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold border shadow-sm inline-flex items-center gap-2 uppercase tracking-widest", styles[severity], className)}>
            <div className={cn("w-1.5 h-1.5 rounded-full",
                severity === "No DR" ? "bg-slate-400" :
                    severity === "Moderate" ? "bg-slate-100" :
                        severity === "Proliferative" ? "bg-red-500 animate-pulse" : "bg-slate-600"
            )} />
            {labels[severity]}
        </span>
    );
}
