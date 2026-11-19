"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpenCheck,
  ClipboardCheck,
  FileCheck2,
  Newspaper,
  Search,
} from "lucide-react";

const guides = [
  {
    title: "Menelusuri skema sertifikasi",
    category: "Skema",
    summary: "Pelajari ruang lingkup, unit kompetensi, dan persyaratan sebelum memilih skema.",
    content:
      "Buka halaman Skema Sertifikasi untuk melihat daftar skema yang tersedia. Periksa deskripsi, unit kompetensi, dan dokumen yang diminta pada setiap skema. Persyaratan dapat berbeda, jadi gunakan informasi pada detail skema yang akan dipilih.",
    icon: BookOpenCheck,
    href: "/skema",
    action: "Lihat skema",
  },
  {
    title: "Menyiapkan permohonan sertifikasi",
    category: "Pendaftaran",
    summary: "Buat akun peserta, pilih skema dan jadwal yang tersedia, lalu lengkapi data permohonan.",
    content:
      "Pendaftaran dimulai dengan akun peserta. Setelah memilih skema dan jadwal yang tersedia, lengkapi APL-01 serta dokumen sesuai persyaratan skema. Tinjau isian sebelum mengirim permohonan agar data yang diserahkan sudah benar.",
    icon: FileCheck2,
    href: "/auth/pendaftaran",
    action: "Daftar peserta",
  },
  {
    title: "Mengisi asesmen mandiri APL-02",
    category: "Asesmen",
    summary: "Jawab pertanyaan untuk setiap unit kompetensi dan lampirkan bukti yang relevan.",
    content:
      "Pada APL-02, peserta mengisi jawaban dan catatan untuk unit kompetensi yang tersedia. Dokumen pendukung dapat dilampirkan sebagai bukti. Sistem memeriksa kelengkapan isian saat permohonan dikirim.",
    icon: ClipboardCheck,
    href: "/auth/masuk",
    action: "Masuk ke akun",
  },
  {
    title: "Memeriksa nomor sertifikat",
    category: "Sertifikat",
    summary: "Masukkan nomor sertifikat untuk memeriksa status dan informasi penerbitannya.",
    content:
      "Gunakan halaman Cek Pemegang Sertifikat dan masukkan nomor yang tercetak pada sertifikat. Hasil pencarian menunjukkan apakah nomor tersebut tercatat, beserta nama pemegang, skema, dan tanggal terbit yang tersedia.",
    icon: Award,
    href: "/informasi/verifikasi-sertifikat",
    action: "Cek sertifikat",
  },
];

const categories = ["Semua", ...guides.map((guide) => guide.category)];

export default function InformasiBerita() {
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  const normalizedQuery = searchQuery.trim().toLocaleLowerCase("id-ID");
  const visibleGuides = guides.filter((guide) => {
    const matchesCategory =
      selectedCategory === "Semua" || guide.category === selectedCategory;
    const searchableText = `${guide.title} ${guide.category} ${guide.summary} ${guide.content}`;
    const matchesSearch = searchableText.toLocaleLowerCase("id-ID").includes(normalizedQuery);

    return matchesCategory && matchesSearch;
  });

  return (
    <section className="bg-background py-12 text-foreground lg:py-20">
      <div className="mx-auto max-w-7xl space-y-10 px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-wider text-primary">
            Informasi sertifikasi
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
            Berita dan panduan
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Baca panduan layanan sertifikasi atau cari topik yang Anda perlukan.
          </p>
        </header>

        <div className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Newspaper className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-bold">Belum ada berita kegiatan yang dipublikasikan</h2>
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Panduan di bawah merangkum alur layanan yang tersedia di situs ini. Informasi kegiatan aktual dapat dilihat pada halaman Kegiatan.
              </p>
            </div>
          </div>
          <Link
            href="/informasi/kegiatan"
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-md border border-primary px-4 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Lihat kegiatan
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <section aria-labelledby="guides-title" className="space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 id="guides-title" className="text-2xl font-bold tracking-tight sm:text-3xl">
                Panduan layanan
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Pilih kategori atau cari kata kunci untuk menyaring panduan.
              </p>
            </div>

            <div className="relative w-full lg:max-w-sm">
              <label htmlFor="guide-search" className="sr-only">
                Cari berita dan panduan
              </label>
              <Search
                aria-hidden="true"
                className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              />
              <input
                id="guide-search"
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Cari topik"
                className="min-h-11 w-full rounded-xl border border-input bg-background pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2" aria-label="Filter kategori panduan">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                aria-pressed={selectedCategory === category}
                className={`min-h-11 shrink-0 rounded-md border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                  selectedCategory === category
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {visibleGuides.length > 0 ? (
            <ul className="grid gap-5 md:grid-cols-2">
              {visibleGuides.map((guide) => {
                const Icon = guide.icon;

                return (
                  <li key={guide.title}>
                    <article className="flex h-full flex-col rounded-2xl border border-border bg-card p-5 sm:p-6">
                      <div className="flex items-start gap-4">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <Icon className="h-5 w-5" />
                        </span>
                        <div>
                          <span className="text-xs font-semibold text-primary">
                            {guide.category}
                          </span>
                          <h3 className="mt-1 text-lg font-bold leading-snug">
                            {guide.title}
                          </h3>
                        </div>
                      </div>

                      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                        {guide.summary}
                      </p>

                      <details className="mt-4 border-t border-border pt-4">
                        <summary className="min-h-11 cursor-pointer content-center text-sm font-semibold text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                          Baca panduan
                        </summary>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {guide.content}
                        </p>
                        <Link
                          href={guide.href}
                          className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                        >
                          {guide.action}
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </details>
                    </article>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-muted/20 px-5 py-12 text-center">
              <Search className="mx-auto h-8 w-8 text-muted-foreground" />
              <h3 className="mt-3 font-bold">Panduan tidak ditemukan</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Ganti kata kunci atau pilih kategori lain.
              </p>
            </div>
          )}
        </section>
      </div>
    </section>
  );
}
