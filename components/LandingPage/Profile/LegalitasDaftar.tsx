import React from "react";
import Image from "next/image";
import { ShieldCheck, ZoomIn, FileCheck2 } from "lucide-react";

export default function LegalitasGaleri() {
  const galeriDokumen = [
    {
      title: "Sertifikat Lisensi BNSP",
      number: "No. KEP. 1284/BNSP/VIII/2023",
      image: "/images/legalitas/lisensi-bnsp.png",
      badge: "Lisensi Utama",
    },
    {
      title: "Surat Keputusan Kemenkumham",
      number: "AHU-0014291.AH.01.07.Tahun 2022",
      image: "/images/legalitas/sk-kemenkumham.png",
      badge: "Akte & Badan Hukum",
    },
    {
      title: "Surat Izin Operasional Disnaker",
      number: "563/3021/Disnaker/2022",
      image: "/images/legalitas/izin-disnaker.png",
      badge: "Izin Operasional",
    },
    {
      title: "Lembar Lampiran NIB & OSS",
      number: "NIB: 1248000392102",
      image: "/images/legalitas/nib-oss.png",
      badge: "Perizinan Berusaha",
    },
  ];

  return (
    <section className="py-10 lg:py-16 bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header Section */}
        <div className="border-l-4 border-primary pl-6 mb-8 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary mb-1">
            <ShieldCheck className="h-4 w-4" />
            <span>Dokumen Keabsahan Fisik</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
            Legalitas & Surat Perizinan
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Dokumen resmi penetapan lisensi BNSP, SK Menteri, dan surat izin operasional LSP.
          </p>
        </div>

        {/* GRID Dokumen */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
          {galeriDokumen.map((doc, idx) => (
            <div
              key={idx}
              className="group relative rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-md hover:border-[#ff6600] hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
            >
              <div className="relative aspect-[1/1.2] w-full rounded-xl bg-muted overflow-hidden border border-border/80 shadow-inner">
                <Image
                  src={doc.image}
                  alt={doc.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />

                {/* Overlay Hover Zoom Oren */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 backdrop-blur-[2px] p-4 text-center">
                  <div className="flex items-center gap-2 rounded-xl bg-[#ff6600] px-4 py-2 text-xs font-bold text-white shadow-lg">
                    <ZoomIn className="h-4 w-4" />
                    <span>Perbesar Lembaran</span>
                  </div>
                  <span className="text-[11px] text-white/90 font-medium">
                    Klik untuk melihat detail berkas
                  </span>
                </div>

                {/* Badge Kategori Kertas */}
                <span className="absolute top-3 left-3 rounded-lg bg-background/95 backdrop-blur-md px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-primary group-hover:text-[#ff6600] group-hover:border-[#ff6600] border border-border shadow-md transition-colors">
                  {doc.badge}
                </span>
              </div>

              {/* Keterangan & Judul */}
              <div className="mt-3 pt-3 border-t border-border/60 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-foreground leading-snug group-hover:text-[#ff6600] transition-colors">
                    {doc.title}
                  </h3>
                  <p className="text-xs font-mono text-muted-foreground mt-0.5">
                    {doc.number}
                  </p>
                </div>

                <div className="p-2 rounded-xl bg-primary/10 text-primary group-hover:bg-[#ff6600]/10 group-hover:text-[#ff6600] transition-colors shrink-0">
                  <FileCheck2 className="h-4 w-4" />
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}