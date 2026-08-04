"use client";

import React from "react";
import { 
  BookOpen, 
  FileCheck, 
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
    <section className="w-full bg-background py-16 md:py-20">
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
                className="group flex flex-col items-center text-center p-6 rounded-2xl bg-card border border-border/80 shadow-sm transition-all duration-300 hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/10 hover:-translate-y-1"
              >
                {/* Icon Box: Default Biru Soft -> Hover Oranye */}
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition-all duration-300 group-hover:bg-orange-500 group-hover:text-white">
                  <IconComponent className="h-7 w-7" />
                </div>

                {/* Card Title: Default Hitam -> Hover Oranye */}
                <h3 className="text-base font-bold text-foreground leading-snug mb-2 transition-colors duration-300 group-hover:text-orange-600">
                  {feature.title}
                </h3>

                {/* Card Description */}
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}