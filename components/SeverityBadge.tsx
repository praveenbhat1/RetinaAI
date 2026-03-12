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
        "No DR": "bg-emerald-50 text-emerald-700 border-emerald-200/50 shadow-emerald-500/10",
        "Mild": "bg-blue-50 text-blue-700 border-blue-200/50 shadow-blue-500/10",
        "Moderate": "bg-amber-50 text-amber-700 border-amber-200/50 shadow-amber-500/10",
        "Severe": "bg-orange-50 text-orange-700 border-orange-200/50 shadow-orange-500/10",
        "Proliferative": "bg-rose-50 text-rose-700 border-rose-200/50 shadow-rose-500/10"
    };

    return (
        <span className={cn("px-4 py-1.5 rounded-full text-xs font-bold border shadow-sm inline-flex items-center gap-2", styles[severity], className)}>
            <span className={cn("w-2 h-2 rounded-full animate-pulse",
                severity === "No DR" ? "bg-emerald-500" :
                    severity === "Mild" ? "bg-blue-500" :
                        severity === "Moderate" ? "bg-amber-500" :
                            severity === "Severe" ? "bg-orange-500" : "bg-rose-500"
            )} />
            {severity}
        </span>
    );
}
