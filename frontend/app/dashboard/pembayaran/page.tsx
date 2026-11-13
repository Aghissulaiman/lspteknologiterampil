"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
    CreditCard,
    CheckCircle2,
    Clock,
    AlertCircle,
    Copy,
    Check,
    MessageCircle,
    ArrowRight,
    FileText,
    UploadCloud,
    Building2,
    Calendar,
    MapPin,
    ShieldCheck,
    RefreshCw
} from "lucide-react";

type PaymentData = {
    id: string;
    application_id: string;
    amount: string;
    bank_name: string;
    account_number: string;
    account_holder: string;
    sender_bank: string;
    sender_account_name: string;
    sender_account_number: string;
    transfer_amount: string;
    proof_document_id: string | null;
    proof_original_name?: string;
    status: "pending_payment" | "proof_uploaded" | "approved" | "rejected";
    notes: string;
    rejection_reason: string;
    cs_whatsapp: string;
    created_at: string;
    updated_at: string;
};

type ApplicationInfo = {
    id: string;
    scheme_id: string;
    status: string;
    scheme_name: string;
    scheme_code: string;
    starts_at: string;
    ends_at: string;
    test_site_name: string;
};

function PembayaranContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const queryAppId = searchParams.get("applicationId");

    const [appId, setAppId] = useState<string | null>(queryAppId);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [appInfo, setAppInfo] = useState<ApplicationInfo | null>(null);
    const [payment, setPayment] = useState<PaymentData | null>(null);

    // Form inputs
    const [senderBank, setSenderBank] = useState("");
    const [senderAccountName, setSenderAccountName] = useState("");
    const [senderAccountNumber, setSenderAccountNumber] = useState("");
    const [transferAmount, setTransferAmount] = useState("");
    const [transferNotes, setTransferNotes] = useState("");
    const [proofFile, setProofFile] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [copiedBca, setCopiedBca] = useState(false);
    const [copiedMandiri, setCopiedMandiri] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Fetch user's latest application if not provided
    useEffect(() => {
        let active = true;

        async function resolveAppId() {
            if (queryAppId) {
                setAppId(queryAppId);
                return;
            }
            try {
                const res = await fetch("/api/applications", { cache: "no-store" });
                if (!res.ok) throw new Error("Gagal mengambil data permohonan.");
                const data = await res.json();
                if (active && Array.isArray(data.applications) && data.applications.length > 0) {
                    setAppId(data.applications[0].id);
                } else if (active) {
                    setLoading(false);
                }
            } catch (err) {
                if (active) setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
            }
        }

        void resolveAppId();
        return () => {
            active = false;
        };
    }, [queryAppId]);

    // Fetch payment data once appId is known
    const fetchPaymentData = async () => {
        if (!appId) return;
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/applications/${appId}/payment`, { cache: "no-store" });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || "Gagal memuat status pembayaran.");
            }
            const data = await res.json();
            setAppInfo(data.application || null);
            setPayment(data.payment || null);
            if (data.payment) {
                if (data.payment.sender_bank) setSenderBank(data.payment.sender_bank);
                if (data.payment.sender_account_name) setSenderAccountName(data.payment.sender_account_name);
                if (data.payment.sender_account_number) setSenderAccountNumber(data.payment.sender_account_number);
                if (data.payment.transfer_amount) setTransferAmount(data.payment.transfer_amount);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Gagal memuat data pembayaran.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (appId) {
            void fetchPaymentData();
        }
    }, [appId]);

    const handleCopy = (text: string, type: "bca" | "mandiri") => {
        navigator.clipboard.writeText(text);
        if (type === "bca") {
            setCopiedBca(true);
            setTimeout(() => setCopiedBca(false), 2000);
        } else {
            setCopiedMandiri(true);
            setTimeout(() => setCopiedMandiri(false), 2000);
        }
    };

    const handleUploadProof = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!appId) return;

        if (!proofFile && !payment?.proof_document_id) {
            alert("Harap pilih berkas bukti transfer (foto/screenshot struk/PDF)!");
            return;
        }

        if (!senderBank.trim() || !senderAccountName.trim()) {
            alert("Nama bank pengirim dan nama pemilik rekening pengirim wajib diisi.");
            return;
        }

        setSubmitting(true);
        setSuccessMessage(null);
        setError(null);

        try {
            const formData = new FormData();
            if (proofFile) {
                formData.append("proof", proofFile);
            }
            formData.append("senderBank", senderBank.trim());
            formData.append("senderAccountName", senderAccountName.trim());
            formData.append("senderAccountNumber", senderAccountNumber.trim());
            formData.append("transferAmount", transferAmount.trim());
            formData.append("notes", transferNotes.trim());

            const res = await fetch(`/api/applications/${appId}/payment/proof`, {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Gagal mengunggah bukti transfer.");
            }

            setSuccessMessage("Bukti transfer berhasil dikirim! Menunggu konfirmasi admin LSP.");
            await fetchPaymentData();
        } catch (err) {
            alert(err instanceof Error ? err.message : "Gagal mengirim bukti pembayaran.");
        } finally {
            setSubmitting(false);
        }
    };

    const csPhone = payment?.cs_whatsapp || "+6281298765432";
    const cleanCsPhone = csPhone.replace(/\D/g, "");
    const waMessage = `Halo Admin LSP Teknologi Terampil, saya ingin konfirmasi pembayaran pendaftaran skema ${appInfo?.scheme_name || ""} atas nama ${senderAccountName || "saya"} (ID Permohonan: ${appId || ""}).`;
    const waUrl = `https://wa.me/${cleanCsPhone}?text=${encodeURIComponent(waMessage)}`;

    if (loading && !payment) {
        return (
            <div className="py-24 text-center space-y-3 font-sans">
                <div className="inline-block w-8 h-8 border-4 border-[#0066CC] border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-slate-500 dark:text-slate-400">Memuat rincian pembayaran pendaftaran...</p>
            </div>
        );
    }

    if (!appId && !loading) {
        return (
            <div className="py-16 text-center space-y-4 font-sans bg-white dark:bg-[#0B192C] p-8 rounded-2xl border border-slate-200 dark:border-slate-800">
                <CreditCard className="w-12 h-12 text-slate-400 mx-auto" />
                <h2 className="text-xl font-bold text-[#0A1D37] dark:text-white">Belum Ada Permohonan Skema Aktif</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                    Silakan pilih skema sertifikasi dan jadwal uji kompetensi terlebih dahulu untuk melanjutkan ke tahap pembayaran.
                </p>
                <Link
                    href="/dashboard/skema"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0066CC] hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-600/20 transition"
                >
                    Pilih Skema Sertifikasi <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        );
    }

    const isApproved = payment?.status === "approved";
    const isProofUploaded = payment?.status === "proof_uploaded";
    const isRejected = payment?.status === "rejected";

    return (
        <div className="space-y-8 font-sans pb-12 animate-in fade-in duration-300">
            {/* Header */}
            <div className="border-b border-slate-200/80 dark:border-slate-800/80 pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <span className="text-[11px] font-bold tracking-widest text-[#0066CC] uppercase bg-blue-50 dark:bg-blue-950/60 dark:text-blue-300 px-2.5 py-1 rounded-md">
                        Tahap 03: Pembayaran Pendaftaran
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#0A1D37] dark:text-white font-serif mt-2">
                        Pembayaran Biaya Sertifikasi
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Lakukan transfer manual ke rekening resmi LSP Teknologi Terampil dan unggah bukti transfer.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={fetchPaymentData}
                        disabled={loading}
                        className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                        title="Perbarui Status Pembayaran"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                        <span>Muat Ulang</span>
                    </button>

                    <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition shadow-sm"
                    >
                        <MessageCircle className="w-4 h-4" />
                        <span>CS WhatsApp</span>
                    </a>
                </div>
            </div>

            {error && (
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <p>{error}</p>
                </div>
            )}

            {successMessage && (
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-sm flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                    <p>{successMessage}</p>
                </div>
            )}

            {/* STATUS BANNER */}
            {isApproved && (
                <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div>
                            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-200/60 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300">
                                Disetujui Admin LSP
                            </span>
                            <h3 className="text-lg font-bold text-emerald-950 dark:text-emerald-100 mt-1">
                                Pembayaran Pendaftaran Berhasil Diverifikasi!
                            </h3>
                            <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-0.5">
                                Bukti transfer Anda telah disetujui. Silakan lanjutkan ke pengisian Formulir Permohonan APL-01 & Asesmen Mandiri APL-02.
                            </p>
                        </div>
                    </div>
                    <Link
                        href={`/dashboard/apl?applicationId=${appId}`}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-700/20 transition shrink-0"
                    >
                        Lanjut ke Form APL-01 & APL-02 <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            )}

            {isProofUploaded && (
                <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                            <Clock className="w-6 h-6 animate-pulse" />
                        </div>
                        <div>
                            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-200/80 dark:bg-amber-900 text-amber-900 dark:text-amber-200">
                                Menunggu Verifikasi Admin
                            </span>
                            <h3 className="text-base font-bold text-amber-950 dark:text-amber-100 mt-1">
                                Bukti Transfer Sedang Ditinjau
                            </h3>
                            <p className="text-xs text-amber-800 dark:text-amber-300 mt-0.5">
                                Admin LSP sedang memeriksa mutasi rekening Anda. Proses verifikasi biasanya memakan waktu maksimal 1x24 jam kerja.
                            </p>
                        </div>
                    </div>
                    <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition shrink-0"
                    >
                        <MessageCircle className="w-4 h-4" />
                        Konfirmasi Cepat via CS
                    </a>
                </div>
            )}

            {isRejected && (
                <div className="p-6 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 shadow-sm">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0">
                            <AlertCircle className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-200 text-red-900 dark:bg-red-900/60 dark:text-red-200">
                                Pembayaran Ditolak
                            </span>
                            <h3 className="text-base font-bold text-red-950 dark:text-red-100 mt-1">
                                Bukti Transfer Ditolak Admin LSP
                            </h3>
                            <div className="mt-2 p-3 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-red-200 dark:border-red-900 text-xs text-red-800 dark:text-red-300">
                                <p className="font-semibold">Alasan Penolakan:</p>
                                <p className="mt-0.5">{payment?.rejection_reason || "Bukti transfer tidak valid atau tidak terbaca."}</p>
                            </div>
                            <p className="text-xs text-red-700 dark:text-red-300 mt-2">
                                Silakan periksa kembali nominal transfer atau unggah ulang bukti transfer yang jelas di formulir bawah ini.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Grid 2 Kolom: Detail Skema & Rekening Pembayaran */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Kolom Kiri (2/3): Rekening LSP & Petunjuk */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Rekening Tujuan */}
                    <div className="bg-white dark:bg-[#0B192C] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                            <div>
                                <h2 className="text-base font-bold text-[#0A1D37] dark:text-white flex items-center gap-2">
                                    <CreditCard className="w-5 h-5 text-[#0066CC]" />
                                    Rekening Resmi Pembayaran LSP
                                </h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    Transfer manual sesuai nominal yang ditentukan ke rekening di bawah ini.
                                </p>
                            </div>
                            <span className="px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-[#0066CC] dark:text-blue-400 text-xs font-bold">
                                Manual Transfer
                            </span>
                        </div>

                        {/* Rekening Card: BCA */}
                        <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-900/60 border border-blue-100 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-extrabold text-blue-800 dark:text-blue-300 text-base">BCA</span>
                                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Bank Central Asia</span>
                                </div>
                                <div className="mt-2 flex items-baseline gap-2">
                                    <p className="font-mono text-xl sm:text-2xl font-bold text-[#0A1D37] dark:text-white tracking-wider">
                                        8730921829
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => handleCopy("8730921829", "bca")}
                                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-[#0066CC] text-xs font-semibold transition cursor-pointer"
                                    >
                                        {copiedBca ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                        <span>{copiedBca ? "Tersalin!" : "Salin"}</span>
                                    </button>
                                </div>
                                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
                                    a.n. <strong className="text-slate-700 dark:text-slate-300">LSP TEKNOLOGI TERAMPIL</strong>
                                </p>
                            </div>

                            <div className="sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-200 dark:border-slate-700">
                                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Tagihan</span>
                                <p className="text-xl font-bold text-[#0066CC] dark:text-blue-400 font-mono mt-0.5">
                                    {payment?.amount || "Rp 1.200.000"}
                                </p>
                            </div>
                        </div>

                        {/* Rekening Card: Mandiri */}
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-extrabold text-amber-700 dark:text-amber-400 text-base">MANDIRI</span>
                                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Bank Mandiri</span>
                                </div>
                                <div className="mt-2 flex items-baseline gap-2">
                                    <p className="font-mono text-lg sm:text-xl font-bold text-[#0A1D37] dark:text-white tracking-wider">
                                        1370019283741
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => handleCopy("1370019283741", "mandiri")}
                                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-amber-600 text-xs font-semibold transition cursor-pointer"
                                    >
                                        {copiedMandiri ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                        <span>{copiedMandiri ? "Tersalin!" : "Salin"}</span>
                                    </button>
                                </div>
                                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
                                    a.n. <strong className="text-slate-700 dark:text-slate-300">LSP TEKNOLOGI TERAMPIL</strong>
                                </p>
                            </div>
                        </div>

                        {/* Petunjuk Transfer */}
                        <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-slate-900/50 border border-blue-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-2">
                            <p className="font-bold text-[#0A1D37] dark:text-white flex items-center gap-1.5">
                                <ShieldCheck className="w-4 h-4 text-[#0066CC]" />
                                Petunjuk Pembayaran Transfer Manual:
                            </p>
                            <ol className="list-decimal pl-5 space-y-1 text-slate-600 dark:text-slate-400">
                                <li>Transfer tepat sesuai nominal tagihan (<strong>{payment?.amount || "Rp 1.200.000"}</strong>) via ATM, M-Banking, Internet Banking, atau Teller.</li>
                                <li>Simpan tangkapan layar (screenshot) atau foto struk bukti transfer.</li>
                                <li>Isi data nama bank dan nama pemilik rekening pengirim pada form di bawah ini.</li>
                                <li>Unggah berkas bukti transfer (format JPG, PNG, atau PDF, maks. 5MB).</li>
                                <li>Admin LSP akan memverifikasi dan menyetujui pembayaran pendaftaran Anda.</li>
                            </ol>
                        </div>
                    </div>

                    {/* Form Upload Bukti Transfer */}
                    <div className="bg-white dark:bg-[#0B192C] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
                        <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                            <h2 className="text-base font-bold text-[#0A1D37] dark:text-white flex items-center gap-2">
                                <UploadCloud className="w-5 h-5 text-[#0066CC]" />
                                Form Konfirmasi Bukti Transfer
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                Masukkan rincian akun bank pengirim dan sertakan struk pembayaran.
                            </p>
                        </div>

                        <form onSubmit={handleUploadProof} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                        Nama Bank Pengirim <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={senderBank}
                                        onChange={(e) => setSenderBank(e.target.value)}
                                        placeholder="Contoh: BCA / BRI / Mandiri / BNI"
                                        required
                                        disabled={isApproved}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-[#0A1D37] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0066CC] disabled:opacity-60"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                        Nama Pemilik Rekening Pengirim <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={senderAccountName}
                                        onChange={(e) => setSenderAccountName(e.target.value)}
                                        placeholder="Nama sesuai di struk / m-banking"
                                        required
                                        disabled={isApproved}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-[#0A1D37] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0066CC] disabled:opacity-60"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                        Nomor Rekening Pengirim <span className="text-slate-400 font-normal">(opsional)</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={senderAccountNumber}
                                        onChange={(e) => setSenderAccountNumber(e.target.value)}
                                        placeholder="Contoh: 1234567890"
                                        disabled={isApproved}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-[#0A1D37] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0066CC] disabled:opacity-60"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                        Nominal yang Ditransfer
                                    </label>
                                    <input
                                        type="text"
                                        value={transferAmount || payment?.amount || ""}
                                        onChange={(e) => setTransferAmount(e.target.value)}
                                        placeholder="Contoh: Rp 1.200.000"
                                        disabled={isApproved}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-[#0A1D37] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0066CC] disabled:opacity-60"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                    Unggah File Bukti Transfer <span className="text-red-500">*</span>
                                </label>
                                <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-5 text-center bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-50 transition">
                                    <input
                                        type="file"
                                        accept="image/png,image/jpeg,application/pdf"
                                        onChange={(e) => setProofFile(e.target.files?.[0] || null)}
                                        disabled={isApproved}
                                        className="hidden"
                                        id="proofFileInput"
                                    />
                                    <label
                                        htmlFor="proofFileInput"
                                        className={`flex flex-col items-center justify-center cursor-pointer ${
                                            isApproved ? "cursor-not-allowed opacity-50" : ""
                                        }`}
                                    >
                                        <UploadCloud className="w-8 h-8 text-[#0066CC] mb-2" />
                                        <p className="text-xs font-bold text-[#0A1D37] dark:text-white">
                                            {proofFile ? proofFile.name : payment?.proof_original_name || "Klik untuk memilih foto struk atau berkas PDF bukti transfer"}
                                        </p>
                                        <p className="text-[11px] text-slate-400 mt-1">
                                            Format yang didukung: JPG, PNG, PDF (Maksimal 5MB)
                                        </p>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                    Catatan / Keterangan Tambahan <span className="text-slate-400 font-normal">(opsional)</span>
                                </label>
                                <textarea
                                    value={transferNotes}
                                    onChange={(e) => setTransferNotes(e.target.value)}
                                    placeholder="Contoh: Transfer atas nama adik kandung / split payment"
                                    rows={2}
                                    disabled={isApproved}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-[#0A1D37] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0066CC] disabled:opacity-60"
                                />
                            </div>

                            {!isApproved && (
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-3.5 rounded-xl bg-[#0066CC] hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-md shadow-blue-600/20 cursor-pointer"
                                >
                                    {submitting ? "Mengunggah Bukti Pembayaran..." : isProofUploaded ? "Perbarui Bukti Transfer" : "Kirim Bukti Pembayaran"}
                                </button>
                            )}
                        </form>
                    </div>
                </div>

                {/* Kolom Kanan (1/3): Rincian Skema & Kontak Layanan CS */}
                <div className="space-y-6">
                    {/* Ringkasan Skema */}
                    <div className="bg-white dark:bg-[#0B192C] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                        <h3 className="text-sm font-bold text-[#0A1D37] dark:text-white uppercase tracking-wider text-slate-400">
                            Ringkasan Permohonan
                        </h3>

                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-3">
                            <div>
                                <span className="text-[10px] font-bold text-[#0066CC] bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded">
                                    {appInfo?.scheme_code || "SKEMA"}
                                </span>
                                <h4 className="font-bold text-sm text-[#0A1D37] dark:text-white mt-1.5 leading-snug">
                                    {appInfo?.scheme_name || "Memuat skema..."}
                                </h4>
                            </div>

                            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-xs space-y-1.5 text-slate-600 dark:text-slate-300">
                                <p className="flex items-center gap-1.5">
                                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                    <span className="truncate">{appInfo?.test_site_name || "TUK Pusat LSP"}</span>
                                </p>
                                <p className="flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                    <span>
                                        {appInfo?.starts_at
                                            ? new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(new Date(appInfo.starts_at))
                                            : "Jadwal Uji"}
                                    </span>
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-between items-center text-xs pt-2">
                            <span className="text-slate-500 dark:text-slate-400 font-medium">Status Pendaftaran:</span>
                            <span className="font-bold uppercase text-[11px] px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
                                {appInfo?.status || "Draft"}
                            </span>
                        </div>
                    </div>

                    {/* Customer Service WhatsApp Card */}
                    <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-6 rounded-2xl shadow-md space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                                <MessageCircle className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm leading-tight">Customer Service</h4>
                                <p className="text-[11px] text-emerald-100">LSP Teknologi Terampil</p>
                            </div>
                        </div>

                        <p className="text-xs text-emerald-50 leading-relaxed">
                            Mengalami kendala dalam proses transfer atau ingin konfirmasi bukti setoran secara instan? Hubungi layanan bantuan kami.
                        </p>

                        <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                            <p className="text-[10px] text-emerald-200 uppercase font-semibold">Nomor WhatsApp Resmi:</p>
                            <p className="font-mono text-base font-bold text-white mt-0.5">{csPhone}</p>
                        </div>

                        <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-3 rounded-xl bg-white text-emerald-800 hover:bg-emerald-50 font-bold text-xs flex items-center justify-center gap-2 transition shadow-sm"
                        >
                            <MessageCircle className="w-4 h-4 text-emerald-700" />
                            Hubungi via WhatsApp
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function PembayaranPage() {
    return (
        <Suspense
            fallback={
                <div className="py-24 text-center font-sans space-y-3">
                    <div className="inline-block w-8 h-8 border-4 border-[#0066CC] border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-slate-500">Memuat halaman pembayaran...</p>
                </div>
            }
        >
            <PembayaranContent />
        </Suspense>
    );
}
