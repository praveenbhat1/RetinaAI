"use client";

import { motion } from "framer-motion";
import { Lock, Mail } from "lucide-react";
import Link from "next/link";
import NeuralNetworkAnimation from "@/components/NeuralNetworkAnimation";

export default function LoginPage() {
    return (
        <div className="flex-1 flex items-center justify-center bg-[#F8FAFC] py-20 px-4 relative overflow-hidden min-h-[90vh]">

            {/* Background Orbs */}
            <div className="absolute top-[-10%] left-[-5%] w-[60vw] h-[60vw] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[50vw] h-[50vw] bg-secondary/15 rounded-full blur-[100px] pointer-events-none" />

            <NeuralNetworkAnimation />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-[480px] bg-white/40 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white/60 p-10 md:p-14 z-10"
            >
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary to-blue-700 mx-auto rounded-3xl flex items-center justify-center text-white mb-6 shadow-2xl shadow-primary/30">
                        <Lock className="w-10 h-10" />
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">Portal Access</h1>
                    <p className="text-slate-500 font-bold text-lg">Secure physician login</p>
                </div>

                <form className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-3 uppercase tracking-widest">Email Identity</label>
                        <div className="relative group">
                            <Mail className="w-6 h-6 absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                            <input type="email" required className="w-full pl-14 pr-6 py-5 bg-white/60 border border-white shadow-inner rounded-3xl focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold text-slate-900 text-lg" placeholder="dr.smith@clinic.com" />
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between mb-3 items-end">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Security Key</label>
                            <a href="#" className="font-bold text-sm text-primary hover:text-blue-800 transition">Recover Key</a>
                        </div>
                        <div className="relative group">
                            <Lock className="w-6 h-6 absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                            <input type="password" required className="w-full pl-14 pr-6 py-5 bg-white/60 border border-white shadow-inner rounded-3xl focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold text-slate-900 text-lg" placeholder="••••••••" />
                        </div>
                    </div>

                    <Link href="/dashboard" className="block w-full text-center py-5 px-6 bg-slate-900 text-white font-extrabold text-lg rounded-full hover:bg-primary transition-all shadow-xl hover:shadow-primary/40 hover:-translate-y-1 mt-10">
                        Authenticate
                    </Link>
                </form>
            </motion.div>
        </div>
    );
}
