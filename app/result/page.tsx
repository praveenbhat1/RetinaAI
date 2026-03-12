import ResultCard from "@/components/ResultCard";
import NeuralNetworkAnimation from "@/components/NeuralNetworkAnimation";

export const metadata = { title: "Analysis Result - RetinaAI" };

export default function ResultPage() {
    return (
        <div className="flex-1 bg-[#F8FAFC] py-24 px-6 relative overflow-hidden min-h-[90vh]">

            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-[80vw] h-[80vw] bg-primary/5 rounded-full blur-[150px] -z-0 pointer-events-none" />
            <NeuralNetworkAnimation />

            <div className="container mx-auto relative z-10">
                <div className="max-w-4xl mx-auto mb-8 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight drop-shadow-sm">Diagnostic Inference</h1>
                    <p className="text-slate-600 text-xl font-bold max-w-2xl mx-auto leading-relaxed">
                        Review the neural network's topographical analysis alongside the classification certainty metrics.
                    </p>
                </div>
                <ResultCard prediction="Moderate" confidence={94.2} />
            </div>
        </div>
    );
}
