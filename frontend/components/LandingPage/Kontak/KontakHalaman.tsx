"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import {
  CheckCircle2,
  Clock,
  ExternalLink,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
} from "lucide-react";

const contactEmail = "lspteknologiterampilmayantara@gmail.com";
const contactPhone = "+6281299998174";
const officeAddress =
  "Jl. Radar Baru Ujung No.50, Pasir Gn. Sel., Kec. Cimanggis, Jawa Barat 16451";

type ContactForm = {
  nama: string;
  email: string;
  subjek: string;
  pesan: string;
};

export default function KontakHalaman() {
  const [formData, setFormData] = useState<ContactForm>({
    nama: "",
    email: "",
    subjek: "",
    pesan: "",
  });
  const [draftPrepared, setDraftPrepared] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const body = [
      `Nama: ${formData.nama}`,
      `Email: ${formData.email}`,
      "",
      formData.pesan,
    ].join("\n");
    const mailto = `mailto:${contactEmail}?subject=${encodeURIComponent(formData.subjek)}&body=${encodeURIComponent(body)}`;

    window.location.assign(mailto);
    setDraftPrepared(true);
  };

  const updateField = (field: keyof ContactForm, value: string) => {
    setDraftPrepared(false);
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(officeAddress)}`;
  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(officeAddress)}&z=16&output=embed`;

  return (
    <section className="relative isolate overflow-hidden bg-background py-12 text-foreground lg:py-20">
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-72 w-[min(90vw,800px)] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />

      <div className="mx-auto max-w-7xl space-y-12 px-4 sm:px-6 lg:px-8">
        <header className="mx-auto max-w-2xl space-y-4 text-center">
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
            Hubungi Kami
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Tanyakan informasi skema, pendaftaran, atau proses asesmen kepada LSP Teknologi Terampil.
          </p>
        </header>

        <div className="grid items-start gap-8 lg:grid-cols-5">
          <div className="space-y-6 lg:col-span-2">
            <div className="space-y-6 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
              <h2 className="text-xl font-black">Informasi Kantor</h2>

              <div className="space-y-5">
                <ContactDetail icon={MapPin} label="Alamat Kantor">
                  <p className="text-sm font-semibold leading-relaxed">{officeAddress}</p>
                </ContactDetail>

                <ContactDetail icon={Phone} label="Telepon / WhatsApp">
                  <a
                    href={`tel:${contactPhone}`}
                    className="block text-sm font-semibold hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    +62 812-9999-8174
                  </a>
                  <a
                    href={`https://wa.me/${contactPhone.slice(1)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex min-h-11 items-center gap-1.5 text-xs font-semibold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    Buka WhatsApp
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </ContactDetail>

                <ContactDetail icon={Mail} label="Email">
                  <a
                    href={`mailto:${contactEmail}`}
                    className="inline-flex min-h-11 items-center break-all text-sm font-semibold hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    {contactEmail}
                  </a>
                </ContactDetail>

                <ContactDetail icon={Clock} label="Jam Operasional">
                  <p className="text-sm font-semibold">Senin sampai Jumat, 08.00 sampai 17.00 WIB</p>
                  <p className="text-xs text-muted-foreground">Sabtu dan Minggu tutup</p>
                </ContactDetail>
              </div>
            </div>
          </div>

          <div className="space-y-6 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8 lg:col-span-3">
            <div>
              <h2 className="text-xl font-black">Kirim Pesan</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Formulir ini menyiapkan draf email di aplikasi email Anda.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField id="contact-name" label="Nama Lengkap">
                  <input
                    id="contact-name"
                    name="nama"
                    type="text"
                    autoComplete="name"
                    required
                    maxLength={100}
                    value={formData.nama}
                    onChange={(event) => updateField("nama", event.target.value)}
                    placeholder="Masukkan nama Anda"
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </FormField>
                <FormField id="contact-email" label="Alamat Email">
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    maxLength={254}
                    value={formData.email}
                    onChange={(event) => updateField("email", event.target.value)}
                    placeholder="nama@email.com"
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </FormField>
              </div>

              <FormField id="contact-subject" label="Subjek Pesan">
                <input
                  id="contact-subject"
                  name="subjek"
                  type="text"
                  required
                  maxLength={160}
                  value={formData.subjek}
                  onChange={(event) => updateField("subjek", event.target.value)}
                  placeholder="Contoh: Pertanyaan pendaftaran sertifikasi"
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </FormField>

              <FormField id="contact-message" label="Pesan">
                <textarea
                  id="contact-message"
                  name="pesan"
                  rows={5}
                  required
                  maxLength={3000}
                  value={formData.pesan}
                  onChange={(event) => updateField("pesan", event.target.value)}
                  placeholder="Tuliskan pertanyaan atau kebutuhan Anda"
                  className="w-full resize-y rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </FormField>

              <button
                type="submit"
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <Send className="h-4 w-4" />
                Buka draf email
              </button>
            </form>

            {draftPrepared && (
              <p
                role="status"
                aria-live="polite"
                className="flex items-start gap-2 rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm leading-relaxed text-foreground"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                Draf email sudah disiapkan. Periksa isinya lalu tekan Kirim. Jika aplikasi email tidak terbuka, gunakan{" "}
                <a className="font-semibold text-primary underline" href={`mailto:${contactEmail}`}>
                  {contactEmail}
                </a>
                .
              </p>
            )}
          </div>
        </div>

        <section aria-labelledby="office-location-title" className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="office-location-title" className="flex items-center gap-2 text-xl font-black">
              <MapPin className="h-5 w-5 text-primary" />
              Lokasi Kantor
            </h2>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Buka di Google Maps
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
          <div className="h-80 overflow-hidden rounded-3xl border border-border sm:h-96">
            <iframe
              title="Peta lokasi kantor LSP Teknologi Terampil"
              src={mapEmbedUrl}
              width="100%"
              height="100%"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="border-0"
            />
          </div>
        </section>
      </div>
    </section>
  );
}

function ContactDetail({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof MapPin;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-start gap-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-accent text-primary">
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0 space-y-1">
        <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        {children}
      </div>
    </div>
  );
}

function FormField({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-xs font-bold text-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}
