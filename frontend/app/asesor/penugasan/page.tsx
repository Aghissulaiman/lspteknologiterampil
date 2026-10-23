"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const penugasanList = [
    { id: "asesi-01", nama: "Ahmad Fauzi", skema: "Teknisi Desktop", code: "SKM-01", jadwal: "15 Nov 2026", tuk: "TUK Lab A", status: "Belum Verifikasi" },
    { id: "asesi-02", nama: "Siti Rahmawati", skema: "Analis Web", code: "SKM-04", jadwal: "22 Nov 2026", tuk: "TUK Lab B", status: "Sudah Verifikasi" },
];

export default function PenugasanAsesorPage() {
    const router = useRouter();
    const [search, setSearch] = useState("");

    const filtered = penugasanList.filter(item =>
        item.nama.toLowerCase().includes(search.toLowerCase()) ||
        item.skema.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm">
                <h1 className="text-2xl font-extrabold tracking-tight">Daftar Penugasan Asesi</h1>
                <p className="text-sm text-muted-foreground mt-1">Kelola jadwal ujian dan daftar asesi yang ditugaskan kepada Anda.</p>
            </div>

            <div className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden p-6 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <h2 className="text-lg font-bold">Semua Penugasan</h2>
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                        <input
                            type="search"
                            placeholder="Cari asesi..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-10 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm outline-none focus:border-primary"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-border bg-muted/40 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                                <th className="py-3 px-4">Nama Asesi</th>
                                <th className="py-3 px-4">Skema</th>
                                <th className="py-3 px-4">Jadwal & TUK</th>
                                <th className="py-3 px-4">Status</th>
                                <th className="py-3 px-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filtered.map((item) => (
                                <tr key={item.id} className="hover:bg-muted/20">
                                    <td className="py-4 px-4 font-bold">{item.nama}</td>
                                    <td className="py-4 px-4"><span className="font-semibold">{item.code}</span> - {item.skema}</td>
                                    <td className="py-4 px-4 text-muted-foreground">{item.jadwal} ({item.tuk})</td>
                                    <td className="py-4 px-4">
                                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary">
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        <Button size="sm" onClick={() => router.push(`/asesor/asesi/${item.id}`)} className="gap-1 font-bold">
                                            Proses <ArrowRight className="h-4 w-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}