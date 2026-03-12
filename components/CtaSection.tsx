import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function CtaSection() {
    return (
        <section className="py-24 bg-slate-900">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-white tracking-tight">
                    Deploy clinical-grade AI
                </h2>
                <p className="text-base text-slate-400 mb-10 max-w-xl mx-auto">
                    Start evaluating the RetinaAI model free of charge. Join professionals screening retinas securely.
                </p>
                <Link href="/dashboard" className="px-8 py-3.5 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-100 transition shadow-sm inline-flex items-center gap-2">
                    Start Streaming <ChevronRight className="w-4 h-4" />
                </Link>
            </div>
        </section>
    );
}
