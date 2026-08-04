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

// Inline SVG untuk logo sosial media
// const FacebookIcon = ({ className }: { className?: string }) => (
//   <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
//     <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
//   </svg>
// );

// const LinkedinIcon = ({ className }: { className?: string }) => (
//   <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
//     <path fillRule="evenodd" d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" clipRule="evenodd" />
//   </svg>
// );

// const YoutubeIcon = ({ className }: { className?: string }) => (
//   <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
//     <path fillRule="evenodd" d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" clipRule="evenodd" />
//   </svg>
// );

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

//   const socialLinks = [
//     { icon: FacebookIcon, href: "#", label: "Facebook" },
//     { icon: LinkedinIcon, href: "#", label: "LinkedIn" },
//     { icon: YoutubeIcon, href: "#", label: "YouTube" },
//   ];

  return (
    <footer className="w-full bg-card border-t border-border/80 transition-colors duration-200">
      
      {/* Upper Footer: Main Content Grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          
          {/* Col 1: Brand Info & BNSP Badge */}
          <div className="lg:col-span-4 space-y-5">
            <div className="flex items-center gap-3">
              <Image
                src="/Logo/Logo.png"
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

            {/* Social Media Links (Facebook, LinkedIn, YouTube) */}
            {/* <div className="pt-2 flex items-center gap-2">
              {socialLinks.map((social, idx) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={idx}
                    href={social.href}
                    aria-label={social.label}
                    className="p-2.5 rounded-lg border border-border bg-background text-muted-foreground hover:text-primary hover:border-primary/50 transition-all cursor-pointer"
                  >
                    <IconComponent className="w-4 h-4" />
                  </a>
                );
              })}
            </div> */}
          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Jelajahi
            </h4>
            <ul className="space-y-2.5 text-xs">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="group inline-flex items-center text-muted-foreground hover:text-primary transition-colors"
                  >
                    <ChevronRight className="w-3 h-3 mr-1 text-primary/40 group-hover:text-primary transition-colors" />
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
                    className="group inline-flex items-center text-muted-foreground hover:text-primary transition-colors"
                  >
                    <ChevronRight className="w-3 h-3 mr-1 text-primary/40 group-hover:text-primary transition-colors" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact Info (No. HP & Email Tetap Ada) */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Hubungi Sekretariat
            </h4>
            <div className="space-y-3 text-xs text-muted-foreground">
              
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>
                  Jl. Radar Baru Ujung No.50, Pasir Gn. Sel., Kec. Cimanggis, Jawa Barat (16451) 
                </span>
              </div>

              {/* Telepon / No. HP */}
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <a href="tel:+6281299998174" className="hover:text-primary transition-colors">
                  +62 812-9999-8174 
                </a>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <a href="mailto:lspteknologiterampilmayantara@gmail.com" className="hover:text-primary transition-colors">
                   lspteknologiterampilmayantara@gmail.com
                </a>
              </div>

              <div className="flex items-start gap-3 pt-1">
                <Clock className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>
                  Senin - Jumat: 08:00 - 17:00 WIB<br />
                  Sabtu - Minggu: Tutup
                </span>
              </div>

            </div>
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