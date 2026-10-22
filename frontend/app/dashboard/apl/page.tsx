
// "use client";

// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { Inter } from "next/font/google";

// const inter = Inter({ subsets: ["latin"] });

// // Simulasi Database Syarat Dokumen (Nanti digantikan dengan API Backend: GET /schemes/:schemeId)
// const REQUIREMENTS_DB: Record<string, { id: string; label: string; isRequired: boolean }[]> = {
//     // Syarat untuk Teknisi Desktop / Hardware / Repair
//     "skm-desktop": [
//         { id: "doc-1", label: "Ijazah Terakhir / Transkrip", isRequired: true },
//         { id: "doc-2", label: "Sertifikat Pelatihan Teknisi Komputer", isRequired: true },
//     ],
//     "skm-repair": [
//         { id: "doc-1", label: "Ijazah Terakhir / Transkrip", isRequired: true },
//         { id: "doc-2", label: "Sertifikat PKL Perbaikan Komputer", isRequired: true },
//     ],
//     "skm-hardware": [
//         { id: "doc-1", label: "Ijazah Terakhir / Transkrip", isRequired: true },
//         { id: "doc-2", label: "Surat Keterangan Kerja di Bidang Hardware", isRequired: true },
//     ],
//     // Syarat untuk Programmer / Web Analyst (Pasti minta Portofolio/GitHub)
//     "skm-web": [
//         { id: "doc-1", label: "Ijazah Terakhir Bidang IT", isRequired: true },
//         { id: "doc-2", label: "Sertifikat Pelatihan UI/UX atau Web Analyst", isRequired: true },
//         { id: "doc-3", label: "Dokumen Portofolio Laporan Analisis Web", isRequired: false },
//     ],
//     "skm-prog": [
//         { id: "doc-1", label: "Ijazah Terakhir Bidang IT", isRequired: true },
//         { id: "doc-2", label: "Sertifikat Pemrograman (Java/Python/JS)", isRequired: true },
//         { id: "doc-3", label: "Tautan Repository / Source Code Aplikasi", isRequired: true },
//     ],
// };

// const UNITS = [
//     { id: "u1", code: "J.620100.004.02", title: "Menggunakan Struktur Data" },
//     { id: "u2", code: "J.620100.005.02", title: "Mengimplementasikan User Interface" },
// ];

// export default function AplPage() {
//     const router = useRouter();
//     const [activeSchemeId, setActiveSchemeId] = useState("skm-web");

//     // State untuk menyimpan file yang diupload (dinamis tanpa batas)
//     const [uploadedDocs, setUploadedDocs] = useState<Record<string, string>>({});

//     useEffect(() => {
//         // Membaca skema yang dipilih user dari halaman sebelumnya
//         const savedScheme = localStorage.getItem("selectedSchemeId");
//         if (savedScheme && REQUIREMENTS_DB[savedScheme]) {
//             setActiveSchemeId(savedScheme);
//         }
//     }, []);

//     // Ambil daftar syarat sesuai skema yang sedang aktif
//     const currentRequirements = REQUIREMENTS_DB[activeSchemeId] || REQUIREMENTS_DB["skm-desktop"];

//     return (
//         <div className="space-y-6">

//             {/* FR.APL-01 DOKUMEN PERSYARATAN */}
//             <div className="bg-white dark:bg-[#0B192C] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 sm:p-9">
//                 <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
//                     <div>
//                         <h3 className={`font-serif text-2xl font-bold text-[#0A1D37] dark:text-white ${inter.className}`}>FR.APL-01 • Dokumen Persyaratan</h3>
//                         <p className="text-xs text-slate-500 mt-1">
//                             Sistem menampilkan syarat khusus berdasarkan Skema yang Anda pilih.
//                         </p>
//                     </div>
//                     <span className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 text-[11px] font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">Tersimpan Privat</span>
//                 </div>

//                 {/* RENDER KOTAK UPLOAD SECARA DINAMIS (Ajaibnya React ada di sini!) */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                     {currentRequirements.map((req) => (
//                         <div key={req.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 hover:border-[#0066CC] transition-colors">
//                             <p className="text-xs font-bold text-[#0A1D37] dark:text-white mb-2">
//                                 {req.label} {req.isRequired && <span className="text-red-500">*</span>}
//                             </p>
//                             <input
//                                 type="file"
//                                 onChange={(e) => setUploadedDocs({ ...uploadedDocs, [req.id]: e.target.files?.[0]?.name || "" })}
//                                 className="text-xs file:bg-[#0066CC] file:text-white file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:font-semibold hover:file:bg-blue-700 cursor-pointer"
//                             />
//                             {uploadedDocs[req.id] && <p className="text-[11px] text-emerald-600 mt-2 font-bold">✓ {uploadedDocs[req.id]} terlampir</p>}
//                         </div>
//                     ))}
//                 </div>
//             </div>

//             {/* FR.APL-02 ASESMEN MANDIRI */}
//             <div className="bg-white dark:bg-[#0B192C] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 sm:p-9">
//                 <h3 className="`font-serif text-2xl font-bold text-[#0A1D37] dark:text-white ${inter.className}`">FR.APL-02 • Asesmen Mandiri</h3>
//                 <table className="w-full text-left">
//                     <thead>
//                         <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] uppercase text-slate-400">
//                             <th className="py-3 px-3">Unit Kompetensi</th>
//                             <th className="py-3 px-3 text-center w-36">K / BK</th>
//                             <th className="py-3 px-3">Bukti Portofolio</th>
//                         </tr>
//                     </thead>
//                     <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
//                         {UNITS.map((u, i) => (
//                             <tr key={u.id}>
//                                 <td className="py-4 px-3">
//                                     <span className="font-mono text-[11px] font-bold text-[#0066CC] block mb-0.5">{i + 1}. {u.code}</span>
//                                     <p className="font-bold text-[#0A1D37] dark:text-white">{u.title}</p>
//                                 </td>
//                                 <td className="py-4 px-3 text-center">
//                                     <label className="mr-3 font-bold text-emerald-600 cursor-pointer">
//                                         <input type="radio" name={u.id} defaultChecked className="mr-1 accent-emerald-600" /> K
//                                     </label>
//                                     <label className="font-bold text-red-500 cursor-pointer">
//                                         <input type="radio" name={u.id} className="mr-1 accent-red-500" /> BK
//                                     </label>
//                                 </td>
//                                 <td className="py-4 px-3">
//                                     <input type="text" placeholder="Link GitHub / Drive..." className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-xs focus:border-[#0066CC] focus:outline-none" />
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>

//                 <div className="flex justify-end pt-7">
//                     <button onClick={() => router.push("/dashboard/status")} className="px-7 py-3.5 rounded-xl bg-[#0066CC] hover:bg-blue-700 text-white font-semibold text-sm shadow-lg transition">
//                         Kirim Permohonan APL 
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const UNITS = [
    { id: "u1", code: "J.620900.010.02", title: "Memasang Motherboard" },
    { id: "u2", code: "J.620900.014.02", title: "Merawat CPU" },
    { id: "u3", code: "J.620900.015.02", title: "Merawat Hard Disk" },
    { id: "u4", code: "J.620900.016.02", title: "Merawat Peripheral" },
];

export default function AplPage() {
    const router = useRouter();

    // State untuk menyimpan nama file yang di-upload
    const [docs, setDocs] = useState({
        ijazah: "",
        sertifikat: "",
    });

    // State untuk asesmen mandiri (K / BK) dan portofolio per unit
    const [assessments, setAssessments] = useState<
        Record<string, { status: "K" | "BK"; portfolio: string }>
    >({
        u1: { status: "K", portfolio: "Sertifikat Pelatihan Hardware" },
        u2: { status: "K", portfolio: "Dokumentasi Praktik Lab" },
        u3: { status: "BK", portfolio: "" },
        u4: { status: "BK", portfolio: "" },
    });

    const updateAssessment = (id: string, field: "status" | "portfolio", value: string) => {
        setAssessments((prev) => ({
            ...prev,
            [id]: {
                status: field === "status" ? (value as "K" | "BK") : prev[id]?.status || "K",
                portfolio: field === "portfolio" ? value : prev[id]?.portfolio || "",
            },
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.push("/dashboard/status");
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 font-sans">

            {/* BAGIAN 1: FR.APL-01 (DOKUMEN PERSYARATAN PRIVAT) */}
            <div className="apl-section-box">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-5">
                    <div>
                        <span className="apl-badge-blue">Tahap 03 • Bagian 1 (FR.APL-01)</span>
                        <h3 className="text-2xl font-semibold text-[#1a2b4c] dark:text-white mt-2">
                            Unggah Dokumen <span className="text-[#0070BA] dark:text-blue-400">Persyaratan</span>
                        </h3>
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300">
                        <span></span> Tersimpan Privat & Aman
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                    <div className="apl-file-box">
                        <p className="font-semibold text-sm text-[#1a2b4c] dark:text-white mb-1">1. Ijazah Terakhir / Transkrip Nilai *</p>
                        <p className="text-[11px] text-slate-400 mb-3">Format PDF/JPG, Maks. 5MB</p>
                        <input
                            type="file"
                            accept=".pdf,image/*"
                            onChange={(e) => e.target.files?.[0] && setDocs({ ...docs, ijazah: e.target.files[0].name })}
                            className="text-xs file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:bg-[#0070BA] file:text-white file:font-semibold hover:file:bg-blue-700 cursor-pointer dark:text-slate-300"
                        />
                        {docs.ijazah && <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 font-medium">✓ {docs.ijazah}</p>}
                    </div>

                    <div className="apl-file-box">
                        <p className="font-semibold text-sm text-[#1a2b4c] dark:text-white mb-1">2. Sertifikat Pelatihan / Surat PKL *</p>
                        <p className="text-[11px] text-slate-400 mb-3">Format PDF/JPG, Maks. 5MB</p>
                        <input
                            type="file"
                            accept=".pdf,image/*"
                            onChange={(e) => e.target.files?.[0] && setDocs({ ...docs, sertifikat: e.target.files[0].name })}
                            className="text-xs file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:bg-[#0070BA] file:text-white file:font-semibold hover:file:bg-blue-700 cursor-pointer dark:text-slate-300"
                        />
                        {docs.sertifikat && <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 font-medium">✓ {docs.sertifikat}</p>}
                    </div>
                </div>
            </div>

            {/* BAGIAN 2: FR.APL-02 (ASESMEN MANDIRI) */}
            <div className="apl-section-box">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-5">
                    <span className="apl-badge-amber">Tahap 03 • Bagian 2 (FR.APL-02)</span>
                    <h3 className="text-2xl font-semibold text-[#1a2b4c] dark:text-white mt-2">
                        Asesmen Mandiri <span className="text-[#0070BA] dark:text-blue-400">Unit Kompetensi</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Centang <b>K (Kompeten)</b> atau <b>BK (Belum Kompeten)</b> pada setiap unit SKKNI dan lampirkan bukti portofolio.
                    </p>
                </div>

                <div className="overflow-x-auto pt-2">
                    <table className="apl-table">
                        <thead>
                            <tr className="apl-table-head">
                                <th className="py-3.5 px-4">Kode & Judul Unit Kompetensi</th>
                                <th className="py-3.5 px-4 text-center w-36">Penilaian (K/BK)</th>
                                <th className="py-3.5 px-4 w-72">Bukti Portofolio / Keterangan</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-sm">
                            {UNITS.map((u, i) => {
                                const current = assessments[u.id];
                                return (
                                    <tr key={u.id} className="apl-table-row">
                                        <td className="py-4 px-4">
                                            <span className="inline-block px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-[#0070BA] dark:text-blue-400 font-mono text-xs font-semibold mb-1">
                                                {i + 1}. {u.code}
                                            </span>
                                            <p className="font-semibold text-[#1a2b4c] dark:text-white">
                                                {u.title}
                                            </p>
                                        </td>

                                        <td className="py-4 px-4 text-center">
                                            <div className="flex items-center justify-center gap-3">
                                                <label className={`px-3 py-1 rounded-xl border text-xs font-semibold cursor-pointer transition ${current?.status === "K"
                                                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300"
                                                        : "border-slate-200 dark:border-slate-700 text-slate-500"
                                                    }`}>
                                                    <input
                                                        type="radio"
                                                        name={`unit-${u.id}`}
                                                        checked={current?.status === "K"}
                                                        onChange={() => updateAssessment(u.id, "status", "K")}
                                                        className="accent-emerald-600 mr-1"
                                                    />
                                                    K
                                                </label>

                                                <label className={`px-3 py-1 rounded-xl border text-xs font-semibold cursor-pointer transition ${current?.status === "BK"
                                                        ? "border-red-500 bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-300"
                                                        : "border-slate-200 dark:border-slate-700 text-slate-500"
                                                    }`}>
                                                    <input
                                                        type="radio"
                                                        name={`unit-${u.id}`}
                                                        checked={current?.status === "BK"}
                                                        onChange={() => updateAssessment(u.id, "status", "BK")}
                                                        className="accent-red-500 mr-1"
                                                    />
                                                    BK
                                                </label>
                                            </div>
                                        </td>

                                        <td className="py-4 px-4">
                                            <input
                                                type="text"
                                                placeholder="Link GitHub / Drive / Nama Berkas"
                                                value={current?.portfolio || ""}
                                                onChange={(e) => updateAssessment(u.id, "portfolio", e.target.value)}
                                                className="apl-input-sm"
                                            />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-end pt-6">
                    <button
                        type="submit"
                        className="px-7 py-3.5 rounded-xl bg-[#0070BA] hover:bg-blue-700 text-white font-semibold text-sm shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5"
                    >
                        Kirim Permohonan & Lihat Status 
                    </button>
                </div>
            </div>
        </form>
    );
}