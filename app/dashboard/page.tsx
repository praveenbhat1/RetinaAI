import UploadCard from "@/components/UploadCard";
import NeuralNetworkAnimation from "@/components/NeuralNetworkAnimation";

export const metadata = { title: "Inference Dashboard - RetinaAI" };

export default function DashboardPage() {
    return (
        <div className="flex-1 bg-[#F8FAFC] py-24 px-6 relative overflow-hidden min-h-[90vh]">
            <div className="absolute top-[10%] right-[-5%] w-[60vw] h-[60vw] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[10%] left-[-5%] w-[50vw] h-[50vw] bg-cyan-400/10 rounded-full blur-[100px] pointer-events-none" />

            <NeuralNetworkAnimation />

            <div className="container mx-auto relative z-10 z-10">
                <div className="max-w-4xl mx-auto mb-6 text-center">
                    <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/60 backdrop-blur-md border border-white/80 shadow-sm text-emerald-700 text-sm font-bold uppercase tracking-widest mb-8">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Engine Online
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight drop-shadow-sm">Acquisition Sandbox</h1>
                    <p className="text-slate-600 text-xl font-bold max-w-2xl mx-auto leading-relaxed">
                        Drag and drop high-resolution fundus topography into the inference engine. The CNN cluster will segment the image instantly.
                    </p>
                </div>
                <UploadCard />
            </div>
        </div>
    );
}
