"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Users,
    Clock,
    CheckCircle,
    ArrowRight,
    Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Data dummy penugasan asesi untuk asesor
const initialAsesiList = [
    {
        id: "asesi-01",
        nama: "Ahmad Fauzi",
        skema: "Teknisi Desktop (Desktop Technician)",
        code: "SKM-01",
        tanggalUjian: "15 Nov 2026",
        statusVerifikasi: "Sudah Verifikasi",
        statusUjian: "Belum Dinilai",
        keputusan: null,
    },
    {
        id: "asesi-02",
        nama: "Siti Rahmawati",
        skema: "Analis Web (Web Analyst)",
        code: "SKM-04",
        tanggalUjian: "22 Nov 2026",
        statusVerifikasi: "Belum Verifikasi",
        statusUjian: "Belum Dinilai",
        keputusan: null,
    },
    {
        id: "asesi-03",
        nama: "Budi Santoso",
        skema: "Pemrogram Muda (Associate Programmer)",
        code: "SKM-05",
        tanggalUjian: "25 Nov 2026",
        statusVerifikasi: "Sudah Verifikasi",
        statusUjian: "Selesai",
        keputusan: "Kompeten",
    },
];

export default function DashboardAsesor() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [asesiList] = useState(initialAsesiList);

    // Statistik ringkas
    const totalAsesi = asesiList.length;
    const menungguVerifikasi = asesiList.filter(a => a.statusVerifikasi === "Belum Verifikasi").length;
    const sudahDinilai = asesiList.filter(a => a.statusUjian === "Selesai").length;

    const filteredAsesi = asesiList.filter(item =>
        item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.skema.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">

                {/* Welcome Banner */}
                <div className="rounded-3xl border border-border bg-gradient-to-br from-primary/[0.07] via-card to-secondary/[0.05] p-6 sm:p-8 shadow-sm">
                    <h1 className="text-2xl font-extrabold sm:text-3xl tracking-tight">
                        Dashboard Penugasan Asesor
                    </h1>
                   
                </div>

                {/* Statistik Cards */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Penugasan Asesi</p>
                            <h3 className="mt-2 text-3xl font-black">{totalAsesi}</h3>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                            <Users className="h-6 w-6" />
                        </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Menunggu Verifikasi</p>
                            <h3 className="mt-2 text-3xl font-black text-amber-500">{menungguVerifikasi}</h3>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
                            <Clock className="h-6 w-6" />
                        </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Selesai Dinilai</p>
                            <h3 className="mt-2 text-3xl font-black text-emerald-500">{sudahDinilai}</h3>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
                            <CheckCircle className="h-6 w-6" />
                        </div>
                    </div>
                </div>

                {/* Daftar Penugasan Asesi */}
                <div className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-border flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-lg font-bold">Daftar Asesi & Jadwal Ujian</h2>
                            <p className="text-xs text-muted-foreground mt-0.5">Pilih asesi untuk melakukan verifikasi atau penilaian uji kompetensi.</p>
                        </div>

                        {/* Search Bar */}
                        <div className="relative w-full sm:w-72">
                            <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                            <input
                                type="search"
                                placeholder="Cari nama atau skema..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="h-10 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm outline-none focus:border-primary"
                            />
                        </div>
                    </div>

                    {/* Tabel Asesi */}
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="border-b border-border bg-muted/40 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                                    <th className="py-3.5 pl-6 pr-4">Nama Asesi</th>
                                    <th className="px-4 py-3.5">Skema Sertifikasi</th>
                                    <th className="px-4 py-3.5">Jadwal Ujian</th>
                                    <th className="px-4 py-3.5">Status Berkas</th>
                                    <th className="px-4 py-3.5">Status Ujian</th>
                                    <th className="py-3.5 pl-4 pr-6 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border text-sm">
                                {filteredAsesi.length > 0 ? (
                                    filteredAsesi.map((item) => (
                                        <tr key={item.id} className="transition-colors hover:bg-muted/20">
                                            <td className="py-4 pl-6 pr-4 font-bold text-foreground">
                                                {item.nama}
                                            </td>
                                            <td className="px-4 py-4 text-muted-foreground">
                                                <span className="font-semibold text-foreground">{item.code}</span> - {item.skema}
                                            </td>
                                            <td className="px-4 py-4 text-muted-foreground font-medium">
                                                {item.tanggalUjian}
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${item.statusVerifikasi === "Sudah Verifikasi"
                                                        ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                                                        : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                                                    }`}>
                                                    {item.statusVerifikasi}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${item.statusUjian === "Selesai"
                                                        ? "bg-primary/10 text-primary border border-primary/20"
                                                        : "bg-muted text-muted-foreground border border-border"
                                                    }`}>
                                                    {item.statusUjian} {item.keputusan ? `(${item.keputusan})` : ""}
                                                </span>
                                            </td>
                                            <td className="py-4 pl-4 pr-6 text-right">
                                                <Button
                                                    size="sm"
                                                    onClick={() => router.push(`/asesor/asesi/${item.id}`)}
                                                    className="gap-1.5 font-bold"
                                                >
                                                    <span>Proses Asesmen</span>
                                                    <ArrowRight className="h-4 w-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-muted-foreground">
                                            Tidak ada data asesi yang ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}