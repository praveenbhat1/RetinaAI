"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Activity, Menu, X, LogOut, User, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { user, logout } = useAuth();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => { setMobileOpen(false); }, [pathname]);

    const handleLogout = () => {
        logout();
        router.push("/");
    };

    const links = [
        { href: "/", label: "Home" },
        ...(user?.role === "admin" 
            ? [{ href: "/dashboard", label: "Engine" }] 
            : user ? [{ href: "/dashboard", label: "Neural Engine" }] : []),
        ...(user?.role === "admin"
            ? [{ href: "/history", label: "Records" }]
            : user && (user.role === "doctor")
                ? [{ href: "/history", label: "Clinical Records" }]
                : user?.role === "patient"
                    ? [{ href: "/history", label: "My Scans" }]
                    : []),
        ...(user?.role === "admin" ? [{ href: "/admin", label: "Admin" }] : []),
        { href: "/about", label: user?.role === "admin" ? "Info" : "Protocol" },
        { href: "/ethics", label: user?.role === "admin" ? "Policy" : "AI Policy" },
    ];

    const roleBadge = user?.role === "admin" ? "ADMIN" : user?.role === "doctor" ? "DOCTOR" : user?.role === "pending_doctor" ? "PENDING" : null;

    return (
        <>
            <nav className={`fixed top-0 z-50 w-full transition-all duration-500 ${scrolled
                ? "border-b border-slate-200/80 bg-white/80 backdrop-blur-2xl shadow-[0_2px_20px_-2px_rgba(0,0,0,0.02)]"
                : "border-b border-transparent bg-white/0"
                }`}>
                <div className="container mx-auto px-6 h-[76px] flex items-center justify-between">

                    {/* Logo — Premium Clinical Branding */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-900 flex items-center justify-center group-hover:scale-105 transition-all duration-500 shadow-xl shadow-slate-900/10">
                            <Activity className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-bold text-slate-900 tracking-tight leading-none">
                                Retinex
                            </span>
                            <span className="text-[9px] font-mono font-bold text-slate-400 tracking-[0.2em] mt-1 uppercase">
                                [ SYS_v4.2.0 ]
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Nav Links */}
                    <div className="hidden lg:flex items-center gap-2">
                        {links.map(({ href, label }) => {
                            const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
                            return (
                                <Link key={href} href={href}
                                    className={`relative px-4 py-2 text-[13px] font-bold uppercase tracking-wider transition-all duration-300 rounded-lg ${isActive
                                        ? "text-slate-900 bg-slate-100/50"
                                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                                        }`}
                                >
                                    {label}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-4">
                        {user ? (
                            <>
                                <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-slate-50 border border-slate-100 rounded-2xl shadow-inner-sm group">
                                    <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                                        {user.role === "admin" ? <Shield className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-white" />}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-slate-900 max-w-[100px] truncate leading-none">{user.name.split(" ")[0]}</span>
                                        {roleBadge && (
                                            <span className="text-[8px] font-mono font-bold text-slate-400 tracking-widest mt-1">
                                                {roleBadge}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="hidden lg:inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-slate-500 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all uppercase tracking-widest"
                                >
                                    <LogOut className="w-3.5 h-3.5" /> Close Session
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="hidden lg:inline-flex px-6 py-2.5 text-xs font-bold text-slate-600 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all uppercase tracking-[0.15em]">
                                    Login
                                </Link>
                                <Link href="/signup" className="hidden lg:inline-flex px-6 py-3 text-xs font-bold text-white bg-slate-900 rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-95 uppercase tracking-[0.15em]">
                                    Sign up
                                </Link>
                            </>
                        )}
                        <button onClick={() => setMobileOpen(v => !v)} className="lg:hidden w-11 h-11 flex items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-900 hover:bg-slate-50 transition-all shadow-sm" aria-label="Toggle menu">
                            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        key="mobile-nav"
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="fixed top-[84px] left-4 right-4 z-40 bg-white/95 backdrop-blur-2xl border border-slate-200/50 rounded-[2.5rem] shadow-2xl p-8 flex flex-col gap-2 lg:hidden"
                    >
                        {links.map(({ href, label }, i) => {
                            const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
                            return (
                                <motion.div
                                    key={href}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <Link href={href} className={`block px-6 py-4 rounded-2xl text-[13px] font-bold uppercase tracking-widest transition-all ${isActive ? "bg-slate-100 text-slate-900 border border-slate-200" : "text-slate-500 hover:bg-slate-50"}`}>
                                        {label}
                                    </Link>
                                </motion.div>
                            );
                        })}
                        <div className="flex flex-col gap-3 mt-6 pt-6 border-t border-slate-100">
                            {user ? (
                                <button onClick={handleLogout} className="w-full py-4 bg-slate-50 text-slate-600 font-bold text-xs uppercase tracking-[0.2em] rounded-2xl border border-slate-200">Terminal Logout</button>
                            ) : (
                                <>
                                    <Link href="/login" className="w-full text-center py-4 px-6 border border-slate-200 text-slate-600 font-bold text-xs uppercase tracking-[0.2em] rounded-2xl bg-white">Authentication</Link>
                                    <Link href="/signup" className="w-full text-center py-4 px-6 bg-slate-900 text-white font-bold text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-slate-900/10">Initialize Account</Link>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
