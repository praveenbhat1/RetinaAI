"use client";

import { motion } from "framer-motion";
import { Database, Network, ShieldCheck } from "lucide-react";

export default function TrustSection() {
    return (
        <section className="py-16 border-t border-b border-slate-100 bg-white relative z-20">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-12">

                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex-1 space-y-4 text-center md:text-left"
                    >
                        <h2 className="text-3xl md:text-4xl font-semibold text-[#0F172A] tracking-tight mb-4">Trusted by leading clinicians</h2>
                        <p className="text-base text-[#475569] max-w-sm mx-auto md:mx-0">Our deep learning pipelines are actively verified against millions of diagnostic clinical fundus maps worldwide.</p>
                    </motion.div>

                    <div className="flex-1 grid grid-cols-2 lg:flex gap-8 justify-center lg:justify-end text-slate-700">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="flex items-center gap-3 font-bold bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl shadow-sm"
                        >
                            <Database className="w-6 h-6 text-primary" />
                            <span>5M+ Scans</span>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="flex items-center gap-3 font-bold bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl shadow-sm"
                        >
                            <Network className="w-6 h-6 text-secondary" />
                            <span>99.4% Acc.</span>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="flex items-center gap-3 font-bold bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl shadow-sm col-span-2 lg:col-span-1 justify-center"
                        >
                            <ShieldCheck className="w-6 h-6 text-emerald-500" />
                            <span>HIPAA Ready</span>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}
