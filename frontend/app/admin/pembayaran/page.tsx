"use client";

import React, { useEffect, useState } from "react";
import {
    CreditCard,
    CheckCircle2,
    XCircle,
    Eye,
    Clock,
    Search,
    AlertCircle,
    Download,
    X,
    MessageCircle,
    FileText,
    User,
    Check
} from "lucide-react";
import { Button } from "@/components/ui/button";

type PaymentItem = {
    id: string;
    application_id: string;
    participant_id: string;
    amount: string;
    bank_name: string;
    account_number: string;
    account_holder: string;
    sender_bank: string;
    sender_account_name: string;
    sender_account_number: string;
    transfer_amount: string;
    proof_document_id: string | null;
    proof_original_name: string | null;
    proof_mime_type: string | null;
    status: "pending_payment" | "proof_uploaded" | "approved" | "rejected";
    notes: string;
    rejection_reason: string;
    cs_whatsapp: string;
    participant_name: string;
    participant_email: string;
    participant_nik: string;
    participant_phone: string;
    scheme_id: string;
    scheme_code: string;
    scheme_name: string;
    reviewer_name: string | null;
    created_at: string;
    updated_at: string;
};

export default function AdminPembayaranPage() {
    const [payments, setPayments] = useState<PaymentItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filters
    const [statusFilter, setStatusFilter] = useState<string>("proof_uploaded");
    const [searchQuery, setSearchQuery] = useState("");

    // Modal state for viewing proof
    const [selectedProofPayment, setSelectedProofPayment] = useState<PaymentItem | null>(null);

    // Modal state for rejection
    const [rejectPaymentId, setRejectPaymentId] = useState<string | null>(null);
    const [rejectionReason, setRejectionReason] = useState("");
    const [processing, setProcessing] = useState(false);

    const fetchPayments = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/admin/payments", { cache: "no-store" });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || "Gagal memuat daftar pembayaran.");
            }
            const data = await res.json();
            setPayments(data.payments || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Gagal memuat data pembayaran.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void fetchPayments();
    }, []);

    const handleApprove = async (paymentId: string) => {
        if (!confirm("Apakah Anda yakin menyetujui pembayaran pendaftaran ini?")) return;
        setProcessing(true);
        try {
            const res = await fetch(`/api/admin/payments/${paymentId}/approve`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Gagal menyetujui pembayaran.");
            await fetchPayments();
        } catch (err) {
            alert(err instanceof Error ? err.message : "Terjadi kesalahan.");
        } finally {
            setProcessing(false);
        }
    };

    const handleRejectSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!rejectPaymentId) return;
        if (!rejectionReason.trim()) {
            alert("Harap masukkan alasan penolakan!");
            return;
        }

        setProcessing(true);
        try {
            const res = await fetch(`/api/admin/payments/${rejectPaymentId}/reject`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reason: rejectionReason.trim() }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Gagal menolak pembayaran.");
            setRejectPaymentId(null);
            setRejectionReason("");
            await fetchPayments();
        } catch (err) {
            alert(err instanceof Error ? err.message : "Terjadi kesalahan.");
        } finally {
            setProcessing(false);
        }
    };

    // Filter logic
    const filteredPayments = payments.filter((item) => {
        if (statusFilter !== "all" && item.status !== statusFilter) return false;
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            const matchName = item.participant_name?.toLowerCase().includes(q);
            const matchNik = item.participant_nik?.toLowerCase().includes(q);
            const matchScheme = item.scheme_name?.toLowerCase().includes(q);
            const matchBank = item.sender_bank?.toLowerCase().includes(q);
            const matchSender = item.sender_account_name?.toLowerCase().includes(q);
            if (!matchName && !matchNik && !matchScheme && !matchBank && !matchSender) return false;
        }
        return true;
    });

    const pendingCount = payments.filter((p) => p.status === "proof_uploaded").length;
    const approvedCount = payments.filter((p) => p.status === "approved").length;
    const rejectedCount = payments.filter((p) => p.status === "rejected").length;
    const unsubmittedCount = payments.filter((p) => p.status === "pending_payment").length;

    return (
        <div className="space-y-8 font-sans pb-12 animate-in fade-in duration-300">
            {/* Header Halaman */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#0A1D37] dark:text-white font-serif">
                        Verifikasi Pembayaran Pendaftaran
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Validasi bukti transfer manual pendaftaran skema sebelum peserta melanjutkan ke pengisian APL.
                    </p>
                </div>

                <Button
                    onClick={fetchPayments}
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

            {/* Statistik Ringkas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div
                    onClick={() => setStatusFilter("proof_uploaded")}
                    className={`p-5 rounded-2xl border transition cursor-pointer ${
                        statusFilter === "proof_uploaded"
                            ? "bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 ring-2 ring-amber-400"
                            : "bg-white dark:bg-[#0B192C] border-slate-200 dark:border-slate-800 shadow-sm hover:border-amber-300"
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                            Menunggu Verifikasi
                        </span>
                        <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-600 flex items-center justify-center">
                            <Clock className="w-4 h-4" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-[#0A1D37] dark:text-white mt-2">{pendingCount}</p>
                    <p className="text-[11px] text-slate-400 mt-1">Ada bukti baru perlu diperiksa</p>
                </div>

                <div
                    onClick={() => setStatusFilter("approved")}
                    className={`p-5 rounded-2xl border transition cursor-pointer ${
                        statusFilter === "approved"
                            ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 ring-2 ring-emerald-400"
                            : "bg-white dark:bg-[#0B192C] border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-300"
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                            Pembayaran Disetujui
                        </span>
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-[#0A1D37] dark:text-white mt-2">{approvedCount}</p>
                    <p className="text-[11px] text-slate-400 mt-1">Peserta dapat mengisi APL</p>
                </div>

                <div
                    onClick={() => setStatusFilter("rejected")}
                    className={`p-5 rounded-2xl border transition cursor-pointer ${
                        statusFilter === "rejected"
                            ? "bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-700 ring-2 ring-red-400"
                            : "bg-white dark:bg-[#0B192C] border-slate-200 dark:border-slate-800 shadow-sm hover:border-red-300"
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-red-700 dark:text-red-400 uppercase tracking-wider">
                            Pembayaran Ditolak
                        </span>
                        <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/40 text-red-600 flex items-center justify-center">
                            <XCircle className="w-4 h-4" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-[#0A1D37] dark:text-white mt-2">{rejectedCount}</p>
                    <p className="text-[11px] text-slate-400 mt-1">Bukti transfer tidak valid</p>
                </div>

                <div
                    onClick={() => setStatusFilter("pending_payment")}
                    className={`p-5 rounded-2xl border transition cursor-pointer ${
                        statusFilter === "pending_payment"
                            ? "bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-700 ring-2 ring-blue-400"
                            : "bg-white dark:bg-[#0B192C] border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-300"
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
                            Belum Mengunggah Bukti
                        </span>
                        <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-[#0066CC] flex items-center justify-center">
                            <CreditCard className="w-4 h-4" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-[#0A1D37] dark:text-white mt-2">{unsubmittedCount}</p>
                    <p className="text-[11px] text-slate-400 mt-1">Draf pendaftaran aktif</p>
                </div>
            </div>

            {/* Filter Bar & Tabel */}
            <div className="bg-white dark:bg-[#0B192C] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-500 uppercase mr-1">Filter Status:</span>
                        {[
                            { key: "all", label: "Semua" },
                            { key: "proof_uploaded", label: `Perlu Verifikasi (${pendingCount})` },
                            { key: "approved", label: "Disetujui" },
                            { key: "rejected", label: "Ditolak" },
                            { key: "pending_payment", label: "Belum Bayar" },
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setStatusFilter(tab.key)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                                    statusFilter === tab.key
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
                            placeholder="Cari peserta / skema..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="py-20 text-center space-y-2">
                        <div className="inline-block w-8 h-8 border-4 border-[#0066CC] border-t-transparent rounded-full animate-spin" />
                        <p className="text-xs text-slate-500">Memuat data pembayaran...</p>
                    </div>
                ) : filteredPayments.length === 0 ? (
                    <div className="py-16 text-center text-slate-400 text-sm">
                        Tidak ada data pembayaran yang sesuai dengan kriteria filter.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-[#F8FAFC] dark:bg-[#071120] text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 text-xs">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Nama Peserta & Kontak</th>
                                    <th className="px-6 py-4 font-semibold">Skema Sertifikasi</th>
                                    <th className="px-6 py-4 font-semibold">Rincian Transfer Asesi</th>
                                    <th className="px-6 py-4 font-semibold">Bukti Struk</th>
                                    <th className="px-6 py-4 font-semibold">Status</th>
                                    <th className="px-6 py-4 font-semibold text-right">Aksi Validasi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {filteredPayments.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition">
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-[#0A1D37] dark:text-white">{item.participant_name}</p>
                                            <p className="text-xs text-slate-400 font-mono">NIK: {item.participant_nik || "—"}</p>
                                            <p className="text-[11px] text-slate-500">{item.participant_phone || item.participant_email}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-[10px] font-bold text-[#0066CC] bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded">
                                                {item.scheme_code}
                                            </span>
                                            <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 mt-1 max-w-xs">
                                                {item.scheme_name}
                                            </p>
                                            <p className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">
                                                Tagihan: {item.amount || "Rp 1.200.000"}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.sender_bank ? (
                                                <div className="text-xs space-y-0.5">
                                                    <p className="font-bold text-slate-800 dark:text-slate-200">
                                                        {item.sender_bank} <span className="font-normal text-slate-400">a.n.</span> {item.sender_account_name}
                                                    </p>
                                                    {item.sender_account_number && (
                                                        <p className="text-[11px] font-mono text-slate-400">Rek: {item.sender_account_number}</p>
                                                    )}
                                                    {item.transfer_amount && (
                                                        <p className="text-[11px] text-slate-600 dark:text-slate-300 font-semibold">
                                                            Nominal: {item.transfer_amount}
                                                        </p>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-xs text-slate-400 italic">Belum ada rincian</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.proof_document_id ? (
                                                <button
                                                    onClick={() => setSelectedProofPayment(item)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#0066CC] dark:text-blue-300 hover:bg-blue-100 text-xs font-semibold transition cursor-pointer"
                                                >
                                                    <Eye className="w-3.5 h-3.5" />
                                                    <span>Lihat Bukti</span>
                                                </button>
                                            ) : (
                                                <span className="text-xs text-slate-400 italic">Belum diunggah</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.status === "approved" && (
                                                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                                                    Disetujui
                                                </span>
                                            )}
                                            {item.status === "proof_uploaded" && (
                                                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                                                    Menunggu Verifikasi
                                                </span>
                                            )}
                                            {item.status === "rejected" && (
                                                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
                                                    Ditolak
                                                </span>
                                            )}
                                            {item.status === "pending_payment" && (
                                                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                                    Belum Bayar
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            {item.status === "proof_uploaded" && (
                                                <>
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleApprove(item.id)}
                                                        disabled={processing}
                                                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8 font-bold"
                                                    >
                                                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Setujui
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        onClick={() => {
                                                            setRejectPaymentId(item.id);
                                                            setRejectionReason("");
                                                        }}
                                                        disabled={processing}
                                                        className="bg-red-600 hover:bg-red-700 text-white text-xs h-8 font-bold"
                                                    >
                                                        <XCircle className="w-3.5 h-3.5 mr-1" /> Tolak
                                                    </Button>
                                                </>
                                            )}

                                            {item.status === "approved" && (
                                                <span className="text-xs text-emerald-600 font-semibold flex items-center justify-end gap-1">
                                                    <Check className="w-3.5 h-3.5" /> Selesai
                                                </span>
                                            )}

                                            {item.status === "rejected" && (
                                                <button
                                                    onClick={() => {
                                                        setRejectPaymentId(item.id);
                                                        setRejectionReason(item.rejection_reason || "");
                                                    }}
                                                    className="text-xs text-red-600 hover:underline cursor-pointer"
                                                >
                                                    Lihat Alasan
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* MODAL PREVIEW BUKTI TRANSFER */}
            {selectedProofPayment && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-[#0B192C] rounded-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-base text-[#0A1D37] dark:text-white">
                                    Bukti Transfer Pembayaran
                                </h3>
                                <p className="text-xs text-slate-400">
                                    Peserta: {selectedProofPayment.participant_name} ({selectedProofPayment.scheme_name})
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedProofPayment(null)}
                                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1 space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 dark:bg-slate-900 p-4 rounded-xl">
                                <div>
                                    <span className="text-slate-400">Bank Pengirim:</span>
                                    <p className="font-bold text-slate-800 dark:text-slate-200">{selectedProofPayment.sender_bank || "—"}</p>
                                </div>
                                <div>
                                    <span className="text-slate-400">Pemilik Rekening:</span>
                                    <p className="font-bold text-slate-800 dark:text-slate-200">{selectedProofPayment.sender_account_name || "—"}</p>
                                </div>
                                <div>
                                    <span className="text-slate-400">Nomor Rekening:</span>
                                    <p className="font-bold font-mono text-slate-800 dark:text-slate-200">{selectedProofPayment.sender_account_number || "—"}</p>
                                </div>
                                <div>
                                    <span className="text-slate-400">Nominal Transfer:</span>
                                    <p className="font-bold font-mono text-emerald-600">{selectedProofPayment.transfer_amount || selectedProofPayment.amount}</p>
                                </div>
                                {selectedProofPayment.notes && (
                                    <div className="col-span-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                                        <span className="text-slate-400">Catatan Peserta:</span>
                                        <p className="text-slate-700 dark:text-slate-300 mt-0.5">{selectedProofPayment.notes}</p>
                                    </div>
                                )}
                            </div>

                            <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-2 bg-slate-100 dark:bg-slate-950 text-center min-h-[300px] flex items-center justify-center">
                                {selectedProofPayment.proof_mime_type?.includes("pdf") ? (
                                    <div className="space-y-3 py-10">
                                        <FileText className="w-16 h-16 text-red-500 mx-auto" />
                                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Berkas Bukti Transfer (PDF)</p>
                                        <a
                                            href={`/api/admin/payments/${selectedProofPayment.id}/proof`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0066CC] text-white text-xs font-semibold"
                                        >
                                            <Download className="w-4 h-4" /> Unduh Dokumen PDF
                                        </a>
                                    </div>
                                ) : (
                                    /* eslint-disable-next-line @next/next/no-img-element */
                                    <img
                                        src={`/api/admin/payments/${selectedProofPayment.id}/proof`}
                                        alt="Bukti Transfer"
                                        className="max-h-[420px] max-w-full rounded-lg object-contain mx-auto shadow-sm"
                                        onError={(e) => {
                                            (e.currentTarget as HTMLElement).style.display = "none";
                                        }}
                                    />
                                )}
                            </div>
                        </div>

                        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3 bg-slate-50 dark:bg-slate-900">
                            {selectedProofPayment.status === "proof_uploaded" && (
                                <>
                                    <Button
                                        onClick={() => {
                                            const id = selectedProofPayment.id;
                                            setSelectedProofPayment(null);
                                            setRejectPaymentId(id);
                                        }}
                                        variant="outline"
                                        className="text-red-600 border-red-300 hover:bg-red-50 text-xs font-bold h-9"
                                    >
                                        <XCircle className="w-4 h-4 mr-1.5" /> Tolak
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            const id = selectedProofPayment.id;
                                            setSelectedProofPayment(null);
                                            void handleApprove(id);
                                        }}
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold h-9"
                                    >
                                        <CheckCircle2 className="w-4 h-4 mr-1.5" /> Setujui Pembayaran
                                    </Button>
                                </>
                            )}
                            <Button
                                onClick={() => setSelectedProofPayment(null)}
                                variant="outline"
                                className="text-xs h-9"
                            >
                                Tutup
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL TOLAK PEMBAYARAN */}
            {rejectPaymentId && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-[#0B192C] rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                            <h3 className="font-bold text-base text-red-600 flex items-center gap-2">
                                <XCircle className="w-5 h-5" />
                                Tolak Bukti Pembayaran
                            </h3>
                            <button
                                onClick={() => setRejectPaymentId(null)}
                                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleRejectSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                    Alasan Penolakan <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    required
                                    rows={3}
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    placeholder="Contoh: Bukti transfer buram/tidak terbaca, atau nominal transfer kurang dari tagihan..."
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-red-500"
                                />
                                <p className="text-[11px] text-slate-400 mt-1">
                                    Catatan ini akan langsung ditampilkan ke dashboard asesi peserta agar dapat melakukan upload ulang.
                                </p>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setRejectPaymentId(null)}
                                    className="text-xs h-9"
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold h-9"
                                >
                                    {processing ? "Memproses..." : "Konfirmasi Tolak"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
