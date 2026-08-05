"use client";

import React, { useState } from "react";
import { Search, Award, CheckCircle2, Layers, BookOpen, ArrowUpRight } from "lucide-react";

export default function SkemaDaftar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const categories = ["Semua", "Software & Web", "Jaringan & Cloud", "Data & AI"];

  const skemaList = [
    {
      code: "SKM-RPL-001",
      title: "Junior Web Developer",
      category: "Software & Web",
      unitsCount: 12,
      level: "KKNI Level 3",
      description: "Menguji kemampuan dalam merancang, membangun, dan memelihara aplikasi berbasis web menggunakan HTML, CSS, JavaScript, serta basis data relasional.",
      popularUnits: ["Menggunakan Struktur Data", "Implementasi User Interface", "Menulis Kode dengan Prinsip Clean Code"],
    },
    {
      code: "SKM-RPL-002",
      title: "Fullstack Application Developer",
      category: "Software & Web",
      unitsCount: 18,
      level: "KKNI Level 5",
      description: "Kompetensi tingkat lanjut mencakup pengembangan backend API, integrasi frontend framework modern, keamanan sistem, serta penyediaan basis data terdistribusi.",
      popularUnits: ["Desain Arsitektur Perangkat Lunak", "Pengembangan RESTful API", "Penerapan Keamanan Aplikasi"],
    },
    {
      code: "SKM-JTK-001",
      title: "Network Administrator Muda",
      category: "Jaringan & Cloud",
      unitsCount: 14,
      level: "KKNI Level 3",
      description: "Mengukur keahlian dalam merancang topologi jaringan lokal (LAN), konfigurasi router & switch, serta troubleshooting infrastruktur jaringan dasar.",
      popularUnits: ["Konfigurasi Routing & Switching", "Memasang Jaringan Nirkabel", "Manajemen Keamanan Jaringan Dasar"],
    },
    {
      code: "SKM-DATA-001",
      title: "Data Analyst Specialist",
      category: "Data & AI",
      unitsCount: 15,
      level: "KKNI Level 4",
      description: "Validasi kemampuan pemrosesan data mentah, pembersihan data, visualisasi data interaktif, dan pembuatan laporan analisis bisnis berbasis data.",
      popularUnits: ["Pembersihan & Pengolahan Data", "Pembuatan Dashboard Business Intelligence", "Analisis Statistik Deskriptif"],
    },
  ];

  // Filter Logic
  const filteredSkema = skemaList.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Semua" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section className="py-10 lg:py-16 bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="border-l-4 border-primary pl-6 mb-8 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary mb-1">
            <Award className="h-4 w-4" />
            <span>Standar Kompetensi Kerja (SKKNI)</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
            Skema Sertifikasi Profesi
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Daftar skema sertifikasi bidang Teknologi Informasi dan Komunikasi yang diakui secara nasional oleh BNSP.
          </p>
        </div>

        {/* Filter & Search Controls */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8 bg-card border border-border p-4 rounded-2xl shadow-sm">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari nama skema atau kode skema..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>

        {/* Grid Card Skema (2 Kolom Lebar) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredSkema.length > 0 ? (
            filteredSkema.map((skema, idx) => (
              <div
                key={idx}
                className="group relative rounded-2xl border border-border bg-card p-6 shadow-sm hover:border-primary/50 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Top Meta Info */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="font-mono text-xs font-extrabold text-primary bg-primary/10 px-2.5 py-1 rounded-lg">
                      {skema.code}
                    </span>
                    <span className="text-xs font-semibold text-muted-foreground bg-muted px-2.5 py-1 rounded-lg border border-border">
                      {skema.level}
                    </span>
                  </div>

                  {/* Title & Category */}
                  <h3 className="text-xl font-extrabold text-foreground group-hover:text-primary transition-colors">
                    {skema.title}
                  </h3>
                  <p className="text-xs font-bold text-muted-foreground mt-0.5">
                    Kategori: {skema.category}
                  </p>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-3">
                    {skema.description}
                  </p>

                  {/* Unit Kompetensi Preview */}
                  <div className="mt-4 pt-4 border-t border-border/60">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <BookOpen className="h-3.5 w-3.5 text-primary" />
                        Unit Kompetensi Utama
                      </span>
                      <span className="text-[11px] font-semibold text-muted-foreground">
                        Total {skema.unitsCount} Unit
                      </span>
                    </div>

                    <ul className="space-y-1.5">
                      {skema.popularUnits.map((unit, uIdx) => (
                        <li key={uIdx} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                          <span className="truncate">{unit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <Layers className="h-3.5 w-3.5" />
                    Skema Terlisensi BNSP
                  </span>

                  <a
                    href="#"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 transition-colors"
                  >
                    <span>Detail Skema & Dokumen</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </div>

              </div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center rounded-2xl border border-dashed border-border bg-card">
              <p className="text-sm font-semibold text-muted-foreground">
                Skema sertifikasi tidak ditemukan.
              </p>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}