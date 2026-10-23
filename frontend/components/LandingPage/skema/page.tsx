"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
    BookOpen,
    CheckCircle2,
    ChevronDown,
    Grid2X2,
    List,
    RotateCcw,
    // Search,
    SlidersHorizontal,
    Star,
    X,
} from "lucide-react";
import { skemaList, levels, methods, categories } from "@/lib/skemaData";

export default function SkemaDaftar() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryQuery, setCategoryQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedLevel, setSelectedLevel] = useState("");
    const [selectedMethods, setSelectedMethods] = useState<string[]>([]);
    const [filtersOpen, setFiltersOpen] = useState(true);
    const [view, setView] = useState<"grid" | "list">("grid");

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

    const hasActiveFilters = Boolean(
        searchQuery || selectedCategory || selectedLevel || selectedMethods.length
    );

    return (
        <main className="bg-background text-foreground">
            <section className="relative isolate overflow-hidden border-b border-border bg-gradient-to-br from-primary/[0.07] via-background to-secondary/[0.08] py-14 sm:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl">
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
                            <p className="text-sm font-bold uppercase tracking-[0.14em] text-primary">Katalog sertifikasi</p>
                            <h2 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">Jelajahi skema yang tersedia</h2>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Menampilkan <span className="font-semibold text-foreground">{filteredSkema.length}</span> dari {skemaList.length} skema
                        </p>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
                        {/* Sidebar Filter */}
                        <aside className="self-start rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5 lg:sticky lg:top-24">
                            <button
                                type="button"
                                onClick={() => setFiltersOpen((open) => !open)}
                                className="flex w-full items-center justify-between gap-2 text-left text-base font-bold"
                            >
                                <span className="inline-flex items-center gap-2">
                                    <SlidersHorizontal className="h-4 w-4 text-primary" /> Filter Pencarian
                                </span>
                                <ChevronDown className={`h-4 w-4 transition-transform ${filtersOpen ? "rotate-180" : ""}`} />
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
                                        <select
                                            value={selectedLevel}
                                            onChange={(event) => setSelectedLevel(event.target.value)}
                                            className="h-10 w-full appearance-none rounded-lg border border-border bg-background px-3 pr-9 text-sm outline-none focus:border-primary"
                                        >
                                            <option value="">Semua Level</option>
                                            {levels.map((level) => (
                                                <option key={level} value={level}>
                                                    Level {level} KKNI
                                                </option>
                                            ))}
                                        </select>
                                    </label>

                                    <fieldset>
                                        <legend className="mb-3 text-sm font-bold">Kategori</legend>
                                        <input
                                            type="search"
                                            value={categoryQuery}
                                            onChange={(event) => setCategoryQuery(event.target.value)}
                                            placeholder="Cari kategori..."
                                            className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none mb-3"
                                        />
                                        <div className="grid max-h-36 grid-cols-1 gap-2 overflow-y-auto pr-1">
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
                                                <label key={category} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted">
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
                                        </div>
                                    </fieldset>
                                </div>
                            )}

                            <div className="mt-4 border-t border-border pt-4">
                                <button
                                    type="button"
                                    onClick={resetFilters}
                                    disabled={!hasActiveFilters && !categoryQuery}
                                    className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-primary disabled:opacity-40"
                                >
                                    <RotateCcw className="h-4 w-4" /> Reset Semua Filter
                                </button>
                            </div>
                        </aside>

                        {/* Daftar Card Skema */}
                        <div className="min-w-0">
                            <input
                                type="search"
                                placeholder="Cari nama, kode, atau bidang skema..."
                                value={searchQuery}
                                onChange={(event) => setSearchQuery(event.target.value)}
                                className="h-12 w-full rounded-xl border border-border bg-card pl-4 pr-4 text-sm shadow-sm outline-none mb-5 focus:border-primary"
                            />

                            <div className="mb-4 flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">{filteredSkema.length} skema ditemukan</p>
                                <div className="inline-flex items-center gap-1 rounded-xl border border-border bg-card p-1">
                                    <button
                                        type="button"
                                        onClick={() => setView("grid")}
                                        className={`inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-semibold ${view === "grid" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted"
                                            }`}
                                    >
                                        <Grid2X2 className="h-4 w-4" /> Grid
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setView("list")}
                                        className={`inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-semibold ${view === "list" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted"
                                            }`}
                                    >
                                        <List className="h-4 w-4" /> List
                                    </button>
                                </div>
                            </div>

                            {filteredSkema.length ? (
                                <div className={view === "grid" ? "grid gap-6 sm:grid-cols-2 xl:grid-cols-3" : "flex flex-col gap-4"}>
                                    {filteredSkema.map((skema) => (
                                        <article
                                            key={skema.id}
                                            className={`group flex justify-between rounded-3xl border border-border bg-card p-3.5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md ${view === "list" ? "flex-col gap-5 sm:flex-row sm:items-center sm:p-5" : "flex-col"
                                                }`}
                                        >
                                            <div className={view === "list" ? "flex flex-1 flex-col gap-5 sm:flex-row sm:items-center" : ""}>
                                                <div className={`relative overflow-hidden rounded-2xl bg-muted ${view === "list" ? "h-44 w-full sm:h-36 sm:w-52 shrink-0" : "h-44 w-full"}`}>
                                                    <img src={skema.image} alt={skema.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                                    <span className="absolute right-3 top-3 rounded-full bg-card/95 px-3 py-1 text-[11px] font-extrabold text-primary shadow-sm backdrop-blur-sm">
                                                        BNSP
                                                    </span>
                                                </div>

                                                <div className={view === "list" ? "flex-1" : "px-2 pb-4 pt-4"}>
                                                    <h3 className="line-clamp-2 min-h-[3.25rem] text-base font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
                                                        {skema.title}
                                                    </h3>
                                                    <div className="mt-3 flex flex-wrap items-center gap-2">
                                                        <span className="rounded-lg border border-border bg-muted/40 px-2.5 py-1 text-xs font-medium text-muted-foreground">Level {skema.level}</span>
                                                        <span className="rounded-lg border border-border bg-muted/40 px-2.5 py-1 text-xs font-medium text-muted-foreground">{skema.jenis}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className={`border-border/60 ${view === "list" ? "flex flex-col justify-between border-t pt-4 sm:w-56 sm:shrink-0 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0" : "border-t px-2 pb-1.5 pt-3.5"}`}>
                                                <div className="mb-4 flex items-end justify-between">
                                                    <div>
                                                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Biaya Sertifikasi</p>
                                                        <p className="mt-0.5 text-lg font-extrabold text-foreground">{skema.price}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="inline-flex items-center gap-1 text-xs font-bold text-secondary">
                                                            <Star className="h-3.5 w-3.5 fill-current" />
                                                            <span>{skema.rating} ({skema.reviewsCount})</span>
                                                        </div>
                                                        <p className="mt-0.5 text-[11px] text-muted-foreground">{skema.asesiCount} Asesi</p>
                                                    </div>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => router.push(`/skema/${skema.id}`)}
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
                                    <h3 className="font-bold">Skema tidak ditemukan</h3>
                                    <button type="button" onClick={resetFilters} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
                                        <X className="h-4 w-4" /> Hapus semua filter
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