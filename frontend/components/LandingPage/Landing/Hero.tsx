import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Users, ShieldCheck } from "lucide-react";

export default function Hero() {
  const shortcuts = [
    {
      icon: BookOpen,
      label: "Skema sertifikasi",
      description: "Lihat skema, unit kompetensi, dan persyaratannya.",
      href: "/skema",
    },
    {
      icon: ShieldCheck,
      label: "Cek sertifikat",
      description: "Periksa nomor sertifikat melalui data LSP.",
      href: "/informasi/verifikasi-sertifikat",
    },
    {
      icon: Users,
      label: "Hubungi LSP",
      description: "Tanyakan informasi pendaftaran dan asesmen.",
      href: "/kontak",
    },
  ];

  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden bg-background"
      style={{ minHeight: "calc(100svh - 5rem)" }}
    >
      {/* BACKGROUND IMAGE */}
      <div className="absolute inset-0 h-full w-full">
        <Image
          src="/Hero/Foto1.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
          quality={100}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background/90 backdrop-blur-[1px]" />
      </div>

      {/* CONTENT */}
      <div
        className="relative z-10 grid w-full place-items-center px-4 py-10 sm:px-6 sm:py-12 lg:px-8"
        style={{ minHeight: "calc(100svh - 5rem)" }}
      >
        <div className="w-full max-w-7xl">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
            
            {/* LEFT - Text Content */}
            <div className="lg:col-span-6">
              {/* Badge */}
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/80 px-4 py-1.5 text-xs font-semibold text-primary backdrop-blur-sm">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>LAYANAN SERTIFIKASI PROFESI</span>
              </div>

              {/* Title */}
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl leading-[1.15]">
                Tingkatkan Karir.
                <br />
                <span className="text-primary">
                  Terampil, Diakui,
                </span>
                <br />
                <span className="text-primary">
                  Tersertifikasi.
                </span>
              </h1>

              {/* Description */}
              <p className="mt-4 max-w-xl text-sm text-muted-foreground sm:text-base lg:text-lg leading-relaxed">
                Temukan skema sertifikasi, pelajari persyaratannya, lalu ajukan sertifikasi melalui portal peserta.
              </p>

              {/* Buttons */}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:gap-4">
                <Link
                  href="/auth/pendaftaran"
                  className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  Mulai Sertifikasi
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>

                <Link
                  href="/skema"
                  className="inline-flex min-h-11 items-center justify-center rounded-md border border-primary/20 bg-background/80 px-5 py-3 text-sm font-semibold text-primary transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  Lihat Skema Uji
                </Link>
              </div>
            </div>

            {/* Space between the introduction and direct service links */}
            <div className="hidden lg:col-span-3 lg:flex lg:items-center lg:justify-center">
              <div className="relative h-[280px] w-[280px] xl:h-[320px] xl:w-[320px]">
                <div className="absolute inset-0 rounded-full bg-primary/10 blur-2xl" />
              </div>
            </div>

            {/* Direct service links */}
            <div className="lg:col-span-3">
              <div className="flex flex-col gap-3">
                {shortcuts.map((shortcut) => {
                  const IconComponent = shortcut.icon;
                  return (
                    <Link
                      key={shortcut.href}
                      href={shortcut.href}
                      className="group flex min-h-24 items-start gap-3 rounded-xl border border-border/80 bg-card/90 p-4 shadow-sm backdrop-blur-sm transition-colors hover:border-primary/50 hover:bg-accent/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-foreground leading-tight">
                          {shortcut.label}
                        </h3>
                        <p className="mt-1 text-xs leading-snug text-muted-foreground">
                          {shortcut.description}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
