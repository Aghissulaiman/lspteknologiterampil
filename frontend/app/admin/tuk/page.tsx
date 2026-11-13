"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Building2, Plus, Edit, Trash2, MapPin, Users, Phone, Mail, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

type SchemeItem = {
    id: string;
    code: string;
    name: string;
};

type TestSite = {
    id: string;
    name: string;
    address: string;
    phone: string;
    email: string;
    site_type: string;
    contact_person: string;
    is_active: boolean;
    schemes: SchemeItem[];
};

export default function TUKPage() {
    const [tukList, setTukList] = useState<TestSite[]>([]);
    const [schemes, setSchemes] = useState<SchemeItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Form inputs
    const [editingId, setEditingId] = useState<string | null>(null);
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [siteType, setSiteType] = useState("Mandiri");
    const [contactPerson, setContactPerson] = useState("");
    const [selectedSchemeIds, setSelectedSchemeIds] = useState<string[]>([]);
    const [submitting, setSubmitting] = useState(false);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [tukRes, schemesRes] = await Promise.all([
                fetch("/api/admin/test-sites", { cache: "no-store" }),
                fetch("/api/public/schemes", { cache: "no-store" }),
            ]);

            if (tukRes.ok) {
                const data = await tukRes.json();
                setTukList(data.testSites || []);
            }
            if (schemesRes.ok) {
                const sData = await schemesRes.json();
                setSchemes(sData.schemes || []);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Gagal memuat data TUK.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadData();
    }, []);

    const resetForm = () => {
        setEditingId(null);
        setName("");
        setAddress("");
        setPhone("");
        setEmail("");
        setSiteType("Mandiri");
        setContactPerson("");
        setSelectedSchemeIds([]);
    };

    const handleEdit = (item: TestSite) => {
        setEditingId(item.id);
        setName(item.name);
        setAddress(item.address);
        setPhone(item.phone || "");
        setEmail(item.email || "");
        setSiteType(item.site_type || "Mandiri");
        setContactPerson(item.contact_person || "");
        setSelectedSchemeIds(item.schemes ? item.schemes.map((s) => s.id) : []);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedSchemeIds.length === 0) {
            alert("Harap pilih minimal satu skema sertifikasi yang didukung oleh TUK ini!");
            return;
        }
        setSubmitting(true);
        try {
            if (editingId) {
                const res = await fetch(`/api/admin/test-sites/${editingId}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name,
                        address,
                        phone,
                        email,
                        siteType,
                        contactPerson,
                        schemeIds: selectedSchemeIds,
                    }),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Gagal memperbarui TUK.");
                alert("Data TUK berhasil diperbarui!");
            } else {
                const res = await fetch("/api/admin/test-sites", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name,
                        address,
                        phone,
                        email,
                        siteType,
                        contactPerson,
                        schemeIds: selectedSchemeIds,
                    }),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Gagal menambahkan TUK baru.");
                alert("TUK baru berhasil ditambahkan!");
            }
            resetForm();
            await loadData();
        } catch (err) {
            alert(err instanceof Error ? err.message : "Terjadi kesalahan.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleToggleStatus = async (item: TestSite) => {
        try {
            const res = await fetch(`/api/admin/test-sites/${item.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isActive: !item.is_active }),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Gagal mengubah status TUK.");
            }
            await loadData();
        } catch (err) {
            alert(err instanceof Error ? err.message : "Terjadi kesalahan.");
        }
    };

    return (
        <div className="space-y-8 font-sans pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Halaman */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#0A1D37] dark:text-white font-serif">
                    Kelola Tempat Uji Kompetensi (TUK)
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">
                    Manajemen lokasi fisik/sewaktu, fasilitas, dan skema sertifikasi yang didukung oleh TUK.
                </p>
            </div>

            {error && (
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 text-sm flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <p>{error}</p>
                </div>
            )}

            {/* Form Input / CRUD Card */}
            <div className="bg-white dark:bg-[#0B192C] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <h2 className="text-base font-bold text-[#0A1D37] dark:text-white flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-[#0066CC]" />
                        {editingId ? "Edit Rincian TUK" : "Tambah TUK Baru"}
                    </h2>
                    {editingId && (
                        <button
                            type="button"
                            onClick={resetForm}
                            className="text-xs text-slate-500 hover:text-red-500 cursor-pointer"
                        >
                            Batal Edit
                        </button>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                                Nama Tempat Uji (TUK) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Contoh: TUK Mandiri LSP Pusat"
                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-[#0A1D37] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                                Jenis / Tipe TUK <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={siteType}
                                onChange={(e) => setSiteType(e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-[#0A1D37] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
                            >
                                <option value="Mandiri">TUK Mandiri</option>
                                <option value="Sewaktu">TUK Sewaktu</option>
                                <option value="Tempat Kerja">TUK Tempat Kerja</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                                Penanggung Jawab (PIC)
                            </label>
                            <input
                                type="text"
                                value={contactPerson}
                                onChange={(e) => setContactPerson(e.target.value)}
                                placeholder="Nama PIC TUK"
                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-[#0A1D37] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                                Alamat Lengkap TUK <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Jl. Kemang Timur No. 12, Jakarta Selatan"
                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-[#0A1D37] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                                Nomor Telepon / HP <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="021-7890123 / 0812..."
                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-[#0A1D37] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                                Email Resmi TUK <span className="text-slate-400 font-normal">(opsional)</span>
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="tuk@lspteknologiterampil.id"
                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-[#0A1D37] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
                            />
                        </div>
                    </div>

                    {/* Skema yang Didukung */}
                    <div>
                        <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1.5">
                            Skema Sertifikasi yang Dapat Diuji di TUK Ini:
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 max-h-44 overflow-y-auto">
                            {schemes.map((s) => {
                                const checked = selectedSchemeIds.includes(s.id);
                                return (
                                    <label
                                        key={s.id}
                                        className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-xs cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={checked}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedSchemeIds([...selectedSchemeIds, s.id]);
                                                } else {
                                                    setSelectedSchemeIds(selectedSchemeIds.filter((id) => id !== s.id));
                                                }
                                            }}
                                            className="rounded accent-[#0066CC]"
                                        />
                                        <span className="truncate">{s.code} - {s.name}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex justify-end pt-2">
                        <Button
                            type="submit"
                            disabled={submitting}
                            className="bg-[#0066CC] hover:bg-blue-700 text-white font-bold text-xs h-10 px-6 rounded-xl"
                        >
                            {submitting ? "Menyimpan..." : editingId ? "Perbarui TUK" : "Simpan TUK Baru"}
                        </Button>
                    </div>
                </form>
            </div>

            {/* Tabel List TUK */}
            <div className="bg-white dark:bg-[#0B192C] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100 dark:border-slate-800">
                    <h2 className="text-base font-bold text-[#0A1D37] dark:text-white">
                        Daftar Tempat Uji Kompetensi Aktif
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Total {tukList.length} lokasi TUK terdaftar dalam sistem.
                    </p>
                </div>

                {loading ? (
                    <div className="py-16 text-center text-xs text-slate-400">Memuat data TUK...</div>
                ) : tukList.length === 0 ? (
                    <div className="py-16 text-center text-xs text-slate-400">Belum ada lokasi TUK yang dibuat.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-[#F8FAFC] dark:bg-[#071120] text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 text-xs">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Nama & Tipe TUK</th>
                                    <th className="px-6 py-4 font-semibold">Alamat & Kontak</th>
                                    <th className="px-6 py-4 font-semibold">Skema Terhubung</th>
                                    <th className="px-6 py-4 font-semibold">Status Operasional</th>
                                    <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {tukList.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition">
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-[#0A1D37] dark:text-white">{item.name}</p>
                                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-50 text-[#0066CC] dark:bg-blue-950/60 dark:text-blue-300 mt-1">
                                                TUK {item.site_type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs">
                                            <p className="text-slate-700 dark:text-slate-300 max-w-sm truncate flex items-center gap-1.5">
                                                <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                                                <span>{item.address}</span>
                                            </p>
                                            <p className="text-slate-400 mt-0.5 flex items-center gap-1.5">
                                                <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                                                <span>{item.phone}</span>
                                                {item.contact_person && <span>(PIC: {item.contact_person})</span>}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1 max-w-xs">
                                                {item.schemes && item.schemes.length > 0 ? (
                                                    item.schemes.map((s) => (
                                                        <span
                                                            key={s.id}
                                                            className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-600 dark:text-slate-300"
                                                        >
                                                            {s.code}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-xs text-slate-400 italic">Belum ada skema</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                type="button"
                                                onClick={() => handleToggleStatus(item)}
                                                className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition ${
                                                    item.is_active
                                                        ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400"
                                                        : "bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400"
                                                }`}
                                            >
                                                {item.is_active ? "Aktif" : "Nonaktif"}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleEdit(item)}
                                                className="h-8 text-xs font-bold"
                                            >
                                                <Edit className="w-3.5 h-3.5 mr-1" /> Edit
                                            </Button>
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
