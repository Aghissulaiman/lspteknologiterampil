// "use client";

// import React, { useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import Link from "next/link";
// import { ArrowLeft, Calendar, FileCode2, CheckCircle2, ShieldCheck, LogIn } from "lucide-react";
// import { skemaList } from "@/lib/skemaData";

// export default function DetailSkemaLandingPage() {
//     const router = useRouter();
//     const params = useParams();
//     const schemeId = params.id;

//     const activeDetail = skemaList.find((s) => s.id === schemeId);
//     const [selectedJadwal, setSelectedJadwal] = useState(activeDetail?.jadwal[0]?.id || "");

//     if (!activeDetail) {
//         return (
//             <div className="text-center py-20 space-y-4">
//                 <h2 className="text-xl font-bold text-slate-700 dark:text-white">Skema Sertifikasi Tidak Ditemukan</h2>
//                 <button
//                     onClick={() => router.push("/skema")}
//                     className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-bold"
//                 >
//                     Kembali ke Katalog Skema
//                 </button>8
//             </div>
//         );
//     }

//     return (
//         <main className="bg-background text-foreground min-h-screen py-10 sm:py-14">
//             <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-6">
//                 <div>
//                     <button
//                         type="button"
//                         onClick={() => router.push("/skema")}
//                         className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground transition hover:text-primary"
//                     >
//                         <ArrowLeft className="h-4 w-4" /> Kembali ke Katalog Skema
//                     </button>
//                 </div>

//                 <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
//                     <div className="space-y-6 lg:col-span-8">
//                         <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
//                             <div className="mb-4 flex flex-wrap items-center gap-2.5">
//                                 <span className="rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary">
//                                     {activeDetail.code}
//                                 </span>
//                                 <span className="rounded-full border border-border bg-muted px-3.5 py-1 text-xs font-semibold text-foreground">
//                                     Level {activeDetail.level}
//                                 </span>
//                                 <span className="inline-flex items-center gap-1.5 rounded-full border border-secondary/30 bg-secondary/10 px-3.5 py-1 text-xs font-bold text-secondary">
//                                     <FileCode2 className="h-3.5 w-3.5" /> No. Skema: {activeDetail.nomorSkema}
//                                 </span>
//                             </div>

//                             <h1 className="text-2xl font-extrabold leading-tight text-foreground sm:text-3xl">
//                                 Skema Sertifikasi {activeDetail.title}
//                             </h1>

//                             <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
//                                 {activeDetail.description}
//                             </p>

//                             <div className="mt-6 grid grid-cols-2 gap-4 border-t border-border pt-6 sm:grid-cols-5">
//                                 <div>
//                                     <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Jenis</p>
//                                     <p className="mt-1 text-sm font-bold text-foreground">{activeDetail.jenis}</p>
//                                 </div>
//                                 <div>
//                                     <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Pelaksanaan</p>
//                                     <p className="mt-1 text-sm font-bold text-foreground">{activeDetail.methods.join(" / ")}</p>
//                                 </div>
//                                 <div>
//                                     <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Total Unit</p>
//                                     <p className="mt-1 text-sm font-bold text-foreground">{activeDetail.units.length} Unit SKKNI</p>
//                                 </div>
//                                 <div>
//                                     <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Masa Berlaku</p>
//                                     <p className="mt-1 inline-flex items-center gap-1 text-sm font-bold text-primary">
//                                         <ShieldCheck className="h-4 w-4 shrink-0" /> {activeDetail.masaBerlaku}
//                                     </p>
//                                 </div>
//                                 <div>
//                                     <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Biaya</p>
//                                     <p className="mt-1 text-sm font-extrabold text-secondary">{activeDetail.price}</p>
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
//                             <div className="mb-5 rounded-xl bg-muted/50 p-4">
//                                 <h2 className="text-lg font-bold text-foreground">Persyaratan Pendaftaran</h2>
//                             </div>
//                             <ul className="space-y-3.5">
//                                 {activeDetail.persyaratan.map((req, index) => (
//                                     <li key={index} className="flex items-center gap-3.5">
//                                         <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
//                                             {index + 1}
//                                         </span>
//                                         <span className="text-sm text-muted-foreground sm:text-base">{req}</span>
//                                     </li>
//                                 ))}
//                             </ul>
//                         </div>

//                         <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
//                             <div className="p-6 sm:px-8 sm:pb-4 sm:pt-8">
//                                 <h2 className="text-lg font-bold text-foreground">Struktur Unit Kompetensi</h2>
//                             </div>
//                             <div className="overflow-x-auto">
//                                 <table className="w-full border-collapse text-left">
//                                     <thead>
//                                         <tr className="border-y border-border bg-muted/40 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
//                                             <th className="w-16 py-3.5 pl-6 pr-4 sm:pl-8">No</th>
//                                             <th className="w-48 px-4 py-3.5">Kode Unit</th>
//                                             <th className="py-3.5 pl-4 pr-6 sm:pr-8">Judul Unit Kompetensi</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody className="divide-y divide-border text-sm">
//                                         {activeDetail.units.map((unit, idx) => (
//                                             <tr key={unit.kode} className="transition-colors hover:bg-muted/20">
//                                                 <td className="py-4 pl-6 pr-4 font-medium text-muted-foreground sm:pl-8">{idx + 1}</td>
//                                                 <td className="px-4 py-4 font-mono text-xs font-bold text-primary sm:text-sm">{unit.kode}</td>
//                                                 <td className="py-4 pl-4 pr-6 font-medium text-foreground sm:pr-8">{unit.judul}</td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="lg:sticky lg:top-24 lg:col-span-4">
//                         <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
//                             <div className="border-b border-border bg-muted/40 p-6 sm:p-7">
//                                 <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Pendaftaran</p>
//                                 <p className="mt-1 text-3xl font-extrabold text-foreground">{activeDetail.price}</p>
//                                 <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
//                                     <CheckCircle2 className="h-3.5 w-3.5" /> Masa berlaku sertifikat {activeDetail.masaBerlaku}
//                                 </p>
//                             </div>

//                             <div className="space-y-6 p-6 sm:p-7">
//                                 <div>
//                                     <p className="mb-3 text-sm font-bold text-foreground">Pilih Jadwal Ujian:</p>
//                                     <div className="space-y-3">
//                                         {activeDetail.jadwal.map((item) => {
//                                             const isSelected = selectedJadwal === item.id;
//                                             return (
//                                                 <label
//                                                     key={item.id}
//                                                     onClick={() => setSelectedJadwal(item.id)}
//                                                     className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-all ${isSelected ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border bg-card hover:border-primary/40"
//                                                         }`}
//                                                 >
//                                                     <input
//                                                         type="radio"
//                                                         name="jadwal-ujian"
//                                                         checked={isSelected}
//                                                         onChange={() => setSelectedJadwal(item.id)}
//                                                         className="mt-1 h-4 w-4 accent-primary"
//                                                     />
//                                                     <div className="space-y-1">
//                                                         <p className="flex items-center gap-1.5 text-sm font-bold text-foreground">
//                                                             <Calendar className="h-3.5 w-3.5 text-primary" /> {item.tanggal}
//                                                         </p>
//                                                         <p className="text-xs text-muted-foreground">{item.tuk}</p>
//                                                         <p className="pt-0.5 text-xs font-bold text-secondary">{item.kuota}</p>
//                                                     </div>
//                                                 </label>
//                                             );
//                                         })}
//                                     </div>
//                                 </div>

//                                 <div className="space-y-3 pt-2">
//                                     <Link
//                                         href="/auth/pendaftaran"
//                                         className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-bold text-primary-foreground shadow-sm transition hover:opacity-95"
//                                     >
//                                         <LogIn className="h-4 w-4" />
//                                         <span>Login untuk Mendaftar</span>
//                                     </Link>
//                                 </div>

//                                 <p className="text-center text-[11px] leading-relaxed text-muted-foreground">
//                                     Silakan login atau daftar akun terlebih dahulu untuk melanjutkan pengisian APL-01.
//                                 </p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </main>
//     );
// }


"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
    ArrowLeft,
    Calendar,
    FileCode2,
    CheckCircle2,
    ShieldCheck,
    LogIn,
    Menu,
    X,
    Sun,
    Moon,
    ChevronDown
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { skemaList } from "@/lib/skemaData";

// Hook untuk mendeteksi mounted (mencegah hydration mismatch pada tema)
import { useSyncExternalStore } from "react";
const emptySubscribe = () => () => { };
function useIsMounted() {
    return useSyncExternalStore(
        emptySubscribe,
        () => true,
        () => false
    );
}

export default function DetailSkemaLandingPage() {
    const router = useRouter();
    const params = useParams();
    const schemeId = params.id;

    const activeDetail = skemaList.find((s) => s.id === schemeId);
    const [selectedJadwal, setSelectedJadwal] = useState(activeDetail?.jadwal[0]?.id || "");

    // State untuk Navbar
    const [isOpen, setIsOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

    const { theme, setTheme, resolvedTheme } = useTheme();
    const mounted = useIsMounted();

    const activeTheme = mounted ? resolvedTheme || theme : "light";
    const isDarkTheme = activeTheme === "dark";

    const toggleTheme = (event: React.MouseEvent<HTMLButtonElement>) => {
        const nextTheme = isDarkTheme ? "light" : "dark";

        if (!document.startViewTransition) {
            setTheme(nextTheme);
            return;
        }

        const x = event.clientX;
        const y = event.clientY;

        const endRadius = Math.hypot(
            Math.max(x, window.innerWidth - x),
            Math.max(y, window.innerHeight - y)
        );

        const transition = document.startViewTransition(() => {
            setTheme(nextTheme);
        });

        transition.ready.then(() => {
            const clipPath = [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${endRadius}px at ${x}px ${y}px)`,
            ];

            document.documentElement.animate(
                { clipPath },
                {
                    duration: 1100,
                    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
                    pseudoElement: "::view-transition-new(root)",
                }
            );
        });
    };

    const toggleMobileAccordion = (title: string) => {
        setMobileExpanded(mobileExpanded === title ? null : title);
    };

    const menuItems = [
        {
            title: "Beranda",
            href: "/",
        },
        {
            title: "Profil",
            href: "#",
            children: [
                { name: "Tentang LSP", href: "/profil/tentang" },
                { name: "Struktur Organisasi", href: "/profil/struktur" },
            ],
        },
        {
            title: "Skema",
            href: "#",
            children: [
                { name: "Skema Sertifikasi", href: "/skema" },
            ],
        },
        {
            title: "Informasi",
            href: "#",
            children: [
                { name: "Kegiatan", href: "/informasi/kegiatan" },
                { name: "Berita", href: "/informasi/berita" },
                { name: "Cek Pemegang Sertifikat", href: "/informasi/verifikasi-sertifikat" },
            ],
        },
        {
            title: "Kontak",
            href: "/kontak",
        },
    ];

    if (!activeDetail) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center space-y-4 bg-background text-foreground">
                <h2 className="text-xl font-bold">Skema Sertifikasi Tidak Ditemukan</h2>
                <button
                    onClick={() => router.push("/skema")}
                    className="rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground shadow-sm"
                >
                    Kembali ke Katalog Skema
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            {/* ================= NAVBAR UTAMA ================= */}
            <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-md">
                <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

                    {/* Brand Logo */}
                    <Link href="/" className="flex items-center gap-3 cursor-pointer">
                        <div className="relative h-11 w-11 sm:h-12 sm:w-12">
                            <Image
                                src="/Logo/Logo2.png"
                                alt="Logo LSP Teknologi Terampil"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-bold leading-tight tracking-tight text-foreground">
                                LSP <span className="text-primary">Teknologi Terampil</span>
                            </span>
                            <span className="text-[11px] font-semibold text-muted-foreground tracking-wider uppercase">
                                Lisensi BNSP
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden items-center space-x-2 lg:flex">
                        {menuItems.map((item) => (
                            <div
                                key={item.title}
                                className="relative"
                                onMouseEnter={() => item.children && setActiveDropdown(item.title)}
                                onMouseLeave={() => item.children && setActiveDropdown(null)}
                            >
                                {item.children ? (
                                    <button
                                        className="flex items-center gap-1.5 px-4 py-2.5 text-base font-semibold text-foreground/80 hover:text-primary transition-colors cursor-pointer rounded-md hover:bg-accent/50"
                                        onClick={() =>
                                            setActiveDropdown(activeDropdown === item.title ? null : item.title)
                                        }
                                    >
                                        {item.title}
                                        <ChevronDown
                                            className={`h-4.5 w-4.5 transition-transform duration-200 ${activeDropdown === item.title ? "rotate-180 text-primary" : ""
                                                }`}
                                        />
                                    </button>
                                ) : (
                                    <Link
                                        href={item.href}
                                        className="block px-4 py-2.5 text-base font-semibold text-foreground/80 hover:text-primary transition-colors rounded-md hover:bg-accent/50"
                                    >
                                        {item.title}
                                    </Link>
                                )}

                                {/* Dropdown Menu Desktop */}
                                {item.children && activeDropdown === item.title && (
                                    <div className="absolute left-0 top-full pt-2 w-64 animate-in fade-in-50 zoom-in-95 duration-150">
                                        <div className="rounded-xl border border-border bg-popover/95 p-2 shadow-lg backdrop-blur-md">
                                            {item.children.map((subItem) => (
                                                <Link
                                                    key={subItem.name}
                                                    href={subItem.href}
                                                    className="block rounded-lg px-3.5 py-2.5 text-base font-medium text-foreground/90 hover:bg-accent hover:text-primary transition-colors"
                                                >
                                                    {subItem.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>

                    {/* Action Controls */}
                    <div className="hidden items-center gap-3 md:flex">
                        {/* Switcher Tema */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleTheme}
                            className="h-10 w-10 cursor-pointer rounded-md text-foreground transition-transform active:scale-95 select-none"
                            aria-label="Ganti Tema"
                        >
                            {mounted && isDarkTheme ? (
                                <Moon className="h-5 w-5 text-blue-400" />
                            ) : (
                                <Sun className="h-5 w-5 text-amber-500" />
                            )}
                        </Button>

                        {/* CTA Utama Pendaftaran */}
                        <Link
                            href="/auth/pendaftaran"
                            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-5 text-base font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
                        >
                            Daftar Sertifikasi
                        </Link>
                    </div>

                    {/* Mobile Toggle Button */}
                    <div className="flex items-center gap-2 lg:hidden">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleTheme}
                            className="h-10 w-10 rounded-md text-foreground"
                            aria-label="Ganti Tema"
                        >
                            {mounted && isDarkTheme ? (
                                <Moon className="h-5 w-5 text-blue-400" />
                            ) : (
                                <Sun className="h-5 w-5 text-amber-500" />
                            )}
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsOpen(!isOpen)}
                            aria-label="Toggle Menu"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </Button>
                    </div>
                </div>

                {/* Mobile Accordion Menu */}
                {isOpen && (
                    <div className="border-b border-border bg-background px-4 pb-6 pt-3 lg:hidden space-y-2 max-h-[calc(100vh-5rem)] overflow-y-auto">
                        {menuItems.map((item) => (
                            <div key={item.title} className="border-b border-border/40 pb-2">
                                {item.children ? (
                                    <div>
                                        <button
                                            onClick={() => toggleMobileAccordion(item.title)}
                                            className="flex w-full items-center justify-between py-2.5 text-lg font-semibold text-foreground"
                                        >
                                            <span>{item.title}</span>
                                            <ChevronDown
                                                className={`h-5 w-5 transition-transform duration-200 ${mobileExpanded === item.title ? "rotate-180 text-primary" : ""
                                                    }`}
                                            />
                                        </button>

                                        {mobileExpanded === item.title && (
                                            <div className="pl-4 space-y-1 pt-1 pb-1">
                                                {item.children.map((subItem) => (
                                                    <Link
                                                        key={subItem.name}
                                                        href={subItem.href}
                                                        onClick={() => setIsOpen(false)}
                                                        className="block py-2 text-base font-medium text-muted-foreground hover:text-primary transition-colors"
                                                    >
                                                        {subItem.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <Link
                                        href={item.href}
                                        onClick={() => setIsOpen(false)}
                                        className="block py-2.5 text-lg font-semibold text-foreground hover:text-primary"
                                    >
                                        {item.title}
                                    </Link>
                                )}
                            </div>
                        ))}

                        {/* Action Button Mobile */}
                        <div className="pt-4">
                            <Link
                                href="/auth/pendaftaran"
                                onClick={() => setIsOpen(false)}
                                className="flex w-full h-11 items-center justify-center rounded-md text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
                            >
                                Daftar Sertifikasi
                            </Link>
                        </div>
                    </div>
                )}
            </header>

            {/* ================= KONTEN UTAMA DETAIL SKEMA ================= */}
            <main className="flex-1 py-10 sm:py-14">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-6">
                    <div>
                        {/* <button
                            type="button"
                            onClick={() => router.push("/skema")}
                            className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground transition hover:text-primary"
                        >
                            <ArrowLeft className="h-4 w-4" /> Kembali ke Katalog Skema
                        </button> */}
                    </div>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
                        {/* KOLOM KIRI */}
                        <div className="space-y-6 lg:col-span-8">
                            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
                                <div className="mb-4 flex flex-wrap items-center gap-2.5">
                                    <span className="rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary">
                                        {activeDetail.code}
                                    </span>
                                    <span className="rounded-full border border-border bg-muted px-3.5 py-1 text-xs font-semibold text-foreground">
                                        Level {activeDetail.level}
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-secondary/30 bg-secondary/10 px-3.5 py-1 text-xs font-bold text-secondary">
                                        <FileCode2 className="h-3.5 w-3.5" /> No. Skema: {activeDetail.nomorSkema}
                                    </span>
                                </div>

                                <h1 className="text-2xl font-extrabold leading-tight text-foreground sm:text-3xl">
                                    Skema Sertifikasi {activeDetail.title}
                                </h1>

                                <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                                    {activeDetail.description}
                                </p>

                                <div className="mt-6 grid grid-cols-2 gap-4 border-t border-border pt-6 sm:grid-cols-5">
                                    <div>
                                        <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Jenis</p>
                                        <p className="mt-1 text-sm font-bold text-foreground">{activeDetail.jenis}</p>
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Pelaksanaan</p>
                                        <p className="mt-1 text-sm font-bold text-foreground">{activeDetail.methods.join(" / ")}</p>
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Total Unit</p>
                                        <p className="mt-1 text-sm font-bold text-foreground">{activeDetail.units.length} Unit SKKNI</p>
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Masa Berlaku</p>
                                        <p className="mt-1 inline-flex items-center gap-1 text-sm font-bold text-primary">
                                            <ShieldCheck className="h-4 w-4 shrink-0" /> {activeDetail.masaBerlaku}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Biaya</p>
                                        <p className="mt-1 text-sm font-extrabold text-secondary">{activeDetail.price}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
                                <div className="mb-5 rounded-xl bg-muted/50 p-4">
                                    <h2 className="text-lg font-bold text-foreground">Persyaratan Pendaftaran</h2>
                                </div>
                                <ul className="space-y-3.5">
                                    {activeDetail.persyaratan.map((req, index) => (
                                        <li key={index} className="flex items-center gap-3.5">
                                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                                                {index + 1}
                                            </span>
                                            <span className="text-sm text-muted-foreground sm:text-base">{req}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
                                <div className="p-6 sm:px-8 sm:pb-4 sm:pt-8">
                                    <h2 className="text-lg font-bold text-foreground">Struktur Unit Kompetensi</h2>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse text-left">
                                        <thead>
                                            <tr className="border-y border-border bg-muted/40 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                                                <th className="w-16 py-3.5 pl-6 pr-4 sm:pl-8">No</th>
                                                <th className="w-48 px-4 py-3.5">Kode Unit</th>
                                                <th className="py-3.5 pl-4 pr-6 sm:pr-8">Judul Unit Kompetensi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border text-sm">
                                            {activeDetail.units.map((unit, idx) => (
                                                <tr key={unit.kode} className="transition-colors hover:bg-muted/20">
                                                    <td className="py-4 pl-6 pr-4 font-medium text-muted-foreground sm:pl-8">{idx + 1}</td>
                                                    <td className="px-4 py-4 font-mono text-xs font-bold text-primary sm:text-sm">{unit.kode}</td>
                                                    <td className="py-4 pl-4 pr-6 font-medium text-foreground sm:pr-8">{unit.judul}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* KOLOM KANAN (Sticky) */}
                        <div className="lg:sticky lg:top-28 lg:col-span-4">
                            <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
                                <div className="border-b border-border bg-muted/40 p-6 sm:p-7">
                                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Pendaftaran</p>
                                    <p className="mt-1 text-3xl font-extrabold text-foreground">{activeDetail.price}</p>
                                    <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                                        <CheckCircle2 className="h-3.5 w-3.5" /> Masa berlaku sertifikat {activeDetail.masaBerlaku}
                                    </p>
                                </div>

                                <div className="space-y-6 p-6 sm:p-7">
                                    <div>
                                        <p className="mb-3 text-sm font-bold text-foreground">Pilih Jadwal Ujian:</p>
                                        <div className="space-y-3">
                                            {activeDetail.jadwal.map((item) => {
                                                const isSelected = selectedJadwal === item.id;
                                                return (
                                                    <label
                                                        key={item.id}
                                                        onClick={() => setSelectedJadwal(item.id)}
                                                        className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-all ${isSelected ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border bg-card hover:border-primary/40"
                                                            }`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="jadwal-ujian"
                                                            checked={isSelected}
                                                            onChange={() => setSelectedJadwal(item.id)}
                                                            className="mt-1 h-4 w-4 accent-primary"
                                                        />
                                                        <div className="space-y-1">
                                                            <p className="flex items-center gap-1.5 text-sm font-bold text-foreground">
                                                                <Calendar className="h-3.5 w-3.5 text-primary" /> {item.tanggal}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">{item.tuk}</p>
                                                            <p className="pt-0.5 text-xs font-bold text-secondary">{item.kuota}</p>
                                                        </div>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="space-y-3 pt-2">
                                        <Link
                                            href="/auth/pendaftaran"
                                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-bold text-primary-foreground shadow-sm transition hover:opacity-95"
                                        >
                                            <LogIn className="h-4 w-4" />
                                            <span>Login untuk Mendaftar</span>
                                        </Link>
                                    </div>

                                    <p className="text-center text-[11px] leading-relaxed text-muted-foreground">
                                        Silakan login atau daftar akun terlebih dahulu untuk melanjutkan pengisian APL-01.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}