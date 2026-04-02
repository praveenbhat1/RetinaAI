"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Mail, User, Loader2, CheckCircle2, Eye, EyeOff, Stethoscope, UserCircle, Activity, ShieldCheck, Zap, Hash, Building2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

type PracticeType = "hospital" | "clinic" | "both";
type Specialization = "ophthalmologist" | "general_physician" | "";

export default function SignupPage() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [selectedRole, setSelectedRole] = useState<"patient" | "doctor">("patient");
    const [form, setForm] = useState({
        name: "", email: "", password: "", confirmPassword: "",
        licenseNumber: "", practiceType: "" as PracticeType | "",
        hospitalName: "", clinicName: "",
        specialization: "" as Specialization,
    });
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

        // Doctor-specific validations
        if (selectedRole === "doctor") {
            if (!form.licenseNumber.trim()) errs.licenseNumber = "License number is required";
            if (!form.practiceType) errs.practiceType = "Please select a practice type";
            if ((form.practiceType === "hospital" || form.practiceType === "both") && !form.hospitalName.trim())
                errs.hospitalName = "Hospital name is required";
            if ((form.practiceType === "clinic" || form.practiceType === "both") && !form.clinicName.trim())
                errs.clinicName = "Clinic name is required";
        }
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate() || loading || success) return;
        setLoading(true);
        setAuthError("");

        try {
            const doctorData = selectedRole === "doctor" ? {
                licenseNumber: form.licenseNumber,
                practiceType: form.practiceType,
                hospitalName: form.practiceType !== "clinic" ? form.hospitalName : "",
                clinicName: form.practiceType !== "hospital" ? form.clinicName : "",
                specialization: form.specialization,
            } : undefined;

            await signup(form.name, form.email, form.password, selectedRole, doctorData);
            setLoading(false);
            setSuccess(true);
            setTimeout(() => {
                router.push(selectedRole === "doctor" ? "/pending" : "/dashboard");
            }, 100);
        } catch (err: any) {
            setLoading(false);
            setAuthError(getFirebaseErrorMessage(err));
        }
    };

    const update = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm(prev => ({ ...prev, [key]: e.target.value }));
        if (errors[key]) setErrors(prev => ({ ...prev, [key]: "" }));
    };

    const inputClass = (key: string) =>
        `w-full pl-11 pr-4 py-3 bg-slate-50/80 border rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400/20 focus:border-slate-400 focus:bg-white transition-all disabled:opacity-60 ${errors[key] ? "border-red-300 bg-red-50/30" : "border-slate-200"}`;

    const selectClass = (key: string) =>
        `w-full pl-11 pr-4 py-3 bg-slate-50/80 border rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400/20 focus:border-slate-400 focus:bg-white transition-all disabled:opacity-60 appearance-none ${errors[key] ? "border-red-300 bg-red-50/30" : "border-slate-200"}`;

    return (
        <div className="flex-1 relative overflow-hidden bg-white min-h-[90vh]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[40vh] bg-gradient-to-b from-slate-50 to-transparent pointer-events-none" />
            <div className="relative z-10 flex items-center justify-center py-24 px-4 min-h-[90vh]">
                <div className="w-full max-w-[1000px] flex flex-col lg:flex-row items-start gap-12 lg:gap-16">

                    {/* Left — Branding */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="hidden lg:flex flex-col flex-1 max-w-[380px] pt-2"
                    >
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200/60 flex items-center justify-center shadow-sm">
                                <Activity className="w-5 h-5 text-slate-900" />
                            </div>
                            <span className="text-xl font-bold text-slate-900 tracking-tight">Retinex</span>
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
                                { icon: Zap, text: "Instant clinical reporting" },
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
                        className="w-full max-w-[520px] flex-shrink-0"
                    >
                        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/40 border border-slate-200/60 p-8 md:p-10">

                            <div className="mb-6">
                                <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">Create your account</h1>
                                <p className="text-slate-500 text-sm">Get started with Retinex screening</p>
                            </div>

                            {/* Role Selection */}
                            <div className="mb-5">
                                <label className="block text-sm font-medium text-slate-700 mb-2">I am a</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {(["patient", "doctor"] as const).map((role) => (
                                        <button
                                            key={role}
                                            type="button"
                                            onClick={() => setSelectedRole(role)}
                                            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all ${selectedRole === role
                                                ? "border-indigo-500 bg-slate-100/80 text-blue-700 shadow-sm shadow-blue-500/10"
                                                : "border-slate-200 bg-slate-50/50 text-slate-600 hover:border-slate-300"
                                                }`}
                                        >
                                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${selectedRole === role ? "bg-blue-100" : "bg-slate-100"}`}>
                                                {role === "patient"
                                                    ? <UserCircle className={`w-4 h-4 ${selectedRole === role ? "text-slate-900" : "text-slate-500"}`} />
                                                    : <Stethoscope className={`w-4 h-4 ${selectedRole === role ? "text-slate-900" : "text-slate-500"}`} />
                                                }
                                            </div>
                                            {role.charAt(0).toUpperCase() + role.slice(1)}
                                        </button>
                                    ))}
                                </div>
                                <AnimatePresence>
                                    {selectedRole === "doctor" && (
                                        <motion.p
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="text-xs text-amber-600 mt-2.5 font-medium bg-amber-50 rounded-lg px-3 py-2 border border-amber-200/50"
                                        >
                                            Doctor accounts require admin approval before activation.
                                        </motion.p>
                                    )}
                                </AnimatePresence>
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

                            <form className="space-y-4" onSubmit={handleSubmit}>
                                {/* Full Name */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Full name</label>
                                    <div className="relative">
                                        <User className="w-[18px] h-[18px] absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input type="text" value={form.name} onChange={update("name")} disabled={loading || success}
                                            className={inputClass("name")} placeholder="Dr. Jane Smith" />
                                    </div>
                                    {errors.name && <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.name}</p>}
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
                                    <div className="relative">
                                        <Mail className="w-[18px] h-[18px] absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input type="email" value={form.email} onChange={update("email")} disabled={loading || success}
                                            className={inputClass("email")} placeholder="name@hospital.com" />
                                    </div>
                                    {errors.email && <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.email}</p>}
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                                    <div className="relative">
                                        <Lock className="w-[18px] h-[18px] absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input type={showPassword ? "text" : "password"} value={form.password} onChange={update("password")} disabled={loading || success}
                                            className={inputClass("password")} placeholder="Min. 8 characters" />
                                        <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors" tabIndex={-1}>
                                            {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                                        </button>
                                    </div>
                                    {errors.password && <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.password}</p>}
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm password</label>
                                    <div className="relative">
                                        <Lock className="w-[18px] h-[18px] absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input type="password" value={form.confirmPassword} onChange={update("confirmPassword")} disabled={loading || success}
                                            className={inputClass("confirmPassword")} placeholder="Re-enter password" />
                                    </div>
                                    {errors.confirmPassword && <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.confirmPassword}</p>}
                                </div>

                                {/* ── Doctor-Only Fields ── */}
                                <AnimatePresence>
                                    {selectedRole === "doctor" && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="space-y-4 overflow-hidden"
                                        >
                                            {/* Divider */}
                                            <div className="flex items-center gap-3 pt-1">
                                                <div className="flex-1 h-px bg-slate-100" />
                                                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Doctor Details</span>
                                                <div className="flex-1 h-px bg-slate-100" />
                                            </div>

                                            {/* License Number */}
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1.5">License Number</label>
                                                <div className="relative">
                                                    <Hash className="w-[18px] h-[18px] absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                                    <input type="text" value={form.licenseNumber} onChange={update("licenseNumber")} disabled={loading || success}
                                                        className={inputClass("licenseNumber")} placeholder="e.g. KMC12345" />
                                                </div>
                                                {errors.licenseNumber && <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.licenseNumber}</p>}
                                            </div>

                                            {/* Practice Type */}
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Practice Type</label>
                                                <div className="relative">
                                                    <Building2 className="w-[18px] h-[18px] absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                                    <select value={form.practiceType} onChange={update("practiceType")} disabled={loading || success}
                                                        className={selectClass("practiceType")}>
                                                        <option value="">Select practice type</option>
                                                        <option value="hospital">Hospital</option>
                                                        <option value="clinic">Clinic</option>
                                                        <option value="both">Both</option>
                                                    </select>
                                                </div>
                                                {errors.practiceType && <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.practiceType}</p>}
                                            </div>

                                            {/* Dynamic Fields Based on Practice Type */}
                                            <AnimatePresence>
                                                {(form.practiceType === "hospital" || form.practiceType === "both") && (
                                                    <motion.div
                                                        key="hospital"
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: "auto" }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Hospital Name</label>
                                                        <div className="relative">
                                                            <Building2 className="w-[18px] h-[18px] absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                                            <input type="text" value={form.hospitalName} onChange={update("hospitalName")} disabled={loading || success}
                                                                className={inputClass("hospitalName")} placeholder="e.g. Apollo Hospitals" />
                                                        </div>
                                                        {errors.hospitalName && <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.hospitalName}</p>}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                            <AnimatePresence>
                                                {(form.practiceType === "clinic" || form.practiceType === "both") && (
                                                    <motion.div
                                                        key="clinic"
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: "auto" }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Clinic Name</label>
                                                        <div className="relative">
                                                            <Activity className="w-[18px] h-[18px] absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                                            <input type="text" value={form.clinicName} onChange={update("clinicName")} disabled={loading || success}
                                                                className={inputClass("clinicName")} placeholder="e.g. Netra Eye Clinic" />
                                                        </div>
                                                        {errors.clinicName && <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.clinicName}</p>}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                            {/* Specialization (optional) */}
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                                    Specialization <span className="text-slate-400 font-normal">(optional)</span>
                                                </label>
                                                <div className="relative">
                                                    <Stethoscope className="w-[18px] h-[18px] absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                                    <select value={form.specialization} onChange={update("specialization")} disabled={loading || success}
                                                        className={selectClass("specialization")}>
                                                        <option value="">Select specialization</option>
                                                        <option value="ophthalmologist">Ophthalmologist</option>
                                                        <option value="general_physician">General Physician</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Submit */}
                                <motion.button
                                    whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                                    type="submit" disabled={loading || success}
                                    className={`w-full py-3 px-6 font-semibold text-sm rounded-xl transition-all mt-2 flex items-center justify-center gap-2 shadow-lg ${success
                                        ? "bg-emerald-600 text-white shadow-emerald-500/25"
                                        : "bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/20"
                                        } disabled:cursor-not-allowed`}
                                >
                                    {success ? (<><CheckCircle2 className="w-4 h-4" /> Account Created</>)
                                        : loading ? (<><Loader2 className="w-4 h-4 animate-spin" /> Creating account…</>)
                                            : "Create Account"}
                                </motion.button>
                            </form>

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
