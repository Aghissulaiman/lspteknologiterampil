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
            <span className="text-blue-600 transition-colors duration-300 hover:text-orange-500">
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
        className="
          group
          relative
          overflow-hidden
          rounded-2xl
          border
          border-border
          bg-card
          p-6
          text-center
          transition-all
          duration-500
          cursor-pointer

          hover:border-orange-500
          hover:-translate-y-2
        "
      >
        {/* Glow Background */}
        <div
          className="
            absolute
            inset-0
            opacity-0
            transition-all
            duration-500
            group-hover:opacity-100
            pointer-events-none
          "
        >
          {/* Glow bawah */}
          <div
            className="
              absolute
              -bottom-24
              left-1/2
              h-64
              w-64
              -translate-x-1/2
              rounded-full
              bg-orange-400/30
              blur-3xl
            "
          />

          {/* Glow kanan atas */}
          <div
            className="
              absolute
              -top-10
              right-0
              h-40
              w-40
              rounded-full
              bg-orange-300/20
              blur-3xl
            "
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center">

          {/* Icon */}
          <div
            className="
              mb-5
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              bg-blue-50
              text-blue-600

              transition-all
              duration-500

              group-hover:bg-orange-500
              group-hover:text-white
              group-hover:scale-110
              group-hover:rotate-6
            "
          >
            <IconComponent className="h-7 w-7 transition-all duration-500" />
          </div>

          {/* Title */}
          <h3
            className="
              text-base
              font-bold
              text-foreground
              leading-snug
              mb-2

              transition-all
              duration-500

              group-hover:text-orange-600
            "
          >
            {feature.title}
          </h3>

          {/* Description */}
          <p
            className="
              text-xs
              text-muted-foreground
              leading-relaxed

              transition-all
              duration-500

              group-hover:text-foreground
            "
          >
            {feature.description}
          </p>

          {/* Garis bawah */}
          <div
            className="
              mt-5
              h-1
              w-0
              rounded-full
              bg-orange-500

              transition-all
              duration-500

              group-hover:w-16
            "
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