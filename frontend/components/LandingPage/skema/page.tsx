"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BookOpen, RefreshCw, Search, X } from "lucide-react";

type PublicScheme = {
    id: string;
    code: string;
    name: string;
    category: string | null;
    level: string | null;
    description: string | null;
    requirements: Record<string, unknown> | null;
    unit_count: number;
};

function asText(value: unknown): string {
    if (typeof value === "string" || typeof value === "number") return String(value).trim();
    if (Array.isArray(value)) return value.map(asText).filter(Boolean).join(", ");
    return "";
}

function errorMessage(payload: unknown) {
    if (payload && typeof payload === "object" && "error" in payload && typeof payload.error === "string") {
        return payload.error;
    }
    return "Daftar skema belum dapat dimuat.";
}

export default function SkemaDaftar() {
    const [schemes, setSchemes] = useState<PublicScheme[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedLevel, setSelectedLevel] = useState("");
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [loadError, setLoadError] = useState("");

    const loadSchemes = useCallback(async () => {
        setRefreshing(true);
        try {
            const response = await fetch("/api/public/schemes", { cache: "no-store" });
            const payload = await response.json();
            if (!response.ok) throw new Error(errorMessage(payload));
            setSchemes(Array.isArray(payload.schemes) ? payload.schemes : []);
            setLoadError("");
        } catch (error) {
            setLoadError(error instanceof Error ? error.message : "Daftar skema belum dapat dimuat.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        void loadSchemes();

        const refreshWhenVisible = () => {
            if (!document.hidden) void loadSchemes();
        };
        const intervalId = window.setInterval(refreshWhenVisible, 30_000);
        document.addEventListener("visibilitychange", refreshWhenVisible);
        window.addEventListener("focus", refreshWhenVisible);

        return () => {
            window.clearInterval(intervalId);
            document.removeEventListener("visibilitychange", refreshWhenVisible);
            window.removeEventListener("focus", refreshWhenVisible);
        };
    }, [loadSchemes]);

    const categories = useMemo(
        () => [...new Set(schemes.map((scheme) => scheme.category?.trim()).filter((value): value is string => Boolean(value)))].sort(),
        [schemes],
    );
    const levels = useMemo(
        () => [...new Set(schemes.map((scheme) => scheme.level?.trim()).filter((value): value is string => Boolean(value)))].sort(),
        [schemes],
    );

    const filteredSchemes = useMemo(() => {
        const query = searchQuery.trim().toLocaleLowerCase();
        return schemes.filter((scheme) => {
            const requirementValues = Object.values(scheme.requirements ?? {}).map(asText).join(" ");
            const matchesSearch = !query ||
                `${scheme.code} ${scheme.name} ${scheme.category ?? ""} ${scheme.level ?? ""} ${scheme.description ?? ""} ${requirementValues}`
                    .toLocaleLowerCase()
                    .includes(query);
            const matchesCategory = !selectedCategory || scheme.category === selectedCategory;
            const matchesLevel = !selectedLevel || scheme.level === selectedLevel;
            return matchesSearch && matchesCategory && matchesLevel;
        });
    }, [schemes, searchQuery, selectedCategory, selectedLevel]);

    const clearFilters = () => {
        setSearchQuery("");
        setSelectedCategory("");
        setSelectedLevel("");
    };

    const hasFilters = Boolean(searchQuery || selectedCategory || selectedLevel);

    return (
        <main className="bg-background text-foreground">
            <section className="border-b border-border bg-primary/[0.06] py-10 dark:bg-primary/[0.12] sm:py-14">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl">
                        <p className="text-sm font-semibold text-primary">Katalog sertifikasi</p>
                        <h1 className="mt-2 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                            Skema sertifikasi profesi
                        </h1>
                        <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
                            Lihat bidang, level, unit kompetensi, dan persyaratan setiap skema sebelum mendaftar.
                        </p>
                    </div>
                </div>
            </section>

            <section className="py-8 sm:py-11" aria-labelledby="scheme-list-heading">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-6 flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h2 id="scheme-list-heading" className="text-xl font-bold sm:text-2xl">Pilih skema</h2>
                            <p className="mt-1 text-sm text-muted-foreground">Informasi di bawah mengikuti perubahan yang disimpan admin.</p>
                        </div>
                        <div className="flex items-center justify-between gap-3 sm:justify-end">
                            <p className="text-sm text-muted-foreground" aria-live="polite">
                                {loading ? "Memuat skema…" : `${filteredSchemes.length} dari ${schemes.length} skema`}
                            </p>
                            <button
                                type="button"
                                onClick={() => void loadSchemes()}
                                disabled={refreshing}
                                className="inline-flex min-h-11 shrink-0 cursor-pointer items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm font-semibold transition hover:border-primary/50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60"
                                aria-label="Muat ulang daftar skema"
                            >
                                <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} aria-hidden="true" />
                                <span className="hidden sm:inline">Muat ulang</span>
                            </button>
                        </div>
                    </div>

                    {loadError && (
                        <div role="alert" className="mb-5 flex flex-col gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-foreground">{loadError}</p>
                            <button
                                type="button"
                                onClick={() => void loadSchemes()}
                                className="min-h-11 cursor-pointer self-start font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:self-auto"
                            >
                                Coba lagi
                            </button>
                        </div>
                    )}

                    <div className="mb-6 grid gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(12rem,1fr)_minmax(10rem,0.8fr)]">
                        <label className="block">
                            <span className="mb-1.5 block text-sm font-semibold">Cari skema</span>
                            <span className="relative block">
                                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                                <input
                                    type="search"
                                    value={searchQuery}
                                    onChange={(event) => setSearchQuery(event.target.value)}
                                    placeholder="Nama, kode, atau bidang"
                                    className="h-11 w-full rounded-lg border border-input bg-background pl-10 pr-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                />
                            </span>
                        </label>
                        <label className="block">
                            <span className="mb-1.5 block text-sm font-semibold">Bidang</span>
                            <select
                                value={selectedCategory}
                                onChange={(event) => setSelectedCategory(event.target.value)}
                                className="h-11 w-full cursor-pointer rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            >
                                <option value="">Semua bidang</option>
                                {categories.map((category) => <option key={category} value={category}>{category}</option>)}
                            </select>
                        </label>
                        <label className="block">
                            <span className="mb-1.5 block text-sm font-semibold">Level</span>
                            <select
                                value={selectedLevel}
                                onChange={(event) => setSelectedLevel(event.target.value)}
                                className="h-11 w-full cursor-pointer rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            >
                                <option value="">Semua level</option>
                                {levels.map((level) => <option key={level} value={level}>{level}</option>)}
                            </select>
                        </label>
                    </div>

                    {loading && schemes.length === 0 ? (
                        <p role="status" className="rounded-xl border border-border bg-card px-5 py-12 text-center text-sm text-muted-foreground">
                            Memuat daftar skema sertifikasi…
                        </p>
                    ) : filteredSchemes.length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {filteredSchemes.map((scheme) => {
                                const requirements = scheme.requirements ?? {};
                                const schemeType = asText(requirements.type);
                                const method = asText(requirements.method);
                                const price = asText(requirements.price);
                                const unitCount = Number(scheme.unit_count) || 0;

                                return (
                                    <Link
                                        key={scheme.id}
                                        href={`/skema/${encodeURIComponent(scheme.id)}`}
                                        aria-label={`Lihat detail skema: ${scheme.name}`}
                                        className="group block h-full min-w-0 cursor-pointer rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                                    >
                                        <article className="flex h-full min-w-0 flex-col rounded-xl border border-border bg-card p-5 transition-colors group-hover:border-primary/50">
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <span className="font-mono text-xs font-semibold text-primary">{scheme.code}</span>
                                            {scheme.level && <span className="rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-foreground">{scheme.level}</span>}
                                        </div>
                                        <h3 className="mt-4 line-clamp-2 min-h-14 text-lg font-bold leading-snug">{scheme.name}</h3>
                                        <p className="mt-1 min-h-5 text-sm text-muted-foreground">
                                            {scheme.category || "\u00a0"}
                                        </p>
                                        <p className="mt-4 min-h-[4.5rem] line-clamp-3 text-sm leading-6 text-muted-foreground">
                                            {scheme.description || "\u00a0"}
                                        </p>

                                        <dl className="mt-5 grid grid-cols-2 grid-rows-2 gap-x-3 gap-y-3 border-t border-border pt-4 text-sm">
                                            <div className="min-w-0">
                                                <dt className="text-xs text-muted-foreground">Jenis skema</dt>
                                                <dd className="mt-1 line-clamp-2 min-h-10 break-words font-medium leading-5">{schemeType || "—"}</dd>
                                            </div>
                                            <div className="min-w-0">
                                                <dt className="text-xs text-muted-foreground">Metode</dt>
                                                <dd className="mt-1 line-clamp-2 min-h-10 break-words font-medium leading-5">{method || "—"}</dd>
                                            </div>
                                            <div className="min-w-0">
                                                <dt className="text-xs text-muted-foreground">Unit kompetensi</dt>
                                                <dd className="mt-1 inline-flex min-h-10 items-start gap-1.5 font-medium leading-5">
                                                    <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" /> {unitCount} unit
                                                </dd>
                                            </div>
                                            <div className="min-w-0">
                                                <dt className="text-xs text-muted-foreground">Biaya</dt>
                                                <dd className={`mt-1 line-clamp-2 min-h-10 break-words font-semibold leading-5 ${price ? "text-amber-800 dark:text-secondary" : "text-muted-foreground"}`}>
                                                    {price || "—"}
                                                </dd>
                                            </div>
                                        </dl>

                                        <div className="mt-auto pt-5">
                                            <span className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors group-hover:bg-primary/90 group-focus-visible:bg-primary/90">
                                                Lihat detail skema
                                            </span>
                                        </div>
                                        </article>
                                    </Link>
                                );
                            })}
                        </div>
                    ) : loadError && schemes.length === 0 ? null : schemes.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-border px-5 py-12 text-center">
                            <h3 className="font-semibold">Belum ada skema publik</h3>
                            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
                                Skema yang aktif dan ditampilkan di katalog akan muncul di sini.
                            </p>
                        </div>
                    ) : (
                        <div className="rounded-xl border border-dashed border-border px-5 py-12 text-center">
                            <h3 className="font-semibold">Skema tidak ditemukan</h3>
                            <p className="mt-2 text-sm text-muted-foreground">Ubah kata pencarian atau pilihan bidang dan level.</p>
                            {hasFilters && (
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="mt-4 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-lg px-3 text-sm font-semibold text-primary hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                >
                                    <X className="h-4 w-4" aria-hidden="true" /> Hapus filter
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
