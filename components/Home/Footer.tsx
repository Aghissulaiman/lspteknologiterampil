"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, ChevronRight } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Beranda", href: "#beranda" },
    { name: "Skema Sertifikasi", href: "#skema" },
    { name: "Jadwal Uji Kompetensi", href: "#jadwal" },
    { name: "Tempat Uji Kompetensi (TUK)", href: "#tuk" },
    { name: "Profil & Legalitas LSP", href: "#about" },
  ];

  const infoLinks = [
    { name: "Cek Status Sertifikat", href: "/Masuk?action=check-certificate" },
    { name: "Verifikasi Keaslian", href: "/Masuk?action=verify" },
    { name: "Prosedur Banding Asesmen", href: "/Masuk?action=appeal" },
    { name: "Kebijakan Privasi", href: "/Masuk?action=privacy" },
    { name: "Syarat & Ketentuan", href: "/Masuk?action=terms" },
  ];

  return (
    <footer className="w-full bg-card border-t border-border/80 transition-colors duration-200">
      
      {/* Upper Footer: Main Content Grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          
          {/* Col 1: Brand Info & BNSP Badge (5 Cols di LG) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="flex items-center gap-3">
              <Image
                src="/Logo/Logo2.png"
                alt="Logo LSP Teknologi Terampil"
                width={55}
                height={55}
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

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-md">
              LSP Teknologi Terampil adalah lembaga sertifikasi pihak ketiga yang berlisensi resmi oleh Badan Nasional Sertifikasi Profesi (BNSP) untuk mencetak tenaga kerja profesional berstandar industri.
            </p>

            {/* License Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-accent/60 border border-border text-xs text-foreground font-medium">
              <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
              <span>
                Lisensi BNSP No: <strong className="text-primary font-mono">BNSP-LSP-XXXX-ID</strong>
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links (3 Cols di LG) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Jelajahi
            </h4>
            <ul className="space-y-2.5 text-xs">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center text-muted-foreground hover:text-primary transition-colors"
                  >
                    <ChevronRight className="w-3 h-3 mr-1 text-muted-foreground/50 group-hover:text-primary transition-colors shrink-0" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Asesi Services (4 Cols di LG) */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Layanan Asesi
            </h4>
            <ul className="space-y-2.5 text-xs">
              {infoLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center text-muted-foreground hover:text-primary transition-colors"
                  >
                    <ChevronRight className="w-3 h-3 mr-1 text-muted-foreground/50 group-hover:text-primary transition-colors shrink-0" />
                    <span>{link.name}</span>
                  </Link>
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
            © {currentYear} <strong className="text-foreground">LSP Teknologi Terampil</strong>. Hak Cipta Dilindungi Undang-Undang.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 text-[11px]">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
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