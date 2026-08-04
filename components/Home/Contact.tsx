"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Pesan terkirim:", formData);
    alert("Terima kasih! Pesan Anda telah terkirim.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section id="kontak" className="relative w-full bg-background py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
   

        {/* Content Section: Info & Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Information Column (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Brand Logo & Brief */}
            {/* <div className="flex items-center gap-3">
              <Image 
                src="/Logo/Logo2.png" 
                alt="Logo LSP Teknologi Terampil"
                width={60}
                height={60}
                className="object-contain"
              />
              <span className="text-xl font-bold text-foreground">
                LSP <span className="text-primary">Teknologi Terampil</span>
              </span>
            </div> */}
            
            <p className="text-sm text-muted-foreground leading-relaxed">
              Lembaga Sertifikasi Profesi terpercaya yang berkomitmen mencetak tenaga kerja profesional dan bersertifikasi standar nasional & internasional.
            </p>

            {/* Contact Details List */}
            <div className="space-y-4 pt-2">
              
              {/* Alamat */}
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Alamat Kantor</h4>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    Jl. Radar Baru Ujung No.50, Pasir Gn. Sel., Kec. Cimanggis, Jawa Barat (16451)
                  </p>
                </div>
              </div>

              {/* Telepon / HP */}
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Telepon / WhatsApp</h4>
                  <a 
                    href="tel:+6281299998174" 
                    className="text-xs text-muted-foreground mt-0.5 block hover:text-primary transition-colors"
                  >
                    +62 812-9999-8174
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Email Official</h4>
                  <a 
                    href="mailto:lspteknologiterampilmayantara@gmail.com" 
                    className="text-xs text-muted-foreground mt-0.5 block hover:text-primary transition-colors break-all"
                  >
                    lspteknologiterampilmayantara@gmail.com
                  </a>
                </div>
              </div>

              {/* Jam Operasional */}
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Jam Operasional</h4>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    Senin - Jumat: 08:00 - 17:00 WIB <br />
                    Sabtu - Minggu: Tutup
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Form Column (7 Cols) */}
          <div className="lg:col-span-7 rounded-2xl bg-card p-6 sm:p-8 border border-border/80 shadow-md">
            <h3 className="text-xl font-bold text-foreground mb-4">
              Kirim Pesan
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nama Lengkap */}
                <div>
                  <label htmlFor="name" className="block text-xs font-semibold text-foreground mb-1.5">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Masukkan nama Anda"
                    className="w-full rounded-md border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-xs font-semibold text-foreground mb-1.5">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="nama@email.com"
                    className="w-full rounded-md border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                </div>
              </div>

              {/* Subjek */}
              <div>
                <label htmlFor="subject" className="block text-xs font-semibold text-foreground mb-1.5">
                  Subjek *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Pertanyaan seputar skema / pendaftaran"
                  className="w-full rounded-md border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>

              {/* Pesan */}
              <div>
                <label htmlFor="message" className="block text-xs font-semibold text-foreground mb-1.5">
                  Pesan Anda *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tuliskan pertanyaan atau pesan Anda di sini..."
                  className="w-full rounded-md border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full bg-primary text-primary-foreground hover:bg-orange-500 font-semibold shadow-md transition-colors"
              >
                Kirim Pesan Sekarang
                <Send className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </div>

        </div>

      </div>
    </section>
  );
}