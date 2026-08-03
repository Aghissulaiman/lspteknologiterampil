"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight, BookOpen, Users, ShieldCheck, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Hero() {
  const stats = [
    {
      icon: BookOpen,
      value: "50+",
      label: "Skema Sertifikasi",
      description: "Standar kompetensi nasional & internasional",
    },
    {
      icon: Users,
      value: "15,000+",
      label: "Peserta Tersertifikasi",
      description: "Alumni terbukti kompeten di industri",
    },
    {
      icon: Award,
      value: "98%",
      label: "Tingkat Kelulusan",
      description: "Direkomendasikan oleh praktisi",
    },
  ];

  return (
    // min-h-[calc(100vh-5rem)] membuat komponen ini pas 1 layar (dikurangi tinggi navbar 80px / 5rem)
    <section className="relative flex min-h-[calc(100vh-5rem)] w-full items-center justify-center overflow-hidden bg-background py-8 lg:py-0">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-8">
          
          {/* 1. Teks Kiri */}
          <div className="z-10 lg:col-span-5">
            {/* Top Badge (Biru + Accent Soft Blue) */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-xs font-semibold text-primary">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span>LEMBAGA SERTIFIKASI PROFESI RESMI</span>
            </div>

            {/* Headline Teks (Full Biru & Dark Navy) */}
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-5xl leading-[1.15]">
              Tingkatkan Karir. <br />
              <span className="text-primary">Terampil, Diakui,</span> <br />
              <span className="text-primary">Tersertifikasi.</span>
            </h1>

            {/* Deskripsi */}
            <p className="mt-5 text-base text-muted-foreground sm:text-lg leading-relaxed">
              Uji kompetensi dan dapatkan sertifikasi profesi resmi untuk membuktikan keahlian teknologi Anda sesuai standar industri nasional (BNSP).
            </p>

            {/* Tombol Akses (Semua Biru - Tanpa Warna Lain) */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-md group"
              >
                Mulai Sertifikasi
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-primary/20 text-primary hover:bg-accent font-semibold"
              >
                Lihat Skema Uji
              </Button>
            </div>
          </div>

          {/* 2. Gambar Tengah (Foto Profesional) */}
<div className="relative flex items-center justify-center lg:col-span-4 min-h-[380px] sm:min-h-[440px]">
  {/* Lingkaran Dekoratif Soft Blue di Belakang Foto */}
  <div className="absolute top-1/2 left-1/2 -z-10 h-[280px] w-[280px] sm:h-[340px] sm:w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent blur-xl" />
  
  {/* Pembungkus Foto (Diberi h-[380px] dan w-full agar ukurannya tidak 0px) */}
  <div className="relative h-[380px] w-full max-w-[320px] sm:h-[440px] sm:max-w-[360px] overflow-hidden rounded-2xl">
    {/* <Image
      src="/Foto/Foto1.png"
      alt="Profesional LSP Teknologi Terampil"
      fill
      sizes="(max-width: 768px) 100vw, 360px"
      className="object-cover object-top"
      priority
    /> */}
  </div>
</div>

          {/* 3. Stat Cards Kanan (Seragam dengan Nuansa Biru & Putih) */}
          <div className="flex flex-col gap-4 lg:col-span-3">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div
                  key={index}
                  className="flex items-start gap-4 rounded-2xl bg-card p-5 border border-border/80 shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground leading-tight">
                      {stat.value}
                    </h3>
                    <p className="text-sm font-semibold text-foreground mt-0.5">
                      {stat.label}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 leading-snug">
                      {stat.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}