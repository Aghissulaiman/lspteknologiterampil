"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Calendar, CheckCircle2, Clock, FileCode2, FileText, Info, MapPin, ShieldCheck, Users } from "lucide-react";

type CompetencyUnit = {
    id: string;
    code: string;
    title: string;
    sort_order: number;
};

type DocumentRequirement = {
    code: string;
    label: string;
    category: string;
    is_required: boolean;
};

type SchemeDetail = {
    id: string;
    code: string;
    name: string;
    category: string;
    level: string;
    description: string;
    requirements: {
        type?: string;
        method?: string;
        price?: string;
        rating?: number;
        reviewCount?: number;
        asesiCount?: number;
        image?: string;
        nomorSkema?: string;
        masaBerlaku?: string;
    };
    competencyUnits?: CompetencyUnit[];
    documentRequirements?: DocumentRequirement[];
};

type ScheduleItem = {
    id: string;
    scheme_id: string;
    test_site_id: string;
    starts_at: string;
    ends_at: string;
    capacity: number;
    available_slots: number;
    test_site_name: string;
    test_site_address: string;
    test_site_type: string;
};

function formatScheduleDate(dateString: string) {
    try {
        const d = new Date(dateString);
        return new Intl.DateTimeFormat("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "short",
            year: "numeric",
        }).format(d);
    } catch {
        return dateString;
    }
}

function formatScheduleTime(dateString: string) {
    try {
        const d = new Date(dateString);
        return new Intl.DateTimeFormat("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        }).format(d) + " WIB";
    } catch {
        return "";
    }
}

export default function DetailSkemaPage() {
    const router = useRouter();
    const params = useParams();
    const schemeId = params?.id as string;

    const [scheme, setScheme] = useState<SchemeDetail | null>(null);
    const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
    const [selectedScheduleId, setSelectedScheduleId] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!schemeId) return;
        let active = true;

        async function loadData() {
            setLoading(true);
            setError("");
            try {
                // 1. Ambil detail skema
                const schemeRes = await fetch(`/api/public/schemes/${schemeId}`, { cache: "no-store" });
                if (!schemeRes.ok) throw new Error("Skema sertifikasi tidak ditemukan.");
                const schemeData = await schemeRes.json();
                const currentScheme = schemeData.scheme as SchemeDetail;

                if (!active) return;
                setScheme(currentScheme);

                // 2. Ambil jadwal ujian aktif untuk skema ini
                const schedRes = await fetch(`/api/applications/schedules?schemeId=${currentScheme.id}`, { cache: "no-store" });
                if (schedRes.ok) {
                    const schedData = await schedRes.json();
                    const availableSchedules = (schedData.schedules || []) as ScheduleItem[];
                    if (active) {
                        setSchedules(availableSchedules);
                        if (availableSchedules.length > 0) {
                            setSelectedScheduleId(availableSchedules[0].id);
                        }
                    }
                }
            } catch (err) {
                if (active) setError(err instanceof Error ? err.message : "Gagal memuat detail skema.");
            } finally {
                if (active) setLoading(false);
            }
        }

        void loadData();
        return () => {
            active = false;
        };
    }, [schemeId]);

    const handleLanjutAPL = async () => {
        if (!scheme) return;
        if (!selectedScheduleId) {
            alert("Silakan pilih salah satu jadwal asesmen uji kompetensi!");
            return;
        }

        setSubmitting(true);
        try {
            // Ambil draf APL-01 dari localStorage jika ada
            let apl01Draft: Record<string, unknown> = {};
            const localData = localStorage.getItem("apl01_draft");
            if (localData) {
                try {
                    const parsed = JSON.parse(localData) as Record<string, unknown>;
                    // Normalisasi field: pastikan menggunakan nama field yang sesuai dengan backend
                    apl01Draft = {
                        ...parsed,
                        // Mapping field lama -> field baru yang dikenali backend
                        educationLevel: parsed.educationLevel || parsed.education || "",
                        institution: parsed.institution || parsed.schoolName || "",
                        studyProgram: parsed.studyProgram || parsed.major || "",
                        employment: parsed.employment || (
                            parsed.jobStatus === "Bekerja"
                                ? `${String(parsed.jobTitle || "")} di ${String(parsed.companyName || "")}`.trim()
                                : String(parsed.jobStatus || "")
                        ),
                    };
                } catch {}
            }

            // Simpan atau inisiasi permohonan sertifikasi baru di backend
            const response = await fetch("/api/applications", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    schemeId: scheme.id,
                    scheduleId: selectedScheduleId,
                    apl01: apl01Draft,
                }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "Gagal membuat permohonan sertifikasi.");
            }

            const appId = data.application?.id;
            // Navigasi ke tahap pembayaran pendaftaran skema
            router.push(`/dashboard/pembayaran?applicationId=${appId}`);
        } catch (err) {
            alert(err instanceof Error ? err.message : "Terjadi kesalahan saat memproses permohonan.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="py-24 text-center space-y-3 font-sans">
                <div className="inline-block w-8 h-8 border-4 border-[#0070BA] border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-slate-500">Memuat detail skema dan jadwal asesmen...</p>
            </div>
        );
    }

    if (error || !scheme) {
        return (
            <div className="text-center py-20 space-y-4 font-sans">
                <h2 className="text-xl font-bold text-slate-700 dark:text-white">Skema Tidak Ditemukan</h2>
                <p className="text-sm text-slate-500">{error || "Informasi skema sertifikasi tidak dapat ditemukan."}</p>
                <button
                    type="button"
                    onClick={() => router.push("/dashboard/skema")}
                    className="apl-button inline-block"
                >
                    ← Kembali ke Katalog Skema
                </button>
            </div>
        );
    }

    const reqs = scheme.requirements || {};

    return (
        <div className="font-sans space-y-6">
            <button
                type="button"
                onClick={() => router.push("/dashboard/skema")}
                className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-[#0070BA] transition"
            >
                <ArrowLeft className="w-4 h-4" /> Kembali ke Katalog Skema
            </button>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Kolom Kiri: Info Utama, Persyaratan, & Unit SKKNI */}
                <div className="flex-1 space-y-6 min-w-0">
                    {/* Header Skema */}
                    <div className="bg-white dark:bg-[#0B192C] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
                        <div className="flex flex-wrap items-center gap-2.5 mb-4">
                            <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-[#0070BA] dark:text-blue-400 text-xs font-bold font-mono">
                                {scheme.code}
                            </span>
                            <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium">
                                {scheme.level || "Level 3"}
                            </span>
                            {reqs.nomorSkema && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 dark:bg-slate-900 text-slate-500 text-xs border border-slate-200 dark:border-slate-700 font-mono">
                                    <FileCode2 className="h-3.5 w-3.5" />
                                    {reqs.nomorSkema}
                                </span>
                            )}
                        </div>

                        <h2 className="text-2xl sm:text-3xl font-bold text-[#1a2b4c] dark:text-white mb-3">
                            {scheme.name}
                        </h2>

                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                            {scheme.description}
                        </p>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-100 dark:border-slate-800 pt-6">
                            <div>
                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">JENIS SKEMA</p>
                                <p className="font-semibold text-sm text-[#1a2b4c] dark:text-white">{reqs.type || "Okupasi"}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">METODE UJI</p>
                                <p className="font-semibold text-sm text-[#1a2b4c] dark:text-white">{reqs.method || "Tatap Muka"}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">MASA BERLAKU</p>
                                <p className="font-semibold text-sm text-[#1a2b4c] dark:text-white">{reqs.masaBerlaku || "3 Tahun"}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">BIAYA UJI</p>
                                <p className="font-semibold text-sm text-[#0070BA] dark:text-blue-400">{reqs.price || "Gratis / APBN"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Dokumen Persyaratan Pendaftaran */}
                    {scheme.documentRequirements && scheme.documentRequirements.length > 0 && (
                        <div className="bg-white dark:bg-[#0B192C] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
                            <h3 className="text-lg font-bold text-[#1a2b4c] dark:text-white mb-4 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-[#0070BA]" />
                                Berkas Persyaratan Permohonan (FR.APL.01)
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {scheme.documentRequirements.map((doc) => (
                                    <div
                                        key={doc.code}
                                        className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-start gap-3"
                                    >
                                        <span className="w-5 h-5 rounded-full bg-blue-100 text-[#0070BA] flex items-center justify-center shrink-0 text-xs font-bold">
                                            ✓
                                        </span>
                                        <div>
                                            <p className="text-xs font-semibold text-[#1a2b4c] dark:text-white">
                                                {doc.label}
                                            </p>
                                            <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                                {doc.is_required ? "Wajib" : "Pendukung"}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Daftar Unit Kompetensi SKKNI */}
                    {scheme.competencyUnits && scheme.competencyUnits.length > 0 && (
                        <div className="bg-white dark:bg-[#0B192C] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold text-[#1a2b4c] dark:text-white flex items-center gap-2">
                                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                                    Daftar Unit Kompetensi (SKKNI)
                                </h3>
                                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
                                    {scheme.competencyUnits.length} Unit
                                </span>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold uppercase text-slate-400">
                                            <th className="py-2.5 px-3">No</th>
                                            <th className="py-2.5 px-3">Kode Unit</th>
                                            <th className="py-2.5 px-3">Judul Unit Kompetensi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                                        {scheme.competencyUnits.map((unit, idx) => (
                                            <tr key={unit.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                                                <td className="py-3 px-3 font-mono text-slate-400">{idx + 1}</td>
                                                <td className="py-3 px-3 font-mono font-semibold text-[#0070BA] dark:text-blue-400">{unit.code}</td>
                                                <td className="py-3 px-3 font-medium text-slate-700 dark:text-slate-200">{unit.title}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                {/* Kolom Kanan: Pilihan Jadwal Uji & CTA */}
                <div className="w-full lg:w-96 shrink-0 space-y-5 lg:sticky lg:top-28">
                    <div className="bg-white dark:bg-[#0B192C] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
                        <div>
                            <h3 className="font-bold text-base text-[#1a2b4c] dark:text-white">Pilih Jadwal Uji Asesmen</h3>
                            <p className="text-xs text-slate-500 mt-1">Pilih tanggal dan lokasi Tempat Uji Kompetensi (TUK) yang tersedia:</p>
                        </div>

                        {schedules.length === 0 ? (
                            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-amber-700 dark:text-amber-300 text-xs flex items-start gap-2">
                                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold">Belum Ada Jadwal Aktif</p>
                                    <p className="mt-0.5">Admin LSP belum membuka jadwal kuota asesmen baru untuk skema ini.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {schedules.map((item) => {
                                    const isSelected = selectedScheduleId === item.id;
                                    return (
                                        <label
                                            key={item.id}
                                            className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                                                isSelected
                                                    ? "border-[#0070BA] bg-blue-50/50 dark:bg-blue-950/30 ring-2 ring-[#0070BA]/20 shadow-sm"
                                                    : "border-slate-200 dark:border-slate-700 hover:border-blue-300 bg-white dark:bg-slate-900/50"
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="assessment_schedule"
                                                checked={isSelected}
                                                onChange={() => setSelectedScheduleId(item.id)}
                                                className="mt-1 accent-[#0070BA]"
                                            />
                                            <div className="space-y-1 min-w-0">
                                                <p className="font-bold text-xs text-[#1a2b4c] dark:text-white flex items-center gap-1.5">
                                                    <Calendar className="w-3.5 h-3.5 text-[#0070BA]" />
                                                    {formatScheduleDate(item.starts_at)}
                                                </p>
                                                <p className="text-[11px] text-slate-500 flex items-center gap-1">
                                                    <Clock className="w-3 h-3 text-slate-400" />
                                                    {formatScheduleTime(item.starts_at)} - {formatScheduleTime(item.ends_at)}
                                                </p>
                                                <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium flex items-center gap-1">
                                                    <MapPin className="w-3 h-3 text-red-500" />
                                                    <span className="truncate">{item.test_site_name}</span>
                                                </p>
                                                <div className="pt-1 flex items-center gap-2">
                                                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                                                        Sisa Kuota: {item.available_slots} / {item.capacity}
                                                    </span>
                                                </div>
                                            </div>
                                        </label>
                                    );
                                })}
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={handleLanjutAPL}
                            disabled={submitting || schedules.length === 0}
                            className="w-full py-3.5 rounded-xl bg-[#0070BA] hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center gap-2 transition shadow-md shadow-blue-600/20 cursor-pointer"
                        >
                            {submitting ? "Memproses Permohonan..." : "Lanjut ke Pembayaran Pendaftaran →"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
