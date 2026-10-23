"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft,
    CheckCircle2,
    XCircle,
    ExternalLink,
    ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Data dummy asesi detail
const dummyAsesiDetail = {
    id: "asesi-01",
    nama: "Ahmad Fauzi",
    email: "ahmad.fauzi@email.com",
    telepon: "081234567890",
    nik: "3201234567890001",
    skema: "Teknisi Desktop (Desktop Technician)",
    code: "SKM-01",
    nomorSkema: "SKM/BNSP/001/LSP-TTM/2026",
    tanggalUjian: "15 Nov 2026",
    tuk: "TUK Lab Komputer A",
    statusVerifikasi: "Menunggu Verifikasi",
    apl01: {
        ktpUrl: "#",
        ijazahUrl: "#",
        pasfotoUrl: "#",
    },
    apl02: [
        { kode: "J.620900.010.02", judul: "Memasang Motherboard", kompeten: true, bukti: "Sertifikat Pelatihan Hardware 2025" },
        { kode: "J.620900.011.02", judul: "Konfigurasi BIOS/UEFI", kompeten: true, bukti: "Praktik Kerja Lapangan (PKL)" },
    ]
};

export default function DetailAsesorAsesiPage() {
    const router = useRouter();
    const params = useParams();
    const asesiId = params.id;

    const [asesi, setAsesi] = useState(dummyAsesiDetail);
    const [catatanVerifikasi, setCatatanVerifikasi] = useState("");

    const handleVerifikasi = (status: "Disetujui" | "Ditolak") => {
        setAsesi(prev => ({ ...prev, statusVerifikasi: status }));
    };

    return (
        <div className="py-10">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-6">

                {/* Card Biodata Asesi */}
                <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-6">
                        <div>
                            <span className="rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary">
                                {asesi.code}
                            </span>
                            <h1 className="mt-3 text-2xl font-extrabold sm:text-3xl tracking-tight">
                                {asesi.nama}
                            </h1>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Skema: <strong className="text-foreground">{asesi.skema}</strong>
                            </p>
                        </div>

                        <div className="flex flex-col items-start sm:items-end gap-2">
                            <span className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-bold ${asesi.statusVerifikasi === "Disetujui"
                                    ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                                    : asesi.statusVerifikasi === "Ditolak"
                                        ? "bg-red-500/10 text-red-500 border border-red-500/20"
                                        : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                                }`}>
                                Status Berkas: {asesi.statusVerifikasi}
                            </span>
                            <p className="text-xs text-muted-foreground">Jadwal: {asesi.tanggalUjian} ({asesi.tuk})</p>
                        </div>
                    </div>

                    {/* Grid Informasi Kontak */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 text-sm">
                        <div className="rounded-2xl border border-border bg-muted/30 p-4">
                            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">NIK</p>
                            <p className="mt-1 font-semibold">{asesi.nik}</p>
                        </div>
                        <div className="rounded-2xl border border-border bg-muted/30 p-4">
                            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Email</p>
                            <p className="mt-1 font-semibold">{asesi.email}</p>
                        </div>
                        <div className="rounded-2xl border border-border bg-muted/30 p-4">
                            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">No. Telepon / WhatsApp</p>
                            <p className="mt-1 font-semibold">{asesi.telepon}</p>
                        </div>
                    </div>
                </div>

                {/* Bagian APL-01 (Verifikasi Berkas Administratif) */}
                <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-5">
                    <div className="flex items-center justify-between border-b border-border pb-4">
                        <div>
                            <h2 className="text-lg font-bold">1. Verifikasi Berkas Administratif (APL-01)</h2>
                            <p className="text-xs text-muted-foreground mt-0.5">Periksa kelengkapan identitas dan dokumen persyaratan asesi.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="flex items-center justify-between rounded-2xl border border-border p-4 bg-muted/20">
                            <span className="text-sm font-semibold">Scan KTP</span>
                            <a href={asesi.apl01.ktpUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline">
                                Lihat Dokumen <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                        </div>
                        <div className="flex items-center justify-between rounded-2xl border border-border p-4 bg-muted/20">
                            <span className="text-sm font-semibold">Ijazah / SKL</span>
                            <a href={asesi.apl01.ijazahUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline">
                                Lihat Dokumen <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                        </div>
                        <div className="flex items-center justify-between rounded-2xl border border-border p-4 bg-muted/20">
                            <span className="text-sm font-semibold">Pasfoto Formal</span>
                            <a href={asesi.apl01.pasfotoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline">
                                Lihat Dokumen <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                        </div>
                    </div>

                    {/* Aksi Verifikasi */}
                    <div className="pt-4 border-t border-border space-y-4">
                        <label className="block text-sm font-bold">Catatan Verifikator / Asesor:</label>
                        <textarea
                            rows={3}
                            placeholder="Masukkan catatan jika ada berkas yang kurang atau perlu diperbaiki..."
                            value={catatanVerifikasi}
                            onChange={(e) => setCatatanVerifikasi(e.target.value)}
                            className="w-full rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-primary"
                        />

                        <div className="flex flex-wrap items-center gap-3">
                            <Button
                                onClick={() => handleVerifikasi("Disetujui")}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 font-bold"
                            >
                                <CheckCircle2 className="h-4 w-4" /> Setujui Berkas APL-01
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={() => handleVerifikasi("Ditolak")}
                                className="gap-2 font-bold"
                            >
                                <XCircle className="h-4 w-4" /> Tolak / Perlu Perbaikan
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Bagian APL-02 (Asesmen Mandiri) */}
                <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-5">
                    <div>
                        <h2 className="text-lg font-bold">2. Validasi Asesmen Mandiri (APL-02)</h2>
                        <p className="text-xs text-muted-foreground mt-0.5">Pengakuan kompetensi mandiri yang diisi oleh asesi per unit SKKNI.</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left text-sm">
                            <thead>
                                <tr className="border-y border-border bg-muted/40 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                                    <th className="py-3 px-4">Kode Unit</th>
                                    <th className="py-3 px-4">Judul Unit Kompetensi</th>
                                    <th className="py-3 px-4 text-center">Klaim Asesi</th>
                                    <th className="py-3 px-4">Bukti Pendukung</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {asesi.apl02.map((unit) => (
                                    <tr key={unit.kode}>
                                        <td className="py-3.5 px-4 font-mono text-xs font-bold text-primary">{unit.kode}</td>
                                        <td className="py-3.5 px-4 font-semibold">{unit.judul}</td>
                                        <td className="py-3.5 px-4 text-center">
                                            <span className="rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-bold">
                                                {unit.kompeten ? "Kompeten (K)" : "Belum (BK)"}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4 text-muted-foreground text-xs">{unit.bukti}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Tombol Lanjut ke Penilaian Ujian Hari-H */}
                <div className="flex items-center justify-end pt-4">
                    <Button
                        size="lg"
                        disabled={asesi.statusVerifikasi !== "Disetujui"}
                        onClick={() => router.push(`/asesor/asesi/${asesiId}/penilaian`)}
                        className="gap-2 font-bold px-8 shadow-md"
                    >
                        <span>Lanjut ke Form Penilaian Uji Kompetensi</span>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>

            </div>
        </div>
    );
}