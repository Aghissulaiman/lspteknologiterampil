import Link from "next/link";
import { CheckCircle2, ShieldCheck, Target } from "lucide-react";

export default function About() {
  const serviceAreas = [
    { label: "Skema", description: "Ruang lingkup dan persyaratan sertifikasi." },
    { label: "Asesmen", description: "Alur pengajuan dan penilaian kompetensi." },
    { label: "Sertifikat", description: "Pemeriksaan nomor sertifikat yang diterbitkan." },
  ];

  const highlights = [
    "Peserta memilih skema dan jadwal yang tersedia sebelum mengajukan sertifikasi.",
    "Persyaratan mengikuti skema yang dipilih dan ditampilkan pada halaman skema.",
    "Proses asesmen mencakup jawaban mandiri dan bukti kompetensi peserta.",
    "Nomor sertifikat dapat diperiksa melalui halaman verifikasi publik.",
  ];

  return (
    <section id="about" className="w-full bg-background py-12 sm:py-16 md:py-20 transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 lg:gap-8 items-center">
          
          {/* Visual Side (Kiri) */}
          <div className="lg:col-span-5 relative order-2 lg:order-1">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Card */}
              <div className="rounded-2xl sm:rounded-3xl bg-muted/60 border border-border/80 p-6 sm:p-8 md:p-10 relative overflow-hidden shadow-lg">
                {/* Decorative blur */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
                
                {/* Visi Header */}
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-primary text-primary-foreground">
                    <Target className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-foreground">Visi Utama</h4>
                  </div>
                </div>

                {/* Visi Text */}
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed italic mb-6 sm:mb-8">
                  &ldquo;Menjadi lembaga pelatihan dan pengembangan kompetensi teknologi yang profesional, terpercaya, dan inovatif dalam mencetak sumber daya manusia yang kompeten, berdaya saing, serta siap menghadapi kebutuhan industri di era digital.&rdquo;
                </p>

                {/* Ringkasan layanan */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-4 sm:pt-6 border-t border-border/60">
                  {serviceAreas.map((area) => (
                    <div key={area.label} className="text-center">
                      <span className="block text-xs font-bold text-foreground sm:text-sm">
                        {area.label}
                      </span>
                      <span className="mt-1 block text-[9px] leading-tight text-muted-foreground sm:text-[10px]">
                        {area.description}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Text Content Side (Kanan) */}
          <div className="lg:col-span-7 flex flex-col justify-center order-1 lg:order-2">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] sm:text-xs font-semibold w-fit mb-3 sm:mb-4">
              <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> 
              Tentang LSP Teknologi Terampil
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-4 sm:mb-6 leading-tight">
              Membangun Standar Kompetensi SDM Digital Indonesia
            </h2>

            {/* Description */}
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4 sm:mb-6">
              Melalui situs ini, calon asesi dapat menelusuri skema dan persyaratannya, mengikuti alur pengajuan, serta memeriksa nomor sertifikat yang tercatat.
            </p>

            {/* Highlights List */}
            <div className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8">
              {highlights.map((point, index) => (
                <div key={index} className="flex items-start gap-2.5 sm:gap-3">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-foreground font-medium leading-relaxed">
                    {point}
                  </span>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3 sm:gap-4">
              <Link
                href="/profil/tentang"
                className="inline-flex min-h-11 w-full items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:w-auto sm:text-base"
              >
                Profil Lengkap LSP
              </Link>
              <Link
                href="/profil/struktur"
                className="inline-flex min-h-11 w-full items-center justify-center rounded-md border border-border/80 bg-background px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:w-auto sm:text-base"
              >
                Struktur Organisasi
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
