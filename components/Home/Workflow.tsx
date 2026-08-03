"use client";

import React from "react";
import { UserPlus, FileCheck, Award, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

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
        "Jika dinyatakan 'Kompete'n, Anda akan menerima Sertifikat Profesi resmi bertanda tangan BNSP yang berlaku nasional.",
    },
  ];

  return (
    <section className="w-full bg-background py-20 transition-colors duration-200">
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

        {/* Steps Grid dengan Garis Alur */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((item, index) => {
            const IconComp = item.icon;
            return (
              <div
                key={index}
                className="group relative flex flex-col justify-between p-6 rounded-2xl bg-card border border-border/80 transition-all duration-300 hover:border-primary/60 hover:shadow-lg"
              >
                <div>
                  {/* Top Header: Badge Step & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-2xl font-black font-mono text-primary/30 group-hover:text-primary transition-colors">
                      {item.step}
                    </span>
                    <div className="p-3 rounded-xl bg-accent text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <IconComp className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-base font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Footer Indicator */}
                <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground font-medium">
                  <span>Tahap {index + 1} dari 4</span>
                  {index < steps.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-primary hidden lg:block opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Call To Action Bawah */}
        <div className="mt-12 text-center">
          <Button size="lg" className="bg-primary text-primary-foreground font-semibold shadow-md cursor-pointer">
            Mulai Pendaftaran Sekarang
          </Button>
        </div>

      </div>
    </section>
  );
}