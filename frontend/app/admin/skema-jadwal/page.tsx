
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FolderKanban, Plus, Calendar, FileText, Trash2, Edit } from "lucide-react";

export default function SkemaJadwalPage() {
    // State daftar skema dengan nama bersih tanpa kata "Salinan"
    const [skemaList, setSkemaList] = useState([
        { id: 1, kode: "SKM-01", nama: "Teknisi Desktop (Desktop Technician)", kategori: "Teknis" },
        { id: 2, kode: "SKM-02", nama: "Teknisi Perbaikan Komputer (Computer Repair Technician)", kategori: "Teknis" },
        { id: 3, kode: "SKM-03", nama: "Asisten Instalasi dan Pemeliharaan Perangkat Keras", kategori: "Teknis" },
        { id: 4, kode: "SKM-04", nama: "Analis Web (Web Analyst)", kategori: "Pemrograman" },
        { id: 5, kode: "SKM-05", nama: "Pemrogram Muda (Associate Programmer)", kategori: "Pemrograman" },
        { id: 6, kode: "SKM-06", nama: "Skema Pemasaran Digital Berbasis AI (AI Powered Digital Marketing)", kategori: "AI & Digital" },
        { id: 7, kode: "SKM-07", nama: "Skema Penerapan AI Untuk Pembelajaran", kategori: "AI & Digital" },
        { id: 8, kode: "SKM-08", nama: "Skema Pengembang AI Agent (AI Agent Developer)", kategori: "AI & Digital" },
        { id: 9, kode: "SKM-09", nama: "Skema Pengembang AI Otomasi (AI Automation Developer)", kategori: "AI & Digital" },
        { id: 10, kode: "SKM-10", nama: "Skema Teknisi Laptop (Laptop Technician)", kategori: "Teknis" },
    ]);

    // State Form Input
    const [kodeSkema, setKodeSkema] = useState("");
    const [namaSkema, setNamaSkema] = useState("");
    const [kategoriSkema, setKategoriSkema] = useState("");
    const [editingId, setEditingId] = useState<number | null>(null);

    // Fungsi Tambah / Update (CRUD)
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!kodeSkema || !namaSkema || !kategoriSkema) return;

        if (editingId !== null) {
            // Update
            setSkemaList(skemaList.map(item =>
                item.id === editingId ? { ...item, kode: kodeSkema, nama: namaSkema, kategori: kategoriSkema } : item
            ));
            setEditingId(null);
        } else {
            // Create baru
            const newItem = {
                id: Date.now(),
                kode: kodeSkema,
                nama: namaSkema,
                kategori: kategoriSkema,
            };
            setSkemaList([...skemaList, newItem]);
        }

        // Reset Form
        setKodeSkema("");
        setNamaSkema("");
        setKategoriSkema("");
    };

    // Fungsi Edit (Masukkan data ke form)
    const handleEdit = (item: typeof skemaList[0]) => {
        setEditingId(item.id);
        setKodeSkema(item.kode);
        setNamaSkema(item.nama);
        setKategoriSkema(item.kategori);
    };

    // Fungsi Delete
    const handleDelete = (id: number) => {
        setSkemaList(skemaList.filter(item => item.id !== id));
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Halaman */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#0A1D37] dark:text-white font-serif">
                    Skema & Jadwal Sertifikasi
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">
                    Kelola daftar skema uji kompetensi LSP Teknologi Terampil lengkap dengan fitur CRUD.
                </p>
            </div>

            {/* Kartu Ringkasan Informasi */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-[#0B192C] p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-[#0066CC] flex items-center justify-center">
                        <FolderKanban className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-[#0A1D37] dark:text-white">{skemaList.length}</p>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">Total Skema Aktif</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#0B192C] p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center">
                        <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-[#0A1D37] dark:text-white">Gelombang 1</p>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">Jadwal Ujian Terdekat</p>
                    </div>
                </div>
            </div>

            {/* Form Input / CRUD Card */}
            <div className="bg-white dark:bg-[#0B192C] p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm">
                <h2 className="text-lg font-bold text-[#0A1D37] dark:text-white mb-4">
                    {editingId !== null ? "Edit Skema Sertifikasi" : "Tambah Skema Baru"}
                </h2>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">Kode Skema</label>
                        <input
                            type="text"
                            required
                            value={kodeSkema}
                            onChange={(e) => setKodeSkema(e.target.value)}
                            placeholder="Contoh: SKM-11"
                            className="w-full p-3 bg-[#F8FAFC] dark:bg-[#071120] border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-[#0066CC] text-[#0A1D37] dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">Nama Skema Sertifikasi</label>
                        <input
                            type="text"
                            required
                            value={namaSkema}
                            onChange={(e) => setNamaSkema(e.target.value)}
                            placeholder="Contoh: Skema Pengembang Mobile"
                            className="w-full p-3 bg-[#F8FAFC] dark:bg-[#071120] border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-[#0066CC] text-[#0A1D37] dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">Kategori Bidang</label>
                        <input
                            type="text"
                            required
                            value={kategoriSkema}
                            onChange={(e) => setKategoriSkema(e.target.value)}
                            placeholder="Contoh: Pemrograman"
                            className="w-full p-3 bg-[#F8FAFC] dark:bg-[#071120] border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-[#0066CC] text-[#0A1D37] dark:text-white"
                        />
                    </div>

                    <div className="md:col-span-3 flex justify-end gap-2 pt-2">
                        {editingId !== null && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => { setEditingId(null); setKodeSkema(""); setNamaSkema(""); setKategoriSkema(""); }}
                                className="text-xs"
                            >
                                Batal
                            </Button>
                        )}
                        <Button type="submit" className="bg-[#0066CC] hover:bg-blue-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl flex items-center gap-1.5">
                            <Plus className="w-4 h-4" />
                            {editingId !== null ? "Simpan Perubahan" : "Tambah Skema"}
                        </Button>
                    </div>
                </form>
            </div>

            {/* Tabel Daftar Skema */}
            <div className="bg-white dark:bg-[#0B192C] rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800/80">
                    <h2 className="text-lg font-bold text-[#0A1D37] dark:text-white">Daftar Dokumen Skema Uji</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Seluruh skema kompetensi yang tersedia untuk pendaftaran asesi.</p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-[#F8FAFC] dark:bg-[#071120] text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800/80">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Kode Skema</th>
                                <th className="px-6 py-4 font-semibold">Nama Skema Sertifikasi</th>
                                <th className="px-6 py-4 font-semibold">Kategori Bidang</th>
                                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                            {skemaList.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                                    <td className="px-6 py-4 font-mono font-medium text-slate-600 dark:text-slate-300">
                                        {item.kode}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-[#0A1D37] dark:text-white flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-slate-800 text-[#0066CC] dark:text-blue-400 flex items-center justify-center shrink-0">
                                            <FileText className="w-4 h-4" />
                                        </span>
                                        <span className="leading-snug">{item.nama}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-block px-3 py-1 rounded-full bg-blue-50 dark:bg-slate-800 text-[#0066CC] dark:text-blue-400 text-xs font-semibold">
                                            {item.kategori}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleEdit(item)}
                                            className="h-8 text-xs border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                                        >
                                            <Edit className="w-3.5 h-3.5 mr-1" /> Edit
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDelete(item.id)}
                                            className="h-8 text-xs text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900/40 dark:hover:bg-red-950/30"
                                        >
                                            <Trash2 className="w-3.5 h-3.5 mr-1" /> Hapus
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}