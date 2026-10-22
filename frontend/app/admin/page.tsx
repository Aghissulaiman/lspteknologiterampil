"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Users, Clock, ClipboardList, BriefcaseBusiness } from "lucide-react";

export default function AdminDashboardPage() {
    const stats = [
        { label: "Total Peserta", value: "142", icon: Users, color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/30" },
        { label: "Menunggu Verifikasi", value: "12", icon: Clock, color: "text-amber-600", bg: "bg-amber-100 dark:bg-amber-900/30" },
        { label: "Skema Aktif", value: "8", icon: ClipboardList, color: "text-emerald-600", bg: "bg-emerald-100 dark:bg-emerald-900/30" },
        { label: "Total Asesor", value: "24", icon: BriefcaseBusiness, color: "text-purple-600", bg: "bg-purple-100 dark:bg-purple-900/30" },
    ];

    const recentVerifications = [
        { id: 1, nama: "Budi Santoso", skema: "Junior Web Developer", waktu: "10 menit lalu", status: "Menunggu" },
        { id: 2, nama: "Siti Aminah", skema: "Desain Grafis", waktu: "1 jam lalu", status: "Menunggu" },
        { id: 3, nama: "Andi Wijaya", skema: "Network Administrator", waktu: "2 jam lalu", status: "Menunggu" },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#0A1D37] dark:text-white font-serif">
                    Dashboard Admin
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">
                    Ringkasan aktivitas dan status operasional LSP Teknologi Terampil hari ini.
                </p>
            </div>

            {/* Kartu Statistik */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <div key={i} className="bg-white dark:bg-[#0B192C] p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm flex items-center gap-4 transition-transform hover:-translate-y-1">
                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                                <Icon className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-[#0A1D37] dark:text-white">{stat.value}</p>
                                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">{stat.label}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Tabel Jalan Pintas */}
            <div className="bg-white dark:bg-[#0B192C] rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800/80 flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-bold text-[#0A1D37] dark:text-white">Perlu Verifikasi Segera (APL-01)</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Calon peserta yang baru mendaftar hari ini.</p>
                    </div>
                    <Link href="/admin/verifikasi">
                        <Button variant="outline" size="sm" className="text-xs font-bold text-[#0066CC] border-blue-200 hover:bg-blue-50 dark:border-slate-700 dark:text-blue-400 dark:hover:bg-slate-800">
                            Lihat Semua
                        </Button>
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-[#F8FAFC] dark:bg-[#071120] text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800/80">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Nama Peserta</th>
                                <th className="px-6 py-4 font-semibold">Skema Sertifikasi</th>
                                <th className="px-6 py-4 font-semibold">Waktu Daftar</th>
                                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                            {recentVerifications.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-[#0A1D37] dark:text-slate-200">{item.nama}</td>
                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{item.skema}</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-block px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-medium">
                                            {item.waktu}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link href="/admin/verifikasi">
                                            <Button size="sm" className="bg-[#0066CC] hover:bg-blue-700 text-white text-xs h-8">
                                                Proses
                                            </Button>
                                        </Link>
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