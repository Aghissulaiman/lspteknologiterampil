"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Search, ShieldCheck, UserCheck, RefreshCw } from "lucide-react";

type AuditLogItem = {
    id: string;
    actor_id: string | null;
    actor_role: string | null;
    action: string;
    entity_type: string;
    entity_id: string | null;
    details: Record<string, unknown>;
    created_at: string;
};

export default function AuditLogPage() {
    const [logs, setLogs] = useState<AuditLogItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/audit-logs", { cache: "no-store" });
            if (res.ok) {
                const data = await res.json();
                setLogs(data.auditLogs || []);
            }
        } catch (err) {
            console.error("Gagal memuat audit log:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void fetchLogs();
    }, []);

    const filteredLogs = logs.filter((item) => {
        const text = `${item.action} ${item.entity_type} ${item.actor_role || ""} ${JSON.stringify(item.details)}`.toLowerCase();
        return text.includes(searchTerm.toLowerCase());
    });

    return (
        <div className="space-y-8 font-sans pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Halaman */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#0A1D37] dark:text-white font-serif">
                        Audit Log Aktivitas Sistem
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">
                        Rekaman jejak digital seluruh tindakan pengguna dan administrator di dalam sistem LSP.
                    </p>
                </div>

                <Button
                    onClick={fetchLogs}
                    variant="outline"
                    size="sm"
                    className="border-slate-200 dark:border-slate-700 h-9 text-xs"
                >
                    <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} /> Segarkan
                </Button>
            </div>

            {/* Kartu Informasi Keamanan */}
            <div className="bg-white dark:bg-[#0B192C] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-[#0066CC] flex items-center justify-center shrink-0">
                        <ShieldAlert className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-lg font-bold text-[#0A1D37] dark:text-white">Penyimpanan Log Aman & Enkripsi</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Data audit bersifat permanen dan otomatis tercatat oleh sistem backend PostgreSQL.
                        </p>
                    </div>
                </div>
                <div className="hidden sm:block">
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 text-xs font-semibold">
                        <ShieldCheck className="w-4 h-4" /> Sistem Terlindungi
                    </span>
                </div>
            </div>

            {/* Tabel & Filter Search */}
            <div className="bg-white dark:bg-[#0B192C] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-bold text-[#0A1D37] dark:text-white">Riwayat Tindakan Otentik</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Menampilkan riwayat aktivitas real-time dari database.
                        </p>
                    </div>

                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Cari aksi / role / entitas..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-[#F8FAFC] dark:bg-[#071120] border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:border-[#0066CC] text-[#0A1D37] dark:text-white"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="py-16 text-center text-xs text-slate-400">Memuat riwayat log...</div>
                ) : filteredLogs.length === 0 ? (
                    <div className="py-16 text-center text-xs text-slate-400">Belum ada riwayat aktivitas yang tercatat.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-[#F8FAFC] dark:bg-[#071120] text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 text-xs">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Waktu Sistem</th>
                                    <th className="px-6 py-4 font-semibold">Peran Aktor</th>
                                    <th className="px-6 py-4 font-semibold">Aksi Sistem</th>
                                    <th className="px-6 py-4 font-semibold">Tipe Entitas</th>
                                    <th className="px-6 py-4 font-semibold text-right">Rincian JSON</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                                {filteredLogs.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                                        <td className="px-6 py-4 font-mono text-slate-500 dark:text-slate-400">
                                            {new Intl.DateTimeFormat("id-ID", {
                                                dateStyle: "medium",
                                                timeStyle: "medium",
                                            }).format(new Date(item.created_at))}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                                {item.actor_role || "Sistem"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-[#0066CC] dark:text-blue-400 font-mono">
                                            {item.action}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300">
                                            {item.entity_type} {item.entity_id ? `(${item.entity_id.slice(0, 8)}...)` : ""}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="font-mono text-[10px] text-slate-400 truncate max-w-xs inline-block" title={JSON.stringify(item.details)}>
                                                {JSON.stringify(item.details)}
                                            </span>
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
