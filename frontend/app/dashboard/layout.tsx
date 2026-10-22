"use client";

import { Inter } from "next/font/google";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Menu, X } from "lucide-react";
import { useTheme } from "next-themes";


const MENU_ITEMS = [
    { step: "01", label: "Profil & Biodata", desc: "Identitas & berkas KTP", href: "/dashboard/profile" },
    { step: "02", label: "Pilih Skema & Jadwal", desc: "Skema uji & lokasi TUK", href: "/dashboard/skema" },
    { step: "03", label: "Form APL-01 & APL-02", desc: "Syarat & asesmen mandiri", href: "/dashboard/apl" },
    { step: "04", label: "Status & Kartu Ujian", desc: "Verifikasi & cetak kartu", href: "/dashboard/status" },
];

const inter = Inter({ subsets: ["latin"] });

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    
    

    return (
        <div className={`${inter.className} darkMode ? "dark" : ""`}>
            <div className="min-h-screen flex bg-[#F8FAFC] text-[#0A1D37] dark:bg-[#071120] dark:text-slate-100 transition-colors duration-300 font-sans">

                {/* SIDEBAR KIRI */}
                <aside
                    className={`fixed inset-y-0 left-0 z-40 w-80 bg-white lg:sticky lg:top-0 lg:h-screen dark:bg-[#0B192C] border-r border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between transition-transform duration-300 lg:static lg:translate-x-0 print:hidden ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                        }`}
                >
                    <div>
                        {/* Brand Header */}
                        <div className="h-24 px-7 flex items-center gap-3.5 border-b border-slate-100 dark:border-slate-800/80">
                            
                            <div>
                                <h1 className=" font-bold text-lg leading-tight text-[#0A1D37] dark:text-white">
                                    LSP <span className="text-[#0066CC] dark:text-blue-400">Teknologi Terampil</span>
                                </h1>
                                <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-400 mt-0.5">
                                    Lisensi Resmi BNSP
                                </p>
                            </div>
                        </div>

                        {/* Mini Profil Asesi */}
                        <div className={`${inter.className} p-4 mx-5 my-6 rounded-2xl bg-blue-50/60 dark:bg-slate-900/80 border border-blue-100 dark:border-slate-800 flex items-center gap-3.5`}>
                            <div className={`${inter.className} w-11 h-11 rounded-xl bg-white dark:bg-slate-800 text-[#0066CC] dark:text-amber-400 font-serif font-bold text-base flex items-center justify-center shadow-sm border border-blue-100 dark:border-slate-700`}>
                                BS
                            </div>
                            <div className={`${inter.className} min-w-0 flex-1`}>
                                <span className="inline-block px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 text-[10px] font-bold uppercase tracking-wider">
                                    Asesi Peserta
                                </span>
                                <p className={`${inter.className} font-serif font-bold text-sm text-[#0A1D37] dark:text-white truncate mt-0.5`}>
                                    Budi Santoso
                                </p>
                                <p className={`${inter.className} text-[11px] text-slate-500 dark:text-slate-400 font-mono`}>
                                    NIK: 3201123456780001
                                </p>
                            </div>
                        </div>

                        {/* Navigasi Menu */}
                        <nav className="px-5 space-y-2">
                            <p className="px-3 text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">
                                Alur Sertifikasi
                            </p>

                            {MENU_ITEMS.map((item) => {
                                const isActive = pathname.startsWith(item.href);
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setSidebarOpen(false)}
                                        className={`group flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all duration-200 ${isActive
                                                ? "bg-[#0066CC] text-white shadow-lg shadow-blue-600/25 -translate-y-0.5"
                                                : "text-slate-600 dark:text-slate-300 hover:bg-blue-50/80 dark:hover:bg-slate-800/60 hover:text-[#0066CC] dark:hover:text-blue-400 hover:translate-x-1"
                                            }`}
                                    >
                                        <span
                                            className={`w-9 h-9 rounded-xl flex items-center justify-center font-serif font-bold text-xs transition-colors ${isActive
                                                    ? "bg-white/20 text-white"
                                                    : "bg-blue-50 dark:bg-slate-800 text-[#0066CC] dark:text-blue-400 group-hover:bg-blue-100"
                                                }`}
                                        >
                                            {item.step}
                                        </span>
                                        <div className="flex-1">
                                            <p className="font-bold text-sm leading-snug">{item.label}</p>
                                            <p className={`text-[11px] ${isActive ? "text-blue-100" : "text-slate-400 dark:text-slate-500"}`}>
                                                {item.desc}
                                            </p>
                                        </div>
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    <div className="p-5 border-t border-slate-100 dark:border-slate-800/80 space-y-2.5">
                        <Link
                            href="/"
                            className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-[#0066CC] text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-[#0066CC] flex items-center justify-center gap-2 transition"
                        >
                            Kembali ke Beranda
                        </Link>
                    </div>
                </aside>

                {/* KONTEN UTAMA KANAN */}
                <div className="flex-1 flex flex-col min-w-0">
                    <header className="h-24 bg-white/90 dark:bg-[#0B192C]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-6 sm:px-10 flex items-center justify-between sticky top-0 z-30 print:hidden">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="lg:hidden p-2.5 rounded-xl bg-blue-50 dark:bg-slate-800 text-[#0066CC]"
                            >
                                ☰
                            </button>
                            <div>
                                {/* <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 border border-blue-100 dark:border-blue-800/60 text-[#0066CC] dark:text-blue-400 text-[11px] font-bold tracking-wide uppercase mb-1">
                                    <span>🛡️</span> Portal Peserta Sertifikasi Resmi
                                </div> */}
                                <h2 className={`font-serif text-xl sm:text-2xl font-bold text-[#0A1D37] dark:text-white ${inter.className}`}>
                                    Tingkatkan Karir. <span className="text-[#0066CC] dark:text-blue-400">Terampil & Tersertifikasi.</span>
                                </h2>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
            
                            <header className="h-24 bg-white/90 dark:bg-[#0B192C]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-6 sm:px-10 flex items-center justify-between sticky top-0 z-30 print:hidden">

                                {/* KANAN: Tombol Mode & Hamburger Menu */}
                                <div className="flex items-center gap-2">
                                    <div className="relative">
                                        <button
                                            onClick={() => alert("Buka Panel Notifikasi")}
                                            className="relative w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition"
                                            aria-label="Notifikasi"
                                        >
                                            {/* Ikon Lonceng SVG */}
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                                            </svg>

                                            {/* Titik Merah Indikator Notifikasi Baru */}
                                            <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-[#0B192C]" />
                                        </button>
                                    </div>
                                    {/* Tombol Dark Mode (Untuk Desktop - lg:flex) */}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                       onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                        className="hidden lg:flex h-10 w-10 rounded-md text-slate-600 dark:text-slate-300"
                                        aria-label="Ganti Tema"
                                    >
                                        {theme === "dark" ? (
                                            <Moon className="h-5 w-5 text-blue-400" />
                                        ) : (
                                            <Sun className="h-5 w-5 text-amber-500" />
                                        )}
                                    </Button>

                                    {/* Tombol Mobile (Sesuai kodemu: lg:hidden) */}
                                    <div className="flex items-center gap-2 lg:hidden">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                            className="h-10 w-10 rounded-md text-slate-600 dark:text-slate-300"
                                            aria-label="Ganti Tema"
                                        >
                                            {theme === "dark" ? (
                                                <Moon className="h-5 w-5 text-blue-400" />
                                            ) : (
                                                <Sun className="h-5 w-5 text-amber-500" />
                                            )}
                                        </Button>

                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setSidebarOpen(!sidebarOpen)}
                                            aria-label="Toggle Menu"
                                            className="h-10 w-10 text-slate-600 dark:text-slate-300"
                                        >
                                            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                                        </Button>
                                    </div>
                                </div>
                            </header>
                        </div>
                    </header>
                    <main className="p-6 sm:p-10 max-w-5xl w-full mx-auto">{children}</main>
                </div>
            </div>
        </div>
    );
}