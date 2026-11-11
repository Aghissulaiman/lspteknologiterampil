"use client";

import React, { useCallback, useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, CheckCircle2, FileText, Loader2, Trash2, Upload, ExternalLink, ArrowRight } from "lucide-react";

type StoredDoc = {
    id: string;
    document_type: string;
    category: string;
    original_name: string;
    mime_type: string;
    size_bytes: number;
    created_at: string;
};

type CompetencyUnit = {
    id: string;
    code: string;
    title: string;
};

type DocumentRequirement = {
    code: string;
    label: string;
    category: string;
    is_required: boolean;
};

type Apl02UnitResult = {
    unit_id: string;
    unit_code: string;
    unit_title: string;
    self_assessment: "competent" | "not_competent";
    notes: string;
};

type ApplicationData = {
    id: string;
    scheme_id: string;
    scheme_code: string;
    scheme_name: string;
    status: string;
    starts_at: string;
    ends_at: string;
    test_site_name: string;
    documents: StoredDoc[];
    apl02: Apl02UnitResult[];
};

function AplContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const queryAppId = searchParams?.get("applicationId");

    const [applicationId, setApplicationId] = useState<string | null>(queryAppId || null);
    const [appData, setAppData] = useState<ApplicationData | null>(null);
    const [docRequirements, setDocRequirements] = useState<DocumentRequirement[]>([]);
    const [units, setUnits] = useState<CompetencyUnit[]>([]);

    // State asesmen mandiri per unit (unitId -> { selfAssessment, notes })
    const [selfAssessments, setSelfAssessments] = useState<
        Record<string, { selfAssessment: "competent" | "not_competent"; notes: string }>
    >({});

    const [loading, setLoading] = useState(true);
    const [uploadingDocType, setUploadingDocType] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [savingDraft, setSavingDraft] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successNotice, setSuccessNotice] = useState("");

    // 1. Cari atau validasi applicationId
    useEffect(() => {
        let active = true;

        async function resolveApplication() {
            setLoading(true);
            setErrorMessage("");
            try {
                let targetId = queryAppId;

                // Jika tidak ada di query, cari dari daftar aplikasi user
                if (!targetId) {
                    const listRes = await fetch("/api/applications", { cache: "no-store" });
                    if (!listRes.ok) throw new Error("Gagal memeriksa permohonan sertifikasi.");
                    const listData = await listRes.json();
                    const apps = listData?.applications || [];

                    // Cari yang draft atau revision_required
                    const draftApp = apps.find((a: { status: string }) => a.status === "draft" || a.status === "revision_required") || apps[0];
                    if (draftApp) {
                        targetId = draftApp.id;
                    }
                }

                if (!targetId) {
                    // Belum ada aplikasi sama sekali -> arahkan ke pemilihan skema
                    router.push("/dashboard/skema");
                    return;
                }

                if (active) setApplicationId(targetId);

                // 2. Ambil detail aplikasi
                const appRes = await fetch(`/api/applications/${targetId}`, { cache: "no-store" });
                if (!appRes.ok) throw new Error("Permohonan sertifikasi tidak ditemukan.");
                const appDetail = (await appRes.json()).application as ApplicationData;

                if (!active) return;
                setAppData(appDetail);

                // 3. Ambil detail skema untuk mengetahui document requirements & competency units
                const schemeRes = await fetch(`/api/public/schemes/${appDetail.scheme_id}`, { cache: "no-store" });
                if (schemeRes.ok) {
                    const schemeData = (await schemeRes.json()).scheme;
                    if (active) {
                        setDocRequirements(schemeData.documentRequirements || []);
                        const unitList = schemeData.competencyUnits || [];
                        setUnits(unitList);

                        // Inisialisasi state asesmen mandiri
                        const initialAssessment: Record<string, { selfAssessment: "competent" | "not_competent"; notes: string }> = {};
                        for (const u of unitList) {
                            const existing = appDetail.apl02?.find((row) => row.unit_id === u.id);
                            initialAssessment[u.id] = {
                                selfAssessment: existing?.self_assessment || "competent",
                                notes: existing?.notes || "",
                            };
                        }
                        setSelfAssessments(initialAssessment);
                    }
                }
            } catch (err) {
                if (active) setErrorMessage(err instanceof Error ? err.message : "Terjadi kesalahan.");
            } finally {
                if (active) setLoading(false);
            }
        }

        void resolveApplication();
        return () => {
            active = false;
        };
    }, [queryAppId, router]);

    // Handle upload berkas fisik multipart
    const handleFileUpload = async (documentType: string, file: File) => {
        if (!applicationId) return;
        setUploadingDocType(documentType);
        setErrorMessage("");
        setSuccessNotice("");

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("documentType", documentType);

            const res = await fetch(`/api/applications/${applicationId}/documents`, {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Gagal mengunggah berkas.");

            // Refresh data dokumen aplikasi
            const appRes = await fetch(`/api/applications/${applicationId}`, { cache: "no-store" });
            if (appRes.ok) {
                const refreshed = (await appRes.json()).application as ApplicationData;
                setAppData(refreshed);
                setSuccessNotice(`Berkas "${file.name}" berhasil diunggah.`);
            }
        } catch (err) {
            setErrorMessage(err instanceof Error ? err.message : "Gagal mengunggah berkas.");
        } finally {
            setUploadingDocType(null);
        }
    };

    // Handle hapus berkas
    const handleDeleteDocument = async (docId: string) => {
        if (!applicationId) return;
        if (!confirm("Apakah Anda yakin ingin menghapus dokumen ini?")) return;

        setErrorMessage("");
        try {
            const res = await fetch(`/api/applications/${applicationId}/documents/${docId}`, {
                method: "DELETE",
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Gagal menghapus dokumen.");
            }

            // Refresh data
            const appRes = await fetch(`/api/applications/${applicationId}`, { cache: "no-store" });
            if (appRes.ok) {
                const refreshed = (await appRes.json()).application as ApplicationData;
                setAppData(refreshed);
            }
        } catch (err) {
            setErrorMessage(err instanceof Error ? err.message : "Gagal menghapus dokumen.");
        }
    };

    // Simpan asesmen mandiri APL-02 (PUT /api/applications/:id/apl02)
    const saveApl02 = async () => {
        if (!applicationId) return;
        const payload = {
            units: Object.entries(selfAssessments).map(([unitId, val]) => ({
                unitId,
                selfAssessment: val.selfAssessment,
                notes: val.notes,
            })),
        };

        const res = await fetch(`/api/applications/${applicationId}/apl02`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error || "Gagal menyimpan asesmen mandiri.");
        }
    };

    const handleSaveDraft = async () => {
        setSavingDraft(true);
        setErrorMessage("");
        setSuccessNotice("");
        try {
            await saveApl02();
            setSuccessNotice("Draf asesmen mandiri berhasil disimpan.");
        } catch (err) {
            setErrorMessage(err instanceof Error ? err.message : "Gagal menyimpan draf.");
        } finally {
            setSavingDraft(false);
        }
    };

    // Final submit permohonan
    const handleSubmitApplication = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!applicationId) return;

        setSubmitting(true);
        setErrorMessage("");
        setSuccessNotice("");

        try {
            // 1. Simpan APL-02 terlebih dahulu
            await saveApl02();

            // 2. Submit permohonan secara resmi
            const res = await fetch(`/api/applications/${applicationId}/submit`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Gagal mengirim permohonan sertifikasi.");
            }

            // Sukses -> alihkan ke halaman status
            router.push("/dashboard/status");
        } catch (err) {
            setErrorMessage(err instanceof Error ? err.message : "Terjadi kesalahan pengiriman permohonan.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="py-24 text-center space-y-3 font-sans">
                <Loader2 className="w-8 h-8 text-[#0070BA] animate-spin mx-auto" />
                <p className="text-sm text-slate-500">Memuat formulir APL-01 & APL-02...</p>
            </div>
        );
    }

    if (!appData) {
        return (
            <div className="py-20 text-center space-y-4 font-sans">
                <p className="text-sm text-red-500">Permohonan tidak ditemukan.</p>
                <button type="button" onClick={() => router.push("/dashboard/skema")} className="apl-button">
                    Kembali ke Skema
                </button>
            </div>
        );
    }

    const uploadedDocs = appData.documents || [];

    return (
        <form onSubmit={handleSubmitApplication} className="space-y-8 font-sans">
            {/* Header Ringkasan Skema */}
            <div className="bg-white dark:bg-[#0B192C] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div>
                        <span className="apl-badge-blue">Tahap 03 • Formulir APL-01 & APL-02</span>
                        <h2 className="text-xl sm:text-2xl font-bold text-[#1a2b4c] dark:text-white mt-1">
                            Kelengkapan Berkas & Asesmen Mandiri
                        </h2>
                    </div>
                    <div className="px-3.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-[#0070BA] dark:text-blue-400 font-mono text-xs font-bold border border-blue-100 dark:border-blue-800/50 self-start sm:self-auto">
                        {appData.scheme_code}
                    </div>
                </div>

                <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                        <span className="text-slate-400 font-semibold uppercase tracking-wider block mb-0.5">Skema Sertifikasi</span>
                        <p className="font-bold text-slate-700 dark:text-slate-200">{appData.scheme_name}</p>
                    </div>
                    <div>
                        <span className="text-slate-400 font-semibold uppercase tracking-wider block mb-0.5">Lokasi TUK Uji</span>
                        <p className="font-bold text-slate-700 dark:text-slate-200">{appData.test_site_name}</p>
                    </div>
                    <div>
                        <span className="text-slate-400 font-semibold uppercase tracking-wider block mb-0.5">Status Permohonan</span>
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 font-bold uppercase text-[10px]">
                            {appData.status}
                        </span>
                    </div>
                </div>
            </div>

            {/* Alert Notifikasi */}
            {errorMessage && (
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                </div>
            )}
            {successNotice && (
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{successNotice}</span>
                </div>
            )}

            {/* BAGIAN 1: FR.APL-01 UNGGAH DOKUMEN PERSYARATAN */}
            <div className="apl-section-box">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                    <span className="apl-badge-blue">Bagian 1 • FR.APL-01</span>
                    <h3 className="text-xl font-bold text-[#1a2b4c] dark:text-white mt-1">
                        Unggah Dokumen <span className="text-[#0070BA] dark:text-blue-400">Persyaratan</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                        Unggah dokumen asli berupa file PDF, JPG, atau PNG (maksimal 2MB per berkas). Dokumen wajib bertanda bintang (*).
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                    {docRequirements.map((req) => {
                        const existingDoc = uploadedDocs.find((d) => d.document_type === req.code);
                        const isUploading = uploadingDocType === req.code;

                        return (
                            <div key={req.code} className="apl-file-box flex flex-col justify-between">
                                <div>
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                        <p className="font-bold text-xs text-[#1a2b4c] dark:text-white">
                                            {req.label} {req.is_required && <span className="text-red-500">*</span>}
                                        </p>
                                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-semibold uppercase">
                                            {req.category}
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-slate-400 mb-3">Format PDF, JPG, PNG (Maks 2MB)</p>
                                </div>

                                {existingDoc ? (
                                    <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 truncate">
                                                {existingDoc.original_name}
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteDocument(existingDoc.id)}
                                            className="p-1.5 rounded-lg text-red-500 hover:bg-red-100 dark:hover:bg-red-950 transition cursor-pointer"
                                            title="Hapus Dokumen"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <label className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[#0070BA] hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer transition">
                                            {isUploading ? (
                                                <>
                                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                    <span>Mengunggah...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Upload className="w-3.5 h-3.5" />
                                                    <span>Pilih Berkas</span>
                                                </>
                                            )}
                                            <input
                                                type="file"
                                                accept=".pdf,image/jpeg,image/png"
                                                disabled={isUploading}
                                                className="hidden"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) void handleFileUpload(req.code, file);
                                                }}
                                            />
                                        </label>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* BAGIAN 2: FR.APL-02 ASESMEN MANDIRI */}
            <div className="apl-section-box">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                    <span className="apl-badge-amber">Bagian 2 • FR.APL-02</span>
                    <h3 className="text-xl font-bold text-[#1a2b4c] dark:text-white mt-1">
                        Asesmen Mandiri <span className="text-[#0070BA] dark:text-blue-400">Unit Kompetensi</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                        Lakukan asesmen mandiri terhadap seluruh unit kompetensi SKKNI. Pilih <b>K (Kompeten)</b> jika Anda mampu dan memiliki bukti relevan, atau <b>BK (Belum Kompeten)</b>.
                    </p>
                </div>

                <div className="overflow-x-auto pt-2">
                    <table className="apl-table">
                        <thead>
                            <tr className="apl-table-head">
                                <th className="py-3 px-4">Kode & Judul Unit SKKNI</th>
                                <th className="py-3 px-4 text-center w-40">Penilaian Mandiri</th>
                                <th className="py-3 px-4 w-72">Bukti Portofolio / Catatan</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                            {units.map((unit) => {
                                const state = selfAssessments[unit.id] || { selfAssessment: "competent", notes: "" };

                                return (
                                    <tr key={unit.id} className="apl-table-row">
                                        <td className="py-4 px-4 align-top">
                                            <p className="font-mono font-bold text-[#0070BA] dark:text-blue-400">{unit.code}</p>
                                            <p className="font-medium text-slate-700 dark:text-slate-200 mt-0.5">{unit.title}</p>
                                        </td>
                                        <td className="py-4 px-4 align-top">
                                            <div className="flex items-center justify-center gap-4 bg-slate-50 dark:bg-slate-900/60 p-2 rounded-xl border border-slate-200 dark:border-slate-800">
                                                <label className="flex items-center gap-1.5 cursor-pointer font-bold text-xs text-emerald-600">
                                                    <input
                                                        type="radio"
                                                        name={`assessment_${unit.id}`}
                                                        value="competent"
                                                        checked={state.selfAssessment === "competent"}
                                                        onChange={() =>
                                                            setSelfAssessments((prev) => ({
                                                                ...prev,
                                                                [unit.id]: { ...state, selfAssessment: "competent" },
                                                            }))
                                                        }
                                                        className="accent-emerald-600"
                                                    />
                                                    K
                                                </label>
                                                <span className="text-slate-300">|</span>
                                                <label className="flex items-center gap-1.5 cursor-pointer font-bold text-xs text-amber-600">
                                                    <input
                                                        type="radio"
                                                        name={`assessment_${unit.id}`}
                                                        value="not_competent"
                                                        checked={state.selfAssessment === "not_competent"}
                                                        onChange={() =>
                                                            setSelfAssessments((prev) => ({
                                                                ...prev,
                                                                [unit.id]: { ...state, selfAssessment: "not_competent" },
                                                            }))
                                                        }
                                                        className="accent-amber-600"
                                                    />
                                                    BK
                                                </label>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 align-top">
                                            <input
                                                type="text"
                                                placeholder="Contoh: Sertifikat / Hasil Proyek Lab"
                                                value={state.notes}
                                                onChange={(e) =>
                                                    setSelfAssessments((prev) => ({
                                                        ...prev,
                                                        [unit.id]: { ...state, notes: e.target.value },
                                                    }))
                                                }
                                                className="apl-input-sm"
                                            />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                    type="button"
                    onClick={handleSaveDraft}
                    disabled={savingDraft || submitting}
                    className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                    {savingDraft ? "Menyimpan..." : "Simpan Draf Terlebih Dahulu"}
                </button>

                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#0070BA] hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition cursor-pointer disabled:opacity-50"
                >
                    {submitting ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Mengirim Permohonan...</span>
                        </>
                    ) : (
                        <>
                            <span>Kirim Permohonan Sertifikasi Resmi</span>
                            <ArrowRight className="w-4 h-4" />
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}

export default function AplPage() {
    return (
        <Suspense fallback={<div className="py-20 text-center text-xs text-slate-400">Memuat formulir...</div>}>
            <AplContent />
        </Suspense>
    );
}
