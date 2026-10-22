// "use client";

// import { useMemo, useState } from "react";
// import {
//   ArrowUpRight,
//   Award,
//   BookOpen,
//   CheckCircle2,
//   ChevronDown,
//   Grid2X2,
//   List,
//   RotateCcw,
//   Search,
//   SlidersHorizontal,
//   X,
// } from "lucide-react";

// type Skema = {
//   code: string;
//   title: string;
//   category: string;
//   unitsCount: number;
//   level: number;
//   methods: string[];
//   description: string;
//   popularUnits: string[];
// };

// const skemaList: Skema[] = [
//   {
//     code: "SKM-RPL-001",
//     title: "TEKNISI DESKTOP (DESKTOP TECHNICIAN)",
//     category: "Programming Dan Pengembangan Software",
//     unitsCount: 12,
//     level: 3,
//     methods: ["Tatap Muka"],
//     description: "Lakukan instalasi, konfigurasi, perawatan, dan penanganan masalah pada komputer desktop.",
//     popularUnits: ["Memasang perangkat desktop", "Mengonfigurasi sistem operasi", "Menangani gangguan komputer"],
//   },
//   {
//     code: "SKM-RPL-002",
//     title: "TEKNISI PERBAIKAN KOMPUTER (COMPUTER REPAIR TECHNICIAN)",
//     category: "IT And Computing Facilities Management",
//     unitsCount: 18,
//     level: 5,
//     methods: ["SJJ", "Tatap Muka"],
//     description: "Periksa dan perbaiki kerusakan perangkat keras maupun perangkat lunak pada komputer.",
//     popularUnits: ["Mendiagnosis kerusakan komputer", "Memperbaiki komponen komputer", "Menguji hasil perbaikan"],
//   },
//   {
//     code: "SKM-JTK-001",
//     title: "ASISTEN INSTALASI DAN PEMELIHARAAN PERANGKAT KERAS (HARDWARE INSTALLATION AND MAINTENANCE ASSISTANT)",
//     category: "IT And Computing Facilities Management",
//     unitsCount: 14,
//     level: 4,
//     methods: ["Tatap Muka"],
//     description: "Bantu instalasi, pemeriksaan, dan pemeliharaan perangkat keras komputer sesuai prosedur kerja.",
//     popularUnits: ["Menyiapkan perangkat keras", "Membantu instalasi perangkat", "Melakukan pemeliharaan rutin"],
//   },
//   {
//     code: "SKM-DATA-001",
//     title: "TEKNISI PERBAIKAN PERANGKAT (SMARTPHONES REPAIR TECHNICIAN)",
//     category: "IT And Computing Facilities Management",
//     unitsCount: 15,
//     level: 4,
//     methods: ["SJJ", "Tatap Muka"],
//     description: "Lakukan diagnosis, perbaikan, dan pengujian fungsi perangkat smartphone.",
//     popularUnits: ["Mendiagnosis kerusakan smartphone", "Melakukan perbaikan perangkat", "Menguji fungsi smartphone"],
//   },
//   {
//     code: "SKM-DSM-002",
//     title: "ANALIS WEB (WEB ANALYST)",
//     category: "Programming Dan Pengembangan Software",
//     unitsCount: 10,
//     level: 5,
//     methods: ["Tatap Muka"],
//     description: "Analisis struktur, fungsi, dan kinerja situs web untuk membantu menentukan perbaikan yang diperlukan.",
//     popularUnits: ["Menganalisis kebutuhan situs", "Mengevaluasi fungsi web", "Menyusun rekomendasi perbaikan"],
//   },
//   {
//     code: "SKM-KSJ-001",
//     title: "PEMROGRAM MUDA (ASSOCIATE PROGRAMMER)",
//     category: "Programming Dan Pengembangan Software",
//     unitsCount: 16,
//     level: 6,
//     methods: ["SJJ", "Tatap Muka"],
//     description: "Bangun dan uji program komputer dengan menerapkan dasar pemrograman dan spesifikasi yang diberikan.",
//     popularUnits: ["Menerapkan algoritma pemrograman", "Menulis kode program", "Menguji program"],
//   },
// ];

// const levels = [1, 2, 3, 4, 5, 6, 7, 8, 9];
// const methods = ["SJJ", "Tatap Muka"];
// const categories = [...new Set(skemaList.map((item) => item.category))].sort((a, b) => a.localeCompare(b));

// export default function SkemaDaftar() {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [categoryQuery, setCategoryQuery] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [selectedLevel, setSelectedLevel] = useState("");
//   const [selectedMethods, setSelectedMethods] = useState<string[]>([]);
//   const [filtersOpen, setFiltersOpen] = useState(true);
//   const [view, setView] = useState<"grid" | "list">("grid");

//   const filteredCategories = categories.filter((category) =>
//     category.toLocaleLowerCase().includes(categoryQuery.trim().toLocaleLowerCase()),
//   );

//   const filteredSkema = useMemo(() => {
//     const query = searchQuery.trim().toLocaleLowerCase();
//     return skemaList.filter((item) => {
//       const matchesSearch = !query || [item.title, item.code, item.category, item.description]
//         .some((value) => value.toLocaleLowerCase().includes(query));
//       const matchesCategory = !selectedCategory || item.category === selectedCategory;
//       const matchesLevel = !selectedLevel || item.level === Number(selectedLevel);
//       const matchesMethod = selectedMethods.length === 0 || selectedMethods.some((method) => item.methods.includes(method));
//       return matchesSearch && matchesCategory && matchesLevel && matchesMethod;
//     });
//   }, [searchQuery, selectedCategory, selectedLevel, selectedMethods]);

//   const resetFilters = () => {
//     setSearchQuery("");
//     setCategoryQuery("");
//     setSelectedCategory("");
//     setSelectedLevel("");
//     setSelectedMethods([]);
//   };

//   const toggleMethod = (method: string) => {
//     setSelectedMethods((current) => current.includes(method)
//       ? current.filter((item) => item !== method)
//       : [...current, method]);
//   };

//   const hasActiveFilters = Boolean(searchQuery || selectedCategory || selectedLevel || selectedMethods.length);

//   return (
//     <main className="bg-background text-foreground">
//       <section className="relative isolate overflow-hidden border-b border-border bg-gradient-to-br from-primary/[0.07] via-background to-secondary/[0.08] py-14 sm:py-20">
//         <div aria-hidden="true" className="pointer-events-none absolute -right-28 -top-36 -z-10 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
//         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//           <div className="max-w-3xl">
//             <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-background/80 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-primary shadow-sm">
//               <Award className="h-4 w-4" /> Standar Kompetensi Kerja Nasional Indonesia
//             </div>
//             <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
//               Skema <span className="text-primary">Sertifikasi</span> Profesi
//             </h1>
//             <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
//               Temukan skema sertifikasi kompetensi bidang teknologi informasi yang sesuai dengan keahlian dan tujuan karier Anda.
//             </p>
//             <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
//               <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Sertifikasi berlisensi BNSP</span>
//               <span className="inline-flex items-center gap-2"><BookOpen className="h-4 w-4 text-primary" /> {skemaList.length} skema pilihan</span>
//             </div>
//           </div>
//         </div>
//       </section>

//       <section className="py-10 sm:py-14">
//         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//           <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
//             <div>
//               <p className="text-sm font-bold uppercase tracking-[0.14em] text-primary">Katalog sertifikasi</p>
//               <h2 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">Jelajahi skema yang tersedia</h2>
//             </div>
//             <p className="text-sm text-muted-foreground" aria-live="polite">
//               Menampilkan <span className="font-semibold text-foreground">{filteredSkema.length}</span> dari {skemaList.length} skema
//             </p>
//           </div>

//           <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
//             <aside className="self-start rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5 lg:sticky lg:top-24">
//               <button
//                 type="button"
//                 aria-expanded={filtersOpen}
//                 onClick={() => setFiltersOpen((open) => !open)}
//                 className="flex w-full items-center justify-between gap-2 text-left text-base font-bold"
//               >
//                 <span className="inline-flex items-center gap-2"><SlidersHorizontal className="h-4 w-4 text-primary" />Filter Pencarian</span>
//                 <ChevronDown className={`h-4 w-4 transition-transform ${filtersOpen ? "rotate-180" : ""}`} />
//               </button>
//             {filtersOpen && (
//               <div className="mt-5 flex flex-col gap-6 border-t border-border pt-5">
//                 <fieldset>
//                   <legend className="mb-3 text-sm font-bold">Metode Pelaksanaan</legend>
//                   <div className="flex flex-wrap gap-2">
//                     {methods.map((method) => (
//                       <label key={method} className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${selectedMethods.includes(method) ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>
//                         <input type="checkbox" checked={selectedMethods.includes(method)} onChange={() => toggleMethod(method)} className="h-4 w-4 accent-primary" />
//                         {method}
//                       </label>
//                     ))}
//                   </div>
//                 </fieldset>

//                 <label className="block">
//                   <span className="mb-3 block text-sm font-bold">Level KKNI</span>
//                   <span className="relative block">
//                     <select
//                       value={selectedLevel}
//                       onChange={(event) => setSelectedLevel(event.target.value)}
//                       className="h-10 w-full appearance-none rounded-lg border border-border bg-background px-3 pr-9 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
//                     >
//                       <option value="">Semua Level</option>
//                       {levels.map((level) => <option key={level} value={level}>Level {level} KKNI</option>)}
//                     </select>
//                     <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//                   </span>
//                 </label>

//                 <fieldset>
//                   <legend className="mb-3 text-sm font-bold">Kategori</legend>
//                   <label className="relative block">
//                     <span className="sr-only">Cari kategori</span>
//                     <Search aria-hidden="true" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//                     <input
//                       type="search"
//                       value={categoryQuery}
//                       onChange={(event) => setCategoryQuery(event.target.value)}
//                       placeholder="Cari kategori..."
//                       className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
//                     />
//                   </label>
//                   <div className="mt-3 grid max-h-36 grid-cols-1 gap-2 overflow-y-auto pr-1">
//                     <label className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted">
//                       <input type="radio" name="skema-category" checked={!selectedCategory} onChange={() => setSelectedCategory("")} className="h-4 w-4 accent-primary" />
//                       Semua Kategori
//                     </label>
//                     {filteredCategories.map((category) => (
//                       <label key={category} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted">
//                         <input type="radio" name="skema-category" checked={selectedCategory === category} onChange={() => setSelectedCategory(category)} className="h-4 w-4 accent-primary" />
//                         <span>{category}</span>
//                       </label>
//                     ))}
//                     {filteredCategories.length === 0 && <p className="px-2 py-1.5 text-sm text-muted-foreground">Kategori tidak ditemukan.</p>}
//                   </div>
//                 </fieldset>
//               </div>
//             )}

//             <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
//               <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
//                 {!hasActiveFilters && !categoryQuery && <span>Pilih filter untuk menyaring daftar skema.</span>}
//               </div>
//               <button type="button" onClick={resetFilters} disabled={!hasActiveFilters && !categoryQuery} className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-primary disabled:cursor-not-allowed disabled:opacity-40">
//                 <RotateCcw className="h-4 w-4" /> Reset Semua Filter
//               </button>
//             </div>
//           </aside>

//           <div className="min-w-0">
//             <label className="relative mb-5 block">
//               <span className="sr-only">Cari skema sertifikasi</span>
//               <Search aria-hidden="true" className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//               <input
//                 type="search"
//                 placeholder="Cari nama, kode, atau bidang skema..."
//                 value={searchQuery}
//                 onChange={(event) => setSearchQuery(event.target.value)}
//                 className="h-12 w-full rounded-xl border border-border bg-card pl-11 pr-4 text-sm shadow-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
//               />
//             </label>

//           <div className="mb-4 flex items-center justify-between">
//             <p className="text-sm text-muted-foreground">{filteredSkema.length} skema ditemukan</p>
//             <div className="inline-flex items-center gap-1 rounded-xl border border-border bg-card p-1" aria-label="Mode tampilan">
//               <button type="button" aria-label="Tampilan grid" aria-pressed={view === "grid"} onClick={() => setView("grid")} className={`inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-semibold transition ${view === "grid" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted"}`}>
//                 <Grid2X2 className="h-4 w-4" /><span className="hidden sm:inline">Grid</span>
//               </button>
//               <button type="button" aria-label="Tampilan list" aria-pressed={view === "list"} onClick={() => setView("list")} className={`inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-semibold transition ${view === "list" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted"}`}>
//                 <List className="h-4 w-4" /><span className="hidden sm:inline">List</span>
//               </button>
//             </div>
//           </div>

//           {filteredSkema.length ? (
//             <div className={view === "grid" ? "grid gap-5 sm:grid-cols-2 xl:grid-cols-3" : "flex flex-col gap-4"}>
//               {filteredSkema.map((skema) => (
//                 <article key={skema.code} className={`group flex rounded-2xl border border-border bg-card p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg ${view === "list" ? "flex-col gap-5 sm:flex-row sm:items-center sm:p-6" : "flex-col"}`}>
//                   <div className={view === "list" ? "min-w-0 flex-1" : "flex-1"}>
//                     <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
//                       <span className="rounded-lg bg-primary/10 px-2.5 py-1 font-mono text-xs font-bold text-primary">{skema.code}</span>
//                       <span className="rounded-lg border border-border bg-muted/60 px-2.5 py-1 text-xs font-semibold text-muted-foreground">Level {skema.level} KKNI</span>
//                     </div>
//                     <h3 className="break-words text-lg font-extrabold leading-snug tracking-tight transition-colors group-hover:text-primary">{skema.title}</h3>
//                     <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{skema.category}</p>
//                     <p className="mt-3 text-sm leading-6 text-muted-foreground">{skema.description}</p>
//                     <div className="mt-4 flex flex-wrap gap-2">
//                       {skema.methods.map((method) => <span key={method} className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">{method}</span>)}
//                       <span className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">{skema.unitsCount} Unit Kompetensi</span>
//                     </div>
//                     {view === "grid" && (
//                       <div className="mt-5 border-t border-border/70 pt-4">
//                         <p className="mb-2 flex items-center gap-2 text-xs font-bold"><BookOpen className="h-3.5 w-3.5 text-primary" />Unit Kompetensi Utama</p>
//                         <ul className="space-y-2">
//                           {skema.popularUnits.map((unit) => <li key={unit} className="flex items-center gap-2 text-xs text-muted-foreground"><CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-primary" />{unit}</li>)}
//                         </ul>
//                       </div>
//                     )}
//                   </div>
//                   <div className={`flex items-center justify-between border-t border-border/70 pt-4 ${view === "list" ? "gap-6 sm:w-52 sm:shrink-0 sm:flex-col sm:items-end sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0" : "mt-5"}`}>
//                     <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400"><CheckCircle2 className="h-4 w-4" />Terlisensi BNSP</span>
//                     <a href="#" className="inline-flex items-center gap-1.5 text-sm font-bold text-primary transition hover:gap-2.5">
//                       Detail skema
//                     </a>
//                   </div>
//                 </article>
//               ))}
//             </div>
//           ) : (
//             <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
//               <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground"><Search className="h-5 w-5" /></div>
//               <h3 className="font-bold">Skema tidak ditemukan</h3>
//               <p className="mt-1 text-sm text-muted-foreground">Ubah kata kunci atau reset filter untuk melihat skema lainnya.</p>
//               <button type="button" onClick={resetFilters} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"><X className="h-4 w-4" />Hapus semua filter</button>
//             </div>
//           )}
//           </div>
//         </div>
//         </div>
//       </section>
//     </main>
//   );
// }

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronDown,
  FileCode2,
  Grid2X2,
  List,
  LogIn,
  RotateCcw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Star,
  UserPlus,
  X,
} from "lucide-react";

type UnitKompetensi = {
  kode: string;
  judul: string;
};

type JadwalUjian = {
  id: string;
  tanggal: string;
  tuk: string;
  kuota: string;
};

type Skema = {
  code: string;
  nomorSkema: string;
  masaBerlaku: string;
  title: string;
  category: string;
  jenis: string;
  unitsCount: number;
  level: number;
  methods: string[];
  price: string;
  rating: number;
  reviewsCount: number;
  asesiCount: number;
  image: string;
  description: string;
  persyaratan: string[];
  jadwal: JadwalUjian[];
  units: UnitKompetensi[];
};

const skemaList: Skema[] = [
  {
    code: "SKM-RPL-001",
    nomorSkema: "SKM/BNSP/001/LSP-TTM/2026",
    masaBerlaku: "3 Tahun",
    title: "Teknisi Desktop (Desktop Technician)",
    category: "Programming Dan Pengembangan Software",
    jenis: "Okupasi",
    unitsCount: 7,
    level: 3,
    methods: ["Tatap Muka"],
    price: "Rp 1.200.000",
    rating: 4.8,
    reviewsCount: 12,
    asesiCount: 50,
    image:
      "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80",
    description:
      "Lakukan instalasi, konfigurasi, perawatan, dan penanganan masalah pada perangkat keras serta sistem operasi komputer desktop sesuai standar industri.",
    persyaratan: [
      "Ijazah minimal SMP/SMA/SMK sederajat",
      "Pasfoto formal 3×4 latar belakang merah",
      "Identitas diri resmi (KTP / Kartu Pelajar)",
      "Sertifikat pelatihan komputer atau surat keterangan PKL bidang terkait",
    ],
    jadwal: [
      {
        id: "jdw-1",
        tanggal: "15 Nov 2026",
        tuk: "TUK Sewaktu Lab Komputer A",
        kuota: "12 Kuota Tersisa",
      },
      {
        id: "jdw-2",
        tanggal: "22 Nov 2026",
        tuk: "TUK Mandiri Teknologi Terampil",
        kuota: "20 Kuota Tersisa",
      },
    ],
    units: [
      { kode: "J.620900.010.02", judul: "Memasang Motherboard" },
      { kode: "J.620900.014.02", judul: "Merawat CPU" },
      { kode: "J.620900.015.02", judul: "Merawat Hard Disk" },
      { kode: "J.620900.016.02", judul: "Merawat Peripheral" },
      { kode: "J.620900.025.02", judul: "Melakukan Instalasi Sistem Operasi" },
      { kode: "J.620900.026.02", judul: "Melakukan Instalasi Software Aplikasi" },
      { kode: "J.620900.031.02", judul: "Merawat Sistem Operasi" },
    ],
  },
  {
    code: "SKM-RPL-002",
    nomorSkema: "SKM/BNSP/002/LSP-TTM/2026",
    masaBerlaku: "3 Tahun",
    title: "Teknisi Perbaikan Komputer (Computer Repair)",
    category: "IT And Computing Facilities Management",
    jenis: "Okupasi",
    unitsCount: 6,
    level: 5,
    methods: ["SJJ", "Tatap Muka"],
    price: "Rp 1.500.000",
    rating: 4.9,
    reviewsCount: 18,
    asesiCount: 42,
    image:
      "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80",
    description:
      "Periksa, diagnosis, dan perbaiki kerusakan perangkat keras maupun perangkat lunak pada komputer secara menyeluruh sesuai prosedur K3.",
    persyaratan: [
      "Ijazah minimal SMK jurusan TKJ/RPL atau sederajat",
      "Pasfoto formal 3×4 latar belakang merah",
      "Portofolio atau surat pengalaman perbaikan perangkat komputer",
    ],
    jadwal: [
      {
        id: "jdw-3",
        tanggal: "18 Nov 2026",
        tuk: "TUK Mandiri Teknologi Terampil",
        kuota: "15 Kuota Tersisa",
      },
      {
        id: "jdw-4",
        tanggal: "25 Nov 2026",
        tuk: "TUK Sewaktu Lab Hardware",
        kuota: "10 Kuota Tersisa",
      },
    ],
    units: [
      { kode: "J.620900.011.02", judul: "Mendiagnosis Kerusakan Komputer" },
      { kode: "J.620900.012.02", judul: "Memperbaiki Komponen Motherboard" },
      { kode: "J.620900.014.02", judul: "Merawat CPU" },
      { kode: "J.620900.018.02", judul: "Mengganti Suku Cadang Komputer" },
      { kode: "J.620900.029.02", judul: "Memulihkan Data Penyimpanan" },
      { kode: "J.620900.032.02", judul: "Menguji Hasil Perbaikan Perangkat" },
    ],
  },
  {
    code: "SKM-JTK-001",
    nomorSkema: "SKM/BNSP/003/LSP-TTM/2026",
    masaBerlaku: "3 Tahun",
    title: "Asisten Instalasi & Pemeliharaan Perangkat Keras",
    category: "IT And Computing Facilities Management",
    jenis: "Okupasi",
    unitsCount: 5,
    level: 4,
    methods: ["Tatap Muka"],
    price: "Rp 1.000.000",
    rating: 4.7,
    reviewsCount: 10,
    asesiCount: 28,
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    description:
      "Bantu proses persiapan, instalasi, pemeriksaan, dan pemeliharaan berkala perangkat keras komputer sesuai prosedur kerja standar.",
    persyaratan: [
      "Ijazah minimal SMP/SMA/SMK sederajat",
      "Pasfoto formal 3×4 latar belakang merah",
      "Kartu identitas aktif (KTP / Kartu Pelajar)",
    ],
    jadwal: [
      {
        id: "jdw-5",
        tanggal: "20 Nov 2026",
        tuk: "TUK Sewaktu Lab Komputer B",
        kuota: "18 Kuota Tersisa",
      },
    ],
    units: [
      { kode: "J.620900.001.02", judul: "Menyiapkan Peralatan Instalasi Hardware" },
      { kode: "J.620900.005.02", judul: "Membantu Instalasi Perangkat Keras" },
      { kode: "J.620900.010.02", judul: "Memasang Motherboard" },
      { kode: "J.620900.016.02", judul: "Merawat Peripheral" },
      { kode: "J.620900.020.02", judul: "Melakukan Pemeliharaan Rutin PC" },
    ],
  },
  {
    code: "SKM-DATA-001",
    nomorSkema: "SKM/BNSP/004/LSP-TTM/2026",
    masaBerlaku: "3 Tahun",
    title: "Teknisi Perbaikan Perangkat (Smartphones Repair Technician)",
    category: "IT And Computing Facilities Management",
    jenis: "Okupasi",
    unitsCount: 5,
    level: 4,
    methods: ["SJJ", "Tatap Muka"],
    price: "Rp 1.350.000",
    rating: 4.8,
    reviewsCount: 14,
    asesiCount: 31,
    image:
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
    description:
      "Lakukan diagnosis kerusakan modul, perbaikan perangkat keras maupun flashing firmware, serta pengujian fungsi perangkat smartphone.",
    persyaratan: [
      "Ijazah minimal SMA/SMK sederajat",
      "Pasfoto formal 3×4 latar belakang merah",
      "Sertifikat kursus teknisi ponsel atau pengalaman kerja relevan",
    ],
    jadwal: [
      {
        id: "jdw-6",
        tanggal: "27 Nov 2026",
        tuk: "TUK Mandiri Teknologi Terampil",
        kuota: "14 Kuota Tersisa",
      },
    ],
    units: [
      { kode: "S.951200.001.01", judul: "Mendiagnosis Kerusakan Smartphone" },
      { kode: "S.951200.004.01", judul: "Mencetak Ulang Kaki IC (Reballing)" },
      { kode: "S.951200.007.01", judul: "Mengganti Komponen Modul Layar & Baterai" },
      { kode: "S.951200.010.01", judul: "Melakukan Pembaruan Perangkat Lunak (Flashing)" },
      { kode: "S.951200.012.01", judul: "Menguji Fungsi Akhir Smartphone" },
    ],
  },
  {
    code: "SKM-DSM-002",
    nomorSkema: "SKM/BNSP/005/LSP-TTM/2026",
    masaBerlaku: "3 Tahun",
    title: "Analis Web (Web Analyst)",
    category: "Programming Dan Pengembangan Software",
    jenis: "Okupasi",
    unitsCount: 5,
    level: 5,
    methods: ["Tatap Muka"],
    price: "Rp 2.000.000",
    rating: 5.0,
    reviewsCount: 8,
    asesiCount: 35,
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    description:
      "Analisis struktur, kebutuhan pengguna, fungsi, dan kinerja situs web untuk menentukan rekomendasi arsitektur serta perbaikan yang diperlukan.",
    persyaratan: [
      "Minimal Mahasiswa/Lulusan D3/S1 IT atau lulusan SMK dengan pengalaman kerja",
      "Pasfoto formal 3×4 latar belakang merah",
      "Portofolio analisis sistem atau pengembangan aplikasi web",
    ],
    jadwal: [
      {
        id: "jdw-7",
        tanggal: "29 Nov 2026",
        tuk: "TUK Mandiri Teknologi Terampil",
        kuota: "10 Kuota Tersisa",
      },
    ],
    units: [
      { kode: "J.620100.001.01", judul: "Menganalisis Kebutuhan Situs Web" },
      { kode: "J.620100.005.02", judul: "Mengidentifikasi Arsitektur Informasi Web" },
      { kode: "J.620100.009.01", judul: "Mengevaluasi Antarmuka dan Pengalaman Pengguna" },
      { kode: "J.620100.033.02", judul: "Mengukur Performa dan Keamanan Aplikasi Web" },
      { kode: "J.620100.042.01", judul: "Menyusun Rekomendasi Pengembangan Situs" },
    ],
  },
  {
    code: "SKM-KSJ-001",
    nomorSkema: "SKM/BNSP/006/LSP-TTM/2026",
    masaBerlaku: "3 Tahun",
    title: "Pemrogram Muda (Associate Programmer)",
    category: "Programming Dan Pengembangan Software",
    jenis: "Okupasi",
    unitsCount: 6,
    level: 6,
    methods: ["SJJ", "Tatap Muka"],
    price: "Rp 1.750.000",
    rating: 4.9,
    reviewsCount: 22,
    asesiCount: 60,
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
    description:
      "Bangun, kembangkan, dan uji program komputer dengan menerapkan algoritma pemrograman terstruktur maupun berorientasi objek sesuai spesifikasi.",
    persyaratan: [
      "Ijazah minimal SMK RPL/SIJA atau Mahasiswa bidang Informatika",
      "Pasfoto formal 3×4 latar belakang merah",
      "Portofolio source code / project aplikasi yang pernah dibuat",
    ],
    jadwal: [
      {
        id: "jdw-8",
        tanggal: "15 Nov 2026",
        tuk: "TUK Sewaktu Lab Komputer A",
        kuota: "8 Kuota Tersisa",
      },
      {
        id: "jdw-9",
        tanggal: "22 Nov 2026",
        tuk: "TUK Mandiri Teknologi Terampil",
        kuota: "20 Kuota Tersisa",
      },
    ],
    units: [
      { kode: "J.620100.004.02", judul: "Menggunakan Struktur Data" },
      { kode: "J.620100.009.01", judul: "Menggunakan Spesifikasi Program" },
      { kode: "J.620100.016.01", judul: "Menulis Kode dengan Prinsip Sesuai Guidelines" },
      { kode: "J.620100.017.02", judul: "Mengimplementasikan Pemrograman Terstruktur" },
      { kode: "J.620100.018.02", judul: "Mengimplementasikan Pemrograman Berorientasi Objek" },
      { kode: "J.620100.025.02", judul: "Melakukan Debugging" },
    ],
  },
];

const levels = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const methods = ["SJJ", "Tatap Muka"];
const categories = [...new Set(skemaList.map((item) => item.category))].sort((a, b) =>
  a.localeCompare(b)
);

export default function SkemaDaftar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryQuery, setCategoryQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedMethods, setSelectedMethods] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [view, setView] = useState<"grid" | "list">("grid");

  // State untuk menampilkan halaman Detail Skema saat tombol "Detail Skema" diklik
  const [selectedSkema, setSelectedSkema] = useState<Skema | null>(null);
  const [selectedJadwal, setSelectedJadwal] = useState<string>("");

  const filteredCategories = categories.filter((category) =>
    category.toLocaleLowerCase().includes(categoryQuery.trim().toLocaleLowerCase())
  );

  const filteredSkema = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase();
    return skemaList.filter((item) => {
      const matchesSearch =
        !query ||
        [item.title, item.code, item.category, item.description].some((value) =>
          value.toLocaleLowerCase().includes(query)
        );
      const matchesCategory = !selectedCategory || item.category === selectedCategory;
      const matchesLevel = !selectedLevel || item.level === Number(selectedLevel);
      const matchesMethod =
        selectedMethods.length === 0 ||
        selectedMethods.some((method) => item.methods.includes(method));
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
    setSelectedMethods((current) =>
      current.includes(method)
        ? current.filter((item) => item !== method)
        : [...current, method]
    );
  };

  const handleOpenDetail = (skema: Skema) => {
    setSelectedSkema(skema);
    setSelectedJadwal(skema.jadwal[0]?.id || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hasActiveFilters = Boolean(
    searchQuery || selectedCategory || selectedLevel || selectedMethods.length
  );

  // ================= TAMPILAN DETAIL SKEMA (SESUAI GAMBAR 2) =================
  if (selectedSkema) {
    return (
      <main className="bg-background text-foreground min-h-screen py-10 sm:py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Tombol Kembali */}
      

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
            {/* KOLOM KIRI (8 Kolom): Info Skema, Persyaratan, Tabel Unit Kompetensi */}
            <div className="space-y-6 lg:col-span-8">
              {/* 1. Card Info Utama, Deskripsi, Nomor Skema & Masa Berlaku */}
              <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
                <div className="mb-4 flex flex-wrap items-center gap-2.5">
                  <span className="rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary">
                    {selectedSkema.code}
                  </span>
                  <span className="rounded-full border border-border bg-muted px-3.5 py-1 text-xs font-semibold text-foreground">
                    Level {selectedSkema.level}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-secondary/30 bg-secondary/10 px-3.5 py-1 text-xs font-bold text-secondary">
                    <FileCode2 className="h-3.5 w-3.5" />
                    No. Skema: {selectedSkema.nomorSkema}
                  </span>
                </div>

                <h1 className="text-2xl font-extrabold leading-tight text-foreground sm:text-3xl">
                  Skema Sertifikasi {selectedSkema.title}
                </h1>

                {/* Deskripsi Skema */}
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {selectedSkema.description}
                </p>

                {/* Ringkasan Info Skema */}
                <div className="mt-6 grid grid-cols-2 gap-4 border-t border-border pt-6 sm:grid-cols-5">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      Jenis Skema
                    </p>
                    <p className="mt-1 text-sm font-bold text-foreground">
                      {selectedSkema.jenis}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      Pelaksanaan
                    </p>
                    <p className="mt-1 text-sm font-bold text-foreground">
                      {selectedSkema.methods.join(" / ")}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      Total Unit
                    </p>
                    <p className="mt-1 text-sm font-bold text-foreground">
                      {selectedSkema.units.length} Unit SKKNI
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      Masa Berlaku
                    </p>
                    <p className="mt-1 inline-flex items-center gap-1 text-sm font-bold text-primary">
                      <ShieldCheck className="h-4 w-4 shrink-0" />
                      {selectedSkema.masaBerlaku}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      Biaya
                    </p>
                    <p className="mt-1 text-sm font-extrabold text-secondary">
                      {selectedSkema.price}
                    </p>
                  </div>
                </div>
              </div>

              {/* 2. Card Persyaratan Pendaftaran */}
              <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
                <div className="mb-5 rounded-xl bg-muted/50 p-4">
                  <h2 className="text-lg font-bold text-foreground">
                    Persyaratan Pendaftaran
                  </h2>
                </div>
                <ul className="space-y-3.5">
                  {selectedSkema.persyaratan.map((req, index) => (
                    <li key={index} className="flex items-center gap-3.5">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {index + 1}
                      </span>
                      <span className="text-sm text-muted-foreground sm:text-base">
                        {req}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 3. Card Struktur Unit Kompetensi */}
              <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
                <div className="p-6 sm:px-8 sm:pb-4 sm:pt-8">
                  <h2 className="text-lg font-bold text-foreground">
                    Struktur Unit Kompetensi
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="border-y border-border bg-muted/40 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                        <th className="w-16 py-3.5 pl-6 pr-4 sm:pl-8">No</th>
                        <th className="w-48 px-4 py-3.5">Kode Unit</th>
                        <th className="py-3.5 pl-4 pr-6 sm:pr-8">
                          Judul Unit Kompetensi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-sm">
                      {selectedSkema.units.map((unit, idx) => (
                        <tr
                          key={unit.kode}
                          className="transition-colors hover:bg-muted/20"
                        >
                          <td className="py-4 pl-6 pr-4 font-medium text-muted-foreground sm:pl-8">
                            {idx + 1}
                          </td>
                          <td className="px-4 py-4 font-mono text-xs font-bold text-primary sm:text-sm">
                            {unit.kode}
                          </td>
                          <td className="py-4 pl-4 pr-6 font-medium text-foreground sm:pr-8">
                            {unit.judul}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* KOLOM KANAN (4 Kolom Sticky): Total Biaya, Jadwal & Tombol Login/Daftar */}
            <div className="lg:sticky lg:top-24 lg:col-span-4">
              <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
                <div className="border-b border-border bg-muted/40 p-6 sm:p-7">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Total Pendaftaran
                  </p>
                  <p className="mt-1 text-3xl font-extrabold text-foreground">
                    {selectedSkema.price}
                  </p>
                  <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Masa berlaku sertifikat {selectedSkema.masaBerlaku}
                  </p>
                </div>

                <div className="space-y-6 p-6 sm:p-7">
                  <div>
                    <p className="mb-3 text-sm font-bold text-foreground">
                      Pilih Jadwal Ujian:
                    </p>
                    <div className="space-y-3">
                      {selectedSkema.jadwal.map((item) => {
                        const isSelected = selectedJadwal === item.id;
                        return (
                          <label
                            key={item.id}
                            onClick={() => setSelectedJadwal(item.id)}
                            className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-all ${isSelected
                                ? "border-primary bg-primary/5 ring-1 ring-primary"
                                : "border-border bg-card hover:border-primary/40"
                              }`}
                          >
                            <input
                              type="radio"
                              name="jadwal-ujian"
                              checked={isSelected}
                              onChange={() => setSelectedJadwal(item.id)}
                              className="mt-1 h-4 w-4 accent-primary"
                            />
                            <div className="space-y-1">
                              <p className="flex items-center gap-1.5 text-sm font-bold text-foreground">
                                <Calendar className="h-3.5 w-3.5 text-primary" />
                                {item.tanggal}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {item.tuk}
                              </p>
                              <p className="pt-0.5 text-xs font-bold text-secondary">
                                {item.kuota}
                              </p>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Pengganti Tombol "Daftar & Lanjut APL-01" -> Login / Daftar Akun */}
                  <div className="space-y-3 pt-2">
                    <Link
                      href="/auth/pendaftaran"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-bold text-primary-foreground shadow-sm transition hover:opacity-95"
                    >
                      <LogIn className="h-4 w-4" />
                      <span>Login untuk Mendaftar</span>
                    </Link>

                  
                  </div>

                  <p className="text-center text-[11px] leading-relaxed text-muted-foreground">
                    Silakan login atau daftar akun terlebih dahulu untuk melanjutkan pengisian APL-01.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ================= TAMPILAN KATALOG SKEMA (SESUAI GAMBAR 1 + FILTER) =================
  return (
    <main className="bg-background text-foreground">
      <section className="relative isolate overflow-hidden border-b border-border bg-gradient-to-br from-primary/[0.07] via-background to-secondary/[0.08] py-14 sm:py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-28 -top-36 -z-10 h-96 w-96 rounded-full bg-primary/10 blur-3xl"
        />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            {/* <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-background/80 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-primary shadow-sm">
              <Award className="h-4 w-4" /> Standar Kompetensi Kerja Nasional Indonesia
            </div> */}
            <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Skema <span className="text-primary">Sertifikasi</span> Profesi
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Temukan skema sertifikasi kompetensi bidang teknologi informasi yang sesuai dengan keahlian dan tujuan karier Anda.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" /> Sertifikasi berlisensi BNSP
              </span>
              <span className="inline-flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" /> {skemaList.length} skema pilihan
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-primary">
                Katalog sertifikasi
              </p>
              <h2 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">
                Jelajahi skema yang tersedia
              </h2>
            </div>
            <p className="text-sm text-muted-foreground" aria-live="polite">
              Menampilkan <span className="font-semibold text-foreground">{filteredSkema.length}</span> dari{" "}
              {skemaList.length} skema
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
            {/* Sidebar Filter */}
            <aside className="self-start rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5 lg:sticky lg:top-24">
              <button
                type="button"
                aria-expanded={filtersOpen}
                onClick={() => setFiltersOpen((open) => !open)}
                className="flex w-full items-center justify-between gap-2 text-left text-base font-bold"
              >
                <span className="inline-flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-primary" />
                  Filter Pencarian
                </span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${filtersOpen ? "rotate-180" : ""}`}
                />
              </button>

              {filtersOpen && (
                <div className="mt-5 flex flex-col gap-6 border-t border-border pt-5">
                  <fieldset>
                    <legend className="mb-3 text-sm font-bold">Metode Pelaksanaan</legend>
                    <div className="flex flex-wrap gap-2">
                      {methods.map((method) => (
                        <label
                          key={method}
                          className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${selectedMethods.includes(method)
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-border text-muted-foreground hover:border-primary/40"
                            }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedMethods.includes(method)}
                            onChange={() => toggleMethod(method)}
                            className="h-4 w-4 accent-primary"
                          />
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
                        {levels.map((level) => (
                          <option key={level} value={level}>
                            Level {level} KKNI
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        aria-hidden="true"
                        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                      />
                    </span>
                  </label>

                  <fieldset>
                    <legend className="mb-3 text-sm font-bold">Kategori</legend>
                    <label className="relative block">
                      <span className="sr-only">Cari kategori</span>
                      <Search
                        aria-hidden="true"
                        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                      />
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
                        <input
                          type="radio"
                          name="skema-category"
                          checked={!selectedCategory}
                          onChange={() => setSelectedCategory("")}
                          className="h-4 w-4 accent-primary"
                        />
                        Semua Kategori
                      </label>
                      {filteredCategories.map((category) => (
                        <label
                          key={category}
                          className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted"
                        >
                          <input
                            type="radio"
                            name="skema-category"
                            checked={selectedCategory === category}
                            onChange={() => setSelectedCategory(category)}
                            className="h-4 w-4 accent-primary"
                          />
                          <span>{category}</span>
                        </label>
                      ))}
                      {filteredCategories.length === 0 && (
                        <p className="px-2 py-1.5 text-sm text-muted-foreground">
                          Kategori tidak ditemukan.
                        </p>
                      )}
                    </div>
                  </fieldset>
                </div>
              )}

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  {!hasActiveFilters && !categoryQuery && (
                    <span>Pilih filter untuk menyaring daftar skema.</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={resetFilters}
                  disabled={!hasActiveFilters && !categoryQuery}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <RotateCcw className="h-4 w-4" /> Reset Semua Filter
                </button>
              </div>
            </aside>

            {/* Daftar Card Skema */}
            <div className="min-w-0">
              <label className="relative mb-5 block">
                <span className="sr-only">Cari skema sertifikasi</span>
                <Search
                  aria-hidden="true"
                  className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="search"
                  placeholder="Cari nama, kode, atau bidang skema..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="h-12 w-full rounded-xl border border-border bg-card pl-11 pr-4 text-sm shadow-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                />
              </label>

              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {filteredSkema.length} skema ditemukan
                </p>
                <div
                  className="inline-flex items-center gap-1 rounded-xl border border-border bg-card p-1"
                  aria-label="Mode tampilan"
                >
                  <button
                    type="button"
                    aria-label="Tampilan grid"
                    aria-pressed={view === "grid"}
                    onClick={() => setView("grid")}
                    className={`inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-semibold transition ${view === "grid"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-muted"
                      }`}
                  >
                    <Grid2X2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Grid</span>
                  </button>
                  <button
                    type="button"
                    aria-label="Tampilan list"
                    aria-pressed={view === "list"}
                    onClick={() => setView("list")}
                    className={`inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-semibold transition ${view === "list"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-muted"
                      }`}
                  >
                    <List className="h-4 w-4" />
                    <span className="hidden sm:inline">List</span>
                  </button>
                </div>
              </div>

              {filteredSkema.length ? (
                <div
                  className={
                    view === "grid"
                      ? "grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
                      : "flex flex-col gap-4"
                  }
                >
                  {filteredSkema.map((skema) => (
                    <article
                      key={skema.code}
                      className={`group flex justify-between rounded-3xl border border-border bg-card p-3.5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md ${view === "list"
                          ? "flex-col gap-5 sm:flex-row sm:items-center sm:p-5"
                          : "flex-col"
                        }`}
                    >
                      <div
                        className={
                          view === "list"
                            ? "flex flex-1 flex-col gap-5 sm:flex-row sm:items-center"
                            : ""
                        }
                      >
                        {/* Gambar Thumbnail + Badge BNSP (Sesuai Gambar 1) */}
                        <div
                          className={`relative overflow-hidden rounded-2xl bg-muted ${view === "list"
                              ? "h-44 w-full sm:h-36 sm:w-52 shrink-0"
                              : "h-44 w-full"
                            }`}
                        >
                          <img
                            src={skema.image}
                            alt={skema.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <span className="absolute right-3 top-3 rounded-full bg-card/95 px-3 py-1 text-[11px] font-extrabold text-primary shadow-sm backdrop-blur-sm">
                            BNSP
                          </span>
                        </div>

                        {/* Judul & Tag Pills (Level, Okupasi, Metode) */}
                        <div className={view === "list" ? "flex-1" : "px-2 pb-4 pt-4"}>
                          <h3 className="line-clamp-2 min-h-[3.25rem] text-base font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
                            {skema.title}
                          </h3>

                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            <span className="rounded-lg border border-border bg-muted/40 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                              Level {skema.level}
                            </span>
                            <span className="rounded-lg border border-border bg-muted/40 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                              {skema.jenis}
                            </span>
                            {skema.methods.map((method) => (
                              <span
                                key={method}
                                className="rounded-lg border border-border bg-muted/40 px-2.5 py-1 text-xs font-medium text-muted-foreground"
                              >
                                {method === "Tatap Muka" ? "Offline" : method}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Bagian Bawah: Biaya Sertifikasi, Rating & Tombol Detail Skema */}
                      <div
                        className={`border-border/60 ${view === "list"
                            ? "flex flex-col justify-between border-t pt-4 sm:w-56 sm:shrink-0 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0"
                            : "border-t px-2 pb-1.5 pt-3.5"
                          }`}
                      >
                        <div className="mb-4 flex items-end justify-between">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                              Biaya Sertifikasi
                            </p>
                            <p className="mt-0.5 text-lg font-extrabold text-foreground">
                              {skema.price}
                            </p>
                          </div>

                          <div className="text-right">
                            <div className="inline-flex items-center gap-1 text-xs font-bold text-secondary">
                              <Star className="h-3.5 w-3.5 fill-current" />
                              <span>
                                {skema.rating} ({skema.reviewsCount})
                              </span>
                            </div>
                            <p className="mt-0.5 text-[11px] text-muted-foreground">
                              {skema.asesiCount} Asesi
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleOpenDetail(skema)}
                          className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-sm transition-colors hover:bg-secondary hover:text-secondary-foreground"
                        >
                          Detail Skema
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <Search className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold">Skema tidak ditemukan</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Ubah kata kunci atau reset filter untuk melihat skema lainnya.
                  </p>
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                  >
                    <X className="h-4 w-4" />
                    Hapus semua filter
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}