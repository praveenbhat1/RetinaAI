import { Zap, BrainCircuit, ShieldCheck, ActivitySquare, Eye, Dna } from "lucide-react";

export default function FeatureCards() {
    const features = [
        { icon: Zap, title: "Instant Inference", description: "Receive clinical predictions in seconds with our optimized AI." },
        { icon: BrainCircuit, title: "Deep Learning", description: "Powered by robust CNN models trained on extensive datasets." },
        { icon: ShieldCheck, title: "Privacy Focused", description: "Secure processing with strict zero-retention protocols." },
        { icon: Eye, title: "Automated Grading", description: "Classify everything from Mild to Proliferative retinopathy." },
        { icon: ActivitySquare, title: "High Precision", description: "Consistently high sensitivity and specificity for pathologies." },
        { icon: Dna, title: "Clinical Workflow", description: "Easily fits into standard hospital screening routines." }
    ];

    return (
        <section id="features" className="py-20 bg-slate-50 border-t border-slate-200/50">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16 max-w-2xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-semibold text-[#0F172A] mb-4 tracking-tight">Intelligence at scale</h2>
                    <p className="text-base text-[#475569]">RetinaAI provides speed, precision, and security for the modern clinical workflow.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, idx) => {
                        const Icon = feature.icon;
                        return (
                            <div key={idx} className="p-8 rounded-xl bg-white border border-slate-200 hover:border-primary/20 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
                                <div className="w-12 h-12 bg-blue-50 text-primary rounded-xl flex items-center justify-center mb-6">
                                    <Icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-semibold text-[#0F172A] mb-2">{feature.title}</h3>
                                <p className="text-base text-[#475569] leading-relaxed">{feature.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
