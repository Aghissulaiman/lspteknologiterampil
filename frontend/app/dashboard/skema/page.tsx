"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Award, BookOpen, Clock, Layers, Star, Users } from "lucide-react";

type SchemeItem = {
    id: string;
    code: string;
    name: string;
    category: string;
    level: string;
    description: string;
    requirements: {
        type?: string;
        method?: string;
        price?: string;
        rating?: number;
        reviewCount?: number;
        asesiCount?: number;
        image?: string;
        nomorSkema?: string;
    };
};

export default function SkemaPage() {
    const router = useRouter();
    const [schemes, setSchemes] = useState<SchemeItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");

    useEffect(() => {
        let active = true;
        fetch("/api/public/schemes", { cache: "no-store" })
            .then(async (res) => {
                if (!res.ok) throw new Error("Gagal memuat katalog skema sertifikasi.");
                return res.json();
            })
            .then((data) => {
                if (active) {
                    setSchemes(data?.schemes || []);
                }
            })
            .catch((err) => {
                if (active) setError(err instanceof Error ? err.message : "Terjadi kesalahan memuat data.");
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, []);

    const categories = ["all", ...Array.from(new Set(schemes.map((s) => s.category).filter(Boolean)))];

    const filteredSchemes = schemes.filter((scheme) => {
        const matchesSearch =
            !searchQuery ||
            scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            scheme.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
            scheme.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "all" || scheme.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-8 font-sans">
            {/* Header */}
            <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-[#0070BA] dark:text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
                    <Award className="w-3.5 h-3.5" />
                    Tahap 02 • Pemilihan Skema Sertifikasi BNSP
                </div>
                <h2 className="text-3xl sm:text-4xl font-semibold text-[#1a2b4c] dark:text-white leading-tight tracking-tight">
                    Pilih Program Sertifikasi <span className="text-[#0070BA] dark:text-blue-400">Terakreditasi</span>
                </h2>
                <p className="mt-3 text-slate-500 dark:text-slate-400 text-sm max-w-2xl">
                    Pilih skema sertifikasi kompetensi sesuai dengan kualifikasi dan bidang keahlian Anda untuk melanjutkan ke jadwal asesmen.
                </p>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                <div className="relative flex-1 max-w-md">
                    <input
                        type="text"
                        placeholder="Cari skema sertifikasi atau kode..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="apl-input pl-10"
                    />
                    <svg
                        className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            type="button"
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                                selectedCategory === cat
                                    ? "bg-[#0070BA] text-white"
                                    : "bg-white dark:bg-[#0B192C] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-[#0070BA]"
                            }`}
                        >
                            {cat === "all" ? "Semua Bidang" : cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Error & Loading State */}
            {loading && (
                <div className="py-20 text-center space-y-3">
                    <div className="inline-block w-8 h-8 border-4 border-[#0070BA] border-t-transparent rounded-full animate-spin" />
                    <p className="text-xs text-slate-500 font-medium">Memuat katalog skema dari database...</p>
                </div>
            )}

            {error && (
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-600 text-sm">
                    {error}
                </div>
            )}

            {/* Grid Kartu Skema */}
            {!loading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSchemes.map((scheme) => {
                        const reqs = scheme.requirements || {};
                        const fallbackImg = "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=600&q=80";

                        return (
                            <div
                                key={scheme.id}
                                className="bg-white dark:bg-[#0B192C] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col justify-between transition-all hover:shadow-lg hover:-translate-y-1"
                            >
                                <div>
                                    <div className="h-40 bg-slate-200 dark:bg-slate-800 relative overflow-hidden">
                                        <img
                                            src={reqs.image || fallbackImg}
                                            alt={scheme.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                (e.currentTarget as HTMLImageElement).src = fallbackImg;
                                            }}
                                        />
                                        <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#0070BA] text-white font-mono font-bold text-xs rounded-lg shadow-sm">
                                            {scheme.code}
                                        </div>
                                        <div className="absolute top-3 right-3 px-3 py-1 bg-white/95 dark:bg-slate-900/90 backdrop-blur-sm rounded-lg flex items-center gap-1.5 shadow-sm text-xs font-semibold text-[#0070BA] dark:text-blue-400">
                                            <span>BNSP</span>
                                        </div>
                                    </div>

                                    <div className="p-5 flex flex-col flex-1">
                                        <div className="flex items-center gap-2 mb-2 text-xs text-slate-400 font-medium">
                                            <Layers className="w-3.5 h-3.5 text-blue-500" />
                                            <span>{scheme.category || "Teknologi Informasi"}</span>
                                        </div>

                                        <h3 className="text-base font-bold text-[#1a2b4c] dark:text-white leading-snug mb-2 line-clamp-2">
                                            {scheme.name}
                                        </h3>

                                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
                                            {scheme.description}
                                        </p>

                                        <div className="flex flex-wrap gap-1.5 mt-auto">
                                            <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-medium">
                                                {scheme.level || "Level 3"}
                                            </span>
                                            {reqs.type && (
                                                <span className="px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/40 text-[#0070BA] dark:text-blue-400 text-[11px] font-medium">
                                                    {reqs.type}
                                                </span>
                                            )}
                                            {reqs.method && (
                                                <span className="px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-[11px] font-medium">
                                                    {reqs.method}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-5 pt-0 mt-auto">
                                    <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex items-end justify-between">
                                        <div>
                                            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Biaya Asesmen</p>
                                            <p className="text-base font-bold text-[#1a2b4c] dark:text-white">{reqs.price || "Sesuai Ketentuan"}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-semibold text-amber-500 flex items-center justify-end gap-1">
                                                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                                                <span>{reqs.rating || 4.8}</span>
                                            </p>
                                            <p className="text-[10px] text-slate-400 mt-0.5">
                                                {reqs.asesiCount || 40}+ Asesi
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => router.push(`/dashboard/skema/${scheme.id}`)}
                                        className="mt-4 w-full py-3 rounded-xl bg-[#0070BA] hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow"
                                    >
                                        Pilih Skema & Jadwal Uji →
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
