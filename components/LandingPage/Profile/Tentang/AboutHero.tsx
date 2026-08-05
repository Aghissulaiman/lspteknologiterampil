import React from "react";
import Link from "next/link";
import { ShieldCheck, ArrowRight, Award, CheckCircle2 } from "lucide-react";

export default function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-background pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-border/60">
      {/* Background Accent Gradients */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[1000px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-primary/15 via-primary/5 to-transparent blur-3xl" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          
          {/* Kolom Kiri: Headline & Deskripsi */}
          <div className="lg:col-span-7 space-y-6 text-left">

            {/* Main Title */}
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-[1.15]">
              Menjamin Mutu & <br />
              <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Kompetensi SDM Digital
              </span>
            </h1>

            {/* Paragraph Description */}
            <p className="max-w-2xl text-lg text-muted-foreground leading-relaxed">
              LSP Teknologi Terampil adalah Lembaga Sertifikasi Profesi Pihak Ke-3 (LSP-P3) yang berkomitmen melahirkan tenaga ahli TIK berstandar nasional melalui pengujian transparan, obyektif, dan akuntabel.
            </p>

            {/* Bullet Points Keunggulan Singkat */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-foreground font-medium text-base">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                <span>Standar SKKNI Terintegrasi</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                <span>Asesor Kompetensi Sertifikasi</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                <span>Sertifikat Asli BNSP</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                <span>Jejaring TUK Luas</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                href="/Landing-Page/skema"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-base font-semibold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 hover:shadow-lg transition-all active:scale-[0.98]"
              >
                <span>Explorasi Skema</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              
              <Link
                href="/Landing-Page/profile/legalitas"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-input bg-card px-6 text-base font-semibold text-foreground hover:bg-accent hover:text-accent-foreground transition-all active:scale-[0.98]"
              >
                Lihat Legalitas
              </Link>
            </div>
          </div>

          {/* Kolom Kanan: Card Visual Showcase / Highlight */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none rounded-3xl border border-border/80 bg-card/60 p-6 shadow-2xl backdrop-blur-xl">
              
              {/* Inner Banner Badge */}
              <div className="flex items-center justify-between pb-6 border-b border-border/60">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Award className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-lg leading-snug">LSP-P3 TIK</h3>
                    <p className="text-xs text-muted-foreground">Kategori Sektor Teknologi</p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  Aktif
                </span>
              </div>

              {/* Stat Quick Cards */}
              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-border/50 bg-background/80 p-4 transition-all hover:border-primary/40">
                  <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                    Lisensi Nomor
                  </p>
                  <p className="mt-1 text-xl font-extrabold text-foreground tracking-tight">
                    BNSP-LSP-1234-ID
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-border/50 bg-background/80 p-4">
                    <p className="text-xs font-semibold text-muted-foreground">Total Skema</p>
                    <p className="mt-1 text-2xl font-bold text-primary">12+</p>
                  </div>
                  <div className="rounded-2xl border border-border/50 bg-background/80 p-4">
                    <p className="text-xs font-semibold text-muted-foreground">Asesi Lulus</p>
                    <p className="mt-1 text-2xl font-bold text-foreground">10.000+</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}