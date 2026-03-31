"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Mail, User, Loader2, CheckCircle2, Eye, EyeOff, Stethoscope, UserCircle, Activity, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function SignupPage() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [selectedRole, setSelectedRole] = useState<"patient" | "doctor">("patient");
    const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [authError, setAuthError] = useState("");
    const router = useRouter();
    const { signup } = useAuth();

    const getFirebaseErrorMessage = (err: any): string => {
        const code = err?.code || "";
        const message = err?.message || "";

        switch (code) {
            case "auth/email-already-in-use": return "An account with this email already exists.";
            case "auth/weak-password": return "Password is too weak. Use at least 6 characters.";
            case "auth/invalid-email": return "Please enter a valid email address.";
            case "FB_INIT_MISSING": return "Configuration error: Firebase keys are missing in the browser environment.";
            default: 
                if (message.includes("FB_INIT_MISSING")) return "Configuration error: Firebase keys are missing in the browser environment.";
                return `Account creation failed (${code || "unknown error"}). Please try again.`;
        }
    };

    const validate = () => {
        const errs: Record<string, string> = {};
        if (!form.name.trim()) errs.name = "Full name is required";
        if (!form.email.trim()) errs.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email";
        if (!form.password) errs.password = "Password is required";
        else if (form.password.length < 8) errs.password = "Minimum 8 characters";
        if (form.password !== form.confirmPassword) errs.confirmPassword = "Passwords do not match";
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate() || loading || success) return;
        setLoading(true);
        setAuthError("");

        try {
            await signup(form.name, form.email, form.password, selectedRole);
            setLoading(false);
            setSuccess(true);

            setTimeout(() => {
                if (selectedRole === "doctor") {
                    router.push("/pending");
                } else {
                    router.push("/dashboard");
                }
            }, 100);
        } catch (err: any) {
            console.error("Signup error details:", err);
            setLoading(false);
            setAuthError(getFirebaseErrorMessage(err));
        }
    };

    const update = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm(prev => ({ ...prev, [key]: e.target.value }));
        if (errors[key]) setErrors(prev => ({ ...prev, [key]: "" }));
    };

    return (
        <div className="flex-1 relative overflow-hidden bg-white min-h-[90vh]">
            {/* Background matching home page */}
            
            
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[40vh] bg-gradient-to-b from-slate-50 to-transparent pointer-events-none" />

            <div className="relative z-10 flex items-center justify-center py-24 px-4 min-h-[90vh]">
                <div className="w-full max-w-[960px] flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

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
                            Join thousands of clinicians using{" "}
                            <span className="text-slate-900">AI-powered diagnostics</span>
                        </h2>
                        <p className="text-slate-500 leading-relaxed mb-8">
                            Create your account to start screening retinal scans with clinical-grade accuracy and instant results.
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
                        className="w-full max-w-[480px] flex-shrink-0"
                    >
                        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/40 border border-slate-200/60 p-8 md:p-10">

                            <div className="text-center mb-6 lg:hidden">
                                <div className="w-12 h-12 mx-auto rounded-xl bg-slate-100 border border-slate-200/60 flex items-center justify-center mb-4 shadow-sm">
                                    <Activity className="w-6 h-6 text-slate-900" />
                                </div>
                            </div>

                            <div className="mb-6">
                                <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">Create your account</h1>
                                <p className="text-slate-500 text-sm">Get started with Retinex screening</p>
                            </div>

                            {/* Role Selection */}
                            <div className="mb-5">
                                <label className="block text-sm font-medium text-slate-700 mb-2">I am a</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedRole("patient")}
                                        className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all ${selectedRole === "patient"
                                            ? "border-indigo-500 bg-slate-100/80 text-blue-700 shadow-sm shadow-blue-500/10"
                                            : "border-slate-200 bg-slate-50/50 text-slate-600 hover:border-slate-300"
                                            }`}
                                    >
                                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${selectedRole === "patient" ? "bg-blue-100" : "bg-slate-100"}`}>
                                            <UserCircle className={`w-4 h-4 ${selectedRole === "patient" ? "text-slate-900" : "text-slate-500"}`} />
                                        </div>
                                        Patient
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedRole("doctor")}
                                        className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all ${selectedRole === "doctor"
                                            ? "border-indigo-500 bg-slate-100/80 text-blue-700 shadow-sm shadow-blue-500/10"
                                            : "border-slate-200 bg-slate-50/50 text-slate-600 hover:border-slate-300"
                                            }`}
                                    >
                                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${selectedRole === "doctor" ? "bg-blue-100" : "bg-slate-100"}`}>
                                            <Stethoscope className={`w-4 h-4 ${selectedRole === "doctor" ? "text-slate-900" : "text-slate-500"}`} />
                                        </div>
                                        Doctor
                                    </button>
                                </div>
                                {selectedRole === "doctor" && (
                                    <motion.p
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        className="text-xs text-amber-600 mt-2.5 font-medium bg-amber-50 rounded-lg px-3 py-2 border border-amber-200/50"
                                    >
                                        Doctor accounts require admin approval before activation.
                                    </motion.p>
                                )}
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
                                className="space-y-4" 
                                onSubmit={handleSubmit}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ staggerChildren: 0.1, delayChildren: 0.1 }}
                            >
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Full name</label>
                                    <div className="relative">
                                        <User className="w-[18px] h-[18px] absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text" value={form.name} onChange={update("name")} disabled={loading || success}
                                            className={`w-full pl-11 pr-4 py-3 bg-slate-50/80 border rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400/20 focus:border-slate-400 focus:bg-white transition-all disabled:opacity-60 ${errors.name ? "border-red-300 bg-red-50/30" : "border-slate-200"}`}
                                            placeholder="Dr. Jane Smith"
                                        />
                                    </div>
                                    {errors.name && <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.name}</p>}
                                </motion.div>

                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
                                    <div className="relative">
                                        <Mail className="w-[18px] h-[18px] absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="email" value={form.email} onChange={update("email")} disabled={loading || success}
                                            className={`w-full pl-11 pr-4 py-3 bg-slate-50/80 border rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400/20 focus:border-slate-400 focus:bg-white transition-all disabled:opacity-60 ${errors.email ? "border-red-300 bg-red-50/30" : "border-slate-200"}`}
                                            placeholder="name@hospital.com"
                                        />
                                    </div>
                                    {errors.email && <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.email}</p>}
                                </motion.div>

                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                                    <div className="relative">
                                        <Lock className="w-[18px] h-[18px] absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type={showPassword ? "text" : "password"} value={form.password} onChange={update("password")} disabled={loading || success}
                                            className={`w-full pl-11 pr-11 py-3 bg-slate-50/80 border rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400/20 focus:border-slate-400 focus:bg-white transition-all disabled:opacity-60 ${errors.password ? "border-red-300 bg-red-50/30" : "border-slate-200"}`}
                                            placeholder="Min. 8 characters"
                                        />
                                        <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors" tabIndex={-1}>
                                            {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                                        </button>
                                    </div>
                                    {errors.password && <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.password}</p>}
                                </motion.div>

                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm password</label>
                                    <div className="relative">
                                        <Lock className="w-[18px] h-[18px] absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="password" value={form.confirmPassword} onChange={update("confirmPassword")} disabled={loading || success}
                                            className={`w-full pl-11 pr-4 py-3 bg-slate-50/80 border rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400/20 focus:border-slate-400 focus:bg-white transition-all disabled:opacity-60 ${errors.confirmPassword ? "border-red-300 bg-red-50/30" : "border-slate-200"}`}
                                            placeholder="Re-enter password"
                                        />
                                    </div>
                                    {errors.confirmPassword && <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.confirmPassword}</p>}
                                </motion.div>

                                <motion.button
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                    whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                                    type="submit" disabled={loading || success}
                                    className={`w-full py-3 px-6 font-semibold text-sm rounded-xl transition-all mt-1 flex items-center justify-center gap-2 shadow-lg ${success
                                        ? "bg-emerald-600 text-white shadow-emerald-500/25"
                                        : "bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/20 hover:shadow-slate-900/30"
                                        } disabled:cursor-not-allowed`}
                                >
                                    {success ? (<><CheckCircle2 className="w-4 h-4" /> Account Created</>)
                                        : loading ? (<><Loader2 className="w-4 h-4 animate-spin" /> Creating Account…</>)
                                            : "Create Account"}
                                </motion.button>
                            </motion.form>

                            <div className="mt-6 pt-6 border-t border-slate-100">
                                <p className="text-center text-sm text-slate-500">
                                    Already have an account?{" "}
                                    <Link href="/login" className="text-slate-900 font-semibold hover:text-blue-700 transition-colors">Sign In</Link>
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
