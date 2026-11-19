"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import {
  AlertCircle,
  Award,
  Calendar,
  CheckCircle2,
  FileBadge,
  RotateCcw,
  Search,
  UserRound,
} from "lucide-react";

type CertificateResult = {
  valid: true;
  certificate_number: string;
  scheme_name: string;
  issued_at: string;
  participant_name: string;
  scheme_code: string | null;
};

type LookupStatus = "idle" | "loading" | "valid" | "not-found" | "error";

export default function VerifikasiSertifikat() {
  const [searchKey, setSearchKey] = useState("");
  const [status, setStatus] = useState<LookupStatus>("idle");
  const [result, setResult] = useState<CertificateResult | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const certificateNumber = searchKey.trim();
    if (!certificateNumber) return;

    setStatus("loading");
    setResult(null);
    setErrorMessage("");

    try {
      const response = await fetch(
        `/api/public/certificates/${encodeURIComponent(certificateNumber)}`,
        { cache: "no-store" },
      );

      if (response.status === 404) {
        setStatus("not-found");
        return;
      }

      const payload = (await response.json().catch(() => ({}))) as {
        valid?: boolean;
        certificate_number?: string;
        scheme_name?: string;
        issued_at?: string;
        participant_name?: string;
        scheme_code?: string | null;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error || "Verifikasi belum dapat diproses.");
      }

      if (
        payload.valid !== true ||
        !payload.certificate_number ||
        !payload.scheme_name ||
        !payload.participant_name ||
        !payload.issued_at
      ) {
        throw new Error("Data sertifikat belum lengkap.");
      }

      setResult({
        valid: true,
        certificate_number: payload.certificate_number,
        scheme_name: payload.scheme_name,
        issued_at: payload.issued_at,
        participant_name: payload.participant_name,
        scheme_code: payload.scheme_code ?? null,
      });
      setStatus("valid");
    } catch (error) {
      setErrorMessage(
        error instanceof TypeError
          ? "Layanan verifikasi belum dapat dihubungi. Coba kembali beberapa saat lagi."
          : error instanceof Error
            ? error.message
            : "Sertifikat belum dapat diverifikasi. Coba kembali.",
      );
      setStatus("error");
    }
  };

  const handleReset = () => {
    setSearchKey("");
    setResult(null);
    setErrorMessage("");
    setStatus("idle");
  };

  return (
    <section className="bg-background py-12 text-foreground lg:py-20">
      <div className="mx-auto max-w-4xl space-y-10 px-4 sm:px-6 lg:px-8">
        <header className="mx-auto max-w-2xl space-y-4 text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-primary">
            Layanan publik
          </p>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
            Cek Pemegang Sertifikat
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            Masukkan nomor sertifikat untuk memeriksa apakah nomor tersebut tercatat pada basis data LSP.
          </p>
        </header>

        <div className="space-y-5 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <label
              htmlFor="certificate-number"
              className="block text-sm font-bold text-foreground"
            >
              Nomor sertifikat
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative min-w-0 flex-1">
                <FileBadge
                  aria-hidden="true"
                  className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  id="certificate-number"
                  name="certificateNumber"
                  type="text"
                  autoComplete="off"
                  required
                  maxLength={100}
                  value={searchKey}
                  onChange={(event) => setSearchKey(event.target.value)}
                  placeholder="Masukkan nomor pada sertifikat"
                  className="min-h-12 w-full rounded-xl border border-input bg-background pl-12 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <button
                type="submit"
                disabled={status === "loading"}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-wait disabled:opacity-60"
              >
                <Search className="h-4 w-4" />
                {status === "loading" ? "Memeriksa..." : "Verifikasi"}
              </button>
            </div>
          </form>

          {status === "loading" && (
            <p role="status" aria-live="polite" className="text-sm text-muted-foreground">
              Memeriksa nomor sertifikat pada basis data LSP...
            </p>
          )}

          {status === "error" && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-foreground"
            >
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
              <p className="leading-relaxed">{errorMessage}</p>
            </div>
          )}

          {status === "not-found" && (
            <div
              role="status"
              aria-live="polite"
              className="rounded-xl border border-border bg-muted/30 p-5"
            >
              <h2 className="font-bold">Nomor sertifikat tidak ditemukan</h2>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Periksa kembali nomor yang dimasukkan. Jika nomor sudah benar, hubungi LSP untuk meminta bantuan.
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-semibold transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <RotateCcw className="h-4 w-4" />
                Cari nomor lain
              </button>
            </div>
          )}

          {status === "valid" && result && (
            <section
              aria-labelledby="certificate-result-title"
              className="rounded-xl border border-emerald-600/30 bg-emerald-500/5 p-5 sm:p-6"
            >
              <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 className="h-6 w-6" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                      Nomor tercatat
                    </p>
                    <h2 id="certificate-result-title" className="text-lg font-bold">
                      Informasi sertifikat
                    </h2>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-semibold transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary print:hidden"
                >
                  Cetak hasil
                </button>
              </div>

              <dl className="mt-5 grid gap-5 sm:grid-cols-2">
                <CertificateField icon={UserRound} label="Nama pemegang">
                  {result.participant_name}
                </CertificateField>
                <CertificateField icon={FileBadge} label="Nomor sertifikat">
                  <span className="break-all font-mono">{result.certificate_number}</span>
                </CertificateField>
                <CertificateField icon={Award} label="Skema kompetensi">
                  {result.scheme_name}
                  {result.scheme_code && (
                    <span className="mt-1 block text-xs font-normal text-muted-foreground">
                      Kode skema: {result.scheme_code}
                    </span>
                  )}
                </CertificateField>
                <CertificateField icon={Calendar} label="Tanggal terbit">
                  {formatIssuedDate(result.issued_at)}
                </CertificateField>
              </dl>

              <button
                type="button"
                onClick={handleReset}
                className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-semibold transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary print:hidden"
              >
                <RotateCcw className="h-4 w-4" />
                Periksa nomor lain
              </button>
            </section>
          )}
        </div>
      </div>
    </section>
  );
}

function CertificateField({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof UserRound;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="min-w-0">
      <dt className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
        <Icon className="h-4 w-4 text-primary" />
        {label}
      </dt>
      <dd className="mt-1 break-words text-sm font-bold text-foreground">{children}</dd>
    </div>
  );
}

function formatIssuedDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
    timeZone: "Asia/Jakarta",
  }).format(date);
}
