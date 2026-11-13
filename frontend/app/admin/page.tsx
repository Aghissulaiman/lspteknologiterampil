"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Users, Clock, ClipboardList, BriefcaseBusiness, CreditCard, ArrowRight, Eye, CheckCircle2 } from "lucide-react";

type AppItem = {
    id: string;
    participant_name: string;
    scheme_name: string;
    status: string;
    submitted_at: string | null;
    created_at?: string;
};

export default function AdminDashboardPage() {
    const [stats, setStats] = useState({
        totalApplications: 0,
        pendingVerification: 0,
        pendingPayment: 0,
        activeSchemes: 0,
        totalAssessors: 0,
    });
    const [recentApplications, setRecentApplications] = useState<AppItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;

        async function fetchDashboardData() {
            try {
                const [appsRes, schemesRes, assessorsRes, paymentsRes] = await Promise.all([
                    fetch("/api/admin/applications", { cache: "no-store" }),
                    fetch("/api/public/schemes", { cache: "no-store" }),
                    fetch("/api/admin/assessors", { cache: "no-store" }),
                    fetch("/api/admin/payments?status=proof_uploaded", { cache: "no-store" }),
                ]);

                if (!active) return;

                let appList: AppItem[] = [];
                let schemesCount = 0;
                let assessorsCount = 0;
                let pendingPaymentsCount = 0;

                if (appsRes.ok) {
                    const data = await appsRes.json();
                    appList = data.applications || [];
                }

                if (schemesRes.ok) {
                    const data = await schemesRes.json();
                    schemesCount = (data.schemes || []).length;
                }

                if (assessorsRes.ok) {
                    const data = await assessorsRes.json();
                    assessorsCount = (data.assessors || []).length;
                }

                if (paymentsRes.ok) {
                    const data = await paymentsRes.json();
                    pendingPaymentsCount = (data.payments || []).length;
                }

                const pendingVerif = appList.filter((a) => a.status === "submitted").length;

                setStats({
                    totalApplications: appList.length,
                    pendingVerification: pendingVerif,
                    pendingPayment: pendingPaymentsCount,
                    activeSchemes: schemesCount,
                    totalAssessors: assessorsCount,
                });

                setRecentApplications(appList.slice(0, 5));
            } catch (err) {
                console.error("Gagal memuat metrik dashboard admin:", err);
            } finally {
                if (active) setLoading(false);
            }
        }

        void fetchDashboardData();
        return () => {
            active = false;
        };
    }, []);

    const statCards = [
        {
            label: "Verifikasi Pembayaran",
            value: stats.pendingPayment.toString(),
            desc: "Bukti transfer baru",
            icon: CreditCard,
            color: "text-amber-600",
            bg: "bg-amber-100 dark:bg-amber-900/30",
            href: "/admin/pembayaran",
        },
        {
            label: "Verifikasi APL Berkas",
            value: stats.pendingVerification.toString(),
            desc: "Permohonan APL masuk",
            icon: Clock,
            color: "text-[#0066CC]",
            bg: "bg-blue-100 dark:bg-blue-900/30",
            href: "/admin/verifikasi",
        },
        {
            label: "Total Skema Uji",
            value: stats.activeSchemes.toString(),
            desc: "Skema sertifikasi aktif",
            icon: ClipboardList,
            color: "text-emerald-600",
            bg: "bg-emerald-100 dark:bg-emerald-900/30",
            href: "/admin/skema-jadwal",
        },
        {
            label: "Asesor Terdaftar",
            value: stats.totalAssessors.toString(),
            desc: "Penguji resmi kompetensi",
            icon: BriefcaseBusiness,
            color: "text-purple-600",
            bg: "bg-purple-100 dark:bg-purple-900/30",
            href: "/admin/pengguna",
        },
    ];

    return (
        <div className="space-y-8 font-sans animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
            {/* Header */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#0A1D37] dark:text-white font-serif">
                    Dashboard Administrator
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">
                    Ringkasan operasional alur sertifikasi LSP Teknologi Terampil secara langsung.
                </p>
            </div>

            {/* Kartu Statistik */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <Link
                            key={i}
                            href={stat.href}
                            className="bg-white dark:bg-[#0B192C] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-transform hover:-translate-y-1 block"
                        >
                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${stat.bg} ${stat.color}`}>
                                <Icon className="w-6 h-6" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-3xl font-bold text-[#0A1D37] dark:text-white">{stat.value}</p>
                                <p className="text-xs font-bold text-slate-700 dark:text-slate-200 mt-0.5 truncate">{stat.label}</p>
                                <p className="text-[11px] text-slate-400 truncate">{stat.desc}</p>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Tabel Pendaftar Terbaru */}
            <div className="bg-white dark:bg-[#0B192C] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-bold text-[#0A1D37] dark:text-white">Permohonan Sertifikasi Terbaru</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Calon asesi yang mendaftar di sistem.</p>
                    </div>
                    <Link href="/admin/verifikasi">
                        <Button variant="outline" size="sm" className="text-xs font-bold text-[#0066CC] border-blue-200 hover:bg-blue-50 dark:border-slate-700 dark:text-blue-400 dark:hover:bg-slate-800">
                            Lihat Semua Berkas
                        </Button>
                    </Link>
                </div>

                {loading ? (
                    <div className="py-12 text-center text-xs text-slate-400">Memuat data terbaru...</div>
                ) : recentApplications.length === 0 ? (
                    <div className="py-12 text-center text-xs text-slate-400">Belum ada permohonan sertifikasi yang masuk.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-[#F8FAFC] dark:bg-[#071120] text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 text-xs">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Nama Peserta</th>
                                    <th className="px-6 py-4 font-semibold">Skema Sertifikasi</th>
                                    <th className="px-6 py-4 font-semibold">Status Alur</th>
                                    <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {recentApplications.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-[#0A1D37] dark:text-slate-200">{item.participant_name}</td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400 text-xs font-medium">{item.scheme_name}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#0066CC] dark:text-blue-300 text-[11px] font-bold uppercase">
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link href="/admin/verifikasi">
                                                <Button size="sm" variant="outline" className="text-xs h-8 border-slate-200 dark:border-slate-700">
                                                    <Eye className="w-3.5 h-3.5 mr-1" /> Cek
                                                </Button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
