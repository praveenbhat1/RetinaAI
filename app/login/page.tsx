"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, Mail, Loader2, CheckCircle2, Eye, EyeOff, Activity, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [authError, setAuthError] = useState("");
    const router = useRouter();
    const { login, user } = useAuth();

    useEffect(() => {
        if (success && user) {
            const timer = setTimeout(() => {
                switch (user.role) {
                    case "admin": router.push("/admin"); break;
                    case "pending_doctor": router.push("/pending"); break;
                    case "doctor": router.push("/admin"); break;
                    default: router.push("/dashboard");
                }
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [success, user, router]);

    const getFirebaseErrorMessage = (err: any): string => {
        const code = err?.code || "";
        const message = err?.message || "";
        
        switch (code) {
            case "auth/user-not-found": return "No account found with this email.";
            case "auth/wrong-password": return "Incorrect password. Please try again.";
            case "auth/invalid-email": return "Please enter a valid email address.";
            case "auth/too-many-requests": return "Too many attempts. Please try again later.";
            case "auth/invalid-credential": return "Invalid email or password. Please try again.";
            case "auth/network-request-failed": return "Network error. Please check your connection.";
            case "auth/user-disabled": return "This account has been disabled.";
            case "FB_INIT_MISSING": return "Configuration error: Firebase keys are missing in the browser environment.";
            default: 
                if (message.includes("FB_INIT_MISSING")) return "Configuration error: Firebase keys are missing in the browser environment.";
                return `Sign in failed (${code || "unknown error"}). Please try again.`;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (loading || success) return;
        setLoading(true);
        setAuthError("");

        try {
            await login(email, password);
            setLoading(false);
            setSuccess(true);
        } catch (err: any) {
            console.error("Login error details:", err);
            setLoading(false);
            setAuthError(getFirebaseErrorMessage(err));
        }
    };

    return (
        <div className="flex-1 relative overflow-hidden bg-white min-h-[90vh]">
            {/* Background matching home page */}
            
            
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[40vh] bg-gradient-to-b from-slate-50 to-transparent pointer-events-none" />

            <div className="relative z-10 flex items-center justify-center py-24 px-4 min-h-[90vh]">
                <div className="w-full max-w-[920px] flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

                    {/* Left — Branding */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="hidden lg:flex flex-col flex-1 max-w-[380px]"
                    >
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200/60 flex items-center justify-center shadow-sm">
                                <Activity className="w-5 h-5 text-slate-900" />
                            </div>
                            <span className="text-xl font-bold text-slate-900 tracking-tight">
                                Retinex
                            </span>
                        </div>

                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-4 leading-snug">
                            Clinical-grade retinal screening,{" "}
                            <span className="text-slate-900">powered by AI</span>
                        </h2>
                        <p className="text-slate-500 leading-relaxed mb-8">
                            Upload fundus photographs and receive AI-powered diagnostic reports in seconds with 99.4% accuracy.
                        </p>

                        <div className="space-y-4">
                            {[
                                { icon: ShieldCheck, text: "HIPAA compliant, AES-256 encrypted" },
                                { icon: Zap, text: "Results in under 2 seconds" },
                                { icon: Activity, text: "5M+ scans processed globally" },
                            ].map(({ icon: Icon, text }, i) => (
                                <div key={i} className="flex items-center gap-3 text-sm text-slate-600">
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0">
                                        <Icon className="w-4 h-4 text-slate-900" />
                                    </div>
                                    {text}
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right — Form Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                        className="w-full max-w-[440px] flex-shrink-0"
                    >
                        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/40 border border-slate-200/60 p-8 md:p-10">

                            <div className="text-center mb-8 lg:hidden">
                                <div className="w-12 h-12 mx-auto rounded-xl bg-slate-100 border border-slate-200/60 flex items-center justify-center mb-4 shadow-sm">
                                    <Activity className="w-6 h-6 text-slate-900" />
                                </div>
                            </div>

                            <div className="mb-7">
                                <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">Welcome back</h1>
                                <p className="text-slate-500 text-sm">Sign in to your account to continue</p>
                            </div>

                            {authError && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200/80 text-sm text-red-700 font-medium"
                                >
                                    {authError}
                                </motion.div>
                            )}

                            <motion.form 
                                className="space-y-5" 
                                onSubmit={handleSubmit}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
                            >
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
                                    <div className="relative">
                                        <Mail className="w-[18px] h-[18px] absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="email" required value={email} onChange={e => setEmail(e.target.value)} disabled={loading || success}
                                            className="w-full pl-11 pr-4 py-3 bg-slate-50/80 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400/20 focus:border-slate-400 focus:bg-white transition-all disabled:opacity-60"
                                            placeholder="name@hospital.com"
                                        />
                                    </div>
                                </motion.div>

                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                    <div className="flex justify-between mb-1.5">
                                        <label className="block text-sm font-medium text-slate-700">Password</label>
                                        <a href="#" className="text-xs text-slate-500 font-medium hover:text-slate-900 transition-colors">Forgot password?</a>
                                    </div>
                                    <div className="relative">
                                        <Lock className="w-[18px] h-[18px] absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type={showPassword ? "text" : "password"} required value={password} onChange={e => setPassword(e.target.value)} disabled={loading || success}
                                            className="w-full pl-11 pr-11 py-3 bg-slate-50/80 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400/20 focus:border-slate-400 focus:bg-white transition-all disabled:opacity-60"
                                            placeholder="••••••••"
                                        />
                                        <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors" tabIndex={-1}>
                                            {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                                        </button>
                                    </div>
                                </motion.div>

                                <motion.button
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                    whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                                    type="submit" disabled={loading || success}
                                    className={`w-full py-3 px-6 font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg ${success
                                        ? "bg-emerald-600 text-white shadow-emerald-600/25"
                                        : "bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/20 hover:shadow-slate-900/30"
                                        } disabled:cursor-not-allowed`}
                                >
                                    {success ? (<><CheckCircle2 className="w-4 h-4" /> Signed In</>)
                                        : loading ? (<><Loader2 className="w-4 h-4 animate-spin" /> Signing In…</>)
                                            : "Sign In"}
                                </motion.button>
                            </motion.form>

                            <div className="mt-6 pt-6 border-t border-slate-100">
                                <p className="text-center text-sm text-slate-500">
                                    New to Retinex?{" "}
                                    <Link href="/signup" className="text-slate-900 font-semibold hover:text-blue-700 transition-colors">Create an account</Link>
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
