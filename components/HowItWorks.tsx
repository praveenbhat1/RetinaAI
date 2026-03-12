import { Upload, Cpu, FileCheck } from "lucide-react";

export default function HowItWorks() {
    return (
        <section className="py-20 bg-white relative">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-semibold text-[#0F172A] mb-4 tracking-tight">Clinical Workflow</h2>
                    <p className="text-base text-[#475569] max-w-2xl mx-auto">From raw fundus scan to full severity prediction in three steps.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { step: "1", icon: Upload, title: "Acquisition", desc: "Upload standardized fundus photographs." },
                        { step: "2", icon: Cpu, title: "Inference", desc: "CNN ensembles classify pathological signs." },
                        { step: "3", icon: FileCheck, title: "Prediction", desc: "Review comprehensive severity results." }
                    ].map((item, idx) => (
                        <div key={idx} className="flex flex-col items-center text-center p-6 bg-slate-50 rounded-xl border border-slate-100 shadow-sm">
                            <div className="w-16 h-16 bg-white border border-slate-200 rounded-full flex items-center justify-center text-primary mb-6 shadow-sm">
                                <item.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-semibold text-[#0F172A] mb-3">{item.step}. {item.title}</h3>
                            <p className="text-base text-[#475569] leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
