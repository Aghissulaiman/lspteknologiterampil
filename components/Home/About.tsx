"use client";

import React from "react";
import Image from "next/image";
import { Award, CheckCircle2, ShieldCheck, Users, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function About() {
  const stats = [
    { label: "Asesi Tersertifikasi", value: "10,000+", icon: Users },
    { label: "Asesor Kompeten", value: "150+", icon: Award },
    { label: "Skema Sertifikasi", value: "15+", icon: ShieldCheck },
  ];

  const highlights = [
    "Lisensi Resmi dari Badan Nasional Sertifikasi Profesi (BNSP)",
    "Asesor Teruji dan Terverifikasi dari Praktisi Industri",
    "Fasilitas Tempat Uji Kompetensi (TUK) Berstandar Nasional",
    "Materi Uji Selalu Diperbarui Sesuai Tren AI & Digital Marketing",
  ];

  return (
    <section className="w-full bg-background py-20 transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Visual Side (Kiri) - Card Statistik & Decorative Image Placeholder */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Card Graphic / Visual Container */}
              <div className="rounded-3xl bg-muted/60 border border-border/80 p-8 sm:p-10 relative overflow-hidden shadow-lg">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-40 h-40 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
                
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-2xl bg-primary text-primary-foreground">
                    <Target className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-foreground">Visi Utama</h4>
                    
                  </div>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed italic mb-8">
                  &ldquo;Menjadi lembaga pelatihan dan pengembangan kompetensi teknologi yang profesional, terpercaya, dan inovatif dalam mencetak sumber daya manusia yang kompeten, berdaya saing, serta siap menghadapi kebutuhan industri di era digital.&rdquo;
                </p>

                {/* Mini Stats Grid Inside Graphic */}
                <div className="grid grid-cols-3 gap-3 pt-6 border-t border-border/60">
                  {stats.map((stat, idx) => {
                    const IconComp = stat.icon;
                    return (
                      <div key={idx} className="text-center">
                        <IconComp className="w-4 h-4 text-primary mx-auto mb-1" />
                        <span className="block text-lg font-extrabold text-foreground leading-none">
                          {stat.value}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-medium mt-1 block">
                          {stat.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Decorative Floating Badge */}
              <div className="absolute -bottom-5 -right-3 sm:right-4 bg-background border border-border rounded-2xl p-4 shadow-xl flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-foreground">Terlisensi BNSP RI</span>
              </div>

            </div>
          </div>

          {/* Text Content Side (Kanan) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold w-fit mb-4">
              <ShieldCheck className="w-3.5 h-3.5" /> Tentang LSP Teknologi Terampil
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl mb-6 leading-tight">
              Membangun Standar Kompetensi SDM Digital Indonesia
            </h2>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">
              LSP Teknologi Terampil adalah lembaga sertifikasi independen yang bertugas melaksanakan uji kompetensi profesional. Kami hadir untuk menjembatani kebutuhan dunia industri dengan melatih serta memvalidasi keahlian praktis di bidang pengembangan Web terintegrasi AI dan strategi Digital Marketing.
            </p>

            {/* List Poin Keunggulan */}
            <div className="space-y-3 mb-8">
              {highlights.map((point, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-foreground font-medium">
                    {point}
                  </span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <Button size="lg" className="bg-primary text-primary-foreground font-semibold shadow-md cursor-pointer">
                Profil Lengkap LSP
              </Button>
              <Button variant="outline" size="lg" className="border-border/80 font-semibold cursor-pointer">
                Struktur Organisasi
              </Button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}