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
        "No DR": "bg-emerald-50 text-emerald-700 border-emerald-200",
        "Mild": "bg-blue-50 text-blue-700 border-blue-200",
        "Moderate": "bg-amber-50 text-amber-700 border-amber-200",
        "Severe": "bg-orange-50 text-orange-700 border-orange-200",
        "Proliferative": "bg-red-50 text-red-700 border-red-200"
    };

    const labels = {
        "No DR": "No Risk",
        "Mild": "Low Risk",
        "Moderate": "Medium Risk",
        "Severe": "High Risk",
        "Proliferative": "Critical Risk"
    };

    const dotStyles = {
        "No DR": "bg-emerald-500",
        "Mild": "bg-blue-500",
        "Moderate": "bg-amber-500",
        "Severe": "bg-orange-500",
        "Proliferative": "bg-red-500 animate-pulse"
    };

    return (
        <span className={cn("px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold border shadow-sm inline-flex items-center gap-2 uppercase tracking-widest", styles[severity], className)}>
            <div className={cn("w-1.5 h-1.5 rounded-full", dotStyles[severity])} />
            {labels[severity]}
        </span>
    );
}
