"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Award,
    CheckCircle2,
    XCircle,
    FileText,
    Send,
    Eye,
    Clock,
    Search,
    ShieldCheck,
    Check,
    AlertCircle,
    UserCheck,
    Download,
    X
} from "lucide-react";
import Link from "next/link";

type ApplicationItem = {
    id: string;
    status: string;
    final_decision: string | null;
    participant_name: string;
    participant_nik: string;
    participant_phone: string;
    scheme_code: string;
    scheme_name: string;
    assessor_name: string | null;
    recommendation: string | null;
    submitted_at: string | null;
    updated_at: string;
};

type AppDetail = {
    application: Record<string, unknown>;
    certificate: {
        certificate_number: string;
        scheme_name: string;
        issued_at: string;
    } | null;
    assessment: {
        assessor_name?: string;
        recommendation?: string;
        recommendation_note?: string;
        assessment_notes?: string;
    } | null;
};

export default function HasilSertifikatPage() {
    const [applications, setApplications] = useState<ApplicationItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTab, setSelectedTab] = useState<string>("all");

    // Modal detail
    const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
    const [appDetail, setAppDetail] = useState<AppDetail | null>(null);
    const [detailLoading, setDetailLoading] = useState(false);

    const fetchApplications = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/admin/applications", { cache: "no-store" });
            if (!res.ok) throw new Error("Gagal memuat permohonan asesmen.");
            const data = await res.json();
            // Filter applications that have reached assessment stage or beyond
            const relevant = (data.applications || []).filter((app: ApplicationItem) =>
                ["assessment_completed", "competent", "not_competent", "certified", "assessment_scheduled"].includes(app.status)
            );
            setApplications(relevant);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Terjadi kesalahan saat memuat data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void fetchApplications();
    }, []);

    // View detail modal
    const handleViewDetail = async (id: string) => {
        setSelectedAppId(id);
        setDetailLoading(true);
        setAppDetail(null);
        try {
            const res = await fetch(`/api/admin/applications/${id}`, { cache: "no-store" });
            if (!res.ok) throw new Error("Gagal memuat detail kelulusan.");
            const data = await res.json();
            setAppDetail(data);
        } catch (err) {
            alert(err instanceof Error ? err.message : "Terjadi kesalahan.");
            setSelectedAppId(null);
        } finally {
            setDetailLoading(false);
        }
    };

    // Action: Set final decision (Kompeten / Belum Kompeten)
    const handleFinalDecision = async (id: string, decision: "competent" | "not_competent") => {
        const text = decision === "competent" ? "Kompeten (K)" : "Belum Kompeten (BK)";
        if (!confirm(`Apakah Anda yakin menetapkan keputusan pleno asesi ini sebagai: ${text}?`)) return;

        setProcessingId(id);
        try {
            const res = await fetch(`/api/admin/applications/${id}/final-decision`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ decision, note: `Keputusan Pleno LSP: ${text}` }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Gagal menetapkan keputusan akhir.");
            alert(`Keputusan pleno berhasil ditetapkan: ${text}`);
            await fetchApplications();
            if (selectedAppId === id) {
                await handleViewDetail(id);
            }
        } catch (err) {
            alert(err instanceof Error ? err.message : "Terjadi kesalahan.");
        } finally {
            setProcessingId(null);
        }
    };

    // Action: Issue certificate
    const handleIssueCertificate = async (id: string) => {
        if (!confirm("Terbitkan sertifikat resmi berlisensi BNSP untuk asesi ini?")) return;

        setProcessingId(id);
        try {
            const res = await fetch(`/api/admin/applications/${id}/issue-certificate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Gagal menerbitkan sertifikat.");
            alert(`Sertifikat berhasil diterbitkan dengan Nomor: ${data.certificate?.certificate_number}`);
            await fetchApplications();
            if (selectedAppId === id) {
                await handleViewDetail(id);
            }
        } catch (err) {
            alert(err instanceof Error ? err.message : "Terjadi kesalahan.");
        } finally {
            setProcessingId(null);
        }
    };

    // Filter logic
    const filtered = applications.filter((app) => {
        if (selectedTab === "need_pleno" && app.status !== "assessment_completed") return false;
        if (selectedTab === "need_cert" && app.status !== "competent") return false;
        if (selectedTab === "certified" && app.status !== "certified") return false;

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            const matchName = app.participant_name?.toLowerCase().includes(q);
            const matchNik = app.participant_nik?.toLowerCase().includes(q);
            const matchScheme = app.scheme_name?.toLowerCase().includes(q);
            const matchAssessor = app.assessor_name?.toLowerCase().includes(q);
            if (!matchName && !matchNik && !matchScheme && !matchAssessor) return false;
        }
        return true;
    });

    const needPlenoCount = applications.filter((a) => a.status === "assessment_completed").length;
    const needCertCount = applications.filter((a) => a.status === "competent").length;
    const certifiedCount = applications.filter((a) => a.status === "certified").length;

    return (
        <div className="space-y-8 font-sans pb-12 animate-in fade-in duration-300">
            {/* Header Halaman */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#0A1D37] dark:text-white font-serif">
                        Hasil Asesmen & Penerbitan Sertifikat
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Keputusan akhir pleno verifikasi rekomendasi asesor dan penerbitan nomor registrasi sertifikat BNSP.
                    </p>
                </div>

                <Button
                    onClick={fetchApplications}
                    variant="outline"
                    size="sm"
                    className="border-slate-200 dark:border-slate-700 h-9 text-xs"
                >
                    Segarkan Data
                </Button>
            </div>

            {error && (
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <p>{error}</p>
                </div>
            )}

            {/* Kartu Ringkasan Statistik */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div
                    onClick={() => setSelectedTab("need_pleno")}
                    className={`p-5 rounded-2xl border transition cursor-pointer ${
                        selectedTab === "need_pleno"
                            ? "bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 ring-2 ring-amber-400"
                            : "bg-white dark:bg-[#0B192C] border-slate-200 dark:border-slate-800 shadow-sm hover:border-amber-300"
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                            Menunggu Keputusan Pleno
                        </span>
                        <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-600 flex items-center justify-center">
                            <Clock className="w-4 h-4" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-[#0A1D37] dark:text-white mt-2">{needPlenoCount}</p>
                    <p className="text-[11px] text-slate-400 mt-1">Asesor telah selesai menguji</p>
                </div>

                <div
                    onClick={() => setSelectedTab("need_cert")}
                    className={`p-5 rounded-2xl border transition cursor-pointer ${
                        selectedTab === "need_cert"
                            ? "bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-700 ring-2 ring-blue-400"
                            : "bg-white dark:bg-[#0B192C] border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-300"
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#0066CC] dark:text-blue-400 uppercase tracking-wider">
                            Kompeten (Siap Terbit)
                        </span>
                        <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-[#0066CC] flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-[#0A1D37] dark:text-white mt-2">{needCertCount}</p>
                    <p className="text-[11px] text-slate-400 mt-1">Menunggu nomor sertifikat</p>
                </div>

                <div
                    onClick={() => setSelectedTab("certified")}
                    className={`p-5 rounded-2xl border transition cursor-pointer ${
                        selectedTab === "certified"
                            ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 ring-2 ring-emerald-400"
                            : "bg-white dark:bg-[#0B192C] border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-300"
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                            Sertifikat Diterbitkan
                        </span>
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 flex items-center justify-center">
                            <Award className="w-4 h-4" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-[#0A1D37] dark:text-white mt-2">{certifiedCount}</p>
                    <p className="text-[11px] text-slate-400 mt-1">Sertifikat resmi aktif</p>
                </div>
            </div>

            {/* TABEL HASIL ASESMEN */}
            <div className="bg-white dark:bg-[#0B192C] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-500 uppercase mr-1">Filter:</span>
                        {[
                            { key: "all", label: "Semua Hasil" },
                            { key: "need_pleno", label: `Perlu Pleno (${needPlenoCount})` },
                            { key: "need_cert", label: `Siap Terbit (${needCertCount})` },
                            { key: "certified", label: `Sudah Terbit (${certifiedCount})` },
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setSelectedTab(tab.key)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                                    selectedTab === tab.key
                                        ? "bg-[#0066CC] text-white shadow-sm"
                                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full sm:w-64">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Cari nama / skema..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="py-20 text-center space-y-2">
                        <div className="inline-block w-8 h-8 border-4 border-[#0066CC] border-t-transparent rounded-full animate-spin" />
                        <p className="text-xs text-slate-500">Memuat hasil pleno asesmen...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="py-16 text-center text-slate-400 text-sm">
                        Tidak ada berkas yang sesuai dengan kriteria filter saat ini.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-[#F8FAFC] dark:bg-[#071120] text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 text-xs">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Nama Peserta & NIK</th>
                                    <th className="px-6 py-4 font-semibold">Skema Sertifikasi</th>
                                    <th className="px-6 py-4 font-semibold">Asesor Penguji</th>
                                    <th className="px-6 py-4 font-semibold">Rekomendasi Asesor</th>
                                    <th className="px-6 py-4 font-semibold">Keputusan Pleno</th>
                                    <th className="px-6 py-4 font-semibold text-right">Aksi Penerbitan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {filtered.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition">
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-[#0A1D37] dark:text-white">{item.participant_name}</p>
                                            <p className="text-xs text-slate-400 font-mono">NIK: {item.participant_nik || "—"}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-[10px] font-bold text-[#0066CC] bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded">
                                                {item.scheme_code}
                                            </span>
                                            <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 mt-1 max-w-xs">
                                                {item.scheme_name}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4 text-xs font-medium text-slate-700 dark:text-slate-300">
                                            {item.assessor_name || "—"}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.recommendation === "competent" ? (
                                                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                                                    Kompeten (K)
                                                </span>
                                            ) : item.recommendation === "not_competent" ? (
                                                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300">
                                                    Belum Kompeten (BK)
                                                </span>
                                            ) : (
                                                <span className="text-xs text-slate-400 italic">Sedang Berlangsung</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.status === "certified" ? (
                                                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                                                    Tersertifikasi
                                                </span>
                                            ) : item.final_decision === "competent" ? (
                                                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-[#0066CC] dark:bg-blue-950/40 dark:text-blue-300">
                                                    Kompeten
                                                </span>
                                            ) : item.final_decision === "not_competent" ? (
                                                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-50 text-red-600">
                                                    Belum Kompeten
                                                </span>
                                            ) : (
                                                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-600">
                                                    Menunggu Pleno
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <Button
                                                onClick={() => handleViewDetail(item.id)}
                                                variant="outline"
                                                size="sm"
                                                className="h-8 text-xs font-bold"
                                            >
                                                <Eye className="w-3.5 h-3.5 mr-1" /> Rincian
                                            </Button>

                                            {item.status === "assessment_completed" && (
                                                <>
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleFinalDecision(item.id, "competent")}
                                                        disabled={processingId === item.id}
                                                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8 font-bold"
                                                    >
                                                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Pleno K
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleFinalDecision(item.id, "not_competent")}
                                                        disabled={processingId === item.id}
                                                        className="bg-red-600 hover:bg-red-700 text-white text-xs h-8 font-bold"
                                                    >
                                                        <XCircle className="w-3.5 h-3.5 mr-1" /> BK
                                                    </Button>
                                                </>
                                            )}

                                            {item.status === "competent" && (
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleIssueCertificate(item.id)}
                                                    disabled={processingId === item.id}
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
                )}
            </div>

            {/* MODAL DETAIL KEPUTUSAN & SERTIFIKAT */}
            {selectedAppId && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-[#0B192C] rounded-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                            <h3 className="font-bold text-base text-[#0A1D37] dark:text-white flex items-center gap-2">
                                <Award className="w-5 h-5 text-[#0066CC]" />
                                Detail Pleno & Sertifikat Peserta
                            </h3>
                            <button
                                onClick={() => setSelectedAppId(null)}
                                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {detailLoading ? (
                            <div className="py-12 text-center space-y-2">
                                <div className="inline-block w-8 h-8 border-4 border-[#0066CC] border-t-transparent rounded-full animate-spin" />
                                <p className="text-xs text-slate-500">Memuat rincian pleno...</p>
                            </div>
                        ) : appDetail ? (
                            <div className="space-y-4 text-xs">
                                <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                                    <div>
                                        <span className="text-slate-400">Nama Asesi:</span>
                                        <p className="font-bold text-slate-800 dark:text-slate-200">
                                            {appDetail.application?.participant_name as string}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-slate-400">Skema:</span>
                                        <p className="font-bold text-slate-800 dark:text-slate-200">
                                            {appDetail.application?.scheme_name as string}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-slate-400">Asesor Penguji:</span>
                                        <p className="font-bold text-[#0066CC]">
                                            {appDetail.assessment?.assessor_name || "—"}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-slate-400">Rekomendasi Asesor:</span>
                                        <p className="font-bold text-emerald-600">
                                            {appDetail.assessment?.recommendation === "competent" ? "Kompeten (K)" : "Belum Kompeten"}
                                        </p>
                                    </div>
                                </div>

                                {appDetail.assessment?.assessment_notes && (
                                    <div className="p-3.5 rounded-xl bg-blue-50/50 dark:bg-slate-900/50 border border-blue-100 dark:border-slate-800">
                                        <p className="font-bold text-[#0066CC] mb-0.5">Catatan Pemeriksaan Asesor:</p>
                                        <p className="text-slate-700 dark:text-slate-300">{appDetail.assessment.assessment_notes}</p>
                                    </div>
                                )}

                                {appDetail.certificate ? (
                                    <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-2">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-200/60 dark:bg-emerald-900 px-2 py-0.5 rounded">
                                            Sertifikat Resmi Telah Diterbitkan
                                        </span>
                                        <div className="flex items-baseline justify-between pt-1">
                                            <div>
                                                <p className="font-mono text-base font-bold text-emerald-950 dark:text-emerald-100">
                                                    {appDetail.certificate.certificate_number}
                                                </p>
                                                <p className="text-[11px] text-slate-500 mt-0.5">
                                                    Tanggal Terbit: {new Intl.DateTimeFormat("id-ID", { dateStyle: "long" }).format(new Date(appDetail.certificate.issued_at))}
                                                </p>
                                            </div>
                                            <Link
                                                href={`/validasi-sertifikat?nomor=${appDetail.certificate.certificate_number}`}
                                                target="_blank"
                                                className="inline-flex items-center gap-1 text-xs font-bold text-[#0066CC] hover:underline"
                                            >
                                                Validasi Publik →
                                            </Link>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                                        <div>
                                            <p className="font-bold text-slate-800 dark:text-slate-200">Sertifikat Belum Diterbitkan</p>
                                            <p className="text-[11px] text-slate-400">
                                                {appDetail.application?.status === "competent"
                                                    ? "Asesi dinyatakan kompeten. Silakan terbitkan sertifikat."
                                                    : "Lakukan pleno kelulusan terlebih dahulu."}
                                            </p>
                                        </div>

                                        {appDetail.application?.status === "competent" && (
                                            <Button
                                                onClick={() => handleIssueCertificate(selectedAppId)}
                                                disabled={processingId === selectedAppId}
                                                className="bg-[#0066CC] hover:bg-blue-700 text-white text-xs font-bold h-8"
                                            >
                                                <Send className="w-3.5 h-3.5 mr-1" /> Terbitkan
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </div>
                        ) : null}

                        <div className="flex justify-end pt-2">
                            <Button
                                onClick={() => setSelectedAppId(null)}
                                variant="outline"
                                className="text-xs h-9"
                            >
                                Tutup
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
