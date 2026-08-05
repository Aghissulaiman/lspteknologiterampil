"use client";

import React from "react";
import {
  Monitor,
  Laptop,
  Video,
  Lock,
  ShieldCheck,
  Server,
  Cloud,
  KeyRound,
  FileText,
  ArrowRight,
  CheckCircle2,
  FileCode,
  Globe,
} from "lucide-react";

export default function TukDaftar() {
  const sistemOnline = [
    {
      title: "Ujian Online 100% Jarak Jauh",
      desc: "Seluruh rangkaian asesmen kompetensi dikerjakan langsung dari rumah atau lokasi masing-masing tanpa harus datang ke gedung atau ruangan fisik.",
      icon: Globe,
    },
    {
      title: "CBT Ujian Berbasis Web",
      desc: "Sistem Computer Based Test online untuk menjawab soal pilihan ganda, essay, studi kasus, dan pengisian lembar kerja langsung di browser.",
      icon: Laptop,
    },
    {
      title: "Pengawasan Live Streaming",
      desc: "Kamera, audio, dan layar peserta dipantau secara langsung oleh asesor lewat aplikasi telekonferensi online untuk memastikan tidak ada kecurangan.",
      icon: Video,
    },
    {
      title: "Sistem Keamanan Soal",
      desc: "Materi uji dan lembar soal terenkripsi ketat secara online, dan baru bisa dibuka peserta menggunakan token rahasia dari asesor.",
      icon: Lock,
    },
    {
      title: "Verifikasi Identitas Online",
      desc: "Pengecekan wajah, kartu identitas, dan kondisi ruangan peserta dilakukan secara virtual via kamera sebelum ujian resmi dimulai.",
      icon: ShieldCheck,
    },
    {
      title: "Server Cloud Berkecepatan Tinggi",
      desc: "Infrastruktur cloud online dengan kestabilan penuh untuk menampung ribuan peserta ujian secara bersamaan tanpa takut server down.",
      icon: Server,
    },
    {
      title: "Simpan Otomatis (Auto-Save)",
      desc: "Setiap klik dan jawaban yang diketik peserta langsung tersimpan otomatis ke database online setiap detik untuk menghindari data hilang.",
      icon: Cloud,
    },
    {
      title: "Token Akses Dinamis",
      desc: "Kata kunci masuk ujian online yang hanya dibagikan langsung oleh asesor saat jadwal ujian dimulai agar keamanan soal terjaga.",
      icon: KeyRound,
    },
    {
      title: "Rekap Nilai Otomatis",
      desc: "Hasil tes teori dan jawaban peserta langsung dihitung dan direkap secara instan oleh sistem sesaat setelah ujian online disubmit.",
      icon: FileCode,
    },
  ];

  const detailOnline = [
    {
      label: "Metode Pelaksanaan",
      isi: "Full Online / Daring tanpa tatap muka fisik.",
    },
    {
      label: "Media Pengawasan",
      isi: "Kamera web aktif, screen sharing, dan rekaman sesi online.",
    },
    {
      label: "Akses Masuk Ujian",
      isi: "Menggunakan token unik dan akun login khusus asesi.",
    },
    {
      label: "Penyimpanan Data",
      isi: "Tersimpan real-time di cloud server terpusat.",
    },
  ];

  return (
    <section className="py-12 lg:py-20 bg-background text-foreground relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* Header Utama TUK Online */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-3xl font-black tracking-tight sm:text-5xl mb-4">
            Tempat Uji Kompetensi Online
          </h1>
          <p className="text-sm sm:text-lg text-muted-foreground leading-relaxed">
            Pusat layanan Uji Kompetensi yang murni diselenggarakan secara online jarak jauh menggunakan sistem digital terintegrasi penuh.
          </p>
        </div>

        {/* Ringkasan Informasi Online */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-muted/20 p-6 rounded-3xl">
          {detailOnline.map((item, idx) => (
            <div key={idx} className="bg-background/60 p-4 rounded-2xl border border-muted/30">
              <span className="text-[11px] font-bold text-primary uppercase tracking-wider block mb-1">
                {item.label}
              </span>
              <p className="text-xs sm:text-sm font-semibold text-foreground">
                {item.isi}
              </p>
            </div>
          ))}
        </div>

        {/* Grid Informasi Fitur TUK Online (Banyak & Padat Seputar Online) */}
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-2xl font-extrabold mb-2">Arsitektur Sistem & Fitur TUK Online</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Daftar lengkap fasilitas murni berbasis online untuk kelancaran ujian daring.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sistemOnline.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="bg-muted/20 p-6 rounded-3xl flex flex-col justify-between space-y-4 hover:bg-muted/30 transition-all duration-300">
                  <div>
                    <div className="p-3 rounded-2xl bg-primary/10 text-primary w-fit mb-4">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-base font-bold text-foreground mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                  <div className="pt-2 flex items-center gap-1.5 text-[11px] font-bold text-primary">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Sistem 100% Online</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Banner Panduan / SOP TUK Online */}
        <div className="mx-auto max-w-4xl bg-muted/30 p-6 sm:p-8 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-left">
            <div className="p-3.5 rounded-2xl bg-background shadow-sm text-primary shrink-0">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <p className="text-base font-bold text-foreground">
                Panduan Teknis Sistem TUK Online
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Unduh file petunjuk lengkap cara kerja platform asesmen online dari awal sampai selesai.
              </p>
            </div>
          </div>

          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-6 py-3.5 text-xs font-bold hover:bg-foreground/90 transition-all shrink-0"
          >
            <span>Unduh Panduan Online (PDF)</span>
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

      </div>
    </section>
  );
}