"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    FileCheck,
    CheckCircle2,
    XCircle,
    Eye,
    Clock,
    Search,
    Filter,
    UserCheck,
    GraduationCap,
    Building2,
    Calendar,
    FileText,
    Download,
    X,
    AlertCircle,
    Check,
    ArrowRight
} from "lucide-react";

type ApplicationItem = {
    id: string;
    status: string;
    submitted_at: string | null;
    updated_at: string;
    final_decision: string | null;
    apl01?: {
        fullName?: string;
        nik?: string;
        educationLevel?: string;
        institution?: string;
        studyProgram?: string;
        employment?: string;
        phone?: string;
        email?: string;
        birthPlace?: string;
        birthDate?: string;
        address?: string;
    };
    participant_id: string;
    participant_name: string;
    participant_email: string;
    participant_nik: string;
    participant_phone: string;
    scheme_id: string;
    scheme_code: string;
    scheme_name: string;
    starts_at: string;
    ends_at: string;
    test_site_name: string;
    assessor_id: string | null;
    assessor_name: string | null;
    recommendation: string | null;
    payment_status: string | null;
};

type SchemeOption = {
    id: string;
    code: string;
    name: string;
};

type AssessorOption = {
    id: string;
    full_name: string;
    email: string;
    phone: string;
};

type ApplicationDetail = {
    application: Record<string, unknown>;
    documents: Array<{
        id: string;
        document_type: string;
        category: string;
        original_name: string;
        mime_type: string;
        size_bytes: number;
    }>;
    apl02: Array<{
        unit_id: string;
        code: string;
        title: string;
        self_assessment: string;
        notes: string;
        evidence: Array<{ id: string; originalName: string; documentType: string }>;
    }>;
    history: Array<{
        from_status: string;
        to_status: string;
        reason: string | null;
        created_at: string;
    }>;
    assessment: {
        assessor_id?: string;
        assessor_name?: string;
        recommendation?: string;
    } | null;
};

export default function VerifikasiAPLPage() {
    const [applications, setApplications] = useState<ApplicationItem[]>([]);
    const [schemes, setSchemes] = useState<SchemeOption[]>([]);
    const [assessors, setAssessors] = useState<AssessorOption[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filters
    const [selectedScheme, setSelectedScheme] = useState<string>("all");
    const [selectedEducation, setSelectedEducation] = useState<string>("all");
    const [selectedStatus, setSelectedStatus] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");

    // Modal Cek Dokumen
    const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
    const [appDetail, setAppDetail] = useState<ApplicationDetail | null>(null);
    const [detailLoading, setDetailLoading] = useState(false);

    // Modal Tugaskan Asesor
    const [assignAppId, setAssignAppId] = useState<string | null>(null);
    const [selectedAssessorId, setSelectedAssessorId] = useState<string>("");
    const [assignLoading, setAssignLoading] = useState(false);

    // Modal Minta Revisi
    const [revisionAppId, setRevisionAppId] = useState<string | null>(null);
    const [revisionReason, setRevisionReason] = useState("");
    const [revisionLoading, setRevisionLoading] = useState(false);

    const [processingVerify, setProcessingVerify] = useState(false);

    // Load applications, schemes, and assessors
    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [appsRes, schemesRes, assessorsRes] = await Promise.all([
                fetch("/api/admin/applications", { cache: "no-store" }),
                fetch("/api/public/schemes", { cache: "no-store" }),
                fetch("/api/admin/assessors", { cache: "no-store" }),
            ]);

            if (!appsRes.ok) throw new Error("Gagal memuat daftar permohonan sertifikasi.");
            const appsData = await appsRes.json();
            setApplications(appsData.applications || []);

            if (schemesRes.ok) {
                const sData = await schemesRes.json();
                setSchemes(sData.schemes || []);
            }

            if (assessorsRes.ok) {
                const aData = await assessorsRes.json();
                setAssessors(aData.assessors || []);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Terjadi kesalahan saat memuat data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadData();
    }, []);

    // Load detail for "Cek Dokumen" modal
    const handleCekDokumen = async (id: string) => {
        setSelectedAppId(id);
        setDetailLoading(true);
        setAppDetail(null);
        try {
            const res = await fetch(`/api/admin/applications/${id}`, { cache: "no-store" });
            if (!res.ok) throw new Error("Gagal memuat detail dokumen permohonan.");
            const data = await res.json();
            setAppDetail(data);
        } catch (err) {
            alert(err instanceof Error ? err.message : "Gagal memuat detail dokumen.");
            setSelectedAppId(null);
        } finally {
            setDetailLoading(false);
        }
    };

    // Action: Setujui Verifikasi
    const handleSetujuiVerifikasi = async (id: string) => {
        if (!confirm("Apakah Anda yakin menyetujui verifikasi dokumen APL peserta ini?")) return;
        setProcessingVerify(true);
        try {
            const res = await fetch(`/api/admin/applications/${id}/verify`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });
            const data = await res.json();
            if (!res.ok) {
                if (data.details?.missingDocuments) {
                    const list = data.details.missingDocuments.map((d: { code: string }) => d.code).join(", ");
                    throw new Error(`Dokumen wajib belum lengkap: ${list}`);
                }
                throw new Error(data.error || "Gagal menyetujui verifikasi.");
            }
            alert("Dokumen APL berhasil diverifikasi! Selanjutnya Anda dapat menugaskan Asesor penguji.");
            if (selectedAppId === id) {
                await handleCekDokumen(id);
            }
            await loadData();
        } catch (err) {
            alert(err instanceof Error ? err.message : "Terjadi kesalahan saat verifikasi.");
        } finally {
            setProcessingVerify(false);
        }
    };

    // Action: Minta Revisi
    const handleRevisionSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!revisionAppId || !revisionReason.trim()) return;
        setRevisionLoading(true);
        try {
            const res = await fetch(`/api/admin/applications/${revisionAppId}/revision`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reason: revisionReason.trim() }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Gagal meminta revisi.");
            alert("Permintaan revisi berkas telah dikirimkan ke asesi.");
            setRevisionAppId(null);
            setRevisionReason("");
            if (selectedAppId === revisionAppId) {
                setSelectedAppId(null);
            }
            await loadData();
        } catch (err) {
            alert(err instanceof Error ? err.message : "Terjadi kesalahan saat meminta revisi.");
        } finally {
            setRevisionLoading(false);
        }
    };

    // Action: Tugaskan Asesor
    const handleAssignSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!assignAppId || !selectedAssessorId) {
            alert("Silakan pilih salah satu asesor!");
            return;
        }
        setAssignLoading(true);
        try {
            const res = await fetch(`/api/admin/applications/${assignAppId}/assign`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ assessorId: selectedAssessorId }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Gagal menugaskan asesor.");
            alert("Asesor berhasil ditugaskan! Jadwal asesmen telah aktif.");
            setAssignAppId(null);
            setSelectedAssessorId("");
            if (selectedAppId === assignAppId) {
                await handleCekDokumen(assignAppId);
            }
            await loadData();
        } catch (err) {
            alert(err instanceof Error ? err.message : "Terjadi kesalahan saat menugaskan asesor.");
        } finally {
            setAssignLoading(false);
        }
    };

    // Filter applications
    const filteredApplications = applications.filter((app) => {
        // Scheme filter
        if (selectedScheme !== "all" && app.scheme_id !== selectedScheme) {
            return false;
        }

        // Education Level / Akademi filter
        if (selectedEducation !== "all") {
            const edu = (app.apl01?.educationLevel || "").toLowerCase();
            const filterEdu = selectedEducation.toLowerCase();
            if (!edu.includes(filterEdu)) {
                return false;
            }
        }

        // Status filter
        if (selectedStatus !== "all" && app.status !== selectedStatus) {
            return false;
        }

        // Search query
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            const matchName = (app.participant_name || "").toLowerCase().includes(q);
            const matchNik = (app.participant_nik || "").toLowerCase().includes(q);
            const matchScheme = (app.scheme_name || "").toLowerCase().includes(q);
            const matchAssessor = (app.assessor_name || "").toLowerCase().includes(q);
            const matchInstitution = (app.apl01?.institution || "").toLowerCase().includes(q);
            if (!matchName && !matchNik && !matchScheme && !matchAssessor && !matchInstitution) {
                return false;
            }
        }

        return true;
    });

    // Counts
    const submittedCount = applications.filter((a) => a.status === "submitted").length;
    const verifiedCount = applications.filter((a) => a.status === "verified").length;
    const scheduledCount = applications.filter((a) => a.status === "assessment_scheduled").length;

    return (
        <div className="space-y-8 font-sans pb-12 animate-in fade-in duration-300">
            {/* Header Halaman */}
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div className="min-w-0">
                    <h1 className="text-2xl sm:text-3xl font-bold leading-tight text-[#0A1D37] dark:text-white font-serif">
                        Verifikasi Berkas APL & Penugasan Asesor
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Cek kelengkapan dokumen persyaratan asesi, setujui berkas, dan tugaskan asesor penguji kompetensi.
                    </p>
                </div>

                <Button
                    onClick={loadData}
                    variant="outline"
                    size="sm"
                    className="h-9 shrink-0 self-start border-slate-200 text-xs dark:border-slate-700 xl:self-auto"
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

            {/* Kartu Ringkasan */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div
                    onClick={() => setSelectedStatus("submitted")}
                    className={`p-5 rounded-2xl border transition cursor-pointer ${
                        selectedStatus === "submitted"
                            ? "bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 ring-2 ring-amber-400"
                            : "bg-white dark:bg-[#0B192C] border-slate-200 dark:border-slate-800 shadow-sm hover:border-amber-300"
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                            Menunggu Verifikasi Berkas
                        </span>
                        <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-600 flex items-center justify-center">
                            <Clock className="w-4 h-4" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-[#0A1D37] dark:text-white mt-2">{submittedCount}</p>
                    <p className="text-[11px] text-slate-400 mt-1">APL-01 & APL-02 diajukan asesi</p>
                </div>

                <div
                    onClick={() => setSelectedStatus("verified")}
                    className={`p-5 rounded-2xl border transition cursor-pointer ${
                        selectedStatus === "verified"
                            ? "bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-700 ring-2 ring-blue-400"
                            : "bg-white dark:bg-[#0B192C] border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-300"
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#0066CC] dark:text-blue-400 uppercase tracking-wider">
                            Terverifikasi (Siap Tugaskan)
                        </span>
                        <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-[#0066CC] flex items-center justify-center">
                            <FileCheck className="w-4 h-4" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-[#0A1D37] dark:text-white mt-2">{verifiedCount}</p>
                    <p className="text-[11px] text-slate-400 mt-1">Siap ditugaskan ke Asesor</p>
                </div>

                <div
                    onClick={() => setSelectedStatus("assessment_scheduled")}
                    className={`p-5 rounded-2xl border transition cursor-pointer ${
                        selectedStatus === "assessment_scheduled"
                            ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 ring-2 ring-emerald-400"
                            : "bg-white dark:bg-[#0B192C] border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-300"
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                            Asesor Ditugaskan (Asesmen)
                        </span>
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 flex items-center justify-center">
                            <UserCheck className="w-4 h-4" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-[#0A1D37] dark:text-white mt-2">{scheduledCount}</p>
                    <p className="text-[11px] text-slate-400 mt-1">Sedang/siap diuji oleh Asesor</p>
                </div>
            </div>

            {/* FILTER PANEL LENGKAP */}
            <div className="bg-white dark:bg-[#0B192C] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <Filter className="w-4 h-4 text-[#0066CC]" />
                    <h2 className="text-xs font-bold uppercase tracking-wider text-[#0A1D37] dark:text-white">
                        Filter Pendaftar Sertifikasi
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Filter Skema */}
                    <div>
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                            Pilihan Skema Sertifikasi
                        </label>
                        <select
                            value={selectedScheme}
                            onChange={(e) => setSelectedScheme(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-[#0A1D37] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
                        >
                            <option value="all">Semua Skema ({schemes.length})</option>
                            {schemes.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {s.code} - {s.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Filter Jenjang Pendidikan / Akademi */}
                    <div>
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                            Jenjang Pendidikan / Akademi
                        </label>
                        <select
                            value={selectedEducation}
                            onChange={(e) => setSelectedEducation(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-[#0A1D37] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
                        >
                            <option value="all">Semua Jenjang Pendidikan</option>
                            <option value="smk">SMK / MAK</option>
                            <option value="sma">SMA / MA</option>
                            <option value="d3">Diploma 3 (D3)</option>
                            <option value="s1">Sarjana / D4 (S1/D4)</option>
                            <option value="s2">Magister (S2)</option>
                            <option value="lainnya">Lainnya</option>
                        </select>
                    </div>

                    {/* Filter Status Alur */}
                    <div>
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                            Status Alur Sertifikasi
                        </label>
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-[#0A1D37] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
                        >
                            <option value="all">Semua Status</option>
                            <option value="submitted">Menunggu Verifikasi (Submitted)</option>
                            <option value="verified">Terverifikasi (Verified)</option>
                            <option value="assessment_scheduled">Asesor Ditugaskan (Scheduled)</option>
                            <option value="revision_required">Perlu Revisi (Revision)</option>
                            <option value="assessment_completed">Asesmen Selesai</option>
                            <option value="competent">Kompeten (Siap Sertifikat)</option>
                        </select>
                    </div>

                    {/* Pencarian Nama / NIK */}
                    <div>
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                            Cari Asesi / Asesor
                        </label>
                        <div className="relative">
                            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Nama, NIK, Asesor..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-[#0A1D37] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* TABEL VERIFIKASI APL */}
            <div className="bg-white dark:bg-[#0B192C] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                        <h2 className="text-base font-bold text-[#0A1D37] dark:text-white">
                            Daftar Pendaftar Skema Sertifikasi
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Menampilkan {filteredApplications.length} berkas permohonan asesi.
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="py-20 text-center space-y-2">
                        <div className="inline-block w-8 h-8 border-4 border-[#0066CC] border-t-transparent rounded-full animate-spin" />
                        <p className="text-xs text-slate-500">Memuat berkas permohonan...</p>
                    </div>
                ) : filteredApplications.length === 0 ? (
                    <div className="py-16 text-center text-slate-400 text-sm">
                        Tidak ada berkas yang sesuai dengan kriteria filter saat ini.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-[#F8FAFC] dark:bg-[#071120] text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 text-xs">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Nama Asesi & Kontak</th>
                                    <th className="px-6 py-4 font-semibold">Jenjang Akademi / Sekolah</th>
                                    <th className="px-6 py-4 font-semibold">Pilihan Skema & TUK</th>
                                    <th className="px-6 py-4 font-semibold">Status Berkas</th>
                                    <th className="px-6 py-4 font-semibold">Penguji (Asesor)</th>
                                    <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {filteredApplications.map((app) => (
                                    <tr key={app.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition">
                                        {/* Nama Asesi */}
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-[#0A1D37] dark:text-white">{app.participant_name}</p>
                                            <p className="text-xs text-slate-400 font-mono">NIK: {app.participant_nik || "—"}</p>
                                            <p className="text-[11px] text-slate-500">{app.participant_phone || app.participant_email}</p>
                                        </td>

                                        {/* Jenjang Akademi */}
                                        <td className="px-6 py-4">
                                            <div className="text-xs">
                                                <p className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                                    <GraduationCap className="w-3.5 h-3.5 text-[#0066CC]" />
                                                    {app.apl01?.educationLevel || "Pendidikan Terakhir"}
                                                </p>
                                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-[200px]">
                                                    {app.apl01?.institution || "—"}
                                                </p>
                                                {app.apl01?.studyProgram && (
                                                    <p className="text-[10px] text-slate-400 truncate max-w-[200px]">
                                                        {app.apl01.studyProgram}
                                                    </p>
                                                )}
                                            </div>
                                        </td>

                                        {/* Skema & Jadwal */}
                                        <td className="px-6 py-4">
                                            <span className="text-[10px] font-bold text-[#0066CC] bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded">
                                                {app.scheme_code}
                                            </span>
                                            <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 mt-1 max-w-xs">
                                                {app.scheme_name}
                                            </p>
                                            <p className="text-[11px] text-slate-400 mt-0.5">
                                                {app.test_site_name}
                                            </p>
                                        </td>

                                        {/* Status Berkas */}
                                        <td className="px-6 py-4">
                                            {app.status === "submitted" && (
                                                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                                                    Menunggu Verifikasi
                                                </span>
                                            )}
                                            {app.status === "verified" && (
                                                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#0066CC] dark:bg-blue-950/40 dark:text-blue-300">
                                                    Terverifikasi
                                                </span>
                                            )}
                                            {app.status === "assessment_scheduled" && (
                                                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                                                    Uji Terjadwal
                                                </span>
                                            )}
                                            {app.status === "assessment_completed" && (
                                                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400">
                                                    Asesmen Selesai
                                                </span>
                                            )}
                                            {app.status === "revision_required" && (
                                                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
                                                    Perlu Revisi
                                                </span>
                                            )}
                                            {app.status === "competent" && (
                                                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                                                    Kompeten
                                                </span>
                                            )}
                                            {app.status === "draft" && (
                                                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                                    Draft APL
                                                </span>
                                            )}
                                        </td>

                                        {/* Penguji (Asesor) */}
                                        <td className="px-6 py-4">
                                            {app.assessor_name ? (
                                                <div className="flex items-center gap-1.5">
                                                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                                                    <div>
                                                        <p className="font-bold text-xs text-slate-800 dark:text-slate-200">
                                                            {app.assessor_name}
                                                        </p>
                                                        <button
                                                            onClick={() => {
                                                                setAssignAppId(app.id);
                                                                setSelectedAssessorId(app.assessor_id || "");
                                                            }}
                                                            className="text-[10px] text-[#0066CC] hover:underline cursor-pointer"
                                                        >
                                                            Ubah Asesor
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="space-y-1">
                                                    <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                                                        Belum Ditugaskan
                                                    </span>
                                                    {app.status === "verified" && (
                                                        <div>
                                                            <button
                                                                onClick={() => {
                                                                    setAssignAppId(app.id);
                                                                    setSelectedAssessorId("");
                                                                }}
                                                                className="text-xs font-bold text-[#0066CC] hover:underline flex items-center gap-1 cursor-pointer"
                                                            >
                                                                <UserCheck className="w-3.5 h-3.5" />
                                                                Tugaskan Sekarang
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </td>

                                        {/* Aksi */}
                                        <td className="px-6 py-4 text-right space-x-2">
                                            {/* REVISI: Ganti button "Lihat" -> "Cek Dokumen" */}
                                            <Button
                                                onClick={() => handleCekDokumen(app.id)}
                                                variant="outline"
                                                size="sm"
                                                className="h-8 text-xs font-bold border-blue-200 hover:bg-blue-50 text-[#0066CC] dark:border-blue-900 dark:text-blue-400"
                                            >
                                                <Eye className="w-3.5 h-3.5 mr-1" /> Cek Dokumen
                                            </Button>

                                            {app.status === "submitted" && (
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleSetujuiVerifikasi(app.id)}
                                                    disabled={processingVerify}
                                                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8 font-bold"
                                                >
                                                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Verifikasi
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

            {/* MODAL CEK DOKUMEN (DETAIL LENGKAP APL-01 & APL-02) */}
            {selectedAppId && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-[#0B192C] rounded-2xl max-w-4xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
                        {/* Header Modal */}
                        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900">
                            <div>
                                <span className="text-[10px] font-bold text-[#0066CC] uppercase bg-blue-100 dark:bg-blue-950 px-2 py-0.5 rounded">
                                    Pemeriksaan Dokumen Peserta
                                </span>
                                <h3 className="font-bold text-lg text-[#0A1D37] dark:text-white mt-1">
                                    {appDetail?.application?.participant_name as string || "Cek Dokumen APL"}
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Skema: {appDetail?.application?.scheme_name as string || "—"} | Status: <strong className="uppercase">{appDetail?.application?.status as string}</strong>
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedAppId(null)}
                                className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Konten Modal */}
                        <div className="p-6 overflow-y-auto flex-1 space-y-6">
                            {detailLoading ? (
                                <div className="py-20 text-center space-y-2">
                                    <div className="inline-block w-8 h-8 border-4 border-[#0066CC] border-t-transparent rounded-full animate-spin" />
                                    <p className="text-xs text-slate-500">Memuat rincian berkas dan formulir...</p>
                                </div>
                            ) : appDetail ? (
                                <>
                                    {/* Bagian 1: Data Biodata APL-01 */}
                                    <div className="space-y-3">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                            <FileText className="w-4 h-4 text-[#0066CC]" />
                                            1. Data Identitas Peserta (APL-01)
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs">
                                            <div>
                                                <span className="text-slate-400">Nama Lengkap:</span>
                                                <p className="font-bold text-slate-800 dark:text-slate-200">
                                                    {(appDetail.application?.apl01 as Record<string, string>)?.fullName || appDetail.application?.participant_name as string}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-slate-400">NIK:</span>
                                                <p className="font-bold font-mono text-slate-800 dark:text-slate-200">
                                                    {(appDetail.application?.apl01 as Record<string, string>)?.nik || appDetail.application?.participant_nik as string}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-slate-400">Nomor Telepon:</span>
                                                <p className="font-bold text-slate-800 dark:text-slate-200">
                                                    {(appDetail.application?.apl01 as Record<string, string>)?.phone || appDetail.application?.participant_phone as string}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-slate-400">Jenjang Pendidikan / Akademi:</span>
                                                <p className="font-bold text-[#0066CC]">
                                                    {(appDetail.application?.apl01 as Record<string, string>)?.educationLevel || "—"}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-slate-400">Nama Sekolah / Kampus:</span>
                                                <p className="font-bold text-slate-800 dark:text-slate-200">
                                                    {(appDetail.application?.apl01 as Record<string, string>)?.institution || "—"}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-slate-400">Program Studi / Jurusan:</span>
                                                <p className="font-bold text-slate-800 dark:text-slate-200">
                                                    {(appDetail.application?.apl01 as Record<string, string>)?.studyProgram || "—"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bagian 2: Dokumen Persyaratan & Bukti Portofolio */}
                                    <div className="space-y-3">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                            <Download className="w-4 h-4 text-emerald-600" />
                                            2. Dokumen Persyaratan yang Diunggah
                                        </h4>
                                        {appDetail.documents.length === 0 ? (
                                            <p className="text-xs text-slate-400 italic">Belum ada dokumen yang diunggah.</p>
                                        ) : (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {appDetail.documents.map((doc) => (
                                                    <div
                                                        key={doc.id}
                                                        className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 bg-white dark:bg-slate-900"
                                                    >
                                                        <div className="min-w-0">
                                                            <span className="text-[10px] font-bold text-[#0066CC] uppercase bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.5 rounded">
                                                                {doc.document_type}
                                                            </span>
                                                            <p className="text-xs font-bold text-[#0A1D37] dark:text-white truncate mt-1">
                                                                {doc.original_name}
                                                            </p>
                                                            <p className="text-[10px] text-slate-400">
                                                                {(doc.size_bytes / 1024).toFixed(0)} KB • {doc.mime_type}
                                                            </p>
                                                        </div>

                                                        <a
                                                            href={`/api/admin/applications/${selectedAppId}/documents/${doc.id}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#0066CC] dark:bg-blue-950/60 dark:text-blue-300 transition shrink-0"
                                                            title="Buka / Unduh Dokumen"
                                                        >
                                                            <Download className="w-4 h-4" />
                                                        </a>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Bagian 3: Daftar Unit Kompetensi SKKNI */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-[#0066CC]" />
                                                3. Daftar Unit Kompetensi SKKNI yang Akan Diuji
                                            </h4>
                                            <span className="text-[10px] text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                                                Dinilai oleh Asesor
                                            </span>
                                        </div>
                                        <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                                            <table className="w-full text-xs text-left">
                                                <thead className="bg-slate-100 dark:bg-slate-900 text-slate-500">
                                                    <tr>
                                                        <th className="px-4 py-2 font-semibold w-12 text-center">No</th>
                                                        <th className="px-4 py-2 font-semibold w-40">Kode Unit SKKNI</th>
                                                        <th className="px-4 py-2 font-semibold">Judul Unit Kompetensi</th>
                                                        <th className="px-4 py-2 font-semibold w-36 text-center">Tahap Penilaian</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                                    {appDetail.apl02.map((u, idx) => (
                                                        <tr key={u.unit_id || idx}>
                                                            <td className="px-4 py-2.5 text-center text-slate-400 font-bold">
                                                                {idx + 1}
                                                            </td>
                                                            <td className="px-4 py-2.5">
                                                                <span className="font-mono font-bold text-[#0066CC] dark:text-blue-400">
                                                                    {u.code}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-2.5 text-slate-700 dark:text-slate-300 font-medium">
                                                                {u.title}
                                                            </td>
                                                            <td className="px-4 py-2.5 text-center">
                                                                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-[#0066CC] dark:bg-blue-950/60 dark:text-blue-300">
                                                                    Uji Asesor
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </>
                            ) : null}
                        </div>

                        {/* Footer Modal: Tombol Aksi */}
                        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-900">
                            <div className="flex items-center gap-2">
                                <Button
                                    onClick={() => setSelectedAppId(null)}
                                    variant="outline"
                                    className="text-xs h-9"
                                >
                                    Tutup
                                </Button>
                            </div>

                            <div className="flex items-center gap-2">
                                {appDetail?.application?.status === "submitted" && (
                                    <>
                                        <Button
                                            onClick={() => {
                                                setRevisionAppId(selectedAppId);
                                                setRevisionReason("");
                                            }}
                                            variant="outline"
                                            className="text-red-600 border-red-300 hover:bg-red-50 text-xs font-bold h-9"
                                        >
                                            <XCircle className="w-4 h-4 mr-1.5" /> Minta Revisi Berkas
                                        </Button>

                                        <Button
                                            onClick={() => handleSetujuiVerifikasi(selectedAppId)}
                                            disabled={processingVerify}
                                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold h-9"
                                        >
                                            <CheckCircle2 className="w-4 h-4 mr-1.5" /> Setujui Verifikasi
                                        </Button>
                                    </>
                                )}

                                {appDetail?.application?.status === "verified" && (
                                    <Button
                                        onClick={() => {
                                            setAssignAppId(selectedAppId);
                                            setSelectedAssessorId("");
                                        }}
                                        className="bg-[#0066CC] hover:bg-blue-700 text-white text-xs font-bold h-9"
                                    >
                                        <UserCheck className="w-4 h-4 mr-1.5" /> Tugaskan Asesor Penguji
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL TUGASKAN ASESOR */}
            {assignAppId && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-[#0B192C] rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                            <h3 className="font-bold text-base text-[#0A1D37] dark:text-white flex items-center gap-2">
                                <UserCheck className="w-5 h-5 text-[#0066CC]" />
                                Tugaskan Asesor Penguji
                            </h3>
                            <button
                                onClick={() => setAssignAppId(null)}
                                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleAssignSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                    Pilih Asesor Resmi Terdaftar <span className="text-red-500">*</span>
                                </label>
                                <select
                                    required
                                    value={selectedAssessorId}
                                    onChange={(e) => setSelectedAssessorId(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-[#0A1D37] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
                                >
                                    <option value="">-- Pilih Salah Satu Asesor --</option>
                                    {assessors.map((a) => (
                                        <option key={a.id} value={a.id}>
                                            {a.full_name} ({a.email})
                                        </option>
                                    ))}
                                </select>
                                <p className="text-[11px] text-slate-400 mt-1">
                                    Asesor terpilih akan menerima tugas asesmen di portal asesor mereka.
                                </p>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setAssignAppId(null)}
                                    className="text-xs h-9"
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={assignLoading}
                                    className="bg-[#0066CC] hover:bg-blue-700 text-white text-xs font-bold h-9"
                                >
                                    {assignLoading ? "Menyimpan..." : "Tugaskan Asesor"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL MINTA REVISI */}
            {revisionAppId && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-[#0B192C] rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                            <h3 className="font-bold text-base text-red-600 flex items-center gap-2">
                                <XCircle className="w-5 h-5" />
                                Minta Revisi Berkas APL
                            </h3>
                            <button
                                onClick={() => setRevisionAppId(null)}
                                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleRevisionSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                    Catatan / Alasan Revisi <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    required
                                    rows={4}
                                    value={revisionReason}
                                    onChange={(e) => setRevisionReason(e.target.value)}
                                    placeholder="Jelaskan berkas apa yang kurang atau perlu diperbaiki oleh asesi (contoh: KTP buram, portofolio belum ditandatangani)..."
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-red-500"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setRevisionAppId(null)}
                                    className="text-xs h-9"
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={revisionLoading}
                                    className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold h-9"
                                >
                                    {revisionLoading ? "Mengirim..." : "Kirim Catatan Revisi"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
