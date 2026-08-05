"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function PendaftaranForm() {
  return (
    <div 
      className="relative min-h-screen w-full flex flex-col justify-between bg-cover bg-center bg-no-repeat text-foreground overflow-hidden" 
      style={{ backgroundImage: "url('/Hero/Foto1.png')" }}
    >
      
      {/* 
        OVERLAY BACKGROUND:
        - Light Mode: Sangat transparan (bg-white/10) + Blur halus (backdrop-blur-sm)
        - Dark Mode : Kegelapan sedang (dark:bg-black/50) + Tanpa blur
      */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm dark:bg-black/70 dark:backdrop-blur-sm z-0 transition-all duration-300" />

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4">
        {/* 
          CARD FORMULIR TRANSPARAN:
          - Light Mode: Transparan 50% (bg-white/50) + Blur halus (backdrop-blur-md)
          - Dark Mode : Transparan gelap 80% (dark:bg-card/80)
        */}
        <Card className="w-full max-w-md overflow-hidden border border-white/40 dark:border-border/60 bg-white/50 dark:bg-card/80 backdrop-blur-md shadow-2xl my-auto text-card-foreground transition-all duration-300">
          <CardContent className="p-6">
            
            {/* Form Section */}
            <form
              className="flex flex-col justify-center"
              onSubmit={(e) => e.preventDefault()}
            >
              <FieldGroup className="gap-2.5">
                {/* Header Branding LSP */}
                <div className="flex flex-col items-center gap-1 text-center mb-1">
                  <div className="flex items-center gap-2">
                    <div className="relative h-9 w-9">
                      <Image
                        src="/Logo/Logo2.png"
                        alt="Logo LSP Teknologi Terampil"
                        fill
                        className="object-contain"
                        priority
                      />
                    </div>
                    <span className="text-lg font-bold tracking-tight text-foreground">
                      LSP <span className="text-primary">Teknologi Terampil</span>
                    </span>
                  </div>
                  <h1 className="text-xl font-bold tracking-tight text-foreground">Buat Akun Asesi</h1>
                  <p className="text-xs text-balance text-muted-foreground">
                    Lengkapi data diri Anda untuk memulai pendaftaran sertifikasi
                  </p>
                </div>

                {/* Input Nama Lengkap */}
                <Field className="gap-1">
                  <FieldLabel htmlFor="fullname" className="text-xs text-foreground font-medium">
                    Nama Lengkap (Sesuai KTP)
                  </FieldLabel>
                  <Input
                    id="fullname"
                    type="text"
                    placeholder="Contoh: Budi Santoso"
                    required
                    className="h-8 text-xs bg-white/40 dark:bg-background/50 border-white/60 dark:border-input text-foreground placeholder:text-muted-foreground focus:border-primary"
                  />
                </Field>

                {/* Input NIK & No. WhatsApp */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <Field className="gap-1">
                    <FieldLabel htmlFor="nik" className="text-xs text-foreground font-medium">
                      NIK / No. KTP
                    </FieldLabel>
                    <Input
                      id="nik"
                      type="text"
                      maxLength={16}
                      placeholder="3271012345678901"
                      required
                      className="h-8 text-xs bg-white/40 dark:bg-background/50 border-white/60 dark:border-input text-foreground placeholder:text-muted-foreground focus:border-primary"
                    />
                  </Field>
                  <Field className="gap-1">
                    <FieldLabel htmlFor="phone" className="text-xs text-foreground font-medium">
                      No. WhatsApp
                    </FieldLabel>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="081234567890"
                      required
                      className="h-8 text-xs bg-white/40 dark:bg-background/50 border-white/60 dark:border-input text-foreground placeholder:text-muted-foreground focus:border-primary"
                    />
                  </Field>
                </div>

                {/* Input Email */}
                <Field className="gap-1">
                  <FieldLabel htmlFor="email" className="text-xs text-foreground font-medium">
                    Email Aktif
                  </FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="nama@email.com"
                    required
                    className="h-8 text-xs bg-white/40 dark:bg-background/50 border-white/60 dark:border-input text-foreground placeholder:text-muted-foreground focus:border-primary"
                  />
                  <FieldDescription className="text-[10px] leading-tight text-muted-foreground">
                    Notifikasi jadwal uji dan sertifikat akan dikirim ke email ini.
                  </FieldDescription>
                </Field>

                {/* Input Password & Konfirmasi Password */}
                <Field className="gap-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <Field className="gap-1">
                      <FieldLabel htmlFor="password" className="text-xs text-foreground font-medium">
                        Kata Sandi
                      </FieldLabel>
                      <Input
                        id="password"
                        type="password"
                        required
                        className="h-8 text-xs bg-white/40 dark:bg-background/50 border-white/60 dark:border-input text-foreground focus:border-primary"
                      />
                    </Field>
                    <Field className="gap-1">
                      <FieldLabel htmlFor="confirm-password" className="text-xs text-foreground font-medium">
                        Ulangi Kata Sandi
                      </FieldLabel>
                      <Input
                        id="confirm-password"
                        type="password"
                        required
                        className="h-8 text-xs bg-white/40 dark:bg-background/50 border-white/60 dark:border-input text-foreground focus:border-primary"
                      />
                    </Field>
                  </div>
                </Field>

                {/* Tombol Submit */}
                <Field className="pt-1">
                  <Button
                    type="submit"
                    className="w-full h-9 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer shadow-md"
                  >
                    Daftar Akun Sertifikasi
                  </Button>
                </Field>

                <FieldDescription className="text-center text-xs pt-0.5 text-muted-foreground">
                  Sudah memiliki akun Asesi?{" "}
                  <Link
                    href="/Masuk"
                    className="font-semibold text-primary underline underline-offset-2 hover:text-primary/80"
                  >
                    Masuk Sekarang
                  </Link>
                </FieldDescription>
              </FieldGroup>
            </form>

          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full py-2 text-center text-[11px] text-foreground/80 shrink-0 bg-white/30 dark:bg-black/40 backdrop-blur-md transition-colors duration-200 border-t border-white/20 dark:border-border">
        Dengan mendaftar, Anda menyetujui{" "}
        <Link href="#" className="underline underline-offset-2 hover:text-foreground">
          Syarat &amp; Ketentuan
        </Link>{" "}
        serta{" "}
        <Link href="#" className="underline underline-offset-2 hover:text-foreground">
          Kebijakan Privasi
        </Link>{" "}
        LSP Teknologi Terampil.
      </footer>
    </div>
  );
}