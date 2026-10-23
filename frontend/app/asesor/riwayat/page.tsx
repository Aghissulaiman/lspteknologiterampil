"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";

const riwayatList = [
    { id: "asesi-03", nama: "Budi Santoso", skema: "Pemrogram Muda", tanggal: "25 Okt 2026", keputusan: "Kompeten (K)" },
];

export default function RiwayatAsesorPage() {
    return (
        <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm">
                <h1 className="text-2xl font-extrabold tracking-tight">Riwayat Penilaian Asesmen</h1>
                <p className="text-sm text-muted-foreground mt-1">Rekapitulasi seluruh asesi yang telah selesai Anda nilai pada periode sebelumnya.</p>
            </div>

            <div className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden p-6">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-border bg-muted/40 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                            <th className="py-3 px-4">Nama Asesi</th>
                            <th className="py-3 px-4">Skema Sertifikasi</th>
                            <th className="py-3 px-4">Tanggal Selesai</th>
                            <th className="py-3 px-4">Keputusan Akhir</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {riwayatList.map((item) => (
                            <tr key={item.id} className="hover:bg-muted/20">
                                <td className="py-4 px-4 font-bold">{item.nama}</td>
                                <td className="py-4 px-4">{item.skema}</td>
                                <td className="py-4 px-4 text-muted-foreground">{item.tanggal}</td>
                                <td className="py-4 px-4">
                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                        <CheckCircle2 className="h-3.5 w-3.5" /> {item.keputusan}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}