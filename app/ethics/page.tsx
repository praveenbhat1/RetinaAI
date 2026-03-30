"use client";

import { motion } from "framer-motion";
import { ShieldAlert, AlertTriangle, Brain, Lock, Scale, FileWarning, Microscope, HeartPulse, ArrowRight } from "lucide-react";
import Link from "next/link";
import NeuralNetworkAnimation from "@/components/NeuralNetworkAnimation";

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5, delay },
});

const PRINCIPLES = [
    {
        icon: ShieldAlert,
        title: "AI Is Not a Final Diagnosis",
        content: "Retinova provides AI-generated screening suggestions, not definitive medical diagnoses. All outputs must be reviewed and confirmed by a qualified ophthalmologist or retinal specialist before any clinical decisions are made. The system is intended to assist — never replace — the clinical judgment of licensed medical professionals.",
        accent: "border-red-200 bg-red-50/30",
        iconBg: "from-red-500 to-red-700",
    },
    {
        icon: AlertTriangle,
        title: "Model Limitations",
        content: "Our CNN model, while trained on millions of clinical images, has inherent limitations. It performs best on high-quality, well-centered fundus photographs and may produce less reliable results with low-resolution images, poor lighting conditions, or non-standard camera equipment. The model classifies diabetic retinopathy into 5 severity grades (No DR, Mild, Moderate, Severe, Proliferative) and is not designed to detect other ocular pathologies such as glaucoma, macular degeneration, or retinal detachment.",
        accent: "border-amber-200 bg-amber-50/30",
        iconBg: "from-amber-500 to-amber-700",
    },
    {
        icon: Scale,
        title: "Bias Awareness & Fairness",
        content: "Machine learning models can reflect and amplify biases present in training data. Our team actively monitors for demographic disparities across age, ethnicity, and imaging equipment. However, no model is entirely bias-free. We conduct routine fairness audits, stratified performance evaluations, and encourage institutions to report any observed disparities in prediction accuracy across patient populations.",
        accent: "border-blue-200 bg-slate-100/30",
        iconBg: "from-blue-500 to-blue-700",
    },
    {
        icon: Lock,
        title: "Data Privacy & Security",
        content: "Patient privacy is paramount. All retinal images are processed in-memory and are never permanently stored on our servers. We implement end-to-end encryption for data in transit, and our architecture is designed to be HIPAA-compatible. No personally identifiable information (PII) is collected, stored, or shared. Users retain full ownership and control of their medical data at all times.",
        accent: "border-emerald-200 bg-emerald-50/30",
        iconBg: "from-emerald-500 to-emerald-700",
    },
    {
        icon: FileWarning,
        title: "Regulatory Disclaimer",
        content: "Retinova is currently a research and screening tool and is not approved by the FDA, CE, or any other regulatory body as a standalone medical device for clinical diagnosis. It should only be used as an adjunct screening aid within the scope of clinical research, educational demonstrations, or preliminary screening workflows under the supervision of qualified healthcare providers.",
        accent: "border-purple-200 bg-purple-50/30",
        iconBg: "from-purple-500 to-purple-700",
    },
    {
        icon: Microscope,
        title: "Continuous Improvement",
        content: "We are committed to continuous model improvement through expanded datasets, advanced architectures, and ongoing clinical validation. We welcome collaborations with ophthalmology departments, clinical research institutions, and public health organizations to improve model performance, reduce bias, and expand the conditions our system can detect.",
        accent: "border-teal-200 bg-teal-50/30",
        iconBg: "from-slate-600 to-slate-800",
    },
];

export default function EthicsPage() {
    return (
        <div className="flex-1 bg-white relative overflow-hidden">
            <NeuralNetworkAnimation />

            {/* Hero */}
            <section className="relative pt-32 pb-16 overflow-hidden">
                
                <div className="container mx-auto px-6 relative z-10 max-w-4xl text-center">
                    <motion.div {...fadeUp()}>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 border border-red-100 text-red-600 text-xs font-bold uppercase tracking-widest mb-6">
                            <HeartPulse className="w-4 h-4" /> Ethics & Responsibility
                        </div>
                    </motion.div>
                    <motion.h1 {...fadeUp(0.1)} className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
                        Responsible AI in{" "}
                        <span className="text-slate-900">
                            Healthcare
                        </span>
                    </motion.h1>
                    <motion.p {...fadeUp(0.2)} className="text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        We believe AI in healthcare carries profound ethical responsibilities. This page outlines our commitments to transparency, patient safety, and responsible deployment of clinical AI systems.
                    </motion.p>
                </div>
            </section>

            {/* Important Notice Banner */}
            <section className="py-6 relative z-10">
                <div className="container mx-auto px-6 max-w-4xl">
                    <motion.div {...fadeUp()} className="flex items-start gap-4 p-6 rounded-2xl bg-red-50 border border-red-200">
                        <div className="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center text-white flex-shrink-0 mt-0.5">
                            <AlertTriangle className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-red-800 mb-1 text-sm">Critical Notice</h3>
                            <p className="text-red-700 text-sm leading-relaxed">
                                <strong>Retinova does not provide medical diagnoses.</strong> All AI-generated screening results are probabilistic assessments and must be confirmed by a qualified medical professional. Never make treatment decisions based solely on AI screening outputs.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Principles */}
            <section className="py-16 relative">
                <div className="container mx-auto px-6 max-w-4xl">
                    <div className="space-y-6">
                        {PRINCIPLES.map((principle, i) => {
                            const Icon = principle.icon;
                            return (
                                <motion.div key={i} {...fadeUp(i * 0.06)}
                                    className={`p-7 rounded-2xl border backdrop-blur-sm ${principle.accent}`}
                                >
                                    <div className="flex items-start gap-5">
                                        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${principle.iconBg} flex items-center justify-center text-white flex-shrink-0 shadow-lg mt-0.5`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-extrabold text-slate-900 mb-2 tracking-tight">{principle.title}</h3>
                                            <p className="text-sm text-slate-700 leading-relaxed">{principle.content}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Additional Resources */}
            <section className="py-16 relative">
                <div className="container mx-auto px-6 max-w-4xl">
                    <motion.div {...fadeUp()} className="text-center mb-10">
                        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-3">Patient & Clinician Resources</h2>
                        <p className="text-sm text-slate-600 max-w-xl mx-auto">For more information on AI in healthcare ethics and responsible deployment.</p>
                    </motion.div>
                    <div className="grid md:grid-cols-3 gap-4">
                        {[
                            { title: "WHO Guidelines", desc: "Ethics & governance of AI for health (2021)", url: "https://www.who.int/publications/i/item/9789240029200" },
                            { title: "FDA AI/ML Framework", desc: "Regulatory considerations for AI-based medical devices", url: "https://www.fda.gov/medical-devices/software-medical-device-samd/artificial-intelligence-and-machine-learning-aiml-software-medical-device" },
                            { title: "ICDR Scale Reference", desc: "International Clinical Diabetic Retinopathy severity scale", url: "https://www.aao.org/education/preferred-practice-pattern/diabetic-retinopathy-ppp" },
                        ].map((resource, i) => (
                            <motion.a key={i} {...fadeUp(i * 0.1)}
                                href={resource.url} target="_blank" rel="noopener noreferrer"
                                className="p-5 rounded-2xl bg-white/70 border border-white/80 backdrop-blur-md shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group"
                            >
                                <h3 className="font-bold text-slate-900 text-sm mb-1 group-hover:text-slate-900 transition-colors">{resource.title}</h3>
                                <p className="text-xs text-slate-500 leading-relaxed mb-3">{resource.desc}</p>
                                <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
                                    Learn more <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </motion.a>
                        ))}
                    </div>
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="py-16 relative">
                <div className="container mx-auto px-6 max-w-3xl text-center">
                    <motion.div {...fadeUp()} className="p-10 rounded-3xl bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-100">
                        <Brain className="w-10 h-10 text-slate-900 mx-auto mb-4" />
                        <h2 className="text-xl font-extrabold text-slate-900 mb-2">Questions About Our Ethics Policy?</h2>
                        <p className="text-sm text-slate-600 mb-6">We are committed to full transparency. Reach out to our team for any inquiries regarding our AI practices.</p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Link href="/about" className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg text-sm">
                                About Retinova
                            </Link>
                            <Link href="/dashboard" className="px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition text-sm">
                                Try the Platform
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
