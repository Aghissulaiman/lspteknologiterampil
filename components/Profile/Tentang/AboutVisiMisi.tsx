import React from "react";
import Image from "next/image";
import { CheckCircle2, Target, Compass, Sparkles } from "lucide-react";

export default function AboutVisiMisi() {
  const misiPoints = [
    {
      title: "Penyelenggaraan Asesmen Independen & Transparan",
      desc: "Melaksanakan uji kompetensi yang akuntabel, objektif, serta bebas dari konflik kepentingan dengan mengacu secara konsisten pada Standar Kompetensi Kerja Nasional Indonesia (SKKNI).",
    },
    {
      title: "Pengembangan Skema Berbasis Tuntutan Industri Digital",
      desc: "Merumuskan dan memperbarui skema sertifikasi secara berkala mengikuti dinamika perkembangan teknologi global, AI, rekayasa perangkat lunak, dan infrastruktur IT.",
    },
    {
      title: "Penjaminan Mutu Asesor & Tempat Uji Kompetensi (TUK)",
      desc: "Meningkatkan kapabilitas dan integritas para asesor kompetensi terlisensi BNSP serta memastikan sarana dan prasarana TUK memenuhi standar operasional baku.",
    },
    {
      title: "Sinergi Strategis Ekosistem Vokasi & Industri",
      desc: "Membangun kemitraan berkelanjutan dengan SMK, perguruan tinggi, asosiasi profesi, dan dunia usaha untuk mempercepat penyerapan tenaga kerja tersertifikasi.",
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-background border-b border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
            <Sparkles className="h-4 w-4" />
            <span>Arah & Komitmen Strategis</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Visi & Misi Operasional
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Pilar utama dan komitmen berkelanjutan LSP Teknologi Terampil dalam mencetak sumber daya manusia unggul yang diakui secara nasional.
          </p>
        </div>

        {/* 1. SECTION VISI (Dengan Layout Gambar & Teks Berbobot) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-20">
          
          {/* Gambar Visi */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative mx-auto max-w-md lg:max-w-none rounded-3xl overflow-hidden border border-border bg-card shadow-xl group">
              <div className="relative h-[320px] sm:h-[400px] w-full">
                <Image
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
                  alt="Suasana Pengujian Sertifikasi Profesi"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </div>
              
              {/* Badge Overlay */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-background/90 backdrop-blur-md border border-border/80 shadow-lg">
                <p className="text-xs font-semibold text-primary uppercase tracking-wider">
                  Target Capaian 2030
                </p>
                <p className="text-sm font-bold text-foreground mt-0.5">
                  Standardisasi SDM TIK Berdaya Saing Global
                </p>
              </div>
            </div>
          </div>

          {/* Konten Teks Visi */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-5">
            <div className="inline-flex items-center gap-2 text-primary font-bold text-lg">
              <Compass className="h-6 w-6" />
              <span>VISI UTAMA</span>
            </div>
            
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground leading-snug">
              Menjadi Lembaga Sertifikasi Profesi Pilihan Utama yang Terpercaya dan Diakui Nasional dalam Penjaminan Mutu Tenaga Kerja TIK.
            </h3>
            
            <div className="space-y-4 text-muted-foreground text-base leading-relaxed">
              <p>
                Dalam menghadapi era transformasi digital dan persaingan tenaga kerja yang kian kompetitif, LSP Teknologi Terampil bertekad menjadi acuan (*benchmark*) mutu pengujian standar kompetensi di Indonesia.
              </p>
              <p>
                Kami tidak hanya menerbitkan sertifikat, melainkan memastikan setiap individu yang lulus memiliki pembuktian kapasitas kerja aktual (*actual competence*) yang selaras dengan kebutuhan dunia usaha dan dunia industri (DUDI).
              </p>
            </div>

            {/* Indikator Kunci Visi */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl border border-border bg-card/50 flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                <span className="text-sm font-semibold text-foreground">Pengakuan Standar BNSP</span>
              </div>
              <div className="p-3.5 rounded-xl border border-border bg-card/50 flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                <span className="text-sm font-semibold text-foreground">Kesesuaian Kebutuhan DUDI</span>
              </div>
            </div>
          </div>

        </div>

        {/* 2. SECTION MISI (Layout List Interaktif + Gambar Pendukung) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start pt-8 border-t border-border/60">
          
          {/* Konten Misi (Kiri) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-primary font-bold text-lg">
              <Target className="h-6 w-6" />
              <span>MISI STRATEGIS</span>
            </div>
            
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground leading-snug">
              4 Komitmen Mendasar dalam Menjalankan Operasional Sertifikasi
            </h3>

            <div className="space-y-4 pt-2">
              {misiPoints.map((item, index) => (
                <div
                  key={index}
                  className="group rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      0{index + 1}
                    </span>
                    <div className="space-y-1.5">
                      <h4 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-muted-foreground text-base leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gambar Pendukung Misi (Kanan Sticky) */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="space-y-6">
              <div className="relative h-[260px] sm:h-[320px] w-full rounded-3xl overflow-hidden border border-border bg-card shadow-lg">
                <Image
                  src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80"
                  alt="Kolaborasi Tim Asesor dan Peserta"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Box Quote / Highlight */}
              <div className="rounded-2xl border border-border bg-accent/40 p-6 space-y-4">
                <p className="text-sm font-bold uppercase tracking-wider text-primary">
                  Integritas & Kualitas
                </p>
                <blockquote className="text-base italic text-foreground leading-relaxed">
                  &ldquo;Sertifikasi bukan sekadar lembar kertas, melainkan wujud pengakuan atas kapasitas, etika kerja, dan profesionalisme tenaga ahli Indonesia.&rdquo;
                </blockquote>

                <div className="flex flex-wrap gap-2 pt-1">
                  {[
                    "Akuntabel",
                    "Profesional",
                    "Berkelanjutan",
                  ].map((value) => (
                    <span
                      key={value}
                      className="inline-flex items-center rounded-full border border-primary/20 bg-background/80 px-3 py-1.5 text-xs font-semibold text-primary"
                    >
                      {value}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}