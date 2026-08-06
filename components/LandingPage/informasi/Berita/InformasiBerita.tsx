"use client";

import React, { useState } from "react";
import {
  Newspaper,
  Calendar,
  Clock,
  User,
  ArrowRight,
  Search,
  Tag,
  TrendingUp,
  ChevronRight,
  Megaphone,
  Award,
  CheckCircle2,
  GraduationCap,
} from "lucide-react";

export default function InformasiBerita() {
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  const kategoriList = [
    "Semua",
    "Kelulusan Asesi",
    "Jadwal Sertifikasi",
    "Penyerahan Sertifikat",
    "Update Skema",
    "Kisah Sukses",
  ];

  // Berita Utama / Featured News
  const beritaUtama = {
    id: 1,
    judul:
      "Sebanyak 150 Asesi Resmi Meraih Sertifikat Kompetensi BNSP Skema AI & Software Engineering",
    ringkasan:
      "Penyerahan e-Sertifikat digital secara simbolis diselenggarakan setelah seluruh peserta dinyatakan 'KOMPETEN' oleh Tim Asesor dalam uji kompetensi gelombang lalu.",
    kategori: "Kelulusan Asesi",
    tanggal: "05 Agustus 2026",
    waktuBaca: "4 min baca",
    penulis: "Sekretariat LSP Center",
    gambar:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop",
    tag: "Berita Utama",
  };

  // Daftar Berita Terbaru
  const daftarBerita = [
    {
      id: 2,
      judul:
        "Kisah Sukses Asesi: Berhasil Raih Rekomendasi 'Kompeten' Skema Fullstack Web Developer",
      ringkasan:
        "Pengalaman langsung dari peserta ujian yang membagikan strategi persiapan portofolio hingga sukses melalui sesi wawancara dan observasi praktik.",
      kategori: "Kisah Sukses",
      tanggal: "03 Agustus 2026",
      waktuBaca: "5 min baca",
      penulis: "Tim Redaksi LSP",
      gambar:
        "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: 3,
      judul:
        "Fitur Terbaru: Download e-Sertifikat Digital Ber-QR Code BNSP Langsung dari Dashboard",
      ringkasan:
        "Asesi yang dinyatakan kompeten kini tidak perlu menunggu pengiriman fisik, e-Sertifikat tervalidasi dapat langsung diunduh dan dilampirkan ke LinkedIn.",
      kategori: "Penyerahan Sertifikat",
      tanggal: "01 Agustus 2026",
      waktuBaca: "3 min baca",
      penulis: "Admin Sertifikasi",
      gambar:
        "https://images.unsplash.com/photo-1589330694653-aded6f78655b?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: 4,
      judul:
        "Pembukaan Pendaftaran Uji Kompetensi Gelombang IV 2026 Kuota Terbatas",
      ringkasan:
        "Pendaftaran sertifikasi dibuka untuk skema Artificial Intelligence, Digital Marketing, dan Teknisi Network. Dapatkan fasilitas tryout CBT gratis.",
      kategori: "Jadwal Sertifikasi",
      tanggal: "28 Juli 2026",
      waktuBaca: "4 min baca",
      penulis: "Tim Pendaftaran TUK",
      gambar:
        "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: 5,
      judul:
        "Update Standar MUK 2026: Penyesuaian Unit Kompetensi Sertifikasi Digital Marketing",
      ringkasan:
        "Komite Teknis menetapkan integrasi materi baru terkait AI marketing tools dan analisis data iklan pada perangkat asesmen terbaru.",
      kategori: "Update Skema",
      tanggal: "24 Juli 2026",
      waktuBaca: "6 min baca",
      penulis: "Komite Teknis LSP",
      gambar:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: 6,
      judul:
        "Tips Menghadapi Asesmen Mandiri (APL-02) Agar Lolos Verifikasi Berkas Tanpa Kendala",
      ringkasan:
        "Panduan praktis mengunggah bukti relevan, sertifikat pelatihan, dan portofolio kerja agar dinyatakan layak mengikuti uji praktik.",
      kategori: "Kisah Sukses",
      tanggal: "20 Juli 2026",
      waktuBaca: "4 min baca",
      penulis: "Master Asesor BNSP",
      gambar:
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop",
    },
  ];

  // Pengumuman Penting Ringkas
  const pengumumanKilat = [
    {
      tanggal: "06 Ags 2026",
      teks: "Pengambilan Sertifikat Fisik BNSP Gelombang II dapat diambil di Sekretariat TUK atau dikirim via ekspedisi.",
    },
    {
      tanggal: "02 Ags 2026",
      teks: "Hasil Asesmen Gelombang III telah terbit. Silakan cek status 'Kompeten' pada dashboard akun masing-masing.",
    },
    {
      tanggal: "29 Jul 2026",
      teks: "Batas akhir verifikasi berkas APL-01 & APL-02 untuk Gelombang IV ditutup pada 12 Agustus 2026.",
    },
  ];

  // Filter Berita berdasarkan Kategori dan Pencarian
  const filteredBerita = daftarBerita.filter((item) => {
    const matchCategory =
      selectedCategory === "Semua" || item.kategori === selectedCategory;
    const matchSearch =
      item.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ringkasan.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <section className="py-12 lg:py-20 bg-background text-foreground relative overflow-hidden">
      {/* Visual Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* Section 1: Berita Utama & Pengumuman Kilat */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Card Berita Utama (Foto Full Lebar di Atas, Teks di Bawah) */}
          <div className="lg:col-span-2 bg-muted/20 border border-muted/30 rounded-3xl overflow-hidden group hover:border-primary/40 transition-all duration-300 flex flex-col">
            {/* Foto Penuh Satu Container Atas */}
            <div className="relative h-72 sm:h-96 w-full overflow-hidden shrink-0">
              <img
                src={beritaUtama.gambar}
                alt={beritaUtama.judul}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 bg-primary text-primary-foreground text-[11px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
                <GraduationCap className="h-3.5 w-3.5" />
                <span>{beritaUtama.tag}</span>
              </div>
            </div>

            {/* Seluruh Informasi Teks Tepat Di Bawah Foto */}
            <div className="p-6 sm:p-8 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground font-medium">
                  <span className="flex items-center gap-1.5 text-primary font-bold">
                    <Tag className="h-3.5 w-3.5" />
                    {beritaUtama.kategori}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {beritaUtama.tanggal}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {beritaUtama.waktuBaca}
                  </span>
                </div>

                <h2 className="text-xl sm:text-3xl font-black text-foreground group-hover:text-primary transition-colors leading-snug">
                  {beritaUtama.judul}
                </h2>

                <p className="text-xs sm:text-base text-muted-foreground leading-relaxed">
                  {beritaUtama.ringkasan}
                </p>
              </div>

              <div className="pt-6 border-t border-muted/30 flex items-center justify-between mt-4">
                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-primary" />
                  {beritaUtama.penulis}
                </span>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:underline"
                >
                  <span>Baca Selengkapnya</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Sidebar Pengumuman Kilat */}
          <div className="bg-muted/20 border border-muted/30 p-6 sm:p-8 rounded-3xl space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-muted/30">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                <Megaphone className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-foreground">
                  Pengumuman Asesi
                </h3>
                <p className="text-xs text-muted-foreground">
                  Info penting seputar sertifikat
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {pengumumanKilat.map((info, idx) => (
                <div
                  key={idx}
                  className="bg-background p-4 rounded-2xl border border-muted/20 space-y-2 hover:border-primary/30 transition-all"
                >
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary px-2 py-0.5 rounded-full bg-primary/10">
                    {info.tanggal}
                  </span>
                  <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                    {info.teks}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 space-y-2">
              <div className="flex items-center gap-2 text-primary font-bold text-xs">
                <CheckCircle2 className="h-4 w-4" />
                <span>Cek Validitas Sertifikat</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Verifikasi keaslian nomor registrasi e-Sertifikat BNSP Anda
                melalui sistem pencarian cepat.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Filter, Search & Grid Berita */}
        <div className="space-y-8">
          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-muted/20 p-4 rounded-3xl border border-muted/30">
            {/* Category Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
              {kategoriList.map((kat, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedCategory(kat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCategory === kat
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-background/60 text-muted-foreground hover:bg-background"
                  }`}
                >
                  {kat}
                </button>
              ))}
            </div>

            {/* Search Input Bar */}
            <div className="relative w-full md:w-72 shrink-0">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari berita atau sertifikat..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-background border border-muted/30 rounded-2xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
              />
            </div>
          </div>

          {/* Grid Berita Terbaru */}
          {filteredBerita.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBerita.map((item) => (
                <article
                  key={item.id}
                  className="bg-background border border-muted/30 rounded-3xl overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Thumbnail Image */}
                    <div className="relative h-48 w-full overflow-hidden">
                      <img
                        src={item.gambar}
                        alt={item.judul}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 bg-background/90 backdrop-blur-md text-primary text-[10px] font-bold px-2.5 py-1 rounded-full border border-muted/20">
                        {item.kategori}
                      </span>
                    </div>

                    {/* Content Text */}
                    <div className="p-6 space-y-3">
                      <div className="flex items-center gap-3 text-[11px] text-muted-foreground font-medium">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {item.tanggal}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {item.waktuBaca}
                        </span>
                      </div>

                      <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                        {item.judul}
                      </h3>

                      <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                        {item.ringkasan}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="p-6 pt-0 border-t border-muted/20 mt-4 flex items-center justify-between">
                    <span className="text-[11px] text-muted-foreground font-medium">
                      Oleh {item.penulis}
                    </span>
                    <a
                      href="#"
                      className="p-2 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-16 bg-muted/10 rounded-3xl space-y-3 border border-dashed border-muted/30">
              <Newspaper className="h-10 w-10 text-muted-foreground mx-auto" />
              <h3 className="font-bold text-base text-foreground">
                Tidak Ada Berita Ditemukan
              </h3>
              <p className="text-xs text-muted-foreground">
                Coba ubah kata kunci pencarian atau pilih kategori yang lain.
              </p>
            </div>
          )}
        </div>

        {/* Section 3: Banner Buletin Info Sertifikasi */}
        <div className="mx-auto max-w-4xl bg-muted/30 border border-muted/30 p-6 sm:p-10 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-left">
            <div className="p-4 rounded-2xl bg-primary/10 text-primary shrink-0">
              <TrendingUp className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-lg font-black text-foreground">
                Ingin Mengetahui Jadwal Uji Kompetensi Selanjutnya?
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Daftarkan email Anda untuk menerima notifikasi pembukaan
                gelombang sertifikasi dan pengumuman kelulusan.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <input
              type="email"
              placeholder="Masukkan email Anda..."
              className="bg-background border border-muted/30 rounded-2xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground w-full sm:w-60"
            />
            <button className="rounded-2xl bg-foreground text-background px-5 py-3 text-xs font-bold hover:bg-foreground/90 transition-all shrink-0">
              Langganan
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}