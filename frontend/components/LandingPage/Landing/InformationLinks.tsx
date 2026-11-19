import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const destinations = [
  {
    title: "Tentang LSP",
    description: "Profil, visi, dan misi LSP Teknologi Terampil.",
    href: "/profil/tentang",
  },
  {
    title: "Struktur Organisasi",
    description: "Informasi mengenai struktur dan tata kelola LSP.",
    href: "/profil/struktur",
  },
  {
    title: "Kegiatan",
    description: "Lihat informasi kegiatan sertifikasi dan kolaborasi.",
    href: "/informasi/kegiatan",
  },
  {
    title: "Berita",
    description: "Baca informasi dan panduan layanan sertifikasi.",
    href: "/informasi/berita",
  },
  {
    title: "Cek Pemegang Sertifikat",
    description: "Periksa nomor sertifikat pada basis data LSP.",
    href: "/informasi/verifikasi-sertifikat",
  },
  {
    title: "Kontak",
    description: "Kirim pertanyaan kepada LSP Teknologi Terampil.",
    href: "/kontak",
  },
];

export default function InformationLinks() {
  return (
    <section
      aria-labelledby="information-links-title"
      className="border-y border-border/70 bg-muted/30 py-14 sm:py-16"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Informasi LSP
          </p>
          <h2
            id="information-links-title"
            className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
          >
            Lanjutkan ke halaman yang Anda perlukan
          </h2>
        </div>

        <nav aria-label="Halaman informasi LSP">
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {destinations.map((destination) => (
              <li key={destination.href}>
                <Link
                  href={destination.href}
                  className="group flex min-h-24 items-start justify-between gap-4 rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/50 hover:bg-accent/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <span>
                    <span className="block text-sm font-bold text-foreground">
                      {destination.title}
                    </span>
                    <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                      {destination.description}
                    </span>
                  </span>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="mt-0.5 h-4 w-4 shrink-0 text-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
