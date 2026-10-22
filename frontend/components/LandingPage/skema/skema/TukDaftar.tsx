"use client";

import React from "react";

export default function TukDaftar() {
    return (
        <section id="tuk" className="py-16 sm:py-24 bg-slate-50 dark:bg-[#071120] font-sans">
            <div className="max-w-7xl mx-auto px-6 sm:px-10">

                {/* Header Section TUK */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-[#0070BA] dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-4 border border-blue-200 dark:border-blue-800/50">
                        Fasilitas Ujian
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-bold text-[#1a2b4c] dark:text-white mb-4">
                        Tempat Uji Kompetensi <span className="text-[#0070BA] dark:text-blue-400">(TUK)</span>
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">
                        LSP Teknologi Terampil menyediakan lokasi ujian yang nyaman, berstandar industri, dan dilengkapi dengan perangkat keras memadai untuk memastikan kelancaran asesmen Anda.
                    </p>
                </div>

                {/* Grid Card TUK */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* TUK 1 */}
                    <div className="bg-white dark:bg-[#0B192C] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col sm:flex-row group">
                        <div className="sm:w-2/5 h-48 sm:h-auto bg-slate-200 dark:bg-slate-800 relative overflow-hidden shrink-0">
                            <img
                                src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=600&q=80"
                                alt="TUK Lab Komputer"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-3 left-3 px-3 py-1 bg-amber-500 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm">
                                TUK Sewaktu
                            </div>
                        </div>
                        <div className="p-6 flex flex-col justify-center flex-1">
                            <h3 className="text-xl font-bold text-[#1a2b4c] dark:text-white mb-2">
                                Lab Komputer Terpadu A
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 flex items-start gap-2">
                                <span className="text-[#0070BA] dark:text-blue-400">📍</span>
                                Gedung Utama Lt. 2, Jl. Pendidikan No. 45, Jakarta
                            </p>
                            <div className="flex flex-wrap gap-2 mt-auto">
                                <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300">🖥️ PC Core i7</span>
                                <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300">🌐 Internet 100Mbps</span>
                                <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300">❄️ Full AC</span>
                            </div>
                        </div>
                    </div>

                    {/* TUK 2 */}
                    <div className="bg-white dark:bg-[#0B192C] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col sm:flex-row group">
                        <div className="sm:w-2/5 h-48 sm:h-auto bg-slate-200 dark:bg-slate-800 relative overflow-hidden shrink-0">
                            <img
                                src="https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=600&q=80"
                                alt="TUK Hardware"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-3 left-3 px-3 py-1 bg-emerald-500 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm">
                                TUK Mandiri
                            </div>
                        </div>
                        <div className="p-6 flex flex-col justify-center flex-1">
                            <h3 className="text-xl font-bold text-[#1a2b4c] dark:text-white mb-2">
                                Workshop Hardware & Jaringan
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 flex items-start gap-2">
                                <span className="text-[#0070BA] dark:text-blue-400">📍</span>
                                Ruang Praktik Lt. 1, Institusi Teknologi Terampil, Jakarta
                            </p>
                            <div className="flex flex-wrap gap-2 mt-auto">
                                <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300">🔧 Tools Kit Lengkap</span>
                                <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300">📡 Router MikroTik/Cisco</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}