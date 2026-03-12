import HistoryTable from "@/components/HistoryTable";

export const metadata = { title: "History Logs - RetinaAI Core" };

export default function HistoryPage() {
    return (
        <div className="flex-1 bg-slate-50 py-20 px-4">
            <div className="container mx-auto max-w-6xl">
                <div className="mb-12 text-center md:text-left flex flex-col md:flex-row items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Clinical Repository</h1>
                        <p className="text-slate-600 text-lg font-medium">Historical logs of deep learning inferences and diagnostic approvals.</p>
                    </div>
                    <button className="px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-full hover:bg-slate-100 transition shadow-sm">
                        Export Records
                    </button>
                </div>
                <HistoryTable />
            </div>
        </div>
    );
}
