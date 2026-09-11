// import React from "react";
// import Image from "next/image";
// import { Shield, Award, Briefcase, FileText, CheckCircle } from "lucide-react";

// export default function StrukturBagan() {
//   const dewanPengarah = [
//     {
//       name: "Prof. Dr. Ir. H. Suparman, M.Sc.",
//       role: "Ketua Dewan Pengarah",
//       desc: "Perwakilan Asosiasi Industri TIK",
//       image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
//     },
//     {
//       name: "Drs. Eko Prasetyo, M.M.",
//       role: "Anggota Dewan Pengarah",
//       desc: "Pakar Vokasi & Ketenagakerjaan",
//       image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
//     },
//   ];

//   const direktur = {
//     name: "Dr. Ir. Ahmad Sudrajat, M.T.",
//     role: "Direktur Utama LSP",
//     license: "No. Reg. MET.000.001234 2021",
//     image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
//   };

//   const manajer = [
//     {
//       role: "Manajer Mutu",
//       name: "Budi Santoso, S.Kom., M.T.",
//       code: "MUTU-LSP",
//       icon: Shield,
//       tasks: ["Audit Internal", "SOP BNSP 201/202", "Kaji Ulang Manajemen"],
//       image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
//     },
//     {
//       role: "Manajer Sertifikasi",
//       name: "Siti Rahmawati, S.T.",
//       code: "SERT-LSP",
//       icon: Award,
//       tasks: ["Materi Uji Kompetensi", "Pengawasan TUK", "Pleno Asesmen"],
//       image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
//     },
//     {
//       role: "Manajer Adm. & Keuangan",
//       name: "Hendra Wijaya, S.E.",
//       code: "ADM-LSP",
//       icon: Briefcase,
//       tasks: ["Pendaftaran Asesi", "Penerbitan Sertifikat", "Operasional"],
//       image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
//     },
//   ];

//   return (
//     <section className="py-12 lg:py-20 bg-background text-foreground">
//       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
//         {/* Title Section */}
//         <div className="max-w-3xl mb-12 border-l-4 border-primary pl-6">
//           <span className="text-xs font-bold uppercase tracking-widest text-primary">
//             Sistem Tata Kelola
//           </span>
//           <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl mt-1">
//             Struktur Organisasi LSP
//           </h1>
//           <p className="text-base text-muted-foreground mt-2">
//             Bagan hirarki kepengurusan dan penanggung jawab operasional Lembaga Sertifikasi Profesi Teknologi Terampil.
//           </p>
//         </div>

//         {/* ORGANIZATIONAL CHART CONTAINER */}
//         <div className="relative rounded-3xl border border-border bg-card/50 p-6 sm:p-10 lg:p-12 shadow-xl backdrop-blur-sm">
          
//           {/* LEVEL 1: DEWAN PENGARAH */}
//           <div className="space-y-4">
//             <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-primary/80">
//               <span className="h-2 w-2 rounded-full bg-primary" />
//               Dewan Pengarah (Pengawasan & Kebijakan)
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
//               {dewanPengarah.map((item, idx) => (
//                 <div
//                   key={idx}
//                   className="flex items-center gap-4 rounded-2xl border border-border bg-background p-4 shadow-sm hover:border-primary/40 transition-all"
//                 >
//                   <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-muted">
//                     <Image
//                       src={item.image}
//                       alt={item.name}
//                       fill
//                       className="object-cover object-top"
//                     />
//                   </div>
//                   <div className="min-w-0 flex-1">
//                     <span className="inline-block text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md mb-1">
//                       {item.role}
//                     </span>
//                     <h3 className="text-base font-bold text-foreground truncate">
//                       {item.name}
//                     </h3>
//                     <p className="text-xs text-muted-foreground truncate">
//                       {item.desc}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Garis Pembatas/Konektor Vertikal */}
//           <div className="flex flex-col items-center justify-center my-6">
//             <div className="h-10 w-0.5 bg-gradient-to-b from-primary to-border" />
//           </div>

//           {/* LEVEL 2: DIREKTUR UTAMA */}
//           <div className="max-w-md mx-auto">
//             <div className="flex items-center justify-center gap-2 text-xs font-extrabold uppercase tracking-widest text-primary/80 mb-3">
//               Unsur Pimpinan Eksekutif
//             </div>

//             <div className="relative overflow-hidden rounded-2xl border-2 border-primary bg-background p-6 shadow-lg text-center">
//               <div className="absolute top-0 left-0 right-0 h-1.5 bg-primary" />
              
//               <div className="relative h-24 w-24 mx-auto mb-4 overflow-hidden rounded-2xl border-2 border-primary/20 bg-muted shadow">
//                 <Image
//                   src={direktur.image}
//                   alt={direktur.name}
//                   fill
//                   className="object-cover object-top"
//                 />
//               </div>

//               <span className="inline-block rounded-full bg-primary text-primary-foreground px-4 py-1 text-xs font-bold tracking-wide uppercase shadow-sm">
//                 {direktur.role}
//               </span>

//               <h2 className="text-xl font-extrabold text-foreground mt-3">
//                 {direktur.name}
//               </h2>
              
//               <p className="text-xs font-semibold text-muted-foreground mt-1">
//                 Lisensi BNSP: <span className="text-foreground">{direktur.license}</span>
//               </p>
//             </div>
//           </div>

//           {/* Garis Pembatas/Konektor Vertikal */}
//           <div className="flex flex-col items-center justify-center my-6">
//             <div className="h-10 w-0.5 bg-border" />
//           </div>

//           {/* LEVEL 3: MANAJEMEN / UNSUR PELAKSANA */}
//           <div className="space-y-4">
//             <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-primary/80">
//               <span className="h-2 w-2 rounded-full bg-primary" />
//               Unsur Pelaksana Operasional (Manajemen)
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               {manajer.map((m, idx) => {
//                 const Icon = m.icon;
//                 return (
//                   <div
//                     key={idx}
//                     className="flex flex-col justify-between rounded-2xl border border-border bg-background p-5 shadow-sm hover:border-primary/50 hover:shadow-md transition-all"
//                   >
//                     <div>
//                       {/* Header Kartu Manajer */}
//                       <div className="flex items-center justify-between gap-2 pb-4 mb-4 border-b border-border/60">
//                         <div className="flex items-center gap-3">
//                           <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-muted border border-border">
//                             <Image
//                               src={m.image}
//                               alt={m.name}
//                               fill
//                               className="object-cover object-top"
//                             />
//                           </div>
//                           <div>
//                             <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary">
//                               {m.code}
//                             </span>
//                             <h3 className="text-sm font-bold text-foreground leading-tight">
//                               {m.role}
//                             </h3>
//                           </div>
//                         </div>
//                         <div className="p-2 rounded-xl bg-primary/10 text-primary">
//                           <Icon className="h-5 w-5" />
//                         </div>
//                       </div>

//                       {/* Nama Pejabat */}
//                       <p className="text-base font-bold text-foreground mb-3">
//                         {m.name}
//                       </p>

//                       {/* Daftar Tugas Operasional */}
//                       <div className="space-y-2">
//                         <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
//                           Fungsi & Operasional:
//                         </p>
//                         <ul className="space-y-1.5 text-xs text-muted-foreground">
//                           {m.tasks.map((task, tIdx) => (
//                             <li key={tIdx} className="flex items-center gap-2">
//                               <CheckCircle className="h-3.5 w-3.5 text-primary shrink-0" />
//                               <span>{task}</span>
//                             </li>
//                           ))}
//                         </ul>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>

//           {/* FOOTER NOTICE / KOMITE TEKNIS */}
//           <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/40 p-4 rounded-2xl">
//             <div className="flex items-center gap-3">
//               <div className="p-2 rounded-lg bg-background border border-border text-primary">
//                 <FileText className="h-5 w-5" />
//               </div>
//               <div>
//                 <p className="text-xs font-bold text-foreground">
//                   Komite Teknis & Tim Asesor Kompetensi
//                 </p>
//                 <p className="text-xs text-muted-foreground">
//                   Didukung oleh 50+ Asesor Kompetensi terlisensi BNSP sektor TIK.
//                 </p>
//               </div>
//             </div>

//             <span className="text-xs font-semibold text-primary bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-xl">
//               SK BNSP Terbukti & Aktif
//             </span>
//           </div>

//         </div>

//       </div>
//     </section>
//   );
// }

import React from "react";
import Image from "next/image";
import { Shield, Award, Briefcase, FileText, CheckCircle } from "lucide-react";

export default function StrukturBagan() {
  const dewanPengarah = [
    {
      name: "Prof. Dr. Ir. H. Suparman, M.Sc.",
      role: "Ketua Dewan Pengarah",
      desc: "Perwakilan Asosiasi Industri TIK",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Drs. Eko Prasetyo, M.M.",
      role: "Anggota Dewan Pengarah",
      desc: "Pakar Vokasi & Ketenagakerjaan",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    },
  ];

  const direktur = {
    name: "Dr. Ir. Ahmad Sudrajat, M.T.",
    role: "Direktur Utama LSP",
    license: "No. Reg. MET.000.001234 2021",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
  };

  const manajer = [
    {
      role: "Manajer Mutu",
      name: "Budi Santoso, S.Kom., M.T.",
      code: "MUTU-LSP",
      icon: Shield,
      tasks: ["Audit Internal", "SOP BNSP 201/202", "Kaji Ulang Manajemen"],
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    },
    {
      role: "Manajer Sertifikasi",
      name: "Siti Rahmawati, S.T.",
      code: "SERT-LSP",
      icon: Award,
      tasks: ["Materi Uji Kompetensi", "Pengawasan TUK", "Pleno Asesmen"],
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
    },
    {
      role: "Manajer Adm. & Keuangan",
      name: "Hendra Wijaya, S.E.",
      code: "ADM-LSP",
      icon: Briefcase,
      tasks: ["Pendaftaran Asesi", "Penerbitan Sertifikat", "Operasional"],
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
    },
  ];

  return (
    <section className="py-12 lg:py-20 bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Title Section */}
        <div className="max-w-3xl mb-12 border-l-4 border-primary pl-6">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">
            Sistem Tata Kelola
          </span>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl mt-1">
            Struktur Organisasi LSP
          </h1>
          <p className="text-base text-muted-foreground mt-2">
            Bagan hirarki kepengurusan dan penanggung jawab operasional Lembaga Sertifikasi Profesi Teknologi Terampil.
          </p>
        </div>

        {/* ORGANIZATIONAL CHART CONTAINER */}
        <div className="relative rounded-3xl border border-border bg-card/50 p-6 sm:p-10 lg:p-12 shadow-xl backdrop-blur-sm">

          {/* LEVEL 1: DEWAN PENGARAH */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-primary/80">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Dewan Pengarah (Pengawasan & Kebijakan)
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {dewanPengarah.map((item, idx) => (
                <div
                  key={idx}
                  className="group flex items-center gap-4 rounded-2xl border border-border bg-background p-4 shadow-sm hover:border-orange-500/50 transition-all cursor-pointer"
                >
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-muted">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover object-top"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="inline-block text-[11px] font-bold text-primary bg-primary/10 group-hover:bg-orange-500 group-hover:text-white px-2 py-0.5 rounded-md mb-1 transition-colors">
                      {item.role}
                    </span>
                    <h3 className="text-base font-bold text-foreground truncate group-hover:text-orange-500 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-xs text-muted-foreground truncate">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Garis Pembatas/Konektor Vertikal */}
          <div className="flex flex-col items-center justify-center my-6">
            <div className="h-10 w-0.5 bg-gradient-to-b from-primary to-border" />
          </div>

          {/* LEVEL 2: DIREKTUR UTAMA */}
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-center gap-2 text-xs font-extrabold uppercase tracking-widest text-primary/80 mb-3">
              Unsur Pimpinan Eksekutif
            </div>

            <div className="group relative overflow-hidden rounded-2xl border-2 border-primary bg-background p-6 shadow-lg text-center hover:border-orange-500 transition-all cursor-pointer">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-primary group-hover:bg-orange-500 transition-colors" />

              <div className="relative h-24 w-24 mx-auto mb-4 overflow-hidden rounded-2xl border-2 border-primary/20 bg-muted shadow">
                <Image
                  src={direktur.image}
                  alt={direktur.name}
                  fill
                  className="object-cover object-top"
                />
              </div>

              <span className="inline-block rounded-full bg-primary text-primary-foreground px-4 py-1 text-xs font-bold tracking-wide uppercase shadow-sm group-hover:bg-orange-500 transition-colors">
                {direktur.role}
              </span>

              <h2 className="text-xl font-extrabold text-foreground mt-3 group-hover:text-orange-500 transition-colors">
                {direktur.name}
              </h2>

              <p className="text-xs font-semibold text-muted-foreground mt-1">
                Lisensi BNSP: <span className="text-foreground">{direktur.license}</span>
              </p>
            </div>
          </div>

          {/* Garis Pembatas/Konektor Vertikal */}
          <div className="flex flex-col items-center justify-center my-6">
            <div className="h-10 w-0.5 bg-border" />
          </div>

          {/* LEVEL 3: MANAJEMEN / UNSUR PELAKSANA */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-primary/80">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Unsur Pelaksana Operasional (Manajemen)
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {manajer.map((m, idx) => {
                const Icon = m.icon;
                return (
                  <div
                    key={idx}
                    className="group flex flex-col justify-between rounded-2xl border border-border bg-background p-5 shadow-sm hover:border-orange-500/50 hover:shadow-md transition-all cursor-pointer"
                  >
                    <div>
                      {/* Header Kartu Manajer */}
                      <div className="flex items-center justify-between gap-2 pb-4 mb-4 border-b border-border/60">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-muted border border-border">
                            <Image
                              src={m.image}
                              alt={m.name}
                              fill
                              className="object-cover object-top"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary group-hover:text-orange-500 transition-colors">
                              {m.code}
                            </span>
                            <h3 className="text-sm font-bold text-foreground leading-tight group-hover:text-orange-500 transition-colors">
                              {m.role}
                            </h3>
                          </div>
                        </div>
                        <div className="p-2 rounded-xl bg-primary/10 text-primary group-hover:bg-orange-500/10 group-hover:text-orange-500 transition-colors">
                          <Icon className="h-5 w-5" />
                        </div>
                      </div>

                      {/* Nama Pejabat */}
                      <p className="text-base font-bold text-foreground mb-3 group-hover:text-orange-500 transition-colors">
                        {m.name}
                      </p>

                      {/* Daftar Tugas Operasional */}
                      <div className="space-y-2">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                          Fungsi & Operasional:
                        </p>
                        <ul className="space-y-1.5 text-xs text-muted-foreground">
                          {m.tasks.map((task, tIdx) => (
                            <li key={tIdx} className="flex items-center gap-2">
                              <CheckCircle className="h-3.5 w-3.5 text-primary group-hover:text-orange-500 transition-colors shrink-0" />
                              <span>{task}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* FOOTER NOTICE / KOMITE TEKNIS */}
          <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/40 p-4 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-background border border-border text-primary">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">
                  Komite Teknis & Tim Asesor Kompetensi
                </p>
                <p className="text-xs text-muted-foreground">
                  Didukung oleh 50+ Asesor Kompetensi terlisensi BNSP sektor TIK.
                </p>
              </div>
            </div>

            <span className="text-xs font-semibold text-primary bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-xl">
              SK BNSP Terbukti & Aktif
            </span>
          </div>

        </div>

      </div>
    </section>
  );
}