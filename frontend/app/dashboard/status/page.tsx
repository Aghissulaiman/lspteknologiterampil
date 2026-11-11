"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Award, Calendar, CheckCircle2, Clock, ExternalLink, FileCheck, FileText, MapPin, Printer, ShieldCheck, UserCheck } from "lucide-react";

type UserData = {
    fullName: string;
    nik: string | null;
    email: string;
};

type CertificateData = {
    certificate_number: string;
    scheme_name: string;
    issued_at: string;
};

type ApplicationDetail = {
    id: string;
    status: string;
    scheme_code: string;
    scheme_name: string;
    starts_at: string;
    ends_at: string;
    test_site_name: string;
    test_site_address: string;
    final_decision: string | null;
    decision_note: string | null;
    submitted_at: string | null;
    certificate: CertificateData | null;
    apl01?: Record<string, string>;
};

function formatDateTime(dateString: string) {
    try {
        const d = new Date(dateString);
        return new Intl.DateTimeFormat("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(d) + " WIB";
    } catch {
        return dateString;
    }
}

export default function StatusPage() {
    const [user, setUser] = useState<UserData | null>(null);
    const [application, setApplication] = useState<ApplicationDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        async function loadStatus() {
            setLoading(true);
            setError("");
            try {
                // 1. Ambil data user
                const meRes = await fetch("/api/auth/me", { cache: "no-store" });
                if (meRes.ok) {
                    const meData = await meRes.json();
                    if (active && meData.user) {
                        setUser(meData.user);
                    }
                }

                // 2. Ambil daftar aplikasi user
                const listRes = await fetch("/api/applications", { cache: "no-store" });
                if (!listRes.ok) throw new Error("Gagal memeriksa status permohonan.");
                const listData = await listRes.json();
                const apps = listData?.applications || [];

                if (apps.length === 0) {
                    if (active) setApplication(null);
                    return;
                }

                // 3. Ambil detail aplikasi paling mutakhir
                const latest = apps[0];
                const detailRes = await fetch(`/api/applications/${latest.id}`, { cache: "no-store" });
                if (detailRes.ok) {
                    const detailData = await detailRes.json();
                    if (active) {
                        setApplication(detailData.application);
                    }
                }
            } catch (err) {
                if (active) setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
            } finally {
                if (active) setLoading(false);
            }
        }

        void loadStatus();
        return () => {
            active = false;
        };
    }, []);

    if (loading) {
        return (
            <div className="py-24 text-center space-y-3 font-sans">
                <div className="inline-block w-8 h-8 border-4 border-[#0070BA] border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-slate-500">Memeriksa status permohonan sertifikasi...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 text-sm font-sans">
                {error}
            </div>
        );
    }

    if (!application) {
        return (
            <div className="bg-white dark:bg-[#0B192C] rounded-2xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12 text-center space-y-4 font-sans">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-[#0070BA] flex items-center justify-center mx-auto">
                    <FileText className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-[#1a2b4c] dark:text-white">Belum Ada Permohonan Sertifikasi</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                    Anda belum memiliki pendaftaran sertifikasi aktif. Silakan pilih skema sertifikasi dan jadwal ujian yang tersedia untuk memulai.
                </p>
                <div className="pt-2">
                    <Link href="/dashboard/skema" className="apl-button inline-flex items-center gap-2">
                        Pilih Skema Sertifikasi →
                    </Link>
                </div>
            </div>
        );
    }

    const participantName = application.apl01?.fullName || user?.fullName || "Peserta Asesi";
    const participantNik = application.apl01?.nik || user?.nik || "—";
    const certNumber = application.certificate?.certificate_number;
    const isCertified = application.status === "certified" || application.status === "competent" || Boolean(certNumber);
    const isReadyOrVerified = ["verified", "assessment_scheduled", "assessment_completed", "competent", "certified"].includes(application.status);

    const getStatusInfo = (status: string) => {
        switch (status) {
            case "draft":
                return {
                    label: "Draf Permohonan",
                    desc: "Permohonan Anda masih berupa draf. Silakan lengkapi berkas persyaratan dan asesmen mandiri di formulir APL.",
                    color: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
                    action: (
                        <Link href={`/dashboard/apl?applicationId=${application.id}`} className="apl-button text-xs py-2 px-4 inline-block mt-3">
                            Lanjutkan Pengisian APL →
                        </Link>
                    ),
                };
            case "submitted":
                return {
                    label: "Menunggu Verifikasi Berkas",
                    desc: "Permohonan dan dokumen Anda telah berhasil dikirim ke Admin LSP Teknologi Terampil. Tim verifikator sedang memeriksa keabsahan berkas Anda.",
                    color: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200",
                };
            case "revision_required":
                return {
                    label: "Perlu Revisi Dokumen",
                    desc: application.decision_note ? `Catatan dari Admin: "${application.decision_note}"` : "Ada beberapa dokumen persyaratan yang perlu diperbaiki.",
                    color: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300 border border-red-200",
                    action: (
                        <Link href={`/dashboard/apl?applicationId=${application.id}`} className="apl-button text-xs py-2 px-4 inline-block mt-3 bg-red-600 hover:bg-red-700">
                            Perbaiki Dokumen Sekarang →
                        </Link>
                    ),
                };
            case "verified":
            case "assessment_scheduled":
                return {
                    label: "Siap Uji Kompetensi (Jadwal Terbit)",
                    desc: "Dokumen APL-01 & APL-02 Anda telah disetujui. Kartu Tanda Peserta Ujian resmi telah diterbitkan. Silakan hadir di TUK sesuai jadwal.",
                    color: "bg-blue-50 text-[#0070BA] dark:bg-blue-950 dark:text-blue-300 border border-blue-200",
                };
            case "assessment_completed":
                return {
                    label: "Asesmen Selesai • Pleno Komite",
                    desc: "Ujian asesmen telah selesai dilaksanakan oleh Asesor Penguji. Saat ini sedang menunggu sidang pleno pengesahan hasil oleh Komite LSP.",
                    color: "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border border-purple-200",
                };
            case "competent":
            case "certified":
                return {
                    label: "Dinyatakan KOMPETEN (Sertifikat Terbit)",
                    desc: "Selamat! Anda telah dinyatakan KOMPETEN dan sertifikat profesi BNSP resmi telah diterbitkan.",
                    color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200",
                };
            case "not_competent":
                return {
                    label: "Belum Kompeten",
                    desc: "Berdasarkan hasil uji kompetensi, Anda belum memenuhi kualifikasi yang disyaratkan. Anda dapat berkonsultasi dengan admin LSP untuk uji ulang.",
                    color: "bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300",
                };
            default:
                return {
                    label: status,
                    desc: "Status permohonan sedang diproses oleh sistem.",
                    color: "bg-slate-100 text-slate-700",
                };
        }
    };

    const statusInfo = getStatusInfo(application.status);

    return (
        <div className="space-y-6 font-sans">
            {/* Banner Status Terkini */}
            <div className={`p-6 rounded-2xl ${statusInfo.color} print:hidden`}>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div>
                        <span className="text-[10px] font-bold tracking-widest uppercase opacity-80 block mb-1">
                            Status Terkini • Tahap 04
                        </span>
                        <h3 className="text-xl font-bold">{statusInfo.label}</h3>
                        <p className="text-xs mt-1.5 opacity-90 max-w-2xl leading-relaxed">{statusInfo.desc}</p>
                        {statusInfo.action}
                    </div>
                    {isReadyOrVerified && (
                        <button
                            type="button"
                            onClick={() => window.print()}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-slate-800 hover:bg-slate-50 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700 text-xs font-bold shadow-sm transition self-start sm:self-auto cursor-pointer"
                        >
                            <Printer className="w-4 h-4 text-[#0070BA]" />
                            <span>Cetak Kartu Ujian</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Banner Sertifikat Resmi (Jika Lulus / Certified) */}
            {isCertified && certNumber && (
                <div className="status-cert-banner">
                    <div>
                        <span className="inline-block px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-[11px] font-semibold uppercase mb-2">
                            🏅 Sertifikat Kompetensi Resmi Diterbitkan
                        </span>
                        <h4 className="text-2xl font-bold">Selamat! Anda Dinyatakan Kompeten.</h4>
                        <p className="text-xs text-blue-100 mt-1 font-mono">No. Sertifikat: {certNumber}</p>
                        <p className="text-[11px] text-blue-200 mt-0.5">Skema: {application.scheme_name}</p>
                    </div>
                    <Link
                        href={`/informasi/verifikasi-sertifikat?cert=${encodeURIComponent(certNumber)}`}
                        className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-[#0A1D37] font-semibold text-xs shadow-sm transition-colors shrink-0"
                    >
                        Validasi Publik →
                    </Link>
                </div>
            )}

            {/* KARTU TANDA PESERTA UJI KOMPETENSI (RESMI PRINTABLE) */}
            <div className="status-card-box">
                {/* Header Kartu */}
                <div className="status-card-header">
                    <div>
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1">
                            Kartu Tanda Peserta Uji Kompetensi
                        </p>
                        <h3 className="text-xl font-bold text-[#1a2b4c] dark:text-white">LSP Teknologi Terampil</h3>
                        <p className="text-[10px] text-slate-400">Lisensi Resmi Badan Nasional Sertifikasi Profesi (BNSP)</p>
                    </div>
                    <div className="text-right">
                        <span className="font-mono text-xs text-[#0070BA] dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-lg border border-blue-100 dark:border-blue-800/50 block">
                            APL-{application.id.slice(0, 8).toUpperCase()}
                        </span>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                            Status: <b className="uppercase">{application.status}</b>
                        </span>
                    </div>
                </div>

                <div className="p-6 sm:p-9 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    {/* Kotak Foto & Verifikasi */}
                    <div className="status-photo-box">
                        <div className="w-28 h-36 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-xs text-slate-400 text-center shadow-sm p-2">
                            <span className="text-xl mb-1">👤</span>
                            <span>Pasfoto 3x4</span>
                        </div>
                        <span className="mt-3 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800 text-[11px] font-semibold">
                            {isReadyOrVerified ? "✓ TERVERIFIKASI" : "TERDAFTAR"}
                        </span>
                    </div>

                    {/* Detail Informasi Peserta & Jadwal */}
                    <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-4 text-sm">
                        <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Nama Lengkap Asesi</p>
                            <p className="font-bold text-base text-[#1a2b4c] dark:text-white">{participantName}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Nomor Induk Kependudukan (NIK)</p>
                            <p className="font-mono font-bold text-[#1a2b4c] dark:text-white">{participantNik}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Skema Sertifikasi</p>
                            <p className="font-semibold text-[#0070BA] dark:text-blue-400">
                                {application.scheme_name} ({application.scheme_code})
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Jadwal Pelaksanaan Uji</p>
                            <p className="font-medium text-[#1a2b4c] dark:text-white text-xs">
                                {formatDateTime(application.starts_at)}
                            </p>
                        </div>
                        <div className="sm:col-span-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Lokasi Tempat Uji Kompetensi (TUK)</p>
                            <p className="font-semibold text-[#1a2b4c] dark:text-white">
                                {application.test_site_name}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">{application.test_site_address}</p>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 flex justify-between items-center">
                    <span>* Harap membawa kartu ini beserta kartu identitas asli saat menghadiri asesmen di TUK.</span>
                    <span className="font-mono text-[10px]">Tgl Cetak: {new Date().toLocaleDateString("id-ID")}</span>
                </div>
            </div>
        </div>
    );
}
