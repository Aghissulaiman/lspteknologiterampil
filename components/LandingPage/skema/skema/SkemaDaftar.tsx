"use client";

import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Grid2X2,
  List,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

type Skema = {
  code: string;
  title: string;
  category: string;
  unitsCount: number;
  level: number;
  methods: string[];
  description: string;
  popularUnits: string[];
};

const skemaList: Skema[] = [
  {
    code: "SKM-RPL-001",
    title: "TEKNISI DESKTOP (DESKTOP TECHNICIAN)",
    category: "Programming Dan Pengembangan Software",
    unitsCount: 12,
    level: 3,
    methods: ["Tatap Muka"],
    description: "Lakukan instalasi, konfigurasi, perawatan, dan penanganan masalah pada komputer desktop.",
    popularUnits: ["Memasang perangkat desktop", "Mengonfigurasi sistem operasi", "Menangani gangguan komputer"],
  },
  {
    code: "SKM-RPL-002",
    title: "TEKNISI PERBAIKAN KOMPUTER (COMPUTER REPAIR TECHNICIAN)",
    category: "IT And Computing Facilities Management",
    unitsCount: 18,
    level: 5,
    methods: ["SJJ", "Tatap Muka"],
    description: "Periksa dan perbaiki kerusakan perangkat keras maupun perangkat lunak pada komputer.",
    popularUnits: ["Mendiagnosis kerusakan komputer", "Memperbaiki komponen komputer", "Menguji hasil perbaikan"],
  },
  {
    code: "SKM-JTK-001",
    title: "ASISTEN INSTALASI DAN PEMELIHARAAN PERANGKAT KERAS (HARDWARE INSTALLATION AND MAINTENANCE ASSISTANT)",
    category: "IT And Computing Facilities Management",
    unitsCount: 14,
    level: 4,
    methods: ["Tatap Muka"],
    description: "Bantu instalasi, pemeriksaan, dan pemeliharaan perangkat keras komputer sesuai prosedur kerja.",
    popularUnits: ["Menyiapkan perangkat keras", "Membantu instalasi perangkat", "Melakukan pemeliharaan rutin"],
  },
  {
    code: "SKM-DATA-001",
    title: "TEKNISI PERBAIKAN PERANGKAT (SMARTPHONES REPAIR TECHNICIAN)",
    category: "IT And Computing Facilities Management",
    unitsCount: 15,
    level: 4,
    methods: ["SJJ", "Tatap Muka"],
    description: "Lakukan diagnosis, perbaikan, dan pengujian fungsi perangkat smartphone.",
    popularUnits: ["Mendiagnosis kerusakan smartphone", "Melakukan perbaikan perangkat", "Menguji fungsi smartphone"],
  },
  {
    code: "SKM-DSM-002",
    title: "ANALIS WEB (WEB ANALYST)",
    category: "Programming Dan Pengembangan Software",
    unitsCount: 10,
    level: 5,
    methods: ["Tatap Muka"],
    description: "Analisis struktur, fungsi, dan kinerja situs web untuk membantu menentukan perbaikan yang diperlukan.",
    popularUnits: ["Menganalisis kebutuhan situs", "Mengevaluasi fungsi web", "Menyusun rekomendasi perbaikan"],
  },
  {
    code: "SKM-KSJ-001",
    title: "PEMROGRAM MUDA (ASSOCIATE PROGRAMMER)",
    category: "Programming Dan Pengembangan Software",
    unitsCount: 16,
    level: 6,
    methods: ["SJJ", "Tatap Muka"],
    description: "Bangun dan uji program komputer dengan menerapkan dasar pemrograman dan spesifikasi yang diberikan.",
    popularUnits: ["Menerapkan algoritma pemrograman", "Menulis kode program", "Menguji program"],
  },
];

const levels = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const methods = ["SJJ", "Tatap Muka"];
const categories = [...new Set(skemaList.map((item) => item.category))].sort((a, b) => a.localeCompare(b));

export default function SkemaDaftar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryQuery, setCategoryQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedMethods, setSelectedMethods] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [view, setView] = useState<"grid" | "list">("grid");

  const filteredCategories = categories.filter((category) =>
    category.toLocaleLowerCase().includes(categoryQuery.trim().toLocaleLowerCase()),
  );

  const filteredSkema = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase();
    return skemaList.filter((item) => {
      const matchesSearch = !query || [item.title, item.code, item.category, item.description]
        .some((value) => value.toLocaleLowerCase().includes(query));
      const matchesCategory = !selectedCategory || item.category === selectedCategory;
      const matchesLevel = !selectedLevel || item.level === Number(selectedLevel);
      const matchesMethod = selectedMethods.length === 0 || selectedMethods.some((method) => item.methods.includes(method));
      return matchesSearch && matchesCategory && matchesLevel && matchesMethod;
    });
  }, [searchQuery, selectedCategory, selectedLevel, selectedMethods]);

  const resetFilters = () => {
    setSearchQuery("");
    setCategoryQuery("");
    setSelectedCategory("");
    setSelectedLevel("");
    setSelectedMethods([]);
  };

  const toggleMethod = (method: string) => {
    setSelectedMethods((current) => current.includes(method)
      ? current.filter((item) => item !== method)
      : [...current, method]);
  };

  const hasActiveFilters = Boolean(searchQuery || selectedCategory || selectedLevel || selectedMethods.length);

  return (
    <main className="bg-background text-foreground">
      <section className="relative isolate overflow-hidden border-b border-border bg-gradient-to-br from-primary/[0.07] via-background to-secondary/[0.08] py-14 sm:py-20">
        <div aria-hidden="true" className="pointer-events-none absolute -right-28 -top-36 -z-10 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-background/80 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-primary shadow-sm">
              <Award className="h-4 w-4" /> Standar Kompetensi Kerja Nasional Indonesia
            </div>
            <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Skema <span className="text-primary">Sertifikasi</span> Profesi
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Temukan skema sertifikasi kompetensi bidang teknologi informasi yang sesuai dengan keahlian dan tujuan karier Anda.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Sertifikasi berlisensi BNSP</span>
              <span className="inline-flex items-center gap-2"><BookOpen className="h-4 w-4 text-primary" /> {skemaList.length} skema pilihan</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-primary">Katalog sertifikasi</p>
              <h2 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">Jelajahi skema yang tersedia</h2>
            </div>
            <p className="text-sm text-muted-foreground" aria-live="polite">
              Menampilkan <span className="font-semibold text-foreground">{filteredSkema.length}</span> dari {skemaList.length} skema
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
            <aside className="self-start rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5 lg:sticky lg:top-24">
              <button
                type="button"
                aria-expanded={filtersOpen}
                onClick={() => setFiltersOpen((open) => !open)}
                className="flex w-full items-center justify-between gap-2 text-left text-base font-bold"
              >
                <span className="inline-flex items-center gap-2"><SlidersHorizontal className="h-4 w-4 text-primary" />Filter Pencarian</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${filtersOpen ? "rotate-180" : ""}`} />
              </button>
            {filtersOpen && (
              <div className="mt-5 flex flex-col gap-6 border-t border-border pt-5">
                <fieldset>
                  <legend className="mb-3 text-sm font-bold">Metode Pelaksanaan</legend>
                  <div className="flex flex-wrap gap-2">
                    {methods.map((method) => (
                      <label key={method} className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${selectedMethods.includes(method) ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>
                        <input type="checkbox" checked={selectedMethods.includes(method)} onChange={() => toggleMethod(method)} className="h-4 w-4 accent-primary" />
                        {method}
                      </label>
                    ))}
                  </div>
                </fieldset>

                <label className="block">
                  <span className="mb-3 block text-sm font-bold">Level KKNI</span>
                  <span className="relative block">
                    <select
                      value={selectedLevel}
                      onChange={(event) => setSelectedLevel(event.target.value)}
                      className="h-10 w-full appearance-none rounded-lg border border-border bg-background px-3 pr-9 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                    >
                      <option value="">Semua Level</option>
                      {levels.map((level) => <option key={level} value={level}>Level {level} KKNI</option>)}
                    </select>
                    <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </span>
                </label>

                <fieldset>
                  <legend className="mb-3 text-sm font-bold">Kategori</legend>
                  <label className="relative block">
                    <span className="sr-only">Cari kategori</span>
                    <Search aria-hidden="true" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="search"
                      value={categoryQuery}
                      onChange={(event) => setCategoryQuery(event.target.value)}
                      placeholder="Cari kategori..."
                      className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                    />
                  </label>
                  <div className="mt-3 grid max-h-36 grid-cols-1 gap-2 overflow-y-auto pr-1">
                    <label className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted">
                      <input type="radio" name="skema-category" checked={!selectedCategory} onChange={() => setSelectedCategory("")} className="h-4 w-4 accent-primary" />
                      Semua Kategori
                    </label>
                    {filteredCategories.map((category) => (
                      <label key={category} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted">
                        <input type="radio" name="skema-category" checked={selectedCategory === category} onChange={() => setSelectedCategory(category)} className="h-4 w-4 accent-primary" />
                        <span>{category}</span>
                      </label>
                    ))}
                    {filteredCategories.length === 0 && <p className="px-2 py-1.5 text-sm text-muted-foreground">Kategori tidak ditemukan.</p>}
                  </div>
                </fieldset>
              </div>
            )}

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                {!hasActiveFilters && !categoryQuery && <span>Pilih filter untuk menyaring daftar skema.</span>}
              </div>
              <button type="button" onClick={resetFilters} disabled={!hasActiveFilters && !categoryQuery} className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-primary disabled:cursor-not-allowed disabled:opacity-40">
                <RotateCcw className="h-4 w-4" /> Reset Semua Filter
              </button>
            </div>
          </aside>

          <div className="min-w-0">
            <label className="relative mb-5 block">
              <span className="sr-only">Cari skema sertifikasi</span>
              <Search aria-hidden="true" className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                placeholder="Cari nama, kode, atau bidang skema..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="h-12 w-full rounded-xl border border-border bg-card pl-11 pr-4 text-sm shadow-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
              />
            </label>

          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{filteredSkema.length} skema ditemukan</p>
            <div className="inline-flex items-center gap-1 rounded-xl border border-border bg-card p-1" aria-label="Mode tampilan">
              <button type="button" aria-label="Tampilan grid" aria-pressed={view === "grid"} onClick={() => setView("grid")} className={`inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-semibold transition ${view === "grid" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted"}`}>
                <Grid2X2 className="h-4 w-4" /><span className="hidden sm:inline">Grid</span>
              </button>
              <button type="button" aria-label="Tampilan list" aria-pressed={view === "list"} onClick={() => setView("list")} className={`inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-semibold transition ${view === "list" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted"}`}>
                <List className="h-4 w-4" /><span className="hidden sm:inline">List</span>
              </button>
            </div>
          </div>

          {filteredSkema.length ? (
            <div className={view === "grid" ? "grid gap-5 sm:grid-cols-2 xl:grid-cols-3" : "flex flex-col gap-4"}>
              {filteredSkema.map((skema) => (
                <article key={skema.code} className={`group flex rounded-2xl border border-border bg-card p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg ${view === "list" ? "flex-col gap-5 sm:flex-row sm:items-center sm:p-6" : "flex-col"}`}>
                  <div className={view === "list" ? "min-w-0 flex-1" : "flex-1"}>
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                      <span className="rounded-lg bg-primary/10 px-2.5 py-1 font-mono text-xs font-bold text-primary">{skema.code}</span>
                      <span className="rounded-lg border border-border bg-muted/60 px-2.5 py-1 text-xs font-semibold text-muted-foreground">Level {skema.level} KKNI</span>
                    </div>
                    <h3 className="break-words text-lg font-extrabold leading-snug tracking-tight transition-colors group-hover:text-primary">{skema.title}</h3>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{skema.category}</p>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">{skema.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {skema.methods.map((method) => <span key={method} className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">{method}</span>)}
                      <span className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">{skema.unitsCount} Unit Kompetensi</span>
                    </div>
                    {view === "grid" && (
                      <div className="mt-5 border-t border-border/70 pt-4">
                        <p className="mb-2 flex items-center gap-2 text-xs font-bold"><BookOpen className="h-3.5 w-3.5 text-primary" />Unit Kompetensi Utama</p>
                        <ul className="space-y-2">
                          {skema.popularUnits.map((unit) => <li key={unit} className="flex items-center gap-2 text-xs text-muted-foreground"><CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-primary" />{unit}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className={`flex items-center justify-between border-t border-border/70 pt-4 ${view === "list" ? "gap-6 sm:w-52 sm:shrink-0 sm:flex-col sm:items-end sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0" : "mt-5"}`}>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400"><CheckCircle2 className="h-4 w-4" />Terlisensi BNSP</span>
                    <a href="#" className="inline-flex items-center gap-1.5 text-sm font-bold text-primary transition hover:gap-2.5">
                      Detail skema <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground"><Search className="h-5 w-5" /></div>
              <h3 className="font-bold">Skema tidak ditemukan</h3>
              <p className="mt-1 text-sm text-muted-foreground">Ubah kata kunci atau reset filter untuk melihat skema lainnya.</p>
              <button type="button" onClick={resetFilters} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"><X className="h-4 w-4" />Hapus semua filter</button>
            </div>
          )}
          </div>
        </div>
        </div>
      </section>
    </main>
  );
}
