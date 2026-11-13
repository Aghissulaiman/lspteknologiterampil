"use client";

import { Inter } from "next/font/google";
import React, { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Menu, X, LogOut, ExternalLink } from "lucide-react";
import { useTheme } from "next-themes";

type UserProfile = {
    id: string;
    fullName: string;
    email: string;
    nik: string | null;
    phone: string;
    role: string;
};

const MENU_ITEMS = [
    { step: "01", label: "Profil & Biodata", desc: "Identitas & berkas KTP", href: "/dashboard/profile" },
    { step: "02", label: "Pilih Skema & Jadwal", desc: "Skema uji & lokasi TUK", href: "/dashboard/skema" },
    { step: "03", label: "Pembayaran Skema", desc: "Transfer manual & CS", href: "/dashboard/pembayaran" },
    { step: "04", label: "Berkas Permohonan APL", desc: "Dokumen & unit kompetensi", href: "/dashboard/apl" },
    { step: "05", label: "Status & Kartu Ujian", desc: "Verifikasi & cetak kartu", href: "/dashboard/status" },
];

const inter = Inter({ subsets: ["latin"] });
const subscribeToMount = () => () => {};
const getMountedSnapshot = () => true;
const getServerMountedSnapshot = () => false;

function getInitials(name: string) {
    if (!name) return "AS";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { theme, setTheme } = useTheme();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [user, setUser] = useState<UserProfile | null>(null);
    const mounted = useSyncExternalStore(subscribeToMount, getMountedSnapshot, getServerMountedSnapshot);

    useEffect(() => {
        let active = true;
        fetch("/api/auth/me", { cache: "no-store" })
            .then(async (res) => {
                if (!res.ok) {
                    if (res.status === 401) {
                        router.push("/auth/masuk");
                    }
                    return null;
                }
                const data = await res.json();
                return data?.user as UserProfile | null;
            })
            .then((userData) => {
                if (active && userData) {
                    setUser(userData);
                }
            })
            .catch(() => {});
        return () => {
            active = false;
        };
    }, [router]);

    return (
        <div className={inter.className}>
            <div className="h-dvh flex overflow-hidden bg-[#F8FAFC] text-[#0A1D37] dark:bg-[#071120] dark:text-slate-100 transition-colors duration-300 font-sans">
                {/* SIDEBAR KIRI */}
                <aside
                    className={`fixed inset-y-0 left-0 z-40 w-80 shrink-0 overflow-y-auto bg-white dark:bg-[#0B192C] border-r border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between transition-transform duration-300 lg:static lg:h-dvh lg:translate-x-0 print:hidden ${
                        sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
                >
                    <div>
                        {/* Brand Header */}
                        <div className="h-24 px-7 flex items-center gap-3.5 border-b border-slate-100 dark:border-slate-800/80">
                            <div>
                                <h1 className="font-bold text-lg leading-tight text-[#0A1D37] dark:text-white">
                                    LSP <span className="text-[#0066CC] dark:text-blue-400">Teknologi Terampil</span>
                                </h1>
                                <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-400 mt-0.5">
                                    Portal Peserta Sertifikasi
                                </p>
                            </div>
                        </div>

                        {/* Mini Profil Asesi */}
                        <div className="p-4 mx-5 my-6 rounded-2xl bg-blue-50/60 dark:bg-slate-900/80 border border-blue-100 dark:border-slate-800 flex items-center gap-3.5">
                            <div className="w-11 h-11 rounded-xl bg-white dark:bg-slate-800 text-[#0066CC] dark:text-blue-400 font-bold text-base flex items-center justify-center shadow-sm border border-blue-100 dark:border-slate-700">
                                {getInitials(user?.fullName || "")}
                            </div>
                            <div className="min-w-0 flex-1">
                                <span className="inline-block px-2 py-0.5 rounded-full bg-blue-500/15 text-[#0066CC] dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider">
                                    Asesi Peserta
                                </span>
                                <p className="font-bold text-sm text-[#0A1D37] dark:text-white truncate mt-0.5">
                                    {user?.fullName || "Memuat akun..."}
                                </p>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate">
                                    {user?.nik ? `NIK: ${user.nik}` : user?.email || "—"}
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
                                        className={`group flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all duration-200 ${
                                            isActive
                                                ? "bg-[#0066CC] text-white shadow-lg shadow-blue-600/25 -translate-y-0.5"
                                                : "text-slate-600 dark:text-slate-300 hover:bg-blue-50/80 dark:hover:bg-slate-800/60 hover:text-[#0066CC] dark:hover:text-blue-400 hover:translate-x-1"
                                        }`}
                                    >
                                        <span
                                            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs transition-colors ${
                                                isActive
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

                    <div className="p-5 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                        <Link
                            href="/"
                            className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-[#0066CC] text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-[#0066CC] flex items-center justify-center gap-2 transition"
                        >
                            <ExternalLink className="w-3.5 h-3.5" />
                            Kembali ke Beranda
                        </Link>
                        <form action="/api/auth/logout" method="post">
                            <Button
                                type="submit"
                                variant="outline"
                                className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-red-500 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center justify-center gap-2 transition"
                            >
                                <LogOut className="h-3.5 w-3.5" />
                                Keluar Sistem
                            </Button>
                        </form>
                    </div>
                </aside>

                {/* KONTEN UTAMA KANAN */}
                <div className="flex-1 flex flex-col min-w-0 min-h-0 overflow-y-auto">
                    <header className="h-24 bg-white/90 dark:bg-[#0B192C]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-6 sm:px-10 flex items-center justify-between sticky top-0 z-30 print:hidden">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="lg:hidden p-2.5 rounded-xl bg-blue-50 dark:bg-slate-800 text-[#0066CC]"
                                aria-label="Buka Menu"
                            >
                                <Menu className="h-5 w-5" />
                            </button>
                            <div>
                                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0A1D37] dark:text-white">
                                    Portal Sertifikasi. <span className="text-[#0066CC] dark:text-blue-400">Kompeten & Terpercaya.</span>
                                </h2>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {mounted && (
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
                            )}

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                aria-label="Toggle Menu"
                                className="h-10 w-10 text-slate-600 dark:text-slate-300 lg:hidden"
                            >
                                {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </Button>
                        </div>
                    </header>
                    <main className="p-6 sm:p-10 max-w-5xl w-full mx-auto">{children}</main>
                </div>
            </div>
        </div>
    );
}
