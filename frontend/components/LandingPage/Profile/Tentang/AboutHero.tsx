import Link from "next/link";
import { ArrowRight, Award, FileCheck2, SearchCheck } from "lucide-react";

const services = [
  {
    icon: Award,
    title: "Skema sertifikasi",
    description: "Lihat ruang lingkup skema dan unit kompetensinya.",
    href: "/skema",
  },
  {
    icon: FileCheck2,
    title: "Pengajuan sertifikasi",
    description: "Buat akun peserta dan lengkapi permohonan.",
    href: "/auth/pendaftaran",
  },
  {
    icon: SearchCheck,
    title: "Verifikasi sertifikat",
    description: "Periksa nomor sertifikat melalui basis data LSP.",
    href: "/informasi/verifikasi-sertifikat",
  },
];

export default function AboutHero() {
  return (
    <section className="relative isolate overflow-hidden border-b border-border/60 bg-background py-14 sm:py-20 lg:py-24">
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-96 w-[min(90vw,900px)] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />

      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Profil LSP
          </p>
          <h1 className="mt-3 text-4xl font-black leading-tight tracking-tight text-foreground sm:text-5xl">
            Tentang LSP Teknologi Terampil
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
            Situs ini menyediakan informasi skema sertifikasi, alur pengajuan, persyaratan, dan layanan pemeriksaan nomor sertifikat.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/skema"
              className="inline-flex min-h-11 items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Lihat skema sertifikasi
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/kontak"
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Hubungi LSP
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 sm:p-7">
          <h2 className="text-lg font-bold text-foreground">Layanan pada situs ini</h2>
          <ul className="mt-4 divide-y divide-border">
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <li key={service.href}>
                  <Link
                    href={service.href}
                    className="group flex min-h-20 items-center gap-4 py-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold text-foreground group-hover:text-primary">
                        {service.title}
                      </span>
                      <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                        {service.description}
                      </span>
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-primary transition-transform group-hover:translate-x-1" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
