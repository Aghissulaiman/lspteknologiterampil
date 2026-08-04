"use client";

import React from "react";
import Image from "next/image";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";


export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Beranda", href: "#" },
    { name: "Skema Sertifikasi", href: "#" },
    { name: "Jadwal Uji Kompetensi", href: "#" },
    { name: "Tempat Uji Kompetensi (TUK)", href: "#" },
    { name: "Profil & Legalitas LSP", href: "#" },
  ];

  const infoLinks = [
    { name: "Cek Status Sertifikat", href: "#" },
    { name: "Verifikasi Keaslian", href: "#" },
    { name: "Prosedur Banding Asesmen", href: "#" },
    { name: "Kebijakan Privasi", href: "#" },
    { name: "Syarat & Ketentuan", href: "#" },
  ];

  return (
    <footer className="w-full bg-card border-t border-border/80 transition-colors duration-200">
      
      {/* Upper Footer: Main Content Grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          
          {/* Col 1: Brand Info & BNSP Badge */}
          <div className="lg:col-span-4 space-y-5">
            <div className="flex items-center gap-3">
              <Image
                src="/Logo/Logo2.png"
                alt="Logo LSP Teknologi Terampil"
                width={60}
                height={60}
                className="object-contain"
              />
              <div className="flex flex-col">
                <span className="text-base font-bold leading-tight text-foreground">
                  LSP <span className="text-primary">Teknologi Terampil</span>
                </span>
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mt-0.5">
                  Lembaga Sertifikasi Profesi
                </span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              LSP Teknologi Terampil adalah lembaga sertifikasi pihak ketiga yang berlisensi resmi oleh Badan Nasional Sertifikasi Profesi (BNSP) untuk mencetak tenaga kerja profesional berstandar industri.
            </p>

            {/* License Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-accent/60 border border-border text-xs text-foreground font-medium">
              <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
              <span>Lisensi BNSP No: <strong className="text-primary font-mono">BNSP-LSP-XXXX-ID</strong></span>
            </div>


          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:col-span-2 space-y-4 ">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Jelajahi
            </h4>
            <ul className="space-y-2.5 text-xs hover:text-orange-500">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="group inline-flex items-center text-muted-foreground hover:text-orange-500 transition-colors"
                  >
                    <ChevronRight className="w-3 h-3 mr-1 text-orange/40 hover:text-orange-500 transition-colors" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Asesi Services */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Layanan Asesi
            </h4>
            <ul className="space-y-2.5 text-xs">
              {infoLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="group inline-flex items-center text-muted-foreground hover:text-orange-500 transition-colors"
                  >
                    <ChevronRight className="w-3 h-3 mr-1 text-orange/40 group-hover:text-orange-500 transition-colors" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>


        </div>
      </div>

      {/* Lower Footer */}
      <div className="border-t border-border/60 bg-background/50 py-6 transition-colors duration-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          
          <p className="text-center sm:text-left">
            © {currentYear} <strong>LSP Teknologi Terampil</strong>. Hak Cipta Dilindungi Undang-Undang.
          </p>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse"></span>
              Sistem Pendaftaran Online Aktif
            </span>
            <span className="text-border">|</span>
            <span>Terakreditasi BNSP</span>
          </div>

        </div>
      </div>

    </footer>
  );
}