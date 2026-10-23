"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    ClipboardList,
    History,
    LogOut,
    Menu,
    X,
    ShieldCheck,
    Sun,
    Moon,
    Bell
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

import { Plus_Jakarta_Sans } from "next/font/google";

const jakarta = Plus_Jakarta_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
});

import { useSyncExternalStore } from "react";
const emptySubscribe = () => () => { };
function useIsMounted() {
    return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

export default function AsesorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const { theme, setTheme, resolvedTheme } = useTheme();
    const mounted = useIsMounted();
    const activeTheme = mounted ? resolvedTheme || theme : "light";
    const isDarkTheme = activeTheme === "dark";

    const toggleTheme = () => {
        setTheme(isDarkTheme ? "light" : "dark");
    };

    const navLinks = [
        {
            name: "Dashboard Utama",
            href: "/asesor",
            icon: LayoutDashboard,
        },
        {
            name: "Daftar Penugasan",
            href: "/asesor/penugasan",
            icon: ClipboardList,
        },
        {
            name: "Riwayat Penilaian",
            href: "/asesor/riwayat",
            icon: History,
        },
    ];

    return (
        <div className={`${jakarta.className} min-h-screen bg-background text-foreground flex`}>
            {/* ================= SIDEBAR DESKTOP ================= */}
            <aside className="hidden lg:flex w-72 flex-col border-r border-border bg-card fixed inset-y-0 z-30">

                {/* Brand Header */}
                <div className="flex flex-col px-6 py-5 border-b border-border">
                    <Link href="/asesor" className="flex items-center gap-3">
                        {/* <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                            <ShieldCheck className="h-6 w-6" />
                        </div> */}
                        <div>
                            <span className="text-base font-black leading-tight tracking-tight text-foreground block">
                               LSP Teknologi terampil Mayantara
                            </span>
                            <span className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest mt-0.5">
                                Asesor
                            </span>
                        </div>
                    </Link>
                </div>

                {/* User Profile Card di Sidebar */}
                <div className="p-4">
                    <div className="rounded-2xl border border-border bg-background p-3.5 shadow-sm space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-black text-sm">
                                BH
                            </div>
                            <div className="overflow-hidden">
                                <span className="inline-block rounded-md bg-primary/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-primary mb-0.5">
                                    Asesor Aktif
                                </span>
                                <p className="text-xs font-bold text-foreground truncate">Ir. Budi Hartono, M.T.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Menu Navigasi Utama */}
                <div className="flex-1 px-4 py-2 space-y-1.5 overflow-y-auto">
                    <p className="px-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">
                        Menu Sistem
                    </p>
                    {navLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-bold transition-all ${isActive
                                        ? "bg-primary text-primary-foreground shadow-sm"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    }`}
                            >
                                <Icon className="h-5 w-5 shrink-0" />
                                <span>{link.name}</span>
                            </Link>
                        );
                    })}
                </div>

                {/* Tombol Keluar di Bawah Sidebar */}
                <div className="p-4 border-t border-border">
                    <Button
                        variant="outline"
                        className="w-full justify-center gap-2 font-bold text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20 rounded-xl h-11"
                        onClick={() => router.push("/auth/login")}
                    >
                        <LogOut className="h-4 w-4" />
                        <span>Keluar Sistem</span>
                    </Button>
                </div>
            </aside>

            {/* ================= SIDEBAR MOBILE ================= */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 lg:hidden flex">
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setSidebarOpen(false)}
                    />
                    <div className="relative w-72 max-w-xs flex-1 bg-card border-r border-border flex flex-col z-10 shadow-xl">
                        <div className="flex h-20 items-center justify-between px-6 border-b border-border">
                            <span className="font-black text-base">Panel Asesor LSP</span>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSidebarOpen(false)}
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        <div className="flex-1 px-4 py-2 space-y-1.5 overflow-y-auto">
                            {navLinks.map((link) => {
                                const Icon = link.icon;
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setSidebarOpen(false)}
                                        className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-bold transition-all ${isActive
                                                ? "bg-primary text-primary-foreground shadow-sm"
                                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                            }`}
                                    >
                                        <Icon className="h-5 w-5 shrink-0" />
                                        <span>{link.name}</span>
                                    </Link>
                                );
                            })}
                        </div>

                        <div className="p-4 border-t border-border">
                            <Button
                                variant="outline"
                                className="w-full justify-center gap-2 font-bold text-destructive hover:bg-destructive/10 rounded-xl h-11"
                                onClick={() => router.push("/auth/login")}
                            >
                                <LogOut className="h-4 w-4" />
                                <span>Keluar Sistem</span>
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* ================= MAIN CONTENT AREA ================= */}
            <div className="flex-1 flex flex-col lg:pl-72">
                {/* Top Navbar Header */}
                <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-border bg-background/95 px-4 sm:px-8 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden"
                            onClick={() => setSidebarOpen(true)}
                            aria-label="Buka Menu"
                        >
                            <Menu className="h-6 w-6" />
                        </Button>

                        {/* Logo & Judul Panel Asesor */}
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                                <ShieldCheck className="h-5 w-5" />
                            </div>
                            <div>
                                <span className="text-base font-black leading-tight tracking-tight text-foreground">
                                    <span className="text-primary">Asesor LSP</span>
                                </span>
                                <span className="block text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">
                                    Sistem Penilaian Kompetensi BNSP
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Gabungan Teks Halo, Ikon Lonceng, & Mod Tema di Sebelah Kanan */}
                    <div className="flex items-center gap-4">
                        <span className="hidden text-sm font-medium sm:inline-block text-muted-foreground">
                            Halo, <strong className="text-foreground">Ir. Budi Hartono, M.T.</strong> (Asesor)
                        </span>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10 rounded-xl text-muted-foreground hover:text-foreground relative"
                                aria-label="Notifikasi"
                            >
                                <Bell className="h-5 w-5" />
                                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary" />
                            </Button>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={toggleTheme}
                                className="h-10 w-10 rounded-xl text-muted-foreground hover:text-foreground"
                                aria-label="Ganti Tema"
                            >
                                {mounted && isDarkTheme ? (
                                    <Moon className="h-5 w-5 text-blue-400" />
                                ) : (
                                    <Sun className="h-5 w-5 text-amber-500" />
                                )}
                            </Button>
                        </div>
                    </div>
                </header>

                {/* Page Children Content */}
                <main className="flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
}