"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Award, CheckCircle2, FileText, Send, Eye } from "lucide-react";

export default function HasilSertifikatPage() {
    // Simulasi data peserta yang sudah ujian dan kompeten
    const [pesertaList, setPesertaList] = useState([
        { id: 1, nama: "Budi Santoso", skema: "Junior Web Developer", statusAsesmen: "Kompeten", statusSertifikat: "Belum Diterbitkan" },
        { id: 2, nama: "Siti Aminah", skema: "Desain Grafis", statusAsesmen: "Kompeten", statusSertifikat: "Sudah Diterbitkan" },
        { id: 3, nama: "Andi Wijaya", skema: "Network Administrator", statusAsesmen: "Kompeten", statusSertifikat: "Belum Diterbitkan" },
    ]);

    // Fungsi saat tombol "Terbitkan Sertifikat" diklik
    const handleTerbitkan = (id: number) => {
        setPesertaList(pesertaList.map(item => {
            if (item.id === id) {
                return { ...item, statusSertifikat: "Sudah Diterbitkan" };
            }
            return item;
        }));
        alert("Sertifikat berhasil diterbitkan! (Nanti di-backend ini akan trigger kirim email/PDF ke peserta)");
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Halaman */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#0A1D37] dark:text-white font-serif">
                    Hasil & Penerbitan Sertifikat
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">
                    Kelola keputusan akhir pleno asesor dan terbitkan sertifikat resmi bagi peserta yang kompeten.
                </p>
            </div>

            {/* Kartu Statistik Ringkas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-[#0B192C] p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-[#0A1D37] dark:text-white">128</p>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">Peserta Dinyatakan Kompeten</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#0B192C] p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-[#0066CC] flex items-center justify-center">
                        <Award className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-[#0A1D37] dark:text-white">95</p>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">Sertifikat Telah Diterbitkan</p>
                    </div>
                </div>
            </div>

            {/* Tabel Data Peserta & Aksi Terbitkan */}
            <div className="bg-white dark:bg-[#0B192C] rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800/80">
                    <h2 className="text-lg font-bold text-[#0A1D37] dark:text-white">Daftar Kelulusan Pleno Asesor</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Klik terbitkan untuk memproses sertifikat digital asesi.</p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-[#F8FAFC] dark:bg-[#071120] text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800/80">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Nama Peserta</th>
                                <th className="px-6 py-4 font-semibold">Skema Ujian</th>
                                <th className="px-6 py-4 font-semibold">Status Pleno</th>
                                <th className="px-6 py-4 font-semibold">Status Sertifikat</th>
                                <th className="px-6 py-4 font-semibold text-right">Aksi Penerbitan</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                            {pesertaList.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-[#0A1D37] dark:text-white flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-slate-800 text-[#0066CC] dark:text-blue-400 flex items-center justify-center shrink-0">
                                            <FileText className="w-4 h-4" />
                                        </span>
                                        {item.nama}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{item.skema}</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 text-xs font-semibold">
                                            {item.statusAsesmen}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${item.statusSertifikat === "Sudah Diterbitkan"
                                                ? "bg-blue-50 text-[#0066CC] dark:bg-blue-950/40 dark:text-blue-400"
                                                : "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400"
                                            }`}>
                                            {item.statusSertifikat}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        {item.statusSertifikat === "Sudah Diterbitkan" ? (
                                            <Button variant="outline" size="sm" className="h-8 text-xs">
                                                <Eye className="w-3.5 h-3.5 mr-1" /> Lihat Sertifikat
                                            </Button>
                                        ) : (
                                            <Button
                                                size="sm"
                                                onClick={() => handleTerbitkan(item.id)}
                                                className="bg-[#0066CC] hover:bg-blue-700 text-white text-xs h-8 font-bold"
                                            >
                                                <Send className="w-3.5 h-3.5 mr-1" /> Terbitkan Sertifikat
                                            </Button>
                                        )}
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