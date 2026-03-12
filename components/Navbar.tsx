import Link from "next/link";
import { Activity } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/20 bg-white/30 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.05)]">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary/20 to-secondary/20 flex items-center justify-center border border-white/40 shadow-sm group-hover:scale-105 transition-transform">
            <Activity className="h-6 w-6 text-primary" />
          </div>
          <span className="text-2xl font-extrabold text-slate-800 tracking-tight">RetinaAI</span>
        </Link>
        <div className="hidden md:flex items-center gap-10">
          <Link href="/" className="text-[15px] font-bold text-slate-600 hover:text-primary transition-colors hover:-translate-y-0.5 transform">Home</Link>
          <Link href="/dashboard" className="text-[15px] font-bold text-slate-600 hover:text-primary transition-colors hover:-translate-y-0.5 transform">Dashboard</Link>
          <Link href="/history" className="text-[15px] font-bold text-slate-600 hover:text-primary transition-colors hover:-translate-y-0.5 transform">History</Link>
        </div>
        <div className="flex gap-4">
          <Link href="/login" className="px-7 py-2.5 text-sm font-bold text-white bg-slate-900 rounded-full hover:bg-primary transition-all shadow-lg hover:shadow-primary/30">
            Sign In
          </Link>
        </div>
      </div>
    </nav>
  );
}
