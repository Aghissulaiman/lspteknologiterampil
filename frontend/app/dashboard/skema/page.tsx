
// "use client";

// import React, { useState } from "react";
// import { useRouter } from "next/navigation";

// // Data 5 Skema Lengkap
// const SCHEMES = [
//     {
//         id: "skm-desktop",
//         code: "SKM-01",
//         name: "Teknisi Desktop (Desktop Technician)",
//         level: "Level 2",
//         type: "Okupasi",
//         method: "Offline",
//         price: "Rp 1.200.000",
//         rating: 4.8,
//         reviewCount: 12,
//         asesiCount: 50,
//         image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=600&q=80",
//         units: [
//             { code: "J.620900.010.02", title: "Memasang Motherboard" },
//             { code: "J.620900.014.02", title: "Merawat CPU" },
//             { code: "J.620900.015.02", title: "Merawat Hard Disk" },
//             { code: "J.620900.016.02", title: "Merawat Peripheral" },
//             { code: "J.620900.025.02", title: "Melakukan Instalasi Sistem Operasi" },
//             { code: "J.620900.026.02", title: "Melakukan Instalasi Software Aplikasi" },
//             { code: "J.620900.031.02", title: "Merawat Sistem Operasi" }
//         ],
//         reqs: [
//             "Ijazah minimal SMP sederajat",
//             "Pasfoto 3x4 latar merah"
//         ]
//     },
//     {
//         id: "skm-repair",
//         code: "SKM-02",
//         name: "Teknisi Perbaikan Komputer (Computer Repair)",
//         level: "Level 3",
//         type: "Okupasi",
//         method: "Offline",
//         price: "Rp 1.500.000",
//         rating: 4.9,
//         reviewCount: 18,
//         asesiCount: 42,
//         image: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=600&q=80",
//         units: [
//             { code: "J.620200.004.01", title: "Mendiagnosis Kerusakan Perangkat Keras" },
//             { code: "J.620200.005.01", title: "Melakukan Perbaikan Perangkat Keras" },
//         ],
//         reqs: [
//             "Ijazah minimal SMA/SMK sederajat",
//             "Sertifikat Pelatihan Perbaikan Komputer"
//         ]
//     },
//     {
//         id: "skm-hardware",
//         code: "SKM-03",
//         name: "Asisten Instalasi & Pemeliharaan Perangkat Keras",
//         level: "Level 2",
//         type: "Okupasi",
//         method: "Offline",
//         price: "Rp 1.000.000",
//         rating: 4.7,
//         reviewCount: 10,
//         asesiCount: 28,
//         image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
//         units: [
//             { code: "J.620200.006.01", title: "Menyiapkan Perangkat Keras Komputer" },
//             { code: "J.620200.007.01", title: "Melakukan Pemeliharaan Rutin" },
//         ],
//         reqs: [
//             "Ijazah minimal SMP sederajat",
//             "Surat Keterangan Sehat"
//         ]
//     },
//     {
//         id: "skm-web",
//         code: "SKM-04",
//         name: "Analis Web (Web Analyst)",
//         level: "Level 4",
//         type: "Okupasi",
//         method: "Offline",
//         price: "Rp 2.000.000",
//         rating: 5.0,
//         reviewCount: 8,
//         asesiCount: 35,
//         image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
//         units: [
//             { code: "J.620100.004.02", title: "Menggunakan Struktur Data" },
//             { code: "J.620100.005.02", title: "Mengimplementasikan User Interface" },
//             { code: "J.620100.017.02", title: "Mengimplementasikan Pemrograman Terstruktur" },
//         ],
//         reqs: [
//             "Ijazah minimal SMA/SMK atau sederajat",
//             "Sertifikat Pelatihan Web Analyst",
//             "Portofolio Laporan Analisis Web"
//         ]
//     },
//     {
//         id: "skm-prog",
//         code: "SKM-05",
//         name: "Pemrogram Muda (Associate Programmer)",
//         level: "Level 3",
//         type: "Okupasi",
//         method: "Offline",
//         price: "Rp 1.750.000",
//         rating: 4.9,
//         reviewCount: 22,
//         asesiCount: 60,
//         image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80",
//         units: [
//             { code: "J.620100.015.01", title: "Menulis Kode dengan Prinsip Clean Code" },
//             { code: "J.620100.016.01", title: "Melakukan Debugging Kode Program" },
//             { code: "J.620100.022.02", title: "Menggunakan Library atau Framework" },
//         ],
//         reqs: [
//             "Ijazah minimal SMA/SMK atau sederajat",
//             "Tautan Repository / Source Code Aplikasi (Portofolio)"
//         ]
//     }
// ];

// const SCHEDULES = [
//     { id: "jdw-1", tukName: "TUK Sewaktu Lab Komputer A", date: "15 Nov 2026", time: "08:00 WIB", quota: 12 },
//     { id: "jdw-2", tukName: "TUK Mandiri Teknologi Terampil", date: "22 Nov 2026", time: "09:00 WIB", quota: 20 },
// ];

// export default function SkemaPage() {
//     const router = useRouter();
//     const [activeDetail, setActiveDetail] = useState<typeof SCHEMES[0] | null>(null);
//     const [selectedScheduleId, setSelectedScheduleId] = useState("");

//     const handleLanjutAPL = () => {
//         if (!selectedScheduleId) return alert("Pilih jadwal ujian terlebih dahulu!");
//         if (activeDetail) {
//             localStorage.setItem("selectedSchemeId", activeDetail.id);
//         }
//         router.push("/dashboard/apl");
//     };

//     // ==========================================
//     // VIEW 1: KATALOG SKEMA (GRID CARD)
//     // ==========================================
//     if (!activeDetail) {
//         return (
//             <div className="space-y-8 font-sans">
//                 <div>
//                     <h2 className="text-3xl sm:text-4xl font-semibold text-[#1a2b4c] dark:text-white leading-tight tracking-tight">
//                         Wujudkan <span className="text-[#0070BA] dark:text-blue-400">#KompetensiTerbukti</span> bagi<br className="hidden sm:block" />
//                         professional masa kini melalui<br className="hidden sm:block" />
//                         sertifikasi berstandar BNSP
//                     </h2>
//                     <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium">
//                         Pilih program sertifikasi yang sesuai dengan bidang keahlian Anda.
//                     </p>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                     {SCHEMES.map((scheme) => (
//                         <div key={scheme.id} className="skema-card">
//                             <div className="h-40 bg-slate-200 dark:bg-slate-800 relative overflow-hidden">
//                                 <img src={scheme.image} alt={scheme.name} className="w-full h-full object-cover" />
//                                 <div className="absolute top-3 right-3 px-3 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-lg flex items-center gap-1.5 shadow-sm">
//                                     <span className="text-blue-600 dark:text-blue-400 font-semibold text-xs">BNSP</span>
//                                 </div>
//                             </div>

//                             <div className="p-5 flex flex-col flex-1">
//                                 <h3 className="text-lg font-semibold text-[#1a2b4c] dark:text-white leading-snug mb-3">
//                                     {scheme.name}
//                                 </h3>

//                                 <div className="flex flex-wrap gap-2 mb-6">
//                                     <span className="px-3 py-1 rounded-md border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-[11px] font-medium flex items-center gap-1.5">
//                                         {scheme.level}
//                                     </span>
//                                     <span className="px-3 py-1 rounded-md border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-[11px] font-medium flex items-center gap-1.5">
//                                          {scheme.type}
//                                     </span>
//                                     <span className="px-3 py-1 rounded-md border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-[11px] font-medium flex items-center gap-1.5">
//                                          {scheme.method}
//                                     </span>
//                                 </div>

//                                 <div className="mt-auto border-t border-slate-100 dark:border-slate-800 pt-4 flex items-end justify-between">
//                                     <div>
//                                         <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">Biaya Sertifikasi</p>
//                                         <p className="text-lg font-semibold text-[#1a2b4c] dark:text-white">{scheme.price}</p>
//                                     </div>
//                                     <div className="text-right">
//                                         <p className="text-sm font-semibold text-amber-500 mb-0.5">★ {scheme.rating} <span className="text-slate-400 dark:text-slate-500 font-normal">({scheme.reviewCount})</span></p>
//                                         <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400"> {scheme.asesiCount} Asesi</p>
//                                     </div>
//                                 </div>

//                                 <button
//                                     onClick={() => setActiveDetail(scheme)}
//                                     className="mt-5 w-full py-3.5 rounded-xl bg-[#0f213a] dark:bg-[#0070BA] hover:bg-[#1a365d] dark:hover:bg-blue-600 text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors"
//                                 >
//                                     Detail Skema <span></span>
//                                 </button>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         );
//     }

//     // ==========================================
//     // VIEW 2: HALAMAN DETAIL SKEMA & PILIH JADWAL
//     // ==========================================
//     return (
//         <div className="font-sans">
           
    
//             <div className="flex flex-col lg:flex-row gap-8 items-start">
//                 <div className="flex-1 space-y-8 min-w-0">
//                     <div className="skema-container">
//                         <div className="flex items-center gap-3 mb-4">
//                             <span className="px-3 py-1 rounded-md bg-blue-50 dark:bg-blue-900/30 text-[#0070BA] dark:text-blue-400 text-xs font-medium font-mono border border-blue-100 dark:border-blue-800/50">{activeDetail.code}</span>
//                             <span className="px-3 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700">{activeDetail.level}</span>
//                         </div>
//                         <h2 className="text-2xl sm:text-3xl font-semibold text-[#1a2b4c] dark:text-white mb-6">
//                             Skema Sertifikasi {activeDetail.name}
//                         </h2>

//                         <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-100 dark:border-slate-800 pt-6">
//                             <div>
//                                 <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Jenis Skema</p>
//                                 <p className="font-medium text-sm text-[#1a2b4c] dark:text-white">{activeDetail.type}</p>
//                             </div>
//                             <div>
//                                 <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Pelaksanaan</p>
//                                 <p className="font-medium text-sm text-[#1a2b4c] dark:text-white">{activeDetail.method}</p>
//                             </div>
//                             <div>
//                                 <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Total Unit</p>
//                                 <p className="font-medium text-sm text-[#1a2b4c] dark:text-white">{activeDetail.units.length} Unit SKKNI</p>
//                             </div>
//                             <div>
//                                 <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Biaya</p>
//                                 <p className="font-semibold text-sm text-emerald-600 dark:text-emerald-400">{activeDetail.price}</p>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="skema-container">
//                         <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
//                             <h3 className="text-lg font-semibold text-[#1a2b4c] dark:text-white flex items-center ">
//                                 <span className="text-[#0070BA] dark:text-blue-400"></span> Persyaratan Pendaftaran
//                             </h3>
//                         </div>
//                         <ul className="space-y-3">
//                             {activeDetail.reqs.map((req, idx) => (
//                                 <li key={idx} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
//                                     <span className="mt-0.5 w-5 h-5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-[#0070BA] dark:text-blue-400 flex items-center justify-center text-[10px] font-medium shrink-0">{idx + 1}</span>
//                                     <span className="leading-relaxed">{req}</span>
//                                 </li>
                                
//                             ))}
//                         </ul>
                        
//                     </div>

//                     <div className="bg-white dark:bg-[#0B192C] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
//                         <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
//                             <h3 className="text-lg font-semibold text-[#1a2b4c] dark:text-white flex items-center gap-2">
//                                 <span className="text-[#0070BA] dark:text-blue-400"></span> Struktur Unit Kompetensi
//                             </h3>
//                         </div>
//                         <div className="overflow-x-auto">
//                             <table className="w-full text-left">
//                                 <thead>
//                                     <tr className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B192C] text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
//                                         <th className="py-4 px-6 w-16 text-center">No</th>
//                                         <th className="py-4 px-6">Kode Unit</th>
//                                         <th className="py-4 px-6">Judul Unit Kompetensi</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-sm bg-white dark:bg-[#0B192C]">
//                                     {activeDetail.units.map((unit, idx) => (
//                                         <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
//                                             <td className="py-4 px-6 text-center font-medium text-slate-400 dark:text-slate-500">{idx + 1}</td>
//                                             <td className="py-4 px-6 font-mono text-xs font-medium text-[#0070BA] dark:text-blue-400">{unit.code}</td>
//                                             <td className="py-4 px-6 font-medium text-[#1a2b4c] dark:text-white">{unit.title}</td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="w-full lg:w-80 shrink-0 lg:sticky lg:top-28">
//                     <div className="bg-white dark:bg-[#0B192C] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
//                         <div className="p-6 bg-slate-50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800">
//                             <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Total Pendaftaran</p>
//                             <p className="text-2xl font-semibold text-[#1a2b4c] dark:text-white">{activeDetail.price}</p>
//                         </div>

//                         <div className="p-6 space-y-5">
//                             <div>
//                                 <p className="text-sm font-semibold text-[#1a2b4c] dark:text-white mb-3">Pilih Jadwal Ujian:</p>
//                                 <div className="space-y-2">
//                                     {SCHEDULES.map((jdw) => (
//                                         <label key={jdw.id} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selectedScheduleId === jdw.id ? "border-[#0070BA] dark:border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 ring-1 ring-[#0070BA] dark:ring-blue-500" : "border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600"
//                                             }`}>
//                                             <input
//                                                 type="radio"
//                                                 name="schedule"
//                                                 checked={selectedScheduleId === jdw.id}
//                                                 onChange={() => setSelectedScheduleId(jdw.id)}
//                                                 className="mt-1 accent-[#0070BA] dark:accent-blue-500"
//                                             />
//                                             <div className="min-w-0 flex-1">
//                                                 <p className="text-sm font-semibold text-[#1a2b4c] dark:text-white truncate">{jdw.date}</p>
//                                                 <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{jdw.tukName}</p>
//                                                 <p className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 mt-1.5">{jdw.quota} Kuota Tersisa</p>
//                                             </div>
//                                         </label>
//                                     ))}
//                                 </div>
//                             </div>

//                             <button
//                                 onClick={handleLanjutAPL}
//                                 className="skema-btn"
//                             >
//                                 Daftar & Lanjut APL-01
//                             </button>

//                             <div className="text-center pt-2">
//                                 <p className="text-[10px] text-slate-400 dark:text-slate-500">
//                                     Dengan mendaftar, Anda menyetujui syarat & ketentuan LSP.
//                                 </p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calendar, ShieldCheck, FileCode2, Star, CheckCircle2 } from "lucide-react";

// Data 5 Skema Lengkap
const SCHEMES = [
    {
        id: "skm-desktop",
        code: "SKM-RPL-001",
        nomorSkema: "SKM/BNSP/001/LSP-TTM/2026",
        masaBerlaku: "3 Tahun",
        name: "Teknisi Desktop (Desktop Technician)",
        level: "Level 3",
        type: "Okupasi",
        method: "Tatap Muka",
        price: "Rp 1.200.000",
        rating: 4.8,
        reviewCount: 12,
        asesiCount: 50,
        image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=600&q=80",
        description: "Lakukan instalasi, konfigurasi, perawatan, dan penanganan masalah pada perangkat keras serta sistem operasi komputer desktop sesuai standar industri.",
        units: [
            { code: "J.620900.010.02", title: "Memasang Motherboard" },
            { code: "J.620900.014.02", title: "Merawat CPU" },
            { code: "J.620900.015.02", title: "Merawat Hard Disk" },
            { code: "J.620900.016.02", title: "Merawat Peripheral" },
            { code: "J.620900.025.02", title: "Melakukan Instalasi Sistem Operasi" },
            { code: "J.620900.026.02", title: "Melakukan Instalasi Software Aplikasi" },
            { code: "J.620900.031.02", title: "Merawat Sistem Operasi" }
        ],
        reqs: [
            "Ijazah minimal SMP/SMA/SMK sederajat",
            "Pasfoto formal 3×4 latar belakang merah",
            "Identitas diri resmi (KTP / Kartu Pelajar)",
            "Sertifikat pelatihan komputer atau surat keterangan PKL bidang terkait"
        ]
    },
    {
        id: "skm-repair",
        code: "SKM-RPL-002",
        nomorSkema: "SKM/BNSP/002/LSP-TTM/2026",
        masaBerlaku: "3 Tahun",
        name: "Teknisi Perbaikan Komputer (Computer Repair)",
        level: "Level 5",
        type: "Okupasi",
        method: "Tatap Muka",
        price: "Rp 1.500.000",
        rating: 4.9,
        reviewCount: 18,
        asesiCount: 42,
        image: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=600&q=80",
        description: "Periksa, diagnosis, dan perbaiki kerusakan perangkat keras maupun perangkat lunak pada komputer secara menyeluruh.",
        units: [
            { code: "J.620200.004.01", title: "Mendiagnosis Kerusakan Perangkat Keras" },
            { code: "J.620200.005.01", title: "Melakukan Perbaikan Perangkat Keras" },
        ],
        reqs: [
            "Ijazah minimal SMA/SMK sederajat",
            "Sertifikat Pelatihan Perbaikan Komputer"
        ]
    },
    {
        id: "skm-hardware",
        code: "SKM-JTK-001",
        nomorSkema: "SKM/BNSP/003/LSP-TTM/2026",
        masaBerlaku: "3 Tahun",
        name: "Asisten Instalasi & Pemeliharaan Perangkat Keras",
        level: "Level 4",
        type: "Okupasi",
        method: "Tatap Muka",
        price: "Rp 1.000.000",
        rating: 4.7,
        reviewCount: 10,
        asesiCount: 28,
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
        description: "Bantu proses persiapan, instalasi, pemeriksaan, dan pemeliharaan berkala perangkat keras komputer sesuai prosedur kerja standar.",
        units: [
            { code: "J.620200.006.01", title: "Menyiapkan Perangkat Keras Komputer" },
            { code: "J.620200.007.01", title: "Melakukan Pemeliharaan Rutin" },
        ],
        reqs: [
            "Ijazah minimal SMP sederajat",
            "Surat Keterangan Sehat"
        ]
    },
    {
        id: "skm-web",
        code: "SKM-DSM-002",
        nomorSkema: "SKM/BNSP/004/LSP-TTM/2026",
        masaBerlaku: "3 Tahun",
        name: "Analis Web (Web Analyst)",
        level: "Level 5",
        type: "Okupasi",
        method: "Tatap Muka",
        price: "Rp 2.000.000",
        rating: 5.0,
        reviewCount: 8,
        asesiCount: 35,
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
        description: "Analisis struktur, kebutuhan pengguna, fungsi, dan kinerja situs web untuk menentukan rekomendasi arsitektur serta perbaikan.",
        units: [
            { code: "J.620100.004.02", title: "Menggunakan Struktur Data" },
            { code: "J.620100.005.02", title: "Mengimplementasikan User Interface" },
            { code: "J.620100.017.02", title: "Mengimplementasikan Pemrograman Terstruktur" },
        ],
        reqs: [
            "Ijazah minimal SMA/SMK atau sederajat",
            "Sertifikat Pelatihan Web Analyst",
            "Portofolio Laporan Analisis Web"
        ]
    },
    {
        id: "skm-prog",
        code: "SKM-KSJ-001",
        nomorSkema: "SKM/BNSP/005/LSP-TTM/2026",
        masaBerlaku: "3 Tahun",
        name: "Pemrogram Muda (Associate Programmer)",
        level: "Level 6",
        type: "Okupasi",
        method: "Tatap Muka",
        price: "Rp 1.750.000",
        rating: 4.9,
        reviewCount: 22,
        asesiCount: 60,
        image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80",
        description: "Bangun, kembangkan, dan uji program komputer dengan menerapkan algoritma pemrograman terstruktur maupun berorientasi objek.",
        units: [
            { code: "J.620100.015.01", title: "Menulis Kode dengan Prinsip Clean Code" },
            { code: "J.620100.016.01", title: "Melakukan Debugging Kode Program" },
            { code: "J.620100.022.02", title: "Menggunakan Library atau Framework" },
        ],
        reqs: [
            "Ijazah minimal SMA/SMK atau sederajat",
            "Tautan Repository / Source Code Aplikasi (Portofolio)"
        ]
    }
];

const SCHEDULES = [
    { id: "jdw-1", tukName: "TUK Sewaktu Lab Komputer A", date: "15 Nov 2026", time: "08:00 WIB", quota: 12 },
    { id: "jdw-2", tukName: "TUK Mandiri Teknologi Terampil", date: "22 Nov 2026", time: "09:00 WIB", quota: 20 },
];

export default function SkemaPage() {
    const router = useRouter();
    const [activeDetail, setActiveDetail] = useState<typeof SCHEMES[0] | null>(null);
    const [selectedScheduleId, setSelectedScheduleId] = useState("");

    const handleLanjutAPL = () => {
        if (!selectedScheduleId) return alert("Pilih jadwal ujian terlebih dahulu!");
        if (activeDetail) {
            localStorage.setItem("selectedSchemeId", activeDetail.id);
        }
        router.push("/dashboard/apl");
    };

    // ==========================================
    // VIEW 1: KATALOG SKEMA (GRID CARD)
    // ==========================================
    if (!activeDetail) {
        return (
            <div className="space-y-8 font-sans">
                <div>
                    <h2 className="text-3xl sm:text-4xl font-semibold text-[#1a2b4c] dark:text-white leading-tight tracking-tight">
                        Wujudkan <span className="text-[#0070BA] dark:text-blue-400">#KompetensiTerbukti</span> bagi<br className="hidden sm:block" />
                        professional masa kini melalui<br className="hidden sm:block" />
                        sertifikasi berstandar BNSP
                    </h2>
                    <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium">
                        Pilih program sertifikasi yang sesuai dengan bidang keahlian Anda.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {SCHEMES.map((scheme) => (
                        <div key={scheme.id} className="bg-white dark:bg-[#0B192C] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col justify-between transition-all hover:shadow-md">
                            <div>
                                <div className="h-40 bg-slate-200 dark:bg-slate-800 relative overflow-hidden">
                                    <img src={scheme.image} alt={scheme.name} className="w-full h-full object-cover" />
                                    <div className="absolute top-3 right-3 px-3 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-lg flex items-center gap-1.5 shadow-sm">
                                        <span className="text-[#0070BA] dark:text-blue-400 font-semibold text-xs">BNSP</span>
                                    </div>
                                </div>

                                <div className="p-5 flex flex-col flex-1">
                                    <h3 className="text-lg font-semibold text-[#1a2b4c] dark:text-white leading-snug mb-3 min-h-[3.5rem] line-clamp-2">
                                        {scheme.name}
                                    </h3>

                                    <div className="flex flex-wrap gap-2 mb-6">
                                        <span className="px-3 py-1 rounded-md border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-[11px] font-medium">
                                            {scheme.level}
                                        </span>
                                        <span className="px-3 py-1 rounded-md border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-[11px] font-medium">
                                            {scheme.type}
                                        </span>
                                        <span className="px-3 py-1 rounded-md border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-[11px] font-medium">
                                            {scheme.method}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 pt-0 mt-auto">
                                <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex items-end justify-between">
                                    <div>
                                        <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">Biaya Sertifikasi</p>
                                        <p className="text-lg font-semibold text-[#1a2b4c] dark:text-white">{scheme.price}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-amber-500 mb-0.5">★ {scheme.rating} <span className="text-slate-400 dark:text-slate-500 font-normal">({scheme.reviewCount})</span></p>
                                        <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400"> {scheme.asesiCount} Asesi</p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setActiveDetail(scheme)}
                                    className="mt-5 w-full py-3.5 rounded-xl bg-[#0f213a] dark:bg-[#0070BA] hover:bg-[#1a365d] dark:hover:bg-blue-600 text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors"
                                >
                                    Detail Skema
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // ==========================================
    // VIEW 2: HALAMAN DETAIL SKEMA (SESUAI GAMBAR[cite: 4])
    // ==========================================
    return (
        <div className="font-sans space-y-6">
           

            <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Kolom Kiri: Sesuai Gambar[cite: 4] */}
                <div className="flex-1 space-y-6 min-w-0">
                    {/* Card 1: Header & Info Utama */}
                    <div className="bg-white dark:bg-[#0B192C] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
                        <div className="flex flex-wrap items-center gap-2.5 mb-4">
                            <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-[#0070BA] dark:text-blue-400 text-xs font-semibold font-mono border border-blue-100 dark:border-blue-800/50">
                                {activeDetail.code}
                            </span>
                            <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700">
                                {activeDetail.level}
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/30 text-[#0070BA] dark:text-blue-400 text-xs font-medium border border-blue-200 dark:border-blue-900/50">
                                <FileCode2 className="h-3.5 w-3.5" />
                                No. Skema: {activeDetail.nomorSkema}
                            </span>
                        </div>

                        <h2 className="text-2xl sm:text-3xl font-bold text-[#1a2b4c] dark:text-white mb-3">
                            Skema Sertifikasi {activeDetail.name}
                        </h2>

                        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                            {activeDetail.description}
                        </p>

                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 border-t border-slate-100 dark:border-slate-800 pt-6">
                            <div>
                                <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">JENIS SKEMA</p>
                                <p className="font-semibold text-sm text-[#1a2b4c] dark:text-white">{activeDetail.type}</p>
                            </div>
                            <div>
                                <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">PELAKSANAAN</p>
                                <p className="font-semibold text-sm text-[#1a2b4c] dark:text-white">{activeDetail.method}</p>
                            </div>
                            <div>
                                <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">TOTAL UNIT</p>
                                <p className="font-semibold text-sm text-[#1a2b4c] dark:text-white">{activeDetail.units.length} Unit SKKNI</p>
                            </div>
                           
                            <div>
                                <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">BIAYA</p>
                                <p className="font-bold text-sm text-[#0070BA] dark:text-blue-400">{activeDetail.price}</p>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Persyaratan Pendaftaran (Sesuai Gambar[cite: 4]) */}
                    <div className="bg-white dark:bg-[#0B192C] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/30 mb-5 border border-slate-200/60 dark:border-slate-700/50">
                            <h3 className="text-lg font-semibold text-[#1a2b4c] dark:text-white">
                                Persyaratan Pendaftaran
                            </h3>
                        </div>
                        <ul className="space-y-3.5">
                            {activeDetail.reqs.map((req, idx) => (
                                <li key={idx} className="flex items-start gap-3.5 text-sm text-slate-600 dark:text-slate-300 sm:text-base">
                                    <span className="mt-0.5 w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-900/30 text-[#0070BA] dark:text-blue-400 flex items-center justify-center text-xs font-bold shrink-0">{idx + 1}</span>
                                    <span className="leading-relaxed">{req}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Card 3: Struktur Unit Kompetensi */}
                    <div className="bg-white dark:bg-[#0B192C] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                            <h3 className="text-lg font-semibold text-[#1a2b4c] dark:text-white">
                                Struktur Unit Kompetensi
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B192C] text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                                        <th className="py-4 px-6 w-16 text-center">No</th>
                                        <th className="py-4 px-6">Kode Unit</th>
                                        <th className="py-4 px-6">Judul Unit Kompetensi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-sm bg-white dark:bg-[#0B192C]">
                                    {activeDetail.units.map((unit, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                                            <td className="py-4 px-6 text-center font-medium text-slate-400 dark:text-slate-500">{idx + 1}</td>
                                            <td className="py-4 px-6 font-mono text-xs font-medium text-[#0070BA] dark:text-blue-400">{unit.code}</td>
                                            <td className="py-4 px-6 font-medium text-[#1a2b4c] dark:text-white">{unit.title}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Kolom Kanan: Pilihan Jadwal & Tombol Aksi */}
                <div className="w-full lg:w-80 shrink-0 lg:sticky lg:top-28">
                    <div className="bg-white dark:bg-[#0B192C] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
                        <div className="p-6 bg-slate-50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800">
                            <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Total Pendaftaran</p>
                            <p className="text-2xl font-semibold text-[#1a2b4c] dark:text-white">{activeDetail.price}</p>
                            <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-[#0070BA] dark:text-blue-400">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Masa berlaku sertifikat {activeDetail.masaBerlaku}
                            </p>
                        </div>

                        <div className="p-6 space-y-5">
                            <div>
                                <p className="text-sm font-semibold text-[#1a2b4c] dark:text-white mb-3">Pilih Jadwal Ujian:</p>
                                <div className="space-y-2">
                                    {SCHEDULES.map((jdw) => (
                                        <label key={jdw.id} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selectedScheduleId === jdw.id
                                                ? "border-[#0070BA] dark:border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 ring-1 ring-[#0070BA] dark:ring-blue-500"
                                                : "border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600"
                                            }`}>
                                            <input
                                                type="radio"
                                                name="schedule"
                                                checked={selectedScheduleId === jdw.id}
                                                onChange={() => setSelectedScheduleId(jdw.id)}
                                                className="mt-1 accent-[#0070BA] dark:accent-blue-500"
                                            />
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-semibold text-[#1a2b4c] dark:text-white truncate flex items-center gap-1.5">
                                                    <Calendar className="h-3.5 w-3.5 text-[#0070BA]" />
                                                    {jdw.date}
                                                </p>
                                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{jdw.tukName}</p>
                                                <p className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 mt-1.5">{jdw.quota} Kuota Tersisa</p>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={handleLanjutAPL}
                                className="w-full py-3.5 rounded-xl bg-[#0f213a] dark:bg-[#0070BA] hover:bg-[#1a365d] dark:hover:bg-blue-600 text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
                            >
                                Daftar &amp; Lanjut APL-01
                            </button>

                            <div className="text-center pt-2">
                                <p className="text-[10px] text-slate-400 dark:text-slate-500">
                                    Dengan mendaftar, Anda menyetujui syarat &amp; ketentuan LSP.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}