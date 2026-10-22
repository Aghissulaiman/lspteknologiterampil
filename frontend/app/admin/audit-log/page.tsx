"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Search, ShieldCheck, UserCheck, FileEdit, Trash } from "lucide-react";

export default function AuditLogPage() {
    // Simulasi data log aktivitas sistem yang masuk secara otomatis
    const [logList] = useState([
        { id: 1, waktu: "26 Okt 2026, 14:32 WIB", user: "Admin Pusat (ADM-001)", aksi: "Menerbitkan Sertifikat", target: "Budi Santoso (Junior Web Developer)", tipe: "sukses" },
        { id: 2, waktu: "26 Okt 2026, 13:15 WIB", user: "Admin Pusat (ADM-001)", aksi: "Memverifikasi Berkas APL-01", target: "Siti Aminah", tipe: "sukses" },
        { id: 3, waktu: "26 Okt 2026, 11:00 WIB", user: "Asesor Budi", aksi: "Menyelesaikan Pleno Asesmen", target: "Skema Analis Web", tipe: "sukses" },
        { id: 4, waktu: "25 Okt 2026, 09:45 WIB", user: "Admin Pusat (ADM-001)", aksi: "Menghapus Data TUK", target: "Lab Komputer Lama", tipe: "peringatan" },
    ]);

    const [searchTerm, setSearchTerm] = useState("");

    // Filter pencarian log
    const filteredLogs = logList.filter(item =>
        item.aksi.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.target.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Halaman */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#0A1D37] dark:text-white font-serif">
                    Audit Log Aktivitas Sistem
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">
                    Rekaman jejak digital seluruh tindakan pengguna dan administrator di dalam sistem LSP.
                </p>
            </div>

            {/* Kartu Informasi Keamanan */}
            <div className="bg-white dark:bg-[#0B192C] p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-[#0066CC] flex items-center justify-center shrink-0">
                        <ShieldAlert className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-lg font-bold text-[#0A1D37] dark:text-white">Penyimpanan Log Aman & Enskripsi</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Data audit bersifat read-only dan otomatis tercatat oleh sistem backend.</p>
                    </div>
                </div>
                <div className="hidden sm:block">
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 text-xs font-semibold">
                        <ShieldCheck className="w-4 h-4" /> Sistem Terlindungi
                    </span>
                </div>
            </div>

            {/* Tabel & Filter Search */}
            <div className="bg-white dark:bg-[#0B192C] rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-bold text-[#0A1D37] dark:text-white">Riwayat Tindakan Terbaru</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Menampilkan aktivitas penting dari seluruh pengguna.</p>
                    </div>

                    {/* Kolom Pencarian Log */}
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Cari aktivitas / user..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-[#F8FAFC] dark:bg-[#071120] border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:border-[#0066CC] text-[#0A1D37] dark:text-white"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-[#F8FAFC] dark:bg-[#071120] text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800/80">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Waktu Sistem</th>
                                <th className="px-6 py-4 font-semibold">Pengguna (Aktor)</th>
                                <th className="px-6 py-4 font-semibold">Jenis Aksi</th>
                                <th className="px-6 py-4 font-semibold">Objek / Target</th>
                                <th className="px-6 py-4 font-semibold text-right">Status Log</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                            {filteredLogs.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs text-slate-500 dark:text-slate-400">
                                        {item.waktu}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-[#0A1D37] dark:text-white flex items-center gap-2.5">
                                        <span className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-slate-800 text-[#0066CC] dark:text-blue-400 flex items-center justify-center text-xs shrink-0">
                                            <UserCheck className="w-3.5 h-3.5" />
                                        </span>
                                        {item.user}
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-200">
                                        {item.aksi}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                                        {item.target}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${item.tipe === "sukses"
                                                ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
                                                : "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400"
                                            }`}>
                                            {item.tipe === "sukses" ? "Terekam" : "Peringatan"}
                                        </span>
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