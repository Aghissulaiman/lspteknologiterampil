"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    CheckCircle2,
    ShieldCheck,
    LogOut,
    Save,
    Award,
    AlertCircle,
    FileCheck2
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Data dummy unit kompetensi dan form penilaian untuk asesi
const dummyPenilaianData = {
    id: "asesi-01",
    nama: "Ahmad Fauzi",
    skema: "Teknisi Desktop (Desktop Technician)",
    code: "SKM-01",
    units: [
        {
            kode: "J.620900.010.02",
            judul: "Memasang Motherboard dan Komponen Utama",
            status: "K", // K = Kompeten, BK = Belum Kompeten
            catatan: "Pemasangan presisi dan sesuai prosedur keselamatan kerja."
        },
        {
            kode: "J.620900.011.02",
            judul: "Konfigurasi BIOS/UEFI dan Sistem Operasi",
            status: "K",
            catatan: "Berhasil melakukan setting boot sequence dan instalasi OS dengan lancar."
        },
    ]
};

export default function PenilaianAsesiPage() {
    const router = useRouter();
    const params = useParams();
    const asesiId = params.id;

    const [penilaian, setPenilaian] = useState(dummyPenilaianData);
    const [kesimpulanAsesor, setKesimpulanAsesor] = useState("Kompeten");
    const [feedbackUmum, setFeedbackUmum] = useState("Secara keseluruhan asesi menguasai seluruh unit kompetensi dengan baik.");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleStatusChange = (index: number, newStatus: "K" | "BK") => {
        const updatedUnits = [...penilaian.units];
        updatedUnits[index].status = newStatus;
        setPenilaian({ ...penilaian, units: updatedUnits });
    };

    const handleCatatanChange = (index: number, text: string) => {
        const updatedUnits = [...penilaian.units];
        updatedUnits[index].catatan = text;
        setPenilaian({ ...penilaian, units: updatedUnits });
    };

    const handleSubmitPenilaian = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulasi simpan ke database / backend
        setTimeout(() => {
            setIsSubmitting(false);
            alert("Keputusan hasil uji kompetensi berhasil disimpan dan dikirim ke sistem LSP!");
            router.push("/asesor");
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            {/* Header / Navbar Asesor */}
            <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-md">
                <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                            <ShieldCheck className="h-6 w-6" />
                        </div>
                        <div>
                            <span className="text-xl font-bold leading-tight tracking-tight text-foreground">
                                 <span className="text-primary">Asesor LSP</span>
                            </span>
                            <span className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                                Form Penilaian Uji Kompetensi
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push("/asesor")}
                            className="gap-2"
                        >
                            <LogOut className="h-4 w-4" /> Keluar 
                        </Button>
                    </div>
                </div>
            </header>

            {/* Konten Utama */}
            <main className="flex-1 py-10">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">

                    {/* Tombol Kembali */}
                    <div>
                        <button
                            type="button"
                            onClick={() => router.push(`/asesor/asesi/${asesiId}`)}
                            className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground transition hover:text-primary"
                        >
                            <ArrowLeft className="h-4 w-4" /> Kembali ke Detail Verifikasi Asesi
                        </button>
                    </div>

                    {/* Informasi Asesi */}
                    <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-3">
                        <span className="rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary">
                            {penilaian.code}
                        </span>
                        <h1 className="text-2xl font-extrabold sm:text-3xl tracking-tight">
                            Form Penilaian: {penilaian.nama}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Skema: <strong className="text-foreground">{penilaian.skema}</strong>
                        </p>
                    </div>

                    {/* Form Utama Penilaian */}
                    <form onSubmit={handleSubmitPenilaian} className="space-y-6">

                        {/* Daftar Unit Kompetensi & Penilaian */}
                        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
                            <div className="border-b border-border pb-4">
                                <h2 className="text-lg font-bold">Pencapaian Kompetensi per Unit SKKNI</h2>
                                <p className="text-xs text-muted-foreground mt-0.5">Berikan penilaian Kompeten (K) atau Belum Kompeten (BK) beserta catatan observasi.</p>
                            </div>

                            <div className="space-y-6">
                                {penilaian.units.map((unit, index) => (
                                    <div key={unit.kode} className="rounded-2xl border border-border bg-muted/20 p-5 space-y-4">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                            <div>
                                                <span className="font-mono text-xs font-bold text-primary">{unit.kode}</span>
                                                <h3 className="text-base font-bold text-foreground mt-0.5">{unit.judul}</h3>
                                            </div>

                                            {/* Pilihan Status K / BK */}
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleStatusChange(index, "K")}
                                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${unit.status === "K"
                                                            ? "bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-500/30"
                                                            : "bg-background border border-border text-muted-foreground hover:bg-muted"
                                                        }`}
                                                >
                                                    Kompeten (K)
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleStatusChange(index, "BK")}
                                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${unit.status === "BK"
                                                            ? "bg-red-600 text-white shadow-sm ring-2 ring-red-500/30"
                                                            : "bg-background border border-border text-muted-foreground hover:bg-muted"
                                                        }`}
                                                >
                                                    Belum Kompeten (BK)
                                                </button>
                                            </div>
                                        </div>

                                        {/* Kolom Catatan per Unit */}
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                                                Catatan / Umpan Balik Asesor untuk Unit Ini:
                                            </label>
                                            <input
                                                type="text"
                                                value={unit.catatan}
                                                onChange={(e) => handleCatatanChange(index, e.target.value)}
                                                placeholder="Tuliskan catatan hasil observasi atau tes..."
                                                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Keputusan Akhir & Feedback Umum */}
                        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-5">
                            <h2 className="text-lg font-bold">Rekomendasi & Keputusan Akhir Asesor</h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold mb-2">Rekomendasi Hasil Uji:</label>
                                    <select
                                        value={kesimpulanAsesor}
                                        onChange={(e) => setKesimpulanAsesor(e.target.value)}
                                        className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm font-semibold outline-none focus:border-primary"
                                    >
                                        <option value="Kompeten">Kompeten (K)</option>
                                        <option value="Belum Kompeten">Belum Kompeten (BK)</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2">Umpan Balik / Catatan Umum untuk Asesi:</label>
                                <textarea
                                    rows={4}
                                    value={feedbackUmum}
                                    onChange={(e) => setFeedbackUmum(e.target.value)}
                                    placeholder="Tuliskan evaluasi menyeluruh pelaksanaan asesmen..."
                                    className="w-full rounded-xl border border-border bg-background p-3.5 text-sm outline-none focus:border-primary"
                                />
                            </div>

                            {/* Tombol Simpan Akhir */}
                            <div className="pt-4 border-t border-border flex items-center justify-end">
                                <Button
                                    type="submit"
                                    size="lg"
                                    disabled={isSubmitting}
                                    className="gap-2 font-bold px-8 shadow-md"
                                >
                                    <Save className="h-4 w-4" />
                                    <span>{isSubmitting ? "Menyimpan..." : "Simpan & Submit Penilaian Akhir"}</span>
                                </Button>
                            </div>
                        </div>

                    </form>

                </div>
            </main>
        </div>
    );
}