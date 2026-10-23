"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Calendar, FileCode2, CheckCircle2 } from "lucide-react";
import { SCHEMES, SCHEDULES } from "@/lib/schemes";

export default function DetailSkemaPage() {
    const router = useRouter();
    const params = useParams();
    const schemeId = params.id;

    // Cari data skema berdasarkan id di URL
    const activeDetail = SCHEMES.find((s) => s.id === schemeId);
    const [selectedScheduleId, setSelectedScheduleId] = useState("");

    if (!activeDetail) {
        return (
            <div className="text-center py-20 space-y-4">
                <h2 className="text-xl font-bold text-slate-700 dark:text-white">Skema Sertifikasi Tidak Ditemukan</h2>
               
            </div>
        );
    }

    const handleLanjutAPL = () => {
        if (!selectedScheduleId) return alert("Pilih jadwal ujian terlebih dahulu!");
        localStorage.setItem("selectedSchemeId", activeDetail.id);
        router.push("/dashboard/apl");
    };

    return (
        <div className="font-sans space-y-6">
          
            <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Kolom Kiri: Info Utama, Persyaratan, & Unit Kompetensi */}
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

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-100 dark:border-slate-800 pt-6">
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

                    {/* Card 2: Persyaratan Pendaftaran */}
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