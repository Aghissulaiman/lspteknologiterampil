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
    <footer className="w-full bg-card border-t border-border/80">
      
      {/* Upper Footer */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 lg:gap-8">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Image
                src="/Logo/Logo2.png"
                alt="Logo LSP Teknologi Terampil"
                width={45}
                height={45}
                className="object-contain w-11 h-11 sm:w-12 sm:h-12"
              />
              <div>
                <span className="text-sm sm:text-base font-bold text-foreground">
                  LSP <span className="text-primary">Teknologi Terampil</span>
                </span>
                <p className="text-[8px] sm:text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Lembaga Sertifikasi Profesi
                </p>
              </div>
            </div>

            <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
              LSP Teknologi Terampil adalah lembaga sertifikasi pihak ketiga yang berlisensi resmi oleh Badan Nasional Sertifikasi Profesi (BNSP).
            </p>

            {/* License Badge */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-accent/60 border border-border">
              <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0" />
              <span className="text-[9px] sm:text-[10px] font-medium text-foreground">
                Lisensi BNSP: <span className="text-primary font-mono">BNSP-LSP-XXXX-ID</span>
              </span>
            </div>
          </div>

          {/* Col 2 & 3: Quick Links dan Layanan Asesi (2 kolom) */}
          <div className="md:col-span-2">
            <div className="grid grid-cols-2 gap-8 md:gap-10 lg:gap-8">
              
              {/* Quick Links */}
              <div className="space-y-2">
                <h4 className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-foreground">
                  Jelajahi
                </h4>
                <ul className="space-y-1.5">
                  {quickLinks.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="group inline-flex items-center text-muted-foreground hover:text-orange-500 transition-colors text-[11px] sm:text-xs"
                      >
                        <ChevronRight className="w-2.5 h-2.5 mr-1 text-muted-foreground/50 group-hover:text-orange-500 transition-colors shrink-0" />
                        <span>{link.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Layanan Asesi */}
              <div className="space-y-2">
                <h4 className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-foreground">
                  Layanan Asesi
                </h4>
                <ul className="space-y-1.5">
                  {infoLinks.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="group inline-flex items-center text-muted-foreground hover:text-orange-500 transition-colors text-[11px] sm:text-xs"
                      >
                        <ChevronRight className="w-2.5 h-2.5 mr-1 text-muted-foreground/50 group-hover:text-orange-500 transition-colors shrink-0" />
                        <span>{link.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Lower Footer */}
      <div className="border-t border-border/60 bg-background/50 py-3 sm:py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] sm:text-[11px] text-muted-foreground">
          
          <p className="text-center sm:text-left">
            © {currentYear} <span className="text-foreground font-medium">LSP Teknologi Terampil</span>. Hak Cipta Dilindungi.
          </p>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Sistem Online Aktif</span>
            </span>
            <span className="text-border/50">|</span>
            <span>Terakreditasi BNSP</span>
          </div>

        </div>
      </div>

    </footer>
  );
}