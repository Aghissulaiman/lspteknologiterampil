import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, ChevronRight } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Beranda", href: "/" },
    { name: "Tentang LSP", href: "/profil/tentang" },
    { name: "Struktur Organisasi", href: "/profil/struktur" },
    { name: "Kegiatan", href: "/informasi/kegiatan" },
    { name: "Berita", href: "/informasi/berita" },
    { name: "Kontak", href: "/kontak" },
  ];

  const infoLinks = [
    { name: "Cek Pemegang Sertifikat", href: "/informasi/verifikasi-sertifikat" },
    { name: "Skema Sertifikasi", href: "/skema" },
  ];

  return (
    <footer className="w-full bg-card border-t border-border/80">
      
      {/* Upper Footer */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 lg:gap-8">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Image
                src="/Logo/Logo2.png"
                alt="Logo LSP Teknologi Terampil"
                width={45}
                height={45}
                className="object-contain w-11 h-11 sm:w-12 sm:h-12"
              />
              <div>
                <span className="text-sm sm:text-base font-bold text-foreground">
                  LSP <span className="text-primary">Teknologi Terampil</span>
                </span>
                <p className="text-[8px] sm:text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Lembaga Sertifikasi Profesi
                </p>
              </div>
            </div>

            <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
              Situs LSP Teknologi Terampil memuat informasi skema, proses asesmen, kegiatan, dan verifikasi sertifikat.
            </p>

            <Link
              href="/informasi/verifikasi-sertifikat"
              className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border bg-accent/60 px-3 py-2 text-[10px] font-semibold text-foreground transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-primary" />
              Periksa nomor sertifikat
            </Link>
          </div>

          {/* Col 2 & 3: Quick Links dan Layanan Asesi (2 kolom) */}
          <div className="md:col-span-2">
            <div className="grid grid-cols-2 gap-8 md:gap-10 lg:gap-8">
              
              {/* Quick Links */}
              <div className="space-y-2">
                <h4 className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-foreground">
                  Jelajahi
                </h4>
                <ul className="space-y-1.5">
                  {quickLinks.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="group inline-flex min-h-11 items-center py-1 text-[11px] text-muted-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:text-xs"
                      >
                        <ChevronRight className="w-2.5 h-2.5 mr-1 text-muted-foreground/50 group-hover:text-orange-500 transition-colors shrink-0" />
                        <span>{link.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Layanan Asesi */}
              <div className="space-y-2">
                <h4 className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-foreground">
                  Layanan Asesi
                </h4>
                <ul className="space-y-1.5">
                  {infoLinks.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="group inline-flex min-h-11 items-center py-1 text-[11px] text-muted-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:text-xs"
                      >
                        <ChevronRight className="w-2.5 h-2.5 mr-1 text-muted-foreground/50 group-hover:text-orange-500 transition-colors shrink-0" />
                        <span>{link.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Lower Footer */}
      <div className="border-t border-border/60 bg-background/50 py-3 sm:py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] sm:text-[11px] text-muted-foreground">
          
          <p className="text-center sm:text-left">
            © {currentYear} <span className="text-foreground font-medium">LSP Teknologi Terampil</span>. Hak Cipta Dilindungi.
          </p>

          <Link
            href="/informasi/verifikasi-sertifikat"
            className="inline-flex min-h-11 items-center text-center hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Verifikasi sertifikat
          </Link>

        </div>
      </div>

    </footer>
  );
}
