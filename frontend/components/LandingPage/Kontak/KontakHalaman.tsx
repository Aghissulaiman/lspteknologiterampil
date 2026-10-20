// "use client";

// import React, { useState } from "react";
// import {
//   MapPin,
//   Phone,
//   Mail,
//   Clock,
//   Send,
//   MessageSquare,
//   CheckCircle2,
//   Building2,
//   ExternalLink,
// } from "lucide-react";

// export default function KontakHalaman() {
//   const [formData, setFormData] = useState({
//     nama: "",
//     email: "",
//     subjek: "",
//     pesan: "",
//   });
//   const [submitted, setSubmitted] = useState(false);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     setSubmitted(true);
//     setTimeout(() => {
//       setSubmitted(false);
//       setFormData({ nama: "", email: "", subjek: "", pesan: "" });
//     }, 4000);
//   };

//   return (
//     <section className="py-12 lg:py-20 bg-background text-foreground relative overflow-hidden">
//       {/* Ambient Glow menggunakan variabel Primary Global */}
//       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />

//       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
//         {/* Header Section */}
//         <div className="text-center max-w-2xl mx-auto space-y-4">
//           <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl text-foreground">
//             Hubungi Kami
//           </h1>
//           <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
//             Ada pertanyaan seputar pelaksanaan sertifikasi, konsultasi skema, atau jadwal uji kompetensi? Tim kami siap membantu Anda.
//           </p>
//         </div>

//         {/* Section Info Kontak & Formulir */}
//         <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          
//           {/* Left Column: Detail Informasi Kontak (2 Cols) */}
//           <div className="lg:col-span-2 space-y-6">
//             <div className="bg-card border border-border p-6 sm:p-8 rounded-3xl space-y-6 shadow-sm">
//               <h2 className="text-xl font-black text-card-foreground">
//                 Informasi Kantor
//               </h2>

//               <div className="space-y-5">
//                 {/* Alamat Kantor */}
//                 <div className="flex items-start gap-4">
//                   <div className="p-3 rounded-2xl bg-accent text-accent-foreground shrink-0 mt-0.5 border border-border">
//                     <MapPin className="h-5 w-5" />
//                   </div>
//                   <div className="space-y-1">
//                     <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
//                       Alamat Kantor
//                     </span>
//                     <p className="text-xs sm:text-sm font-semibold text-foreground leading-relaxed">
//                       Jl. Radar Baru Ujung No.50, Pasir Gn. Sel., Kec. Cimanggis, Jawa Barat (16451)
//                     </p>
//                   </div>
//                 </div>

//                 {/* Telepon / WhatsApp */}
//                 <div className="flex items-start gap-4">
//                   <div className="p-3 rounded-2xl bg-accent text-accent-foreground shrink-0 mt-0.5 border border-border">
//                     <Phone className="h-5 w-5" />
//                   </div>
//                   <div className="space-y-1">
//                     <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
//                       Telepon / WhatsApp
//                     </span>
//                     <p className="text-xs sm:text-sm font-semibold text-foreground">
//                       <a
//                         href="https://wa.me/6281299998174"
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="hover:text-primary transition-colors"
//                       >
//                         +62 812-9999-8174
//                       </a>
//                     </p>
//                   </div>
//                 </div>

//                 {/* Email Official */}
//                 <div className="flex items-start gap-4">
//                   <div className="p-3 rounded-2xl bg-accent text-accent-foreground shrink-0 mt-0.5 border border-border">
//                     <Mail className="h-5 w-5" />
//                   </div>
//                   <div className="space-y-1">
//                     <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
//                       Email Official
//                     </span>
//                     <p className="text-xs sm:text-sm font-semibold text-foreground break-all">
//                       <a
//                         href="mailto:lspteknologiterampilmayantara@gmail.com"
//                         className="hover:text-primary transition-colors"
//                       >
//                         lspteknologiterampilmayantara@gmail.com
//                       </a>
//                     </p>
//                   </div>
//                 </div>

//                 {/* Jam Operasional */}
//                 <div className="flex items-start gap-4">
//                   <div className="p-3 rounded-2xl bg-accent text-accent-foreground shrink-0 mt-0.5 border border-border">
//                     <Clock className="h-5 w-5" />
//                   </div>
//                   <div className="space-y-1">
//                     <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
//                       Jam Operasional
//                     </span>
//                     <p className="text-xs sm:text-sm font-semibold text-foreground">
//                       Senin - Jumat: 08:00 - 17:00 WIB
//                     </p>
//                     <p className="text-xs text-destructive font-medium">
//                       Sabtu - Minggu: Tutup
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Tombol Bantuan Cepat WhatsApp */}
//             <a
//               href="https://wa.me/6281299998174"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="w-full bg-primary text-primary-foreground p-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-md"
//             >
//               <MessageSquare className="h-4 w-4" />
//               <span>Kirim Pesan via WhatsApp</span>
//             </a>
//           </div>

//           {/* Right Column: Formulir Kirim Pesan (3 Cols) */}
//           <div className="lg:col-span-3 bg-card border border-border p-6 sm:p-8 rounded-3xl space-y-6 shadow-sm">
//             <div>
//               <h2 className="text-xl font-black text-card-foreground">
//                 Kirim Pesan
//               </h2>
//               <p className="text-xs text-muted-foreground mt-1">
//                 Isi formulir di bawah ini dan tim kami akan segera menghubungi Anda kembali.
//               </p>
//             </div>

//             {submitted ? (
//               <div className="p-6 rounded-2xl bg-primary/10 border border-primary/20 text-center space-y-2">
//                 <CheckCircle2 className="h-10 w-10 text-primary mx-auto" />
//                 <h3 className="font-bold text-base text-foreground">
//                   Pesan Terkirim!
//                 </h3>
//                 <p className="text-xs text-muted-foreground">
//                   Terima kasih telah menghubungi kami. Tim kami akan merespons pesan Anda sesegera mungkin.
//                 </p>
//               </div>
//             ) : (
//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <div className="space-y-1.5">
//                     <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
//                       Nama Lengkap
//                     </label>
//                     <input
//                       type="text"
//                       required
//                       placeholder="Masukkan nama Anda"
//                       value={formData.nama}
//                       onChange={(e) =>
//                         setFormData({ ...formData, nama: e.target.value })
//                       }
//                       className="w-full bg-muted/50 border border-border rounded-2xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground/60"
//                     />
//                   </div>

//                   <div className="space-y-1.5">
//                     <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
//                       Alamat Email
//                     </label>
//                     <input
//                       type="email"
//                       required
//                       placeholder="nama@email.com"
//                       value={formData.email}
//                       onChange={(e) =>
//                         setFormData({ ...formData, email: e.target.value })
//                       }
//                       className="w-full bg-muted/50 border border-border rounded-2xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground/60"
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-1.5">
//                   <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
//                     Subjek Pesan
//                   </label>
//                   <input
//                     type="text"
//                     required
//                     placeholder="Contoh: Pertanyaan Pendaftaran Sertifikasi"
//                     value={formData.subjek}
//                     onChange={(e) =>
//                       setFormData({ ...formData, subjek: e.target.value })
//                     }
//                     className="w-full bg-muted/50 border border-border rounded-2xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground/60"
//                   />
//                 </div>

//                 <div className="space-y-1.5">
//                   <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
//                     Pesan
//                   </label>
//                   <textarea
//                     rows={4}
//                     required
//                     placeholder="Tuliskan pertanyaan atau detail kebutuhan Anda..."
//                     value={formData.pesan}
//                     onChange={(e) =>
//                       setFormData({ ...formData, pesan: e.target.value })
//                     }
//                     className="w-full bg-muted/50 border border-border rounded-2xl p-4 text-xs focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground/60 resize-none"
//                   />
//                 </div>

//                 <button
//                   type="submit"
//                   className="w-full bg-primary text-primary-foreground py-3.5 rounded-2xl font-bold text-xs sm:text-sm hover:opacity-90 transition-all shadow-md flex items-center justify-center gap-2"
//                 >
//                   <Send className="h-4 w-4" />
//                   <span>Kirim Pesan Sekarang</span>
//                 </button>
//               </form>
//             )}
//           </div>
//         </div>

//         {/* Peta Google Maps Terintegrasi */}
//         <div className="space-y-4">
//           <div className="flex items-center justify-between">
//             <h2 className="text-xl font-black text-foreground flex items-center gap-2">
//               <MapPin className="h-5 w-5 text-primary" />
//               <span>Lokasi Peta Kantor</span>
//             </h2>
//             <a
//               href="https://maps.google.com/?q=Jl.+Radar+Baru+Ujung+No.50,+Pasir+Gn.+Sel.,+Kec.+Cimanggis,+Jawa+Barat+16451"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
//             >
//               <span>Buka di Google Maps</span>
//               <ExternalLink className="h-3.5 w-3.5" />
//             </a>
//           </div>

//           <div className="w-full h-80 sm:h-96 rounded-3xl overflow-hidden border border-border shadow-md">
//             <iframe
//               title="Peta Lokasi LSP Teknologi Terampil Mayantara"
//               src="https://maps.google.com/maps?q=Jl.%20Radar%20Baru%20Ujung%20No.50%2C%20Pasir%20Gn.%20Sel.%2C%20Kec.%20Cimanggis%2C%20Jawa%20Barat%2016451&t=&z=16&ie=UTF8&iwloc=&output=embed"
//               width="100%"
//               height="100%"
//               style={{ border: 0 }}
//               allowFullScreen={true}
//               loading="lazy"
//               referrerPolicy="no-referrer-when-downgrade"
//             />
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";

import React, { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageSquare,
  CheckCircle2,
  Building2,
  ExternalLink,
} from "lucide-react";

export default function KontakHalaman() {
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    subjek: "",
    pesan: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ nama: "", email: "", subjek: "", pesan: "" });
    }, 4000);
  };

  return (
    <section className="py-12 lg:py-20 bg-background text-foreground relative overflow-hidden">
      {/* Ambient Glow menggunakan warna Oranye */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-orange-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl text-foreground">
            Hubungi Kami
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Ada pertanyaan seputar pelaksanaan sertifikasi, konsultasi skema, atau jadwal uji kompetensi? Tim kami siap membantu Anda.
          </p>
        </div>

        {/* Section Info Kontak & Formulir */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          
          {/* Left Column: Detail Informasi Kontak (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card border border-border p-6 sm:p-8 rounded-3xl space-y-6 shadow-sm">
              <h2 className="text-xl font-black text-card-foreground">
                Informasi Kantor
              </h2>

              <div className="space-y-5">
                {/* Alamat Kantor */}
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-accent text-accent-foreground shrink-0 mt-0.5 border border-border">
                    <MapPin className="h-5 w-5 text-orange-500" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                      Alamat Kantor
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-foreground leading-relaxed">
                      Jl. Radar Baru Ujung No.50, Pasir Gn. Sel., Kec. Cimanggis, Jawa Barat (16451)
                    </p>
                  </div>
                </div>

                {/* Telepon / WhatsApp */}
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-accent text-accent-foreground shrink-0 mt-0.5 border border-border">
                    <Phone className="h-5 w-5 text-orange-500" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                      Telepon / WhatsApp
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-foreground">
                      {/* UBAH DI SINI: hover:text-orange-500 */}
                      <a
                        href="https://wa.me/6281299998174"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-orange-500 transition-colors"
                      >
                        +62 812-9999-8174
                      </a>
                    </p>
                  </div>
                </div>

                {/* Email Official */}
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-accent text-accent-foreground shrink-0 mt-0.5 border border-border">
                    <Mail className="h-5 w-5 text-orange-500" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                      Email Official
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-foreground break-all">
                      {/* UBAH DI SINI: hover:text-orange-500 */}
                      <a
                        href="mailto:lspteknologiterampilmayantara@gmail.com"
                        className="hover:text-orange-500 transition-colors"
                      >
                        lspteknologiterampilmayantara@gmail.com
                      </a>
                    </p>
                  </div>
                </div>

                {/* Jam Operasional */}
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-accent text-accent-foreground shrink-0 mt-0.5 border border-border">
                    <Clock className="h-5 w-5 text-orange-500" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                      Jam Operasional
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-foreground">
                      Senin - Jumat: 08:00 - 17:00 WIB
                    </p>
                    <p className="text-xs text-destructive font-medium">
                      Sabtu - Minggu: Tutup
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tombol Bantuan Cepat WhatsApp - UBAH DI SINI: hover:bg-orange-600 */}
            <a
              href="https://wa.me/6281299998174"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-orange-500 text-white p-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-orange-600 transition-all shadow-md"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Kirim Pesan via WhatsApp</span>
            </a>
          </div>

          {/* Right Column: Formulir Kirim Pesan (3 Cols) */}
          <div className="lg:col-span-3 bg-card border border-border p-6 sm:p-8 rounded-3xl space-y-6 shadow-sm">
            <div>
              <h2 className="text-xl font-black text-card-foreground">
                Kirim Pesan
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Isi formulir di bawah ini dan tim kami akan segera menghubungi Anda kembali.
              </p>
            </div>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-center space-y-2">
                <CheckCircle2 className="h-10 w-10 text-orange-500 mx-auto" />
                <h3 className="font-bold text-base text-foreground">
                  Pesan Terkirim!
                </h3>
                <p className="text-xs text-muted-foreground">
                  Terima kasih telah menghubungi kami. Tim kami akan merespons pesan Anda sesegera mungkin.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Nama Lengkap
                    </label>
                    {/* UBAH DI SINI: focus:ring-orange-500 & focus:border-orange-500 */}
                    <input
                      type="text"
                      required
                      placeholder="Masukkan nama Anda"
                      value={formData.nama}
                      onChange={(e) =>
                        setFormData({ ...formData, nama: e.target.value })
                      }
                      className="w-full bg-muted/50 border border-border rounded-2xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 text-foreground placeholder:text-muted-foreground/60 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Alamat Email
                    </label>
                    {/* UBAH DI SINI: focus:ring-orange-500 & focus:border-orange-500 */}
                    <input
                      type="email"
                      required
                      placeholder="nama@email.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full bg-muted/50 border border-border rounded-2xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 text-foreground placeholder:text-muted-foreground/60 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Subjek Pesan
                  </label>
                  {/* UBAH DI SINI: focus:ring-orange-500 & focus:border-orange-500 */}
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Pertanyaan Pendaftaran Sertifikasi"
                    value={formData.subjek}
                    onChange={(e) =>
                      setFormData({ ...formData, subjek: e.target.value })
                    }
                    className="w-full bg-muted/50 border border-border rounded-2xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 text-foreground placeholder:text-muted-foreground/60 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Pesan
                  </label>
                  {/* UBAH DI SINI: focus:ring-orange-500 & focus:border-orange-500 */}
                  <textarea
                    rows={4}
                    required
                    placeholder="Tuliskan pertanyaan atau detail kebutuhan Anda..."
                    value={formData.pesan}
                    onChange={(e) =>
                      setFormData({ ...formData, pesan: e.target.value })
                    }
                    className="w-full bg-muted/50 border border-border rounded-2xl p-4 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 text-foreground placeholder:text-muted-foreground/60 resize-none transition-all"
                  />
                </div>

                {/* UBAH DI SINI: bg-orange-500 & hover:bg-orange-600 */}
                <button
                  type="submit"
                  className="w-full bg-orange-500 text-white py-3.5 rounded-2xl font-bold text-xs sm:text-sm hover:bg-orange-600 transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  <span>Kirim Pesan Sekarang</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Peta Google Maps Terintegrasi */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-foreground flex items-center gap-2">
              <MapPin className="h-5 w-5 text-orange-500" />
              <span>Lokasi Peta Kantor</span>
            </h2>
            {/* UBAH DI SINI: text-orange-500 & hover:text-orange-600 */}
            <a
              href="https://maps.google.com/?q=Jl.+Radar+Baru+Ujung+No.50,+Pasir+Gn.+Sel.,+Kec.+Cimanggis,+Jawa+Barat+16451"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-orange-500 hover:text-orange-600 hover:underline flex items-center gap-1 transition-colors"
            >
              <span>Buka di Google Maps</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="w-full h-80 sm:h-96 rounded-3xl overflow-hidden border border-border shadow-md">
            <iframe
              title="Peta Lokasi LSP Teknologi Terampil Mayantara"
              src="https://maps.google.com/maps?q=Jl.%20Radar%20Baru%20Ujung%20No.50%2C%20Pasir%20Gn.%20Sel.%2C%20Kec.%20Cimanggis%2C%20Jawa%20Barat%2016451&t=&z=16&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}