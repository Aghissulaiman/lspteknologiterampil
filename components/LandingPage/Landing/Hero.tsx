"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
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
    <section 
      id="hero" 
      className="relative w-full overflow-hidden bg-background"
      style={{ 
        height: "calc(100vh - 64px)", // Kurangi tinggi navbar (64px)
        maxHeight: "calc(100vh - 64px)",
        minHeight: "calc(100vh - 64px)"
      }}
    >
      {/* BACKGROUND IMAGE */}
      <div className="absolute inset-0 h-full w-full">
        <Image
          src="/Hero/Foto1.png"
          alt="Hero Background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
          quality={100}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background/90 backdrop-blur-[1px]" />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 grid h-full w-full place-items-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-7xl">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
            
            {/* LEFT - Text Content */}
            <div className="lg:col-span-6">
              {/* Badge */}
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/80 px-4 py-1.5 text-xs font-semibold text-primary backdrop-blur-sm">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>LEMBAGA SERTIFIKASI PROFESI RESMI</span>
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
                Program pelatihan dirancang untuk meningkatkan kompetensi peserta 
                melalui pembelajaran berbasis teori dan praktik sesuai kebutuhan industri.
              </p>

              {/* Buttons */}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:gap-4">
                <Link href="/Masuk">
                  <Button 
                    size="lg" 
                    className="bg-primary text-primary-foreground hover:bg-orange-500 font-semibold shadow-md group"
                  >
                    Mulai Sertifikasi
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>

                <Link href="/pendaftaran">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="border-primary/20 text-primary hover:bg-orange-300 font-semibold"
                  >
                    Lihat Skema Uji
                  </Button>
                </Link>
              </div>
            </div>

            {/* MIDDLE - Image */}
            <div className="hidden lg:col-span-3 lg:flex lg:items-center lg:justify-center">
              <div className="relative h-[280px] w-[280px] xl:h-[320px] xl:w-[320px]">
                <div className="absolute inset-0 rounded-full bg-primary/10 blur-2xl" />
              </div>
            </div>

            {/* RIGHT - Stats Cards */}
            <div className="lg:col-span-3">
              <div className="flex flex-col gap-3">
                {stats.map((stat, index) => {
                  const IconComponent = stat.icon;
                  return (
                    <div
                      key={index}
                      className="group flex items-start gap-3 rounded-xl bg-card/80 p-4 border border-border/80 shadow-sm backdrop-blur-sm transition-all hover:bg-orange-50 hover:border-orange-500 hover:shadow-md dark:hover:bg-orange-950/20"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent text-primary transition-colors group-hover:bg-orange-500 group-hover:text-white">
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground leading-tight">
                          {stat.value}
                        </h3>
                        <p className="text-sm font-semibold text-foreground mt-0.5">
                          {stat.label}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                          {stat.description}
                        </p>
                      </div>
                    </div>
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