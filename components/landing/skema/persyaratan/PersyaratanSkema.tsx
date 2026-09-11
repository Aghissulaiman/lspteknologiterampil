"use client";

import React, { useState } from "react";
import {
  Cpu,
  Share2,
  Wrench,
  Wifi,
  Video,
  UserCheck,
  CheckCircle2,
  FileText,
  ArrowRight,
  Bot,
  Megaphone,
  Monitor,
  Check,
  Sparkles,
  Layers,
} from "lucide-react";

export default function PersyaratanSkema() {
  // Tabs untuk 3 Skema Sertifikasi
  const [activeTab, setActiveTab] = useState<"ai" | "marketing" | "teknisi">("ai");

  // Persyaratan Khusus per Skema
  const skemaDetail = {
    ai: {
      id: "ai",
      title: "Skema Artificial Intelligence (AI)",
      subtitle: "Kualifikasi Perangkat & Software untuk Uji Kompetensi Spesialis AI",
      icon: Bot,
      hardware: [
        "Laptop/PC dengan Prosesor Minimal Intel Core i5 Gen 10 / AMD Ryzen 5 4000 series.",
        "RAM Minimal 8 GB (Disarankan 16 GB untuk eksekusi model ML/DL lokal).",
        "Penyimpanan SSD tersisa minimal 20 GB.",
        "GPU Nvidia dedicated (Opsional, disarankan jika menggunakan CUDA/PyTorch lokal).",
      ],
      software: [
        "Python 3.9+ runtime & Jupyter Notebook / VS Code terinstal.",
        "Library dasar ML terinstal: NumPy, Pandas, Scikit-Learn, TensorFlow/PyTorch.",
        "Akses browser aktif ke Google Colab / Kaggle Notebook.",
        "Akun GitHub aktif untuk penyerahan repositori kode/portofolio.",
      ],
      praktek: [
        "Pengerjaan notebook analisis data & training model AI.",
        "Demonstrasi live coding dan penjelasan algoritma via screen sharing.",
        "Upload dokumentasi evaluasi akurasi model ke platform TUK.",
      ],
    },
    marketing: {
      id: "marketing",
      title: "Skema Digital Marketing",
      subtitle: "Kualifikasi Akun & Tools Digital untuk Uji Kompetensi Pemasaran Digital",
      icon: Megaphone,
      hardware: [
        "Laptop/PC dengan Prosesor Minimal Intel Core i3 / AMD Ryzen 3.",
        "RAM Minimal 8 GB (Disarankan agar lancar membuka banyak tab browser & dashboard analitik).",
        "Koneksi Internet sangat stabil minimal 15 Mbps (Upload/Download).",
        "Monitor kedua (Opsional, untuk mempermudah monitoring iklan & presentasi).",
      ],
      software: [
        "Akses ke Facebook Ads Manager & Google Ads account (bisa mode demo/praktik).",
        "Google Analytics 4 (GA4) & Google Looker Studio aktif.",
        "Software/tools desain grafis & copy (Canva / Figma / Adobe Photoshop).",
        "Akses ke tools SEO dasar (Ahrefs/SEMrush/Google Search Console demo).",
      ],
      praktek: [
        "Simulasi riset audiens & penyusunan strategi campaign iklan.",
        "Pembuatan materi konten promosi dan halaman penawaran (landing page).",
        "Presentasi audit analitik digital & strategi ROI via live zoom.",
      ],
    },
    teknisi: {
      id: "teknisi",
      title: "Skema Teknisi Komputer & Jaringan",
      subtitle: "Kualifikasi Perangkat Uji & Lingkungan Simulator Teknisi Komputer",
      icon: Wrench,
      hardware: [
        "Laptop/PC Utama dengan Spesifikasi Minimal Intel i5 / Ryzen 5, RAM 8 GB.",
        "Webcam Eksternal Fleksibel (Bisa digerakkan 360 derajat untuk memperlihatkan meja kerja/perangkat).",
        "Kamera HP Sekunder (Aktif via Zoom sebagai sudut pandang samping/samping meja).",
        "Kabel LAN Tester, Crimping Tool, dan Kabel UTP Cat5e/Cat6 (Siap untuk demonstrasi fisik).",
      ],
      software: [
        "Software Virtualisasi terinstal: Cisco Packet Tracer versi terbaru.",
        "Oracle VirtualBox / VMware Workstation dengan ISO Windows Server/Linux.",
        "Aplikasi analisis jaringan: Wireshark & PuTTY / WinSCP.",
        "Akses Terminal / Command Prompt dengan hak akses Administrator penuh.",
      ],
      praktek: [
        "Demonstrasi perakitan/troubleshooting komponen & perkabelan jaringan via live kamera.",
        "Simulasi konfigurasi IP Address, Routing, dan Server di Packet Tracer / VM.",
        "Pengujian koneksi dan pembuatan laporan analisis troubleshoot.",
      ],
    },
  };

  // Persyaratan Umum (Wajib untuk semua skema)
  const syaratUmum = [
    {
      kategori: "Koneksi & Jaringan Ujian",
      icon: Wifi,
      items: [
        "Koneksi internet utama minimal 10-15 Mbps stabil.",
        "Wajib menyiapkan kuota internet cadangan (tethering HP) jika terjadi mati listrik.",
        "Ping jaringan stabil di bawah 50ms ke server TUK Online.",
      ],
    },
    {
      kategori: "Media Pengawasan (Proctoring)",
      icon: Video,
      items: [
        "Webcam HD jernih dan Microphone tanpa noise mengganggu.",
        "Google Chrome / Firefox versi paling baru.",
        "Aplikasi Zoom Meeting terinstal dan siap lakukan Screen Sharing.",
      ],
    },
    {
      kategori: "Lingkungan Ruangan Ujian",
      icon: UserCheck,
      items: [
        "Ruangan privat, terang, tertutup, dan tenang.",
        "Steril dari orang lain di dalam ruangan selama jam ujian.",
        "Meja kerja bersih dari catatan/buku yang tidak diizinkan.",
      ],
    },
  ];

  const currentSkema = skemaDetail[activeTab];

  return (
    <section className="py-12 lg:py-20 bg-background text-foreground relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* Header Baru (Lebih Segar & Variatif)
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-primary bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
            <Sparkles className="h-4 w-4" />
            <span>Kesiapan Perangkat Asesi</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight sm:text-5xl lg:text-6xl text-foreground">
            Standar Spesifikasi & Kebutuhan Uji
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Setiap keahlian memiliki kebutuhan teknis yang berbeda. Pastikan sistem, peralatan, dan lingkungan kerja Anda memenuhi kualifikasi skema yang dipilih sebelum memulai asesmen daring.
          </p>
        </div> */}

        {/* Tab Selector Skema */}
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setActiveTab("ai")}
              className={`flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-bold text-xs sm:text-sm transition-all duration-200 ${
                activeTab === "ai"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
              }`}
            >
              <Bot className="h-4 w-4" />
              <span>1. Artificial Intelligence (AI)</span>
            </button>

            <button
              onClick={() => setActiveTab("marketing")}
              className={`flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-bold text-xs sm:text-sm transition-all duration-200 ${
                activeTab === "marketing"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
              }`}
            >
              <Megaphone className="h-4 w-4" />
              <span>2. Digital Marketing</span>
            </button>

            <button
              onClick={() => setActiveTab("teknisi")}
              className={`flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-bold text-xs sm:text-sm transition-all duration-200 ${
                activeTab === "teknisi"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
              }`}
            >
              <Wrench className="h-4 w-4" />
              <span>3. Teknisi Komputer & Jaringan</span>
            </button>
          </div>

          {/* Card Detail Skema Terpilih */}
          <div className="bg-muted/20 border border-muted/30 p-6 sm:p-10 rounded-3xl space-y-8">
            <div className="flex items-start gap-4 pb-6 border-b border-muted/30">
              <div className="p-3.5 rounded-2xl bg-primary/10 text-primary shrink-0">
                <currentSkema.icon className="h-8 w-8" />
              </div>
              <div>
                <span className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5" />
                  Kualifikasi Spesifik Skema
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-foreground mt-1">
                  {currentSkema.title}
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  {currentSkema.subtitle}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Syarat Hardware */}
              <div className="bg-background p-6 rounded-2xl border border-muted/20 space-y-3">
                <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-primary" />
                  <span>Kebutuhan Perangkat / Hardware</span>
                </h3>
                <ul className="space-y-2.5 pt-2">
                  {currentSkema.hardware.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-muted-foreground leading-relaxed">
                      <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Syarat Software */}
              <div className="bg-background p-6 rounded-2xl border border-muted/20 space-y-3">
                <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <Monitor className="h-4 w-4 text-primary" />
                  <span>Aplikasi & Tools Wajib</span>
                </h3>
                <ul className="space-y-2.5 pt-2">
                  {currentSkema.software.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-muted-foreground leading-relaxed">
                      <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Metode Uji Praktek */}
              <div className="bg-background p-6 rounded-2xl border border-muted/20 space-y-3">
                <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <Share2 className="h-4 w-4 text-primary" />
                  <span>Pelaksanaan Praktek Online</span>
                </h3>
                <ul className="space-y-2.5 pt-2">
                  {currentSkema.praktek.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-muted-foreground leading-relaxed">
                      <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Persyaratan Standar Umum Semua Skema */}
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-2xl font-extrabold mb-2">Persyaratan Umum Ujian Online</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Ketentuan umum jaringan, pengawasan, dan ruangan yang berlaku wajib untuk ketiga skema di atas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {syaratUmum.map((req, idx) => {
              const Icon = req.icon;
              return (
                <div key={idx} className="bg-muted/20 p-6 rounded-3xl space-y-3">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-bold text-sm sm:text-base text-foreground">
                      {req.kategori}
                    </h3>
                  </div>

                  <ul className="space-y-2">
                    {req.items.map((item, iIdx) => (
                      <li key={iIdx} className="flex items-start gap-2.5 text-xs text-muted-foreground leading-relaxed">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* Banner Unduh Lampiran Skema */}
        <div className="mx-auto max-w-4xl bg-muted/30 p-6 sm:p-8 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-left">
            <div className="p-3.5 rounded-2xl bg-background shadow-sm text-primary shrink-0">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <p className="text-base font-bold text-foreground">
                Dokumen Kurikulum & Lampiran Skema Uji
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Unduh rincian Unit Kompetensi (SKKNI) untuk skema AI, Digital Marketing, dan Teknisi Komputer.
              </p>
            </div>
          </div>

          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-6 py-3.5 text-xs font-bold hover:bg-foreground/90 transition-all shrink-0"
          >
            <span>Unduh Berkas Skema (PDF)</span>
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

      </div>
    </section>
  );
}