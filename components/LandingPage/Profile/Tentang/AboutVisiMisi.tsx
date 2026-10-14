import React from "react";
import Image from "next/image";
import { Target, Compass } from "lucide-react";

export default function AboutVisiMisi() {
  const misiPoints = [
    {
      id: 1,
      title: "Menyelenggarakan Asesmen Berkualitas",
      description: "Melaksanakan proses sertifikasi profesi bidang teknologi yang objektif, transparan, dan terukur dengan mengacu pada Standar Kompetensi Kerja Nasional Indonesia (SKKNI)."
    },
    {
      id: 2,
      title: "Mengembangkan Skema Adaptif",
      description: "Merancang dan memelihara skema uji kompetensi yang relevan, mutakhir, dan sejalan dengan pesatnya perkembangan industri digital masa kini."
    },
    {
      id: 3,
      title: "Menjamin Mutu Infrastruktur & Penguji",
      description: "Menyediakan tenaga Asesor berlisensi BNSP yang profesional serta Tempat Uji Kompetensi (TUK) dengan fasilitas teknologi berstandar tinggi."
    },
    {
      id: 4,
      title: "Membangun Kemitraan Strategis",
      description: "Memperluas sinergi dengan institusi pendidikan dan Dunia Usaha Dunia Industri (DUDI) untuk memastikan talenta digital tersertifikasi mendapatkan pengakuan penuh dan mudah diserap oleh pasar kerja."
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-background border-b border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">


        {/* 2. SECTION MISI (Layout List Interaktif + Gambar Pendukung) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start pt-8 border-t border-border/60">

          {/* Konten Misi (Kiri) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-primary font-bold text-lg">
              <Target className="h-6 w-6" />
              <span>MISI STRATEGIS</span>
            </div>

            <div className="space-y-4 pt-2">
              {misiPoints.map((item, index) => (
                <div
                  key={index}
                  className="group rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm transition-all hover:border-orange-500/50 hover:shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary group-hover:bg-orange-500 group-hover:text-white transition-colors">
                      0{index + 1}
                    </span>
                    <div className="space-y-1.5">
                      <h4 className="text-lg font-bold text-foreground group-hover:text-orange-500 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-muted-foreground text-base leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gambar Pendukung Misi (Kanan Sticky) */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="relative h-[260px] sm:h-[320px] w-full rounded-3xl overflow-hidden border border-border bg-card shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80"
                alt="Kolaborasi Tim Asesor dan Peserta"
                fill
                className="object-cover"
              />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}