"use client";

import { motion } from "framer-motion";
import { Activity, Twitter, Linkedin, Github } from "lucide-react";

export default function Footer() {
    return (
        <footer className="border-t border-slate-200 bg-white pt-16 pb-8 overflow-hidden relative">
            <div className="container mx-auto px-4 lg:px-8 relative z-10">
                <div className="grid md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <Activity className="h-6 w-6 text-primary" />
                            <span className="text-xl font-bold text-slate-900 tracking-tight">RetinaAI</span>
                        </div>
                        <p className="text-slate-500 max-w-sm leading-relaxed mb-6">
                            Empowering healthcare professionals with state-of-the-art deep learning for fast and strictly confidential retinal abnormality detection.
                        </p>
                        <div className="flex items-center gap-4">
                            {[Twitter, Linkedin, Github].map((Icon, i) => (
                                <motion.a whileHover={{ y: -3 }} key={i} href="#" className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-primary hover:border-primary/50 transition-colors">
                                    <Icon className="w-5 h-5" />
                                </motion.a>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold text-slate-900 mb-4">Platform</h4>
                        <ul className="space-y-3">
                            {['Home', 'Dashboard', 'Analysis', 'History'].map(link => (
                                <li key={link}><a href="#" className="text-slate-500 hover:text-primary transition-colors">{link}</a></li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-slate-900 mb-4">Legal</h4>
                        <ul className="space-y-3">
                            {['Privacy Policy', 'Terms of Service', 'Medical Disclaimer'].map(link => (
                                <li key={link}><a href="#" className="text-slate-500 hover:text-primary transition-colors">{link}</a></li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-slate-400">
                        &copy; {new Date().getFullYear()} RetinaAI Inc. All rights reserved.
                    </p>
                    <p className="text-xs text-slate-400 md:text-right max-w-md">
                        Not tightly regulated as a medical device. Clinical predictions must be reviewed by certified ophthalmology professionals.
                    </p>
                </div>
            </div>
            <div className="absolute top-0 right-0 -mt-32 -mr-32 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 -mb-32 -ml-32 w-96 h-96 bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />
        </footer>
    );
}
