"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center relative overflow-hidden">
                {/* HUD Blueprint Grid */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                    style={{ backgroundImage: `linear-gradient(#0f172a 1px, transparent 1px), linear-gradient(90deg, #0f172a 1px, transparent 1px)`, backgroundSize: '40px 40px' }} 
                />
                
                <div className="relative z-10 flex flex-col items-center gap-6">
                    <div className="w-12 h-12 border-4 border-slate-100 border-t-slate-900 rounded-full animate-spin" />
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.3em] mb-2">AUTH_STATUS: CHECKING</span>
                        <div className="h-[1px] w-24 bg-slate-100 relative">
                            <div className="absolute inset-0 bg-slate-900 animate-[loading_1.5s_infinite_ease-in-out]" />
                        </div>
                    </div>
                </div>

                <style jsx>{`
                    @keyframes loading {
                        0% { transform: scaleX(0); transform-origin: left; }
                        50% { transform: scaleX(1); transform-origin: left; }
                        50.1% { transform: scaleX(1); transform-origin: right; }
                        100% { transform: scaleX(0); transform-origin: right; }
                    }
                `}</style>
            </div>
        );
    }

    if (!user) return null;

    return <>{children}</>;
}
