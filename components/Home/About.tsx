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
    <section id="about" className="w-full bg-background py-12 sm:py-16 md:py-20 transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 lg:gap-8 items-center">
          
          {/* Visual Side (Kiri) */}
          <div className="lg:col-span-5 relative order-2 lg:order-1">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Card */}
              <div className="rounded-2xl sm:rounded-3xl bg-muted/60 border border-border/80 p-6 sm:p-8 md:p-10 relative overflow-hidden shadow-lg">
                {/* Decorative blur */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
                
                {/* Visi Header */}
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-primary text-primary-foreground">
                    <Target className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-foreground">Visi Utama</h4>
                  </div>
                </div>

                {/* Visi Text */}
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed italic mb-6 sm:mb-8">
                  &ldquo;Menjadi lembaga pelatihan dan pengembangan kompetensi teknologi yang profesional, terpercaya, dan inovatif dalam mencetak sumber daya manusia yang kompeten, berdaya saing, serta siap menghadapi kebutuhan industri di era digital.&rdquo;
                </p>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-4 sm:pt-6 border-t border-border/60">
                  {stats.map((stat, idx) => {
                    const IconComp = stat.icon;
                    return (
                      <div key={idx} className="text-center">
                        <IconComp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary mx-auto mb-1" />
                        <span className="block text-base sm:text-lg md:text-xl font-extrabold text-foreground leading-none">
                          {stat.value}
                        </span>
                        <span className="text-[8px] sm:text-[10px] text-muted-foreground font-medium mt-1 block leading-tight">
                          {stat.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-4 -right-2 sm:-bottom-5 sm:right-4 bg-background border border-border rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-xl flex items-center gap-2 sm:gap-3">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-orange-300 animate-pulse" />
                <span className="text-[10px] sm:text-xs font-bold text-foreground">Terlisensi BNSP RI</span>
              </div>

            </div>
          </div>

          {/* Text Content Side (Kanan) */}
          <div className="lg:col-span-7 flex flex-col justify-center order-1 lg:order-2">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] sm:text-xs font-semibold w-fit mb-3 sm:mb-4">
              <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> 
              Tentang LSP Teknologi Terampil
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-4 sm:mb-6 leading-tight">
              Membangun Standar Kompetensi SDM Digital Indonesia
            </h2>

            {/* Description */}
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4 sm:mb-6">
              LSP Teknologi Terampil adalah lembaga sertifikasi independen yang bertugas melaksanakan uji kompetensi profesional. Kami hadir untuk menjembatani kebutuhan dunia industri dengan melatih serta memvalidasi keahlian praktis di bidang pengembangan Web terintegrasi AI dan strategi Digital Marketing.
            </p>

            {/* Highlights List */}
            <div className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8">
              {highlights.map((point, index) => (
                <div key={index} className="flex items-start gap-2.5 sm:gap-3">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-foreground font-medium leading-relaxed">
                    {point}
                  </span>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3 sm:gap-4">
              <Button 
                size="default" 
                className="w-full sm:w-auto bg-primary hover:bg-orange-500 text-primary-foreground font-semibold shadow-md cursor-pointer px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base"
              >
                Profil Lengkap LSP
              </Button>
              <Button 
                variant="outline" 
                size="default" 
                className="w-full sm:w-auto border-border/80 font-semibold hover:bg-orange-300 cursor-pointer px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base"
              >
                Struktur Organisasi
              </Button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}