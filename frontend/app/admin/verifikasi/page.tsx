"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileCheck, CheckCircle2, XCircle, Eye, Clock } from "lucide-react";

export default function VerifikasiAPLPage() {
    // Simulasi data peserta yang mendaftar dan menunggu verifikasi berkas APL
    const [verifikasiList, setVerifikasiList] = useState([
        { id: 1, nama: "Budi Santoso", nik: "3201123456780001", skema: "Junior Web Developer", tanggal: "26 Okt 2026", status: "Menunggu" },
        { id: 2, nama: "Siti Aminah", nik: "3201987654320002", skema: "Desain Grafis", tanggal: "26 Okt 2026", status: "Menunggu" },
        { id: 3, nama: "Andi Wijaya", nik: "3201456789120003", skema: "Network Administrator", tanggal: "25 Okt 2026", status: "Menunggu" },
    ]);

    // Fungsi saat admin menyetujui berkas
    const handleSetujui = (id: number) => {
        setVerifikasiList(verifikasiList.map(item =>
            item.id === id ? { ...item, status: "Disetujui" } : item
        ));
        alert("Berkas APL peserta berhasil disetujui!");
    };

    // Fungsi saat admin menolak berkas
    const handleTolak = (id: number) => {
        setVerifikasiList(verifikasiList.map(item =>
            item.id === id ? { ...item, status: "Ditolak" } : item
        ));
        alert("Berkas APL ditolak/minta revisi.");
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Halaman */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#0A1D37] dark:text-white font-serif">
                    Verifikasi Berkas APL-01 & APL-02
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">
                    Periksa kelengkapan identitas dan dokumen persyaratan pendaftaran peserta sertifikasi.
                </p>
            </div>

            {/* Kartu Ringkasan */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-[#0B192C] p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center">
                        <Clock className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-[#0A1D37] dark:text-white">
                            {verifikasiList.filter(item => item.status === "Menunggu").length}
                        </p>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">Antrean Verifikasi Baru</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#0B192C] p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-[#0066CC] flex items-center justify-center">
                        <FileCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-[#0A1D37] dark:text-white">142</p>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">Total Terverifikasi Bulan Ini</p>
                    </div>
                </div>
            </div>

            {/* Tabel Verifikasi */}
            <div className="bg-white dark:bg-[#0B192C] rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800/80">
                    <h2 className="text-lg font-bold text-[#0A1D37] dark:text-white">Daftar Pendaftar Menunggu Validasi</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Klik tombol aksi untuk menyetujui atau memeriksa dokumen.</p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-[#F8FAFC] dark:bg-[#071120] text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800/80">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Nama Peserta & NIK</th>
                                <th className="px-6 py-4 font-semibold">Pilihan Skema</th>
                                <th className="px-6 py-4 font-semibold">Tanggal Daftar</th>
                                <th className="px-6 py-4 font-semibold">Status Berkas</th>
                                <th className="px-6 py-4 font-semibold text-right">Aksi Verifikasi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                            {verifikasiList.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-[#0A1D37] dark:text-white">{item.nama}</p>
                                        <p className="text-xs font-mono text-slate-400 mt-0.5">NIK: {item.nik}</p>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-medium">{item.skema}</td>
                                    <td className="px-6 py-4 text-xs font-mono text-slate-500">{item.tanggal}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${item.status === "Disetujui"
                                                ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
                                                : item.status === "Ditolak"
                                                    ? "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400"
                                                    : "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400"
                                            }`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <Button variant="outline" size="sm" className="h-8 text-xs border-slate-200 dark:border-slate-700">
                                            <Eye className="w-3.5 h-3.5 mr-1" /> Cek KTP
                                        </Button>

                                        {item.status === "Menunggu" ? (
                                            <>
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleSetujui(item.id)}
                                                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8 font-bold"
                                                >
                                                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Setujui
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleTolak(item.id)}
                                                    className="bg-red-600 hover:bg-red-700 text-white text-xs h-8 font-bold"
                                                >
                                                    <XCircle className="w-3.5 h-3.5 mr-1" /> Tolak
                                                </Button>
                                            </>
                                        ) : (
                                            <span className="text-xs font-semibold text-slate-400 italic">Selesai Diproses</span>
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