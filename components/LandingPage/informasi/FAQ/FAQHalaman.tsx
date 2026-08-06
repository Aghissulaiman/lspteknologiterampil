// "use client";

// import React, { useState } from "react";
// import {
//   HelpCircle,
//   Search,
//   ChevronDown,
//   Award,
//   FileCheck,
//   Calendar,
//   ShieldCheck,
//   MessageCircle,
//   Mail,
//   Sparkles,
// } from "lucide-react";

// interface FAQItem {
//   id: number;
//   pertanyaan: string;
//   jawaban: string;
//   kategori: string;
// }

// export default function FAQHalaman() {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("Semua");
//   const [openId, setOpenId] = useState<number | null>(1); // Default item 1 terbuka

//   const kategoriList = [
//     "Semua",
//     "Pendaftaran & Syarat",
//     "Uji Kompetensi",
//     "Kelulusan & Sertifikat",
//     "Verifikasi & Legalitas",
//   ];

//   const faqData: FAQItem[] = [
//     {
//       id: 1,
//       kategori: "Kelulusan & Sertifikat",
//       pertanyaan: "Berapa lama masa berlaku Sertifikat Kompetensi BNSP?",
//       jawaban:
//         "Sertifikat Kompetensi BNSP berlaku selama 3 (tiga) tahun sejak tanggal diterbitkan. Setelah masa berlaku habis, asesi dapat melakukan perpanjangan (resertifikasi) dengan menyertakan bukti portofolio atau kegiatan kerja terbaru.",
//     },
//     {
//       id: 2,
//       kategori: "Kelulusan & Sertifikat",
//       pertanyaan: "Bagaimana cara mengunduh e-Sertifikat digital?",
//       jawaban:
//         "E-Sertifikat digital dapat diunduh langsung melalui Dashboard Asesi setelah status ujian Anda dinyatakan 'KOMPETEN' oleh Tim Asesor dan diverifikasi oleh Komite Teknis LSP.",
//     },
//     {
//       id: 3,
//       kategori: "Pendaftaran & Syarat",
//       pertanyaan: "Apa saja dokumen yang harus disiapkan untuk pendaftaran (APL-01 & APL-02)?",
//       jawaban:
//         "Dokumen utama meliputi KTP/Identitas resmi, Pasfoto terbaru latar merah/biru, ijazah terakhir, CV/Riwayat Hidup, serta bukti pendukung portofolio (sertifikat pelatihan, surat keterangan kerja, atau sampel proyek).",
//     },
//     {
//       id: 4,
//       kategori: "Uji Kompetensi",
//       pertanyaan: "Bagaimana jika asesi dinyatakan 'Belum Kompeten' (BK)?",
//       jawaban:
//         "Jika dinyatakan BK, asesi akan diberikan umpan balik oleh asesor mengenai unit kompetensi yang belum terpenuhi. Asesi berhak mengikuti uji ulang (re-asesmen) khusus pada unit yang belum memenuhi syarat pada gelombang berikutnya.",
//     },
//     {
//       id: 5,
//       kategori: "Verifikasi & Legalitas",
//       pertanyaan: "Bagaimana cara memverifikasi keaslian sertifikat BNSP?",
//       jawaban:
//         "Keaslian sertifikat dapat diverifikasi melalui fitur 'Verifikasi Sertifikat' di website ini dengan memasukkan Nomor Registrasi BNSP atau dengan memindai Kode QR yang tertera pada lembar sertifikat.",
//     },
//     {
//       id: 6,
//       kategori: "Uji Kompetensi",
//       pertanyaan: "Apakah uji kompetensi dilaksanakan secara online atau offline?",
//       jawaban:
//         "Uji kompetensi dapat dilaksanakan secara Offline di Tempat Uji Kompetensi (TUK) terdaftar, maupun secara Online (TUK Daring) sesuai dengan skema dan ketersediaan perangkat asesmen.",
//     },
//     {
//       id: 7,
//       kategori: "Pendaftaran & Syarat",
//       pertanyaan: "Berapa lama proses verifikasi berkas APL-01 dan APL-02?",
//       jawaban:
//         "Proses verifikasi dokumen administrasi (APL-01) dan Asesmen Mandiri (APL-02) memakan waktu 1–3 hari kerja sebelum jadwal pra-asesmen dimulai.",
//     },
//   ];

//   // Toggle Accordion Item
//   const toggleAccordion = (id: number) => {
//     setOpenId(openId === id ? null : id);
//   };

//   // Filter FAQ berdasarkan Kategori dan Pencarian
//   const filteredFAQ = faqData.filter((item) => {
//     const matchCategory =
//       selectedCategory === "Semua" || item.kategori === selectedCategory;
//     const matchSearch =
//       item.pertanyaan.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       item.jawaban.toLowerCase().includes(searchQuery.toLowerCase());
//     return matchCategory && matchSearch;
//   });

//   return (
//     <section className="py-12 lg:py-20 bg-background text-foreground relative overflow-hidden">
//       {/* Visual Ambient Glow */}
//       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />

//       <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
//         {/* Header Hero Section */}
//         <div className="text-center max-w-2xl mx-auto space-y-4">
//           <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-primary bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
//             <HelpCircle className="h-4 w-4" />
//             <span>Pusat Bantuan & FAQ</span>
//           </div>
//           <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl text-foreground">
//             Pertanyaan Yang Sering Diajukan
//           </h1>
//           <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
//             Temukan jawaban lengkap seputar prosedur pendaftaran, jadwal asesmen, klaim e-Sertifikat, dan verifikasi keabsahan lisensi BNSP.
//           </p>
//         </div>

//         {/* Filter & Search Controls */}
//         <div className="space-y-6">
//           <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-muted/20 p-4 rounded-3xl border border-muted/30">
//             {/* Category Filter Tabs */}
//             <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
//               {kategoriList.map((kat, idx) => (
//                 <button
//                   key={idx}
//                   onClick={() => setSelectedCategory(kat)}
//                   className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
//                     selectedCategory === kat
//                       ? "bg-primary text-primary-foreground shadow-sm"
//                       : "bg-background/60 text-muted-foreground hover:bg-background"
//                   }`}
//                 >
//                   {kat}
//                 </button>
//               ))}
//             </div>

//             {/* Search Input Bar */}
//             <div className="relative w-full md:w-72 shrink-0">
//               <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//               <input
//                 type="text"
//                 placeholder="Cari pertanyaan..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full bg-background border border-muted/30 rounded-2xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Accordion FAQ List */}
//         <div className="space-y-4">
//           {filteredFAQ.length > 0 ? (
//             filteredFAQ.map((faq) => {
//               const isOpen = openId === faq.id;
//               return (
//                 <div
//                   key={faq.id}
//                   className={`border rounded-2xl transition-all duration-200 overflow-hidden ${
//                     isOpen
//                       ? "bg-background border-primary/40 shadow-md"
//                       : "bg-muted/10 border-muted/30 hover:border-muted/50"
//                   }`}
//                 >
//                   <button
//                     onClick={() => toggleAccordion(faq.id)}
//                     className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-foreground focus:outline-none"
//                   >
//                     <span className="flex items-center gap-3">
//                       <span className="text-primary text-xs font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-primary/10 shrink-0 hidden sm:inline-block">
//                         {faq.kategori}
//                       </span>
//                       <span>{faq.pertanyaan}</span>
//                     </span>
//                     <ChevronDown
//                       className={`h-5 w-5 text-muted-foreground shrink-0 transition-transform duration-300 ${
//                         isOpen ? "rotate-180 text-primary" : ""
//                       }`}
//                     />
//                   </button>

//                   {isOpen && (
//                     <div className="px-5 sm:px-6 pb-6 pt-0 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-muted/20 mt-1">
//                       <p className="pt-4">{faq.jawaban}</p>
//                     </div>
//                   )}
//                 </div>
//               );
//             })
//           ) : (
//             /* Empty State */
//             <div className="text-center py-16 bg-muted/10 rounded-3xl space-y-3 border border-dashed border-muted/30">
//               <HelpCircle className="h-10 w-10 text-muted-foreground mx-auto" />
//               <h3 className="font-bold text-base text-foreground">
//                 Pertanyaan Tidak Ditemukan
//               </h3>
//               <p className="text-xs text-muted-foreground">
//                 Coba gunakan kata kunci lain atau hubungi tim layanan dukungan kami.
//               </p>
//             </div>
//           )}
//         </div>

//         {/* Contact Support Banner */}
//         <div className="bg-muted/20 border border-muted/30 p-6 sm:p-8 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6">
//           <div className="space-y-1 text-center sm:text-left">
//             <h3 className="text-base sm:text-lg font-black text-foreground">
//               Masih Memiliki Pertanyaan Lain?
//             </h3>
//             <p className="text-xs text-muted-foreground">
//               Tim sekretariat TUK kami siap membantu Anda seputar proses asesmen dan lisensi.
//             </p>
//           </div>

//           <div className="flex flex-wrap items-center justify-center gap-3 w-full sm:w-auto shrink-0">
//             <a
//               href="#"
//               className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-3 rounded-2xl text-xs font-bold hover:opacity-90 transition-all shadow-md"
//             >
//               <MessageCircle className="h-4 w-4" />
//               <span>WhatsApp Admin</span>
//             </a>
//             <a
//               href="#"
//               className="inline-flex items-center gap-2 bg-background border border-muted/30 px-5 py-3 rounded-2xl text-xs font-bold hover:bg-muted/30 transition-all"
//             >
//               <Mail className="h-4 w-4 text-primary" />
//               <span>Kirim Email</span>
//             </a>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";

import React, { useState } from "react";
import {
  HelpCircle,
  Search,
  ChevronDown,
  Award,
  FileCheck,
  Calendar,
  ShieldCheck,
  MessageCircle,
  Mail,
  Sparkles,
} from "lucide-react";

interface FAQItem {
  id: number;
  pertanyaan: string;
  jawaban: string;
  kategori: string;
}

export default function FAQHalaman() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [openId, setOpenId] = useState<number | null>(1); // Default item 1 terbuka

  const kategoriList = [
    "Semua",
    "Pendaftaran & Syarat",
    "Uji Kompetensi",
    "Kelulusan & Sertifikat",
    "Verifikasi & Legalitas",
  ];

  const faqData: FAQItem[] = [
    {
      id: 1,
      kategori: "Kelulusan & Sertifikat",
      pertanyaan: "Berapa lama masa berlaku Sertifikat Kompetensi BNSP?",
      jawaban:
        "Sertifikat Kompetensi BNSP berlaku selama 3 (tiga) tahun sejak tanggal diterbitkan. Setelah masa berlaku habis, asesi dapat melakukan perpanjangan (resertifikasi) dengan menyertakan bukti portofolio atau kegiatan kerja terbaru.",
    },
    {
      id: 2,
      kategori: "Kelulusan & Sertifikat",
      pertanyaan: "Bagaimana cara mengunduh e-Sertifikat digital?",
      jawaban:
        "E-Sertifikat digital dapat diunduh langsung melalui Dashboard Asesi setelah status ujian Anda dinyatakan 'KOMPETEN' oleh Tim Asesor dan diverifikasi oleh Komite Teknis LSP.",
    },
    {
      id: 3,
      kategori: "Pendaftaran & Syarat",
      pertanyaan: "Apa saja dokumen yang harus disiapkan untuk pendaftaran (APL-01 & APL-02)?",
      jawaban:
        "Dokumen utama meliputi KTP/Identitas resmi, Pasfoto terbaru latar merah/biru, ijazah terakhir, CV/Riwayat Hidup, serta bukti pendukung portofolio (sertifikat pelatihan, surat keterangan kerja, atau sampel proyek).",
    },
    {
      id: 4,
      kategori: "Uji Kompetensi",
      pertanyaan: "Bagaimana jika asesi dinyatakan 'Belum Kompeten' (BK)?",
      jawaban:
        "Jika dinyatakan BK, asesi akan diberikan umpan balik oleh asesor mengenai unit kompetensi yang belum terpenuhi. Asesi berhak mengikuti uji ulang (re-asesmen) khusus pada unit yang belum memenuhi syarat pada gelombang berikutnya.",
    },
    {
      id: 5,
      kategori: "Verifikasi & Legalitas",
      pertanyaan: "Bagaimana cara memverifikasi keaslian sertifikat BNSP?",
      jawaban:
        "Keaslian sertifikat dapat diverifikasi melalui fitur 'Verifikasi Sertifikat' di website ini dengan memasukkan Nomor Registrasi BNSP atau dengan memindai Kode QR yang tertera pada lembar sertifikat.",
    },
    {
      id: 6,
      kategori: "Uji Kompetensi",
      pertanyaan: "Apakah uji kompetensi dilaksanakan secara online atau offline?",
      jawaban:
        "Uji kompetensi dapat dilaksanakan secara Offline di Tempat Uji Kompetensi (TUK) terdaftar, maupun secara Online (TUK Daring) sesuai dengan skema dan ketersediaan perangkat asesmen.",
    },
    {
      id: 7,
      kategori: "Pendaftaran & Syarat",
      pertanyaan: "Berapa lama proses verifikasi berkas APL-01 dan APL-02?",
      jawaban:
        "Proses verifikasi dokumen administrasi (APL-01) dan Asesmen Mandiri (APL-02) memakan waktu 1–3 hari kerja sebelum jadwal pra-asesmen dimulai.",
    },
  ];

  // Toggle Accordion Item
  const toggleAccordion = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  // Filter FAQ berdasarkan Kategori dan Pencarian
  const filteredFAQ = faqData.filter((item) => {
    const matchCategory =
      selectedCategory === "Semua" || item.kategori === selectedCategory;
    const matchSearch =
      item.pertanyaan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.jawaban.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <section className="py-12 lg:py-20 bg-background text-foreground relative overflow-hidden">
      {/* Visual Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Header Hero Section */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-primary bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
            <HelpCircle className="h-4 w-4" />
            <span>Pusat Bantuan & FAQ</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl text-foreground">
            Pertanyaan Yang Sering Diajukan
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Temukan jawaban lengkap seputar prosedur pendaftaran, jadwal asesmen, klaim e-Sertifikat, dan verifikasi keabsahan lisensi BNSP.
          </p>
        </div>

        {/* Filter & Search Controls */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-muted/20 p-4 rounded-3xl border border-muted/30">
            {/* Category Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
              {kategoriList.map((kat, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedCategory(kat)}
                  
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${selectedCategory === kat
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-background/60 text-muted-foreground hover:bg-orange-500 hover:text-white"
                    }`}
                >
                  {kat}
                </button>
              ))}
            </div>

            {/* Search Input Bar */}
            <div className="relative w-full md:w-72 shrink-0">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari pertanyaan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
               
                className="w-full bg-background border border-muted/30 rounded-2xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 text-foreground"
              />
            </div>
          </div>
        </div>

        {/* Accordion FAQ List */}
        <div className="space-y-4">
          {filteredFAQ.length > 0 ? (
            filteredFAQ.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <div
                  key={faq.id}
               
                  className={`border rounded-2xl transition-all duration-200 overflow-hidden ${isOpen
                      ? "bg-background border-primary/40 shadow-md"
                      : "bg-muted/10 border-muted/30 hover:border-orange-500/50"
                    }`}
                >
                  <button
                    onClick={() => toggleAccordion(faq.id)}
                
                    className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-foreground group focus:outline-none"
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-primary text-xs font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-primary/10 shrink-0 hidden sm:inline-block">
                        {faq.kategori}
                      </span>
                      {/* UBAH DI SINI: group-hover:text-orange-500 */}
                      <span className="group-hover:text-orange-500 transition-colors">
                        {faq.pertanyaan}
                      </span>
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 text-muted-foreground shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-primary" : "group-hover:text-orange-500"
                        }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-0 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-muted/20 mt-1">
                      <p className="pt-4">{faq.jawaban}</p>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            /* Empty State */
            <div className="text-center py-16 bg-muted/10 rounded-3xl space-y-3 border border-dashed border-muted/30">
              <HelpCircle className="h-10 w-10 text-muted-foreground mx-auto" />
              <h3 className="font-bold text-base text-foreground">
                Pertanyaan Tidak Ditemukan
              </h3>
              <p className="text-xs text-muted-foreground">
                Coba gunakan kata kunci lain atau hubungi tim layanan dukungan kami.
              </p>
            </div>
          )}
        </div>

        {/* Contact Support Banner */}
        <div className="bg-muted/20 border border-muted/30 p-6 sm:p-8 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-base sm:text-lg font-black text-foreground">
              Masih Memiliki Pertanyaan Lain?
            </h3>
            <p className="text-xs text-muted-foreground">
              Tim sekretariat TUK kami siap membantu Anda seputar proses asesmen dan lisensi.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 w-full sm:w-auto shrink-0">
            {/* UBAH DI SINI: hover:bg-orange-500 */}
            <a
              href="#"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-3 rounded-2xl text-xs font-bold hover:bg-orange-500 transition-all shadow-md"
            >
              <MessageCircle className="h-4 w-4" />
              <span>WhatsApp Admin</span>
            </a>
            {/* UBAH DI SINI: hover:border-orange-500 hover:text-orange-500 */}
            <a
              href="#"
              className="inline-flex items-center gap-2 bg-background border border-muted/30 px-5 py-3 rounded-2xl text-xs font-bold hover:border-orange-500 hover:text-orange-500 transition-all"
            >
              <Mail className="h-4 w-4 text-primary" />
              <span>Kirim Email</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}