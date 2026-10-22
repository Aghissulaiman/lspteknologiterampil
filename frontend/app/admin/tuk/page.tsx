"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Building2, Plus, Edit, Trash2, MapPin, Users } from "lucide-react";

export default function TUKPage() {
    // State data TUK (bisa ditambah, diedit, atau dihapus)
    const [tukList, setTukList] = useState([
        { id: 1, nama: "Lab Komputer Utama Lt. 2", lokasi: "Gedung A, Kampus Pusat", kapasitas: "30 Orang", status: "Aktif" },
        { id: 2, nama: "Ruang Uji Jaringan & Server", lokasi: "Gedung B, Sayap Barat", kapasitas: "20 Orang", status: "Aktif" },
        { id: 3, nama: "Studio Multimedia & Desain", lokasi: "Gedung C, Lantai 3", kapasitas: "25 Orang", status: "Perbaikan" },
    ]);

    // State untuk form tambah/edit sederhana
    const [namaTuk, setNamaTuk] = useState("");
    const [lokasiTuk, setLokasiTuk] = useState("");
    const [kapasitasTuk, setKapasitasTuk] = useState("");
    const [editingId, setEditingId] = useState<number | null>(null);

    // Fungsi Create / Update
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!namaTuk || !lokasiTuk || !kapasitasTuk) return;

        if (editingId !== null) {
            // Update data
            setTukList(tukList.map(item =>
                item.id === editingId ? { ...item, nama: namaTuk, lokasi: lokasiTuk, kapasitas: kapasitasTuk } : item
            ));
            setEditingId(null);
        } else {
            // Tambah data baru (Create)
            const newItem = {
                id: Date.now(),
                nama: namaTuk,
                lokasi: lokasiTuk,
                kapasitas: kapasitasTuk,
                status: "Aktif",
            };
            setTukList([...tukList, newItem]);
        }

        // Reset Form
        setNamaTuk("");
        setLokasiTuk("");
        setKapasitasTuk("");
    };

    // Fungsi Edit (Memasukkan data ke form)
    const handleEdit = (item: typeof tukList[0]) => {
        setEditingId(item.id);
        setNamaTuk(item.nama);
        setLokasiTuk(item.lokasi);
        setKapasitasTuk(item.kapasitas);
    };

    // Fungsi Delete
    const handleDelete = (id: number) => {
        setTukList(tukList.filter(item => item.id !== id));
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Halaman */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#0A1D37] dark:text-white font-serif">
                    Kelola Tempat Uji Kompetensi (TUK)
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">
                    Manajemen lokasi, kapasitas, dan status ruangan ujian sertifikasi.
                </p>
            </div>

            {/* Form Input / CRUD Card */}
            <div className="bg-white dark:bg-[#0B192C] p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm">
                <h2 className="text-lg font-bold text-[#0A1D37] dark:text-white mb-4">
                    {editingId !== null ? "Edit Data TUK" : "Tambah TUK Baru"}
                </h2>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">Nama TUK / Ruangan</label>
                        <input
                            type="text"
                            required
                            value={namaTuk}
                            onChange={(e) => setNamaTuk(e.target.value)}
                            placeholder="Contoh: Lab Jaringan"
                            className="w-full p-3 bg-[#F8FAFC] dark:bg-[#071120] border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-[#0066CC] text-[#0A1D37] dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">Lokasi / Gedung</label>
                        <input
                            type="text"
                            required
                            value={lokasiTuk}
                            onChange={(e) => setLokasiTuk(e.target.value)}
                            placeholder="Contoh: Gedung A Lt. 1"
                            className="w-full p-3 bg-[#F8FAFC] dark:bg-[#071120] border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-[#0066CC] text-[#0A1D37] dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">Kapasitas</label>
                        <input
                            type="text"
                            required
                            value={kapasitasTuk}
                            onChange={(e) => setKapasitasTuk(e.target.value)}
                            placeholder="Contoh: 25 Orang"
                            className="w-full p-3 bg-[#F8FAFC] dark:bg-[#071120] border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-[#0066CC] text-[#0A1D37] dark:text-white"
                        />
                    </div>

                    <div className="md:col-span-3 flex justify-end gap-2 pt-2">
                        {editingId !== null && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => { setEditingId(null); setNamaTuk(""); setLokasiTuk(""); setKapasitasTuk(""); }}
                                className="text-xs"
                            >
                                Batal
                            </Button>
                        )}
                        <Button type="submit" className="bg-[#0066CC] hover:bg-blue-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl">
                            {editingId !== null ? "Simpan Perubahan" : "+ Tambah TUK"}
                        </Button>
                    </div>
                </form>
            </div>

            {/* Tabel Data TUK */}
            <div className="bg-white dark:bg-[#0B192C] rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800/80">
                    <h2 className="text-lg font-bold text-[#0A1D37] dark:text-white">Daftar Tempat Uji Kompetensi Terdaftar</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Total TUK aktif saat ini: {tukList.length} lokasi.</p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-[#F8FAFC] dark:bg-[#071120] text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800/80">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Nama Ruangan / TUK</th>
                                <th className="px-6 py-4 font-semibold">Lokasi Gedung</th>
                                <th className="px-6 py-4 font-semibold">Kapasitas</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold text-right">Aksi (CRUD)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                            {tukList.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-[#0A1D37] dark:text-white flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-slate-800 text-[#0066CC] dark:text-blue-400 flex items-center justify-center shrink-0">
                                            <Building2 className="w-4 h-4" />
                                        </span>
                                        {item.nama}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300 flex items-center gap-1.5 mt-2">
                                        <MapPin className="w-3.5 h-3.5 text-slate-400" /> {item.lokasi}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                                        <span className="flex items-center gap-1.5">
                                            <Users className="w-3.5 h-3.5 text-slate-400" /> {item.kapasitas}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${item.status === "Aktif"
                                                ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
                                                : "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400"
                                            }`}>
                                            {item.status}
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