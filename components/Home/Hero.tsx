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
    // Penambahan id="hero" agar dapat di-scroll dari Navbar
    <section 
      id="hero" 
      className="relative flex min-h-[calc(100vh-5rem)] w-full items-center justify-center overflow-hidden bg-background py-8 lg:py-0"
    >
      
      {/* ========================================================= */}
      {/* BACKGROUND IMAGE & OVERLAY */}
      {/* ========================================================= */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/Hero/Foto1.png"
          alt="Hero Background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Overlay agar konten di atasnya tetap terlihat rapi */}
        <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px]" />
      </div>
      {/* ========================================================= */}

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-8">
          
          {/* 1. Teks Kiri */}
          <div className="z-10 lg:col-span-5">
            {/* Top Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-xs font-semibold text-primary">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span>LEMBAGA SERTIFIKASI PROFESI RESMI</span>
            </div>

            {/* Headline Teks */}
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground transition-colors duration-300 hover:text-orange-500 sm:text-4xl md:text-5xl lg:text-5xl leading-[1.15]">
              Tingkatkan Karir. <br />
              <span className="text-primary hover:text-orange-500">
                Terampil, Diakui,
              </span>{" "}
              <br />
              <span className="text-primary hover:text-orange-500">
                Tersertifikasi.
              </span>
            </h1>

            {/* Deskripsi */}
            <p className="mt-5 text-base text-muted-foreground sm:text-lg leading-relaxed">
              Program pelatihan dirancang untuk meningkatkan kompetensi peserta melalui pembelajaran berbasis teori dan praktik sesuai kebutuhan industri. Pilih program yang sesuai dengan minat dan karier Anda.
            </p>

            {/* Tombol Akses */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-primary text-primary-foreground hover:bg-orange-500 font-semibold shadow-md group"
              >
                Mulai Sertifikasi
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-primary/20 text-primary hover:bg-orange-300 font-semibold"
              >
                Lihat Skema Uji
              </Button>
            </div>
          </div>

          {/* 2. Gambar Tengah (Foto Profesional) */}
          <div className="relative flex items-center justify-center lg:col-span-4 min-h-[380px] sm:min-h-[460px]">
            {/* Lingkaran Dekoratif Soft Blue di Belakang Foto */}
            <div className="absolute top-1/2 left-1/2 -z-10 h-[280px] w-[280px] sm:h-[340px] sm:w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-2xl" />
          </div>

          {/* 3. Stat Cards Kanan */}
          <div className="flex flex-col gap-4 lg:col-span-3">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div
                  key={index}
                  className="group flex items-start gap-4 rounded-2xl bg-card p-5 border border-border/80 shadow-sm transition-all hover:bg-orange-50 hover:border-orange-500 hover:shadow-md dark:hover:bg-orange-950/20"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent text-primary transition-colors group-hover:bg-orange-500 group-hover:text-white">
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