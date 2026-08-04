"use client";

import React from "react";
import { 
  BookOpen, 
  Video, 
  TrendingUp, 
  Users, 
  ClipboardList 
} from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: BookOpen,
      title: "Materi Terstruktur",
      description:
        "Modul pembelajaran disusun secara sistematis mulai dari dasar hingga tingkat lanjutan.",
    },
    {
      icon: Users,
      title: "Instruktur Berpengalaman",
      description:
        "Dibimbing oleh praktisi profesional yang memiliki pengalaman di bidangnya.",
    },
    {
      icon: Video,
      title: "Pra-Uji & Workshop",
      description: "Sesi pembekalan langsung dari asesor berpengalaman.",
      highlight: true,
    },
    {
      icon: TrendingUp,
      title: "Standar Industri",
      description: "Materi uji selalu diperbarui sesuai tren teknologi.",
    },
    {
      icon: Users,
      title: "Dukungan Asesor",
      description: "Konsultasi dan bimbingan selama proses sertifikasi.",
    },
    {
      icon: ClipboardList,
      title: "Rencana Asesmen",
      description: "Jadwal dan alur ujian terstruktur secara transparan.",
    },
  ];

  return (
    <section id="features" className="w-full bg-background py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Judul Utama */}
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
            Semua yang Anda Butuhkan untuk{" "}
            <span className="text-primary transition-colors duration-300 hover:text-orange-500">
              Dapatkan Sertifikasi
            </span>
          </h2>
        </div>

        {/* Grid 6 Card Horizontal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;

            return (
              <div
                key={index}
                className={`
                  group
                  relative
                  overflow-hidden
                  rounded-2xl
                  border
                  ${feature.highlight 
                    ? 'border-orange-500 bg-orange-50/40 dark:bg-orange-950/20 shadow-lg shadow-orange-500/10' 
                    : 'border-border/80 bg-card shadow-sm'}
                  p-6
                  text-center
                  transition-all
                  duration-300
                  ease-out
                  cursor-pointer
                  hover:shadow-2xl
                  hover:shadow-orange-500/25
                  hover:border-orange-500
                  hover:-translate-y-2.5
                `}
              >
                {/* Ambient Soft Glow Background (efek ciptadrasoft) */}
                <div
                  className="
                    absolute
                    inset-0
                    opacity-0
                    transition-opacity
                    duration-500
                    group-hover:opacity-100
                    pointer-events-none
                    bg-gradient-to-b
                    from-orange-500/5
                    via-orange-500/10
                    to-orange-500/20
                  "
                />

                {/* Light Blob Accent */}
                <div
                  className="
                    absolute
                    -bottom-12
                    left-1/2
                    h-40
                    w-40
                    -translate-x-1/2
                    rounded-full
                    bg-orange-400/30
                    blur-2xl
                    opacity-0
                    transition-opacity
                    duration-500
                    group-hover:opacity-100
                    pointer-events-none
                  "
                />

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center">

                  {/* Icon Box */}
                  <div
                    className={`
                      mb-5
                      flex
                      h-14
                      w-14
                      items-center
                      justify-center
                      rounded-2xl
                      ${feature.highlight 
                        ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30' 
                        : 'bg-blue-50 text-primary dark:bg-accent'}
                      transition-all
                      duration-300
                      ease-out
                      group-hover:bg-gradient-to-br
                      group-hover:from-orange-500
                      group-hover:to-orange-600
                      group-hover:text-white
                      group-hover:scale-110
                      group-hover:shadow-lg
                      group-hover:shadow-orange-500/35
                    `}
                  >
                    <IconComponent className="h-7 w-7 transition-transform duration-300 group-hover:scale-105" />
                  </div>

                  {/* Title */}
                  <h3
                    className={`
                      text-base
                      font-bold
                      leading-snug
                      mb-2
                      transition-colors
                      duration-300
                      ${feature.highlight ? 'text-orange-600 dark:text-orange-400' : 'text-foreground'}
                      group-hover:text-orange-600
                      dark:group-hover:text-orange-400
                    `}
                  >
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p
                    className="
                      text-xs
                      text-muted-foreground
                      leading-relaxed
                      transition-colors
                      duration-300
                      group-hover:text-foreground
                    "
                  >
                    {feature.description}
                  </p>

                  {/* Garis Aksen Bawah (Progress Bar Glow) */}
                  <div
                    className={`
                      mt-5
                      h-1
                      rounded-full
                      bg-gradient-to-r
                      from-orange-500
                      to-amber-400
                      transition-all
                      duration-300
                      ease-out
                      ${feature.highlight ? 'w-16' : 'w-0 group-hover:w-16'}
                    `}
                  />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
