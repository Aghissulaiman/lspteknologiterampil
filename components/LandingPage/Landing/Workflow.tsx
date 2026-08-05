"use client";

import React from "react";
import { UserPlus, FileCheck, Award, ArrowRight, ShieldCheck } from "lucide-react";

export default function Workflow() {
  const steps = [
    {
      step: "01",
      icon: UserPlus,
      title: "Pendaftaran & Akun Asesi",
      description:
        "Isi formulir pendaftaran secara online, buat akun asesi, dan pilih skema sertifikasi yang sesuai dengan kompetensi Anda.",
    },
    {
      step: "02",
      icon: FileCheck,
      title: "Pra-Asesmen & Asesmen Mandiri",
      description:
        "Unggah berkas persyaratan (APL-01 & APL-02) beserta bukti portofolio pendukung untuk diverifikasi oleh tim verifikator.",
    },
    {
      step: "03",
      icon: ShieldCheck,
      title: "Pelaksanaan Uji Kompetensi",
      description:
        "Ikuti proses ujian praktek & wawancara di Tempat Uji Kompetensi (TUK) bersama Asesor bersertifikasi resmi BNSP.",
    },
    {
      step: "04",
      icon: Award,
      title: "Penerbitan Sertifikat BNSP",
      description:
        "Jika dinyatakan 'Kompeten', Anda akan menerima Sertifikat Profesi resmi bertanda tangan BNSP yang berlaku nasional.",
    },
  ];

  return (
    <section id="workflow" className="w-full bg-background py-20 transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Seksi */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold tracking-wider uppercase text-primary mb-2 block">
            Langkah Mudah
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl mb-4">
            Alur Sertifikasi Uji Kompetensi
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Proses transparan dan terstruktur dari awal pendaftaran hingga sertifikat diterbitkan.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((item, index) => {
            const IconComp = item.icon;
            return (
              <div
                key={index}
                className="
                  group
                  relative
                  overflow-hidden
                  flex
                  flex-col
                  justify-between
                  p-6
                  rounded-2xl
                  bg-card
                  border
                  border-border/80
                  cursor-pointer
                  shadow-none

                  /* Transisi Mantul (Spring Effect) */
                  transition-all
                  duration-500
                  ease-[cubic-bezier(0.34,1.56,0.64,1)]
                  hover:-translate-y-3
                  hover:scale-[1.02]
                  hover:border-orange-500
                  hover:shadow-xl
                  hover:shadow-orange-500/10

                  /* Slide-up Background: Bawah Oranye, Atas Dominan Putih */
                  before:absolute
                  before:inset-0
                  before:bg-gradient-to-t
                  before:from-orange-500/80
                  before:via-orange-200/50
                  before:to-white
                  before:translate-y-full
                  hover:before:translate-y-0
                  before:transition-transform
                  before:duration-600
                  before:ease-[cubic-bezier(0.34,1.56,0.64,1)]
                "
              >
                {/* Konten Utama */}
                <div className="relative z-10">
                  {/* Top Header */}
                  <div className="flex items-center justify-between mb-6">
                    {/* Angka / Nomor Step */}
                    <span 
                      className="
                        text-2xl 
                        font-black 
                        font-mono 
                        text-primary/40 
                        transition-all 
                        duration-500 
                        ease-[cubic-bezier(0.34,1.56,0.64,1)]
                        group-hover:opacity-0 
                        group-hover:-translate-y-8
                        pointer-events-none
                      "
                    >
                      {item.step}
                    </span>

                    {/* Icon Container */}
                    <div 
                      className="
                        p-3 
                        rounded-xl 
                        bg-accent 
                        text-primary 
                        transition-all 
                        duration-500 
                        ease-[cubic-bezier(0.34,1.56,0.64,1)]
                        group-hover:bg-orange-500 
                        group-hover:text-white
                        group-hover:scale-110
                        group-hover:rotate-6
                        group-hover:shadow-[0_4px_14px_rgba(249,115,22,0.4)]
                      "
                    >
                      <IconComp className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-translate-y-1">
                    <h3 
                      className="
                        text-base 
                        font-bold 
                        text-foreground 
                        mb-2 
                        transition-colors 
                        duration-300 
                        group-hover:text-slate-900
                      "
                    >
                      {item.title}
                    </h3>

                    <p 
                      className="
                        text-xs 
                        text-muted-foreground 
                        leading-relaxed 
                        transition-colors 
                        duration-300 
                        group-hover:text-slate-700
                      "
                    >
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Footer Indicator */}
                <div 
                  className="
                    relative 
                    z-10
                    mt-6 
                    pt-4 
                    border-t 
                    border-border/40 
                    flex 
                    items-center 
                    justify-between 
                    text-xs 
                    text-muted-foreground 
                    font-medium 
                    transition-all 
                    duration-500 
                    ease-[cubic-bezier(0.34,1.56,0.64,1)]
                    group-hover:border-orange-900/20 
                    group-hover:text-slate-900
                  "
                >
                  <span>Tahap {index + 1} dari 4</span>

                  {index < steps.length - 1 && (
                    <ArrowRight 
                      className="
                        w-4 
                        h-4 
                        text-orange-500 
                        hidden 
                        lg:block 
                        opacity-40 
                        transition-all 
                        duration-500 
                        ease-[cubic-bezier(0.34,1.56,0.64,1)]
                        group-hover:text-orange-900 
                        group-hover:opacity-100 
                        group-hover:translate-x-2.5
                        group-hover:scale-110
                      " 
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}