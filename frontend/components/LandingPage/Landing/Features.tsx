import Link from "next/link";
import { 
  Award,
  BriefcaseBusiness,
  FileText,
  GraduationCap,
  Image as ImageIcon,
  IdCard,
} from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: IdCard,
      title: "Identitas diri",
      description:
        "Siapkan identitas sesuai persyaratan skema yang dipilih.",
    },
    {
      icon: ImageIcon,
      title: "Pasfoto Formal",
      description:
        "Lampirkan pasfoto terbaru jika diminta oleh skema.",
    },
    {
      icon: GraduationCap,
      title: "Bukti Pendidikan",
      description:
        "Gunakan ijazah atau bukti pendidikan lain sesuai persyaratan.",
    },
    {
      icon: Award,
      title: "Sertifikat Pelatihan",
      description: "Sertakan bukti pelatihan yang relevan jika dipersyaratkan.",
    },
    {
      icon: BriefcaseBusiness,
      title: "Pengalaman kerja",
      description: "Lampirkan bukti kerja atau magang jika diminta.",
    },
    {
      icon: FileText,
      title: "Portofolio & CV",
      description: "Pilih CV dan bukti karya yang sesuai dengan unit kompetensi.",
    },
  ];

  return (
    <section id="features" className="w-full bg-background py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Judul Utama */}
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
            Siapkan berkas untuk sertifikasi
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Persyaratan dapat berbeda untuk tiap skema. Buka detail skema untuk melihat dokumen yang perlu disiapkan.
          </p>
        </div>

        {/* Grid Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;

            return (
              <div
                key={index}
                className="rounded-2xl border border-border bg-card p-6 text-center"
              >
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-accent text-primary">
                  <IconComponent aria-hidden="true" className="h-7 w-7" />
                </div>
                <h3 className="mb-2 text-base font-bold leading-snug text-foreground">
                  {feature.title}
                </h3>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/skema"
            className="inline-flex min-h-11 items-center justify-center rounded-md border border-primary px-5 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Periksa persyaratan skema
          </Link>
        </div>

      </div>
    </section>
  );
} 
