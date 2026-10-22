// "use client";

// import React, { useState } from "react";
// import Link from "next/link";

// export default function StatusPage() {
//     const [status, setStatus] = useState<"ready" | "competent">("ready");

//     return (
//         <div className="space-y-6 font-sans">
//             {/* Simulasi Status BE */}
//             <div className="bg-blue-50 dark:bg-slate-900 border border-blue-100 dark:border-slate-800 rounded-2xl p-4 flex items-center justify-between print:hidden">
//                 <span className="text-xs font-semibold text-[#0A1D37] dark:text-slate-300">🎛️ Simulasi Status BE:</span>
//                 <div className="flex gap-2">
//                     <button onClick={() => setStatus("ready")} className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${status === "ready" ? "bg-[#0070BA] text-white" : "bg-white dark:bg-slate-800 text-slate-600 border border-slate-200"}`}>
//                         3. Siap Ujian (Asesor Ditugaskan)
//                     </button>
//                     <button onClick={() => setStatus("competent")} className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${status === "competent" ? "bg-[#0070BA] text-white" : "bg-white dark:bg-slate-800 text-slate-600 border border-slate-200"}`}>
//                         4. Kompeten (Sertifikat Terbit)
//                     </button>
//                 </div>
//             </div>

//             {/* Kartu Sertifikat Terbit (Jika Kompeten) */}
//             {status === "competent" && (
//                 <div className="bg-gradient-to-br from-[#0f213a] to-[#1a365d] text-white rounded-2xl p-6 sm:p-8 shadow-md flex items-center justify-between print:hidden border border-slate-200">
//                     <div>
//                         {/* <span className="inline-block px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-[11px] font-semibold uppercase mb-2">
//                             🏅 Sertifikat Kompetensi Resmi Diterbitkan
//                         </span> */}
//                         <h4 className="text-2xl font-bold">Selamat! Anda Dinyatakan Kompeten.</h4>
//                         <p className="text-xs text-blue-100 mt-1 font-mono">No. Sertifikat: TIK.6201.00891.2026</p>
//                     </div>
//                     <Link href="/" className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-[#0A1D37] font-semibold text-xs shadow-sm transition-colors">
//                         Validasi Publik 
//                     </Link>
//                 </div>
//             )}

//             {/* Kartu Ujian (Desain Lebih Clean & Border Soft) */}
//             <div className="bg-white dark:bg-[#0B192C] rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
//                 {/* Header Terang, Gak Biru Tua Lagi */}
//                 <div className="bg-slate-50 dark:bg-slate-800/50 p-6 sm:px-9 flex justify-between items-center border-b border-slate-100 dark:border-slate-800">
//                     <div>
//                         <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1">Kartu Tanda Peserta Uji Kompetensi</p>
//                         <h3 className="text-xl font-bold text-[#1a2b4c] dark:text-white">LSP Teknologi Terampil</h3>
//                     </div>
//                     <span className="font-mono text-xs text-[#0070BA] dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-lg border border-blue-100 dark:border-blue-800/50">APL-2026-00891</span>
//                 </div>

//                 <div className="p-6 sm:p-9 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
//                     <div className="flex flex-col items-center justify-center p-5 border border-slate-100 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/50">
//                         <div className="w-28 h-36 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xs text-slate-400 text-center shadow-sm">
//                             Pasfoto 3x4
//                         </div>
//                         <span className="mt-3 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 text-[11px] font-semibold">✓ TERVERIFIKASI</span>
//                     </div>

//                     <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-4 text-sm">
//                         <div>
//                             <p className="text-xs text-slate-500 mb-1">Nama Lengkap</p>
//                             <p className="font-semibold text-base text-[#1a2b4c] dark:text-white">Budi Santoso</p>
//                         </div>
//                         <div>
//                             <p className="text-xs text-slate-500 mb-1">NIK</p>
//                             <p className="font-mono font-semibold text-[#1a2b4c] dark:text-white">3201123456780001</p>
//                         </div>
//                         <div>
//                             <p className="text-xs text-slate-500 mb-1">Skema Sertifikasi</p>
//                             <p className="font-semibold text-[#0070BA]">Junior Web Developer (SKM-RPL-01)</p>
//                         </div>
//                         <div>
//                             <p className="text-xs text-slate-500 mb-1">Asesor Penguji</p>
//                             <p className="font-medium text-[#1a2b4c] dark:text-white">Ir. Hendra Wijaya, M.Kom</p>
//                         </div>
//                         <div className="sm:col-span-2 pt-4 border-t border-slate-100 dark:border-slate-800">
//                             <p className="text-xs text-slate-500 mb-1">Jadwal & Lokasi TUK Offline</p>
//                             <p className="font-semibold text-[#1a2b4c] dark:text-white">TUK Sewaktu Lab Komputer Terpadu A — 15 Nov 2026 (08:00 WIB)</p>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function StatusPage() {
    const [status, setStatus] = useState<"ready" | "competent">("ready");

    return (
        <div className="space-y-6 font-sans">
            {/* Simulasi Status BE */}
            <div className="status-simulasi-box">
                <div className="flex gap-2">
                    <button
                        onClick={() => setStatus("ready")}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${status === "ready"
                                ? "bg-[#0070BA] text-white shadow-sm"
                                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                            }`}
                    >
                        3. Siap Ujian (Asesor Ditugaskan)
                    </button>
                    <button
                        onClick={() => setStatus("competent")}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${status === "competent"
                                ? "bg-[#0070BA] text-white shadow-sm"
                                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                            }`}
                    >
                        4. Kompeten (Sertifikat Terbit)
                    </button>
                </div>
            </div>

            {/* Kartu Sertifikat Terbit (Jika Kompeten) */}
            {status === "competent" && (
                <div className="status-cert-banner">
                    <div>
                        <span className="inline-block px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-[11px] font-semibold uppercase mb-2">
                        Sertifikat Kompetensi Resmi Diterbitkan
                        </span>
                        <h4 className="text-2xl font-bold">Selamat! Anda Dinyatakan Kompeten.</h4>
                        <p className="text-xs text-blue-100 mt-1 font-mono">No. Sertifikat: TIK.6201.00891.2026</p>
                    </div>
                    <Link href="/" className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-[#0A1D37] font-semibold text-xs shadow-sm transition-colors">
                        Validasi Publik 
                    </Link>
                </div>
            )}

            {/* Kartu Ujian */}
            <div className="status-card-box">
                {/* Header Kartu */}
                <div className="status-card-header">
                    <div>
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1">
                            Kartu Tanda Peserta Uji Kompetensi
                        </p>
                        <h3 className="text-xl font-bold text-[#1a2b4c] dark:text-white">LSP Teknologi Terampil</h3>
                    </div>
                    <span className="font-mono text-xs text-[#0070BA] dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-lg border border-blue-100 dark:border-blue-800/50">
                        APL-2026-00891
                    </span>
                </div>

                <div className="p-6 sm:p-9 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    {/* Kotak Pasfoto */}
                    <div className="status-photo-box">
                        <div className="w-28 h-36 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xs text-slate-400 text-center shadow-sm">
                            Pasfoto 3x4
                        </div>
                        <span className="mt-3 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800 text-[11px] font-semibold">
                            ✓ TERVERIFIKASI
                        </span>
                    </div>

                    {/* Detail Informasi Peserta */}
                    <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-4 text-sm">
                        <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Nama Lengkap</p>
                            <p className="font-semibold text-base text-[#1a2b4c] dark:text-white">Budi Santoso</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">NIK</p>
                            <p className="font-mono font-semibold text-[#1a2b4c] dark:text-white">3201123456780001</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Skema Sertifikasi</p>
                            <p className="font-semibold text-[#0070BA] dark:text-blue-400">Junior Web Developer (SKM-RPL-01)</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Asesor Penguji</p>
                            <p className="font-medium text-[#1a2b4c] dark:text-white">Ir. Hendra Wijaya, M.Kom</p>
                        </div>
                        <div className="sm:col-span-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Jadwal & Lokasi TUK Offline</p>
                            <p className="font-semibold text-[#1a2b4c] dark:text-white">
                                TUK Sewaktu Lab Komputer Terpadu A — 15 Nov 2026 (08:00 WIB)
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}