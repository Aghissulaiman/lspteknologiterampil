"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, BookOpen, FileText, RefreshCw } from "lucide-react";
import Footer from "@/components/LandingPage/Landing/Footer";
import Navbar from "@/components/LandingPage/Navbar";

type SchemeUnit = {
    id: string;
    code: string;
    title: string;
    description: string | null;
};

type SchemeDocument = {
    code: string;
    label: string;
    category: "administrative" | "portfolio";
    is_required: boolean;
    allowed_mime_types: string[];
};

type PublicSchemeDetail = {
    id: string;
    code: string;
    name: string;
    category: string | null;
    level: string | null;
    description: string | null;
    requirements: Record<string, unknown> | null;
    competencyUnits: SchemeUnit[];
    documentRequirements: SchemeDocument[];
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
    return "Detail skema belum dapat dimuat.";
}

export default function DetailSkemaPage() {
    const params = useParams<{ id: string }>();
    const schemeId = Array.isArray(params.id) ? params.id[0] : params.id;
    const [scheme, setScheme] = useState<PublicSchemeDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [accountStatus, setAccountStatus] = useState<"checking" | "participant" | "guest">("checking");

    useEffect(() => {
        let active = true;

        fetch("/api/auth/me", { cache: "no-store" })
            .then(async (response) => {
                if (!response.ok) return false;
                const data = await response.json();
                return data?.user?.role === "participant";
            })
            .then((isParticipant) => {
                if (active) setAccountStatus(isParticipant ? "participant" : "guest");
            })
            .catch(() => {
                if (active) setAccountStatus("guest");
            });

        return () => {
            active = false;
        };
    }, []);

    useEffect(() => {
        let active = true;

        async function loadScheme() {
            setLoading(true);
            setError("");
            try {
                const response = await fetch(`/api/public/schemes/${encodeURIComponent(schemeId)}`, { cache: "no-store" });
                const payload = await response.json();
                if (!response.ok) throw new Error(errorMessage(payload));
                if (active) setScheme(payload.scheme ?? null);
            } catch (loadError) {
                if (active) setError(loadError instanceof Error ? loadError.message : "Detail skema belum dapat dimuat.");
            } finally {
                if (active) setLoading(false);
            }
        }

        void loadScheme();
        const refreshWhenVisible = () => {
            if (!document.hidden) void loadScheme();
        };
        const intervalId = window.setInterval(refreshWhenVisible, 30_000);
        document.addEventListener("visibilitychange", refreshWhenVisible);
        window.addEventListener("focus", refreshWhenVisible);

        return () => {
            active = false;
            window.clearInterval(intervalId);
            document.removeEventListener("visibilitychange", refreshWhenVisible);
            window.removeEventListener("focus", refreshWhenVisible);
        };
    }, [schemeId]);

    const requirements = scheme?.requirements ?? {};
    const metadata = [
        ["Jenis skema", asText(requirements.type)],
        ["Metode pelaksanaan", asText(requirements.method)],
        ["Biaya", asText(requirements.price)],
        ["Nomor skema", asText(requirements.nomorSkema)],
        ["Masa berlaku", asText(requirements.masaBerlaku)],
    ].filter((item): item is [string, string] => Boolean(item[1]));

    return (
        <>
            <Navbar />
            <main className="min-h-[60vh] bg-background py-8 text-foreground sm:py-12">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <Link
                        href="/skema"
                        className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-lg pr-3 text-sm font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Kembali ke katalog skema
                    </Link>

                    {loading ? (
                        <p role="status" className="mt-6 rounded-xl border border-border bg-card px-5 py-12 text-center text-sm text-muted-foreground">
                            Memuat detail skema…
                        </p>
                    ) : error ? (
                        <div role="alert" className="mt-6 rounded-xl border border-destructive/30 bg-destructive/5 px-5 py-8 text-center">
                            <h1 className="text-xl font-bold">Skema belum dapat dibuka</h1>
                            <p className="mt-2 text-sm text-muted-foreground">{error}</p>
                            <Link href="/skema" className="mt-4 inline-flex min-h-11 items-center rounded-lg bg-primary px-4 font-semibold text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                                Kembali ke katalog
                            </Link>
                        </div>
                    ) : !scheme ? (
                        <div className="mt-6 rounded-xl border border-dashed border-border px-5 py-12 text-center">
                            <h1 className="text-xl font-bold">Skema tidak ditemukan</h1>
                            <p className="mt-2 text-sm text-muted-foreground">Skema mungkin sudah tidak aktif atau tidak ditampilkan di katalog.</p>
                        </div>
                    ) : (
                        <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1.7fr)_minmax(17rem,0.8fr)] lg:items-start">
                            <div className="min-w-0 space-y-5">
                                <section className="rounded-xl border border-border bg-card p-5 sm:p-8" aria-labelledby="scheme-title">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="rounded-md bg-primary/10 px-3 py-1.5 font-mono text-xs font-semibold text-primary">{scheme.code}</span>
                                        {scheme.level && <span className="rounded-md bg-muted px-3 py-1.5 text-xs font-medium">{scheme.level}</span>}
                                    </div>
                                    <h1 id="scheme-title" className="mt-4 text-2xl font-bold leading-tight sm:text-3xl">{scheme.name}</h1>
                                    {scheme.category && <p className="mt-2 text-sm font-medium text-primary">{scheme.category}</p>}
                                    {scheme.description && <p className="mt-5 whitespace-pre-line text-sm leading-7 text-muted-foreground sm:text-base">{scheme.description}</p>}

                                    {metadata.length > 0 && (
                                        <dl className="mt-6 grid gap-4 border-t border-border pt-5 sm:grid-cols-2">
                                            {metadata.map(([label, value]) => (
                                                <div key={label} className="min-w-0">
                                                    <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
                                                    <dd className={`mt-1 break-words text-sm font-semibold ${label === "Biaya" ? "text-amber-800 dark:text-secondary" : ""}`}>{value}</dd>
                                                </div>
                                            ))}
                                        </dl>
                                    )}
                                </section>

                                <section className="overflow-hidden rounded-xl border border-border bg-card" aria-labelledby="competency-heading">
                                    <div className="flex items-start gap-3 border-b border-border p-5 sm:px-7">
                                        <BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                                        <div>
                                            <h2 id="competency-heading" className="font-bold">Unit kompetensi</h2>
                                            <p className="mt-1 text-sm text-muted-foreground">Urutan dan isi unit mengikuti data skema yang dikelola admin.</p>
                                        </div>
                                    </div>
                                    {scheme.competencyUnits.length > 0 ? (
                                        <ol className="divide-y divide-border">
                                            {scheme.competencyUnits.map((unit, index) => (
                                                <li key={unit.id} className="flex min-w-0 gap-4 px-5 py-4 sm:px-7">
                                                    <span className="mt-0.5 w-7 shrink-0 font-mono text-xs text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
                                                    <div className="min-w-0">
                                                        <p className="break-words font-semibold">{unit.title}</p>
                                                        <p className="mt-1 break-all font-mono text-xs text-primary">{unit.code}</p>
                                                        {unit.description && <p className="mt-2 whitespace-pre-line text-sm leading-6 text-muted-foreground">{unit.description}</p>}
                                                    </div>
                                                </li>
                                            ))}
                                        </ol>
                                    ) : (
                                        <p className="px-5 py-8 text-sm text-muted-foreground sm:px-7">Unit kompetensi belum ditambahkan.</p>
                                    )}
                                </section>
                            </div>

                            <aside className="space-y-5 lg:sticky lg:top-24">
                                <section className="rounded-xl border border-border bg-card p-5 sm:p-6" aria-labelledby="documents-heading">
                                    <div className="flex items-start gap-3">
                                        <FileText className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                                        <div>
                                            <h2 id="documents-heading" className="font-bold">Dokumen pendaftaran</h2>
                                            <p className="mt-1 text-sm text-muted-foreground">Persiapkan berkas yang tercantum untuk skema ini.</p>
                                        </div>
                                    </div>
                                    {scheme.documentRequirements.length > 0 ? (
                                        <ul className="mt-4 space-y-3">
                                            {scheme.documentRequirements.map((document) => (
                                                <li key={document.code} className="rounded-lg border border-border p-3">
                                                    <p className="text-sm font-semibold">{document.label}</p>
                                                    <p className="mt-1 text-xs text-muted-foreground">
                                                        {document.category === "portfolio" ? "Portofolio" : "Administrasi"}
                                                        {document.is_required ? " · Wajib" : " · Opsional"}
                                                    </p>
                                                    {document.allowed_mime_types.length > 0 && (
                                                        <p className="mt-1 break-words text-xs text-muted-foreground">
                                                            Format: {document.allowed_mime_types.map((type) => type === "application/pdf" ? "PDF" : type === "image/jpeg" ? "JPG" : type === "image/png" ? "PNG" : type).join(", ")}
                                                        </p>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="mt-4 rounded-lg bg-muted/60 p-3 text-sm text-muted-foreground">Belum ada persyaratan dokumen khusus.</p>
                                    )}
                                </section>

                                <section className="rounded-xl border border-primary/20 bg-primary/[0.04] p-5 sm:p-6">
                                    <h2 className="font-bold">{accountStatus === "participant" ? "Lanjutkan pendaftaran" : "Siap mendaftar?"}</h2>
                                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                        {accountStatus === "participant"
                                            ? "Akun asesi Anda sudah aktif. Lanjutkan melalui Dashboard Asesi."
                                            : accountStatus === "checking"
                                                ? "Memeriksa status akun Anda..."
                                                : "Masuk atau buat akun peserta untuk melanjutkan pendaftaran sertifikasi."}
                                    </p>
                                    {accountStatus === "participant" ? (
                                        <Link href="/dashboard" className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                                            Lanjut ke Dashboard Asesi
                                        </Link>
                                    ) : accountStatus === "checking" ? (
                                        <button type="button" disabled aria-busy="true" className="mt-4 inline-flex min-h-11 w-full cursor-wait items-center justify-center rounded-lg bg-primary/60 px-4 py-2.5 text-sm font-semibold text-primary-foreground">
                                            Memeriksa akun...
                                        </button>
                                    ) : (
                                        <>
                                            <Link href="/auth/pendaftaran" className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                                                Buat akun peserta
                                            </Link>
                                            <Link href="/auth/masuk" className="mt-2 inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-border px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                                                Sudah punya akun? Masuk
                                            </Link>
                                        </>
                                    )}
                                </section>

                                <button
                                    type="button"
                                    onClick={() => window.location.reload()}
                                    className="inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg px-3 text-sm font-medium text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                >
                                    <RefreshCw className="h-4 w-4" aria-hidden="true" /> Muat ulang detail
                                </button>
                            </aside>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}
