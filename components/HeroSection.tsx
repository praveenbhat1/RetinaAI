"use client";

import Link from 'next/link';
import Retina3D from './Retina3D';
import NeuralNetworkAnimation from './NeuralNetworkAnimation';
import { motion } from 'framer-motion';
import { ChevronRight, ArrowRight } from 'lucide-react';

export default function HeroSection() {
    return (
        <section className="relative pt-32 pb-24 overflow-hidden bg-white min-h-[90vh] flex items-center">

            {/* Particle Neural Net Background */}
            <NeuralNetworkAnimation />

            <div className="container mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

                {/* Left Side: Content */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="flex-1 space-y-8 max-w-2xl text-center lg:text-left"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-primary text-sm font-bold uppercase tracking-wider">
                        <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                        Clinical-Grade Diagnostics
                    </div>

                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#0F172A] leading-[1.15] tracking-tight">
                        AI-Powered <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#14B8A6]">
                            Retinal Abnormality Detection
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-[#475569] font-medium leading-[1.6] max-w-xl mx-auto lg:mx-0">
                        Empowering healthcare providers with early detection of diabetic retinopathy and other retinal anomalies using deep learning models.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
                        <Link href="/dashboard" className="px-8 py-4 text-lg text-white bg-primary font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-primary/30 group flex items-center justify-center gap-2">
                            Start Screening <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link href="#features" className="px-8 py-4 text-lg text-slate-700 bg-white border-2 border-slate-200 font-bold rounded-xl hover:bg-slate-50 transition-all hover:border-slate-300 flex items-center justify-center gap-2">
                            Learn More <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </motion.div>

                {/* Right Side: Interactive 3D Eye Model */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="flex-1 relative w-full h-[400px] md:h-[500px] lg:h-[600px] flex items-center justify-center p-4 lg:p-0"
                >
                    {/* Subtle glow rendering behind the eye model */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-secondary/10 rounded-full blur-[100px] pointer-events-none" />
                    <Retina3D />
                </motion.div>

            </div>
        </section>
    );
}
