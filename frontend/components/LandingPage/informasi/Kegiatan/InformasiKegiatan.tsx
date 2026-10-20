"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  Award,
  BookOpenCheck,
  Building2,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  ClipboardCheck,
  GraduationCap,
  Handshake,
  UsersRound,
  X,
} from "lucide-react";

type Activity = {
  title: string;
  category: string;
  description: string;
  image: string;
  imageAlt: string;
  icon: typeof ClipboardCheck;
};

const activities: Activity[] = [
  {
    title: "Uji kompetensi berbasis praktik",
    category: "Uji Kompetensi",
    description:
      "Asesi menunjukkan pengetahuan dan keterampilan melalui bukti kerja, observasi, serta tanya jawab yang mengacu pada unit kompetensi.",
    image:
      "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Ilustrasi peserta mengikuti sesi uji kompetensi",
    icon: ClipboardCheck,
  },
  {
    title: "Pembekalan sebelum asesmen",
    category: "Pembekalan Asesi",
    description:
      "Pengenalan alur sertifikasi, dokumen yang perlu disiapkan, dan gambaran pelaksanaan asesmen membantu asesi mengikuti proses dengan percaya diri.",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Ilustrasi kegiatan pembekalan peserta",
    icon: GraduationCap,
  },
  {
    title: "Kolaborasi dengan Tempat Uji Kompetensi",
    category: "Kolaborasi TUK",
    description:
      "Koordinasi dengan TUK mendukung kesiapan tempat, perangkat, dan jadwal agar pelaksanaan uji kompetensi berjalan tertata.",
    image:
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Ilustrasi tim berkolaborasi dalam persiapan kegiatan",
    icon: Building2,
  },
  {
    title: "Penguatan mutu proses asesmen",
    category: "Pengembangan Asesor",
    description:
      "Diskusi dan penyelarasan praktik asesmen membantu menjaga proses penilaian tetap konsisten, objektif, dan sesuai prosedur.",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Ilustrasi diskusi tim dalam kegiatan penguatan mutu",
    icon: UsersRound,
  },
  {
    title: "Sosialisasi skema sertifikasi",
    category: "Sosialisasi",
    description:
      "Pengenalan ruang lingkup skema dan unit kompetensi membantu calon asesi memilih sertifikasi yang sesuai dengan pengalaman dan bidangnya.",
    image:
      "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Ilustrasi sesi berbagi informasi kepada peserta",
    icon: BookOpenCheck,
  },
  {
    title: "Apresiasi pencapaian kompetensi",
    category: "Apresiasi Asesi",
    description:
      "Pengakuan atas hasil asesmen menjadi penanda perjalanan belajar dan langkah baru bagi asesi untuk terus berkembang secara profesional.",
    image:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Ilustrasi apresiasi bagi peserta yang menyelesaikan program",
    icon: Award,
  },
];

const filters = ["Semua", ...activities.map((activity) => activity.category)];

export default function InformasiKegiatan() {
  const [activeFilter, setActiveFilter] = useState("Semua");
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const visibleActivities =
    activeFilter === "Semua"
      ? activities
      : activities.filter((activity) => activity.category === activeFilter);
  const selectedActivity =
    selectedPhotoIndex === null ? null : visibleActivities[selectedPhotoIndex];

  useEffect(() => {
    if (selectedPhotoIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedPhotoIndex(null);
      if (event.key === "ArrowLeft") {
        setSelectedPhotoIndex((current) =>
          current === null
            ? null
            : (current - 1 + visibleActivities.length) % visibleActivities.length
        );
      }
      if (event.key === "ArrowRight") {
        setSelectedPhotoIndex((current) =>
          current === null ? null : (current + 1) % visibleActivities.length
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedPhotoIndex, visibleActivities.length]);

  return (
    <>
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-slate-950 text-white">
        <div className="absolute -right-28 -top-32 h-96 w-96 rounded-full bg-sky-400/15 blur-3xl" />
        <div className="absolute -bottom-48 left-1/4 h-96 w-96 rounded-full bg-orange-400/10 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-semibold tracking-wide text-blue-100 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-orange-400" />
              RUANG CERITA LSP TEKNOLOGI TERAMPIL
            </div>
            <h1 className="max-w-xl text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              Kompetensi tumbuh dari{" "}
              <span className="text-sky-300">setiap proses.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-blue-100/85 sm:text-lg sm:leading-8">
              Kenali rangkaian kegiatan yang mendukung perjalanan sertifikasi,
              dari persiapan asesi hingga asesmen dan kolaborasi bersama mitra.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href="#jelajahi-kegiatan"
                className="inline-flex items-center gap-2 rounded-xl bg-orange-400 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-orange-950/20 transition hover:-translate-y-0.5 hover:bg-orange-300"
              >
                Jelajahi kegiatan <ArrowDown className="h-4 w-4" />
              </a>
              <span className="text-sm text-blue-100/75">
                Belajar · Berkolaborasi · Bersertifikasi
              </span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl lg:ml-auto">
            <div className="absolute -inset-3 rotate-2 rounded-[2rem] bg-white/10" />
            <div className="relative h-[310px] overflow-hidden rounded-[1.7rem] border border-white/15 shadow-2xl shadow-slate-950/40 sm:h-[390px]">
              <Image
                src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1400&q=90"
                alt="Ilustrasi suasana pelatihan dan pembelajaran bersama"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 48vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                  Proses yang terarah
                </span>
                <p className="mt-4 max-w-sm text-2xl font-bold leading-snug sm:text-3xl">
                  Setiap langkah membawa keahlian lebih dekat pada pengakuan.
                </p>
              </div>
            </div>
            <div className="absolute -bottom-5 -left-4 hidden rounded-2xl border border-white/15 bg-white/95 p-4 text-slate-900 shadow-xl sm:flex sm:items-center sm:gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-800">
                <Handshake className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-sm font-bold">Tumbuh bersama</span>
                <span className="block text-xs text-slate-500">
                  Asesi, asesor, dan mitra
                </span>
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border/70 bg-card/70">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 py-6 sm:grid-cols-3 sm:px-6 lg:px-8">
          {[
            {
              icon: GraduationCap,
              title: "Persiapan",
              text: "Mendampingi asesi memahami alur",
            },
            {
              icon: ClipboardCheck,
              title: "Asesmen",
              text: "Mengukur kompetensi secara terarah",
            },
            {
              icon: Handshake,
              title: "Kolaborasi",
              text: "Bersinergi dengan jejaring TUK",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-center gap-4 px-2 sm:justify-center"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <item.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-bold text-foreground">{item.title}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        id="jelajahi-kegiatan"
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
      >
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Dari dekat
            </span>
            <h2 className="mt-3 max-w-xl text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Kegiatan yang menghubungkan proses dan pencapaian.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground lg:justify-self-end">
            Setiap kegiatan dirancang untuk mendukung sertifikasi yang tertib,
            bermutu, dan relevan dengan kebutuhan kompetensi di bidang teknologi.
          </p>
        </div>

        <div className="mt-10 grid gap-5 overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-sm md:grid-cols-[1.05fr_0.95fr]">
          <div className="relative min-h-[260px] md:min-h-[360px]">
            <Image
              src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1400&q=85"
              alt="Ilustrasi tim berdiskusi untuk mempersiapkan kegiatan sertifikasi"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
            <span className="absolute left-5 top-5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-blue-900 shadow-sm">
              SOROTAN KEGIATAN
            </span>
          </div>
          <div className="flex flex-col justify-center p-6 sm:p-9 lg:p-11">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <UsersRound className="h-4 w-4" />
              Kolaborasi & penguatan mutu
            </div>
            <h3 className="mt-4 text-2xl font-extrabold leading-snug tracking-tight text-foreground sm:text-3xl">
              Sertifikasi yang baik dimulai dari persiapan yang matang.
            </h3>
            <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
              Koordinasi antara asesi, asesor, dan Tempat Uji Kompetensi menjadi
              bagian penting dalam menyiapkan proses asesmen yang nyaman dan
              terstruktur.
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              {["Persiapan", "Asesmen", "Kolaborasi"].map((label) => (
                <span
                  key={label}
                  className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold text-muted-foreground"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col justify-between gap-6 sm:mt-20 md:flex-row md:items-end">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Galeri kegiatan
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Cerita dari setiap tahapan
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Pilih kategori untuk melihat ragam aktivitas dalam perjalanan
              sertifikasi.
            </p>
          </div>
          <Link
            href="/kontak"
            className="inline-flex items-center gap-2 self-start text-sm font-bold text-primary transition hover:gap-3 md:self-auto"
          >
            Tanyakan informasi kegiatan <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div
          className="mt-7 flex gap-2 overflow-x-auto pb-2"
          aria-label="Filter kategori kegiatan"
        >
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              aria-pressed={activeFilter === filter}
              className={
                "shrink-0 rounded-full border px-4 py-2.5 text-sm font-semibold transition " +
                (activeFilter === filter
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground")
              }
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visibleActivities.map((activity) => (
            <ActivityCard
              key={activity.title}
              activity={activity}
              onPreview={() =>
                setSelectedPhotoIndex(visibleActivities.indexOf(activity))
              }
            />
          ))}
        </div>

        <p className="mt-6 text-xs leading-5 text-muted-foreground">
          Foto pada halaman ini bersifat ilustratif. Dokumentasi aktual kegiatan
          dapat ditambahkan sesuai arsip LSP.
        </p>
      </section>

      <section className="px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 rounded-[1.75rem] bg-blue-950 px-6 py-8 text-white sm:px-9 sm:py-10 md:flex-row md:items-center">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-sm font-semibold text-sky-200">
              <Award className="h-4 w-4" />
              Langkah selanjutnya
            </div>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
              Siap mengembangkan kompetensi Anda?
            </h2>
            <p className="mt-2 text-sm leading-6 text-blue-100/80">
              Temukan skema sertifikasi yang sesuai dan mulai perjalanan
              kompetensi bersama LSP Teknologi Terampil.
            </p>
          </div>
          <Link
            href="/skema"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-950 transition hover:bg-sky-100"
          >
            Lihat skema sertifikasi <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {selectedActivity && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 p-3 backdrop-blur-sm sm:p-6"
          onClick={() => setSelectedPhotoIndex(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="activity-photo-title"
            className="relative grid max-h-[92vh] w-full max-w-6xl overflow-hidden rounded-2xl bg-card shadow-2xl lg:grid-cols-[1.35fr_0.65fr]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative min-h-[42vh] bg-slate-950 sm:min-h-[50vh] lg:min-h-[72vh]">
              <Image
                src={selectedActivity.image}
                alt={selectedActivity.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 70vw"
                className="object-contain"
              />
              <button
                type="button"
                onClick={() => setSelectedPhotoIndex(null)}
                aria-label="Tutup foto"
                autoFocus
                className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-slate-950/70 text-white transition hover:bg-slate-950"
              >
                <X className="h-5 w-5" />
              </button>
              {visibleActivities.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedPhotoIndex(
                        (selectedPhotoIndex! - 1 + visibleActivities.length) %
                          visibleActivities.length
                      )
                    }
                    aria-label="Lihat foto sebelumnya"
                    className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-slate-950/70 text-white transition hover:bg-slate-950"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedPhotoIndex(
                        (selectedPhotoIndex! + 1) % visibleActivities.length
                      )
                    }
                    aria-label="Lihat foto berikutnya"
                    className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-slate-950/70 text-white transition hover:bg-slate-950"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
            </div>
            <div className="flex max-h-[42vh] flex-col justify-center overflow-y-auto p-5 sm:max-h-[36vh] sm:p-7 lg:max-h-none lg:p-9">
              <span className="inline-flex w-fit rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary">
                {selectedActivity.category}
              </span>
              <h2
                id="activity-photo-title"
                className="mt-4 text-2xl font-extrabold leading-snug text-foreground"
              >
                {selectedActivity.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {selectedActivity.description}
              </p>
              <p className="mt-6 border-t border-border pt-4 text-xs leading-5 text-muted-foreground">
                Foto ilustrasi kegiatan. Dokumentasi aktual dapat ditambahkan
                sesuai arsip LSP.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ActivityCard({
  activity,
  onPreview,
}: {
  activity: Activity;
  onPreview: () => void;
}) {
  const Icon = activity.icon;

  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5">
      <div className="relative h-56 overflow-hidden">
        <button
          type="button"
          onClick={onPreview}
          aria-label={`Lihat foto ${activity.title}`}
          className="absolute inset-0 z-10 cursor-zoom-in text-left focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-white"
        >
          <Image
            src={activity.image}
            alt={activity.imageAlt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
          <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-slate-900 shadow-sm">
            <Icon className="h-3.5 w-3.5 text-primary" />
            {activity.category}
          </span>
        </button>
      </div>
      <div className="p-5 sm:p-6">
        <h3 className="text-lg font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
          {activity.title}
        </h3>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {activity.description}
        </p>
        <div className="mt-5 flex items-center gap-2 border-t border-border/70 pt-4 text-xs font-semibold text-muted-foreground">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          Bagian dari perjalanan kompetensi
        </div>
      </div>
    </article>
  );
}
