// import React from "react";
// import Image from "next/image";
// import { Target, Compass } from "lucide-react";

// export default function AboutVisiMisi() {
//   const misiPoints = [
//     {
//       id: 1,
//       title: "Menyelenggarakan Asesmen Berkualitas",
//       description: "Melaksanakan proses sertifikasi profesi bidang teknologi yang objektif, transparan, dan terukur dengan mengacu pada Standar Kompetensi Kerja Nasional Indonesia (SKKNI)."
//     },
//     {
//       id: 2,
//       title: "Mengembangkan Skema Adaptif",
//       description: "Merancang dan memelihara skema uji kompetensi yang relevan, mutakhir, dan sejalan dengan pesatnya perkembangan industri digital masa kini."
//     },
//     {
//       id: 3,
//       title: "Menjamin Mutu Infrastruktur & Penguji",
//       description: "Menyediakan tenaga Asesor berlisensi BNSP yang profesional serta Tempat Uji Kompetensi (TUK) dengan fasilitas teknologi berstandar tinggi."
//     },
//     {
//       id: 4,
//       title: "Membangun Kemitraan Strategis",
//       description: "Memperluas sinergi dengan institusi pendidikan dan Dunia Usaha Dunia Industri (DUDI) untuk memastikan talenta digital tersertifikasi mendapatkan pengakuan penuh dan mudah diserap oleh pasar kerja."
//     }
//   ];

//   return (
//     <section className="py-16 lg:py-24 bg-background border-b border-border/60">
//       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">


//         {/* 2. SECTION MISI (Layout List Interaktif + Gambar Pendukung) */}
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start pt-8 border-t border-border/60">

//           {/* Konten Misi (Kiri) */}
//           <div className="lg:col-span-7 space-y-6">
//             <div className="inline-flex items-center gap-2 text-primary font-bold text-lg">
//               <Target className="h-6 w-6" />
//               <span>Misi</span>
//             </div>

//             <div className="space-y-4 pt-2">
//               {misiPoints.map((item, index) => (
//                 <div
//                   key={index}
//                   className="group rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm transition-all hover:border-orange-500/50 hover:shadow-md"
//                 >
//                   <div className="flex items-start gap-4">
//                     <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary group-hover:bg-orange-500 group-hover:text-white transition-colors">
//                       0{index + 1}
//                     </span>
//                     <div className="space-y-1.5">
//                       <h4 className="text-lg font-bold text-foreground group-hover:text-orange-500 transition-colors">
//                         {item.title}
//                       </h4>
//                       <p className="text-muted-foreground text-base leading-relaxed">
//                         {item.description}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Gambar Pendukung Misi (Kanan Sticky) */}
//           <div className="lg:col-span-5 lg:sticky lg:top-28">
//             <div className="relative h-[260px] sm:h-[320px] w-full rounded-3xl overflow-hidden border border-border bg-card shadow-lg">
//               <Image
//                 src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80"
//                 alt="Kolaborasi Tim Asesor dan Peserta"
//                 fill
//                 className="object-cover"
//               />
//             </div>
//           </div>

//         </div>

//       </div>
//     </section>
//   );
// }

import React from "react";
import { Target, Compass, Sparkles } from "lucide-react";

export default function AboutVisiMisi() {
  const misiPoints = [
    {
      id: 1,
      title: "Menyelenggarakan Asesmen Berkualitas",
      description:
        "Melaksanakan proses sertifikasi profesi bidang teknologi yang objektif, transparan, dan terukur dengan mengacu pada Standar Kompetensi Kerja Nasional Indonesia (SKKNI).",
    },
    {
      id: 2,
      title: "Mengembangkan Skema Adaptif",
      description:
        "Merancang dan memelihara skema uji kompetensi yang relevan, mutakhir, dan sejalan dengan pesatnya perkembangan industri digital masa kini.",
    },
    {
      id: 3,
      title: "Menjamin Mutu Infrastruktur & Penguji",
      description:
        "Menyediakan tenaga Asesor berlisensi BNSP yang profesional serta Tempat Uji Kompetensi (TUK) dengan fasilitas teknologi berstandar tinggi.",
    },
    {
      id: 4,
      title: "Membangun Kemitraan Strategis",
      description:
        "Memperluas sinergi dengan institusi pendidikan dan Dunia Usaha Dunia Industri (DUDI) untuk memastikan talenta digital tersertifikasi mendapatkan pengakuan penuh dan mudah diserap oleh pasar kerja.",
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-background border-b border-border/60">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-12">

        {/* ================= 1. CARD VISI ================= */}
        <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-card p-6 sm:p-10 shadow-sm">
          {/* Aksen garis Biru (primary) ke Oranye (secondary) */}
          <div className="absolute top-0 left-0 h-full w-2 bg-gradient-to-b from-primary to-secondary" />

          <div className="flex flex-col md:flex-row md:items-center gap-6 lg:gap-10 pl-2">
            {/* Label & Judul Visi (Kiri) */}
            <div className="md:w-1/3 shrink-0 space-y-2 border-b md:border-b-0 md:border-r border-border pb-5 md:pb-0 md:pr-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-secondary/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-secondary">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Cita-Cita Utama</span>
              </div>
              <div className="flex items-center gap-3 pt-1">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                  <Compass className="h-6 w-6" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                  Visi Kami
                </h2>
              </div>
            </div>

            {/* Isi Teks Visi (Kanan) */}
            <div className="md:w-2/3">
              <p className="text-base sm:text-lg lg:text-xl font-medium text-foreground leading-relaxed">
                &ldquo;Menjadi Lembaga Sertifikasi Profesi di bidang teknologi yang{" "}
                <span className="font-bold text-primary underline decoration-secondary decoration-2 underline-offset-4">
                  unggul, terpercaya, dan profesional
                </span>{" "}
                dalam mewujudkan sumber daya manusia Indonesia yang kompeten serta
                berdaya saing global.&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* ================= 2. SECTION MISI ================= */}
        <div className="space-y-6">
          {/* Header Misi */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-secondary-foreground shadow-sm">
              <Target className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground">
                Misi Strategis
              </h3>
              <p className="text-sm text-muted-foreground">
                Langkah nyata LSP Teknologi Terampil Mayantara dalam mencapai visi
              </p>
            </div>
          </div>

          {/* Grid 2 Kolom x 2 Baris */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {misiPoints.map((item, index) => (
              <div
                key={item.id}
                className="group relative rounded-2xl border border-border bg-card p-6 sm:p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-secondary/50 hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  {/* Nomor Urut (Biru primary -> Hover Oranye secondary) */}
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-base font-extrabold text-primary transition-colors duration-300 group-hover:bg-secondary group-hover:text-secondary-foreground">
                    0{index + 1}
                  </span>

                  {/* Judul & Deskripsi Misi */}
                  <div className="space-y-2">
                    <h4 className="text-lg font-bold text-foreground transition-colors duration-300 group-hover:text-secondary">
                      {item.title}
                    </h4>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}