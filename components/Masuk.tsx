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

export default function MasukForm() {
  return (
    <div 
      className="relative min-h-screen w-full flex flex-col justify-between bg-cover bg-center bg-no-repeat text-foreground overflow-hidden" 
      style={{ backgroundImage: "url('/Hero/Foto1.png')" }}
    >
      
      {/* 
        OVERLAY BACKGROUND:
        - Light Mode: Sangat transparan (bg-white/10) + Blur halus (backdrop-blur-sm)
        - Dark Mode : Kegelapan sedang (dark:bg-black/70) + Blur halus
      */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm dark:bg-black/70 dark:backdrop-blur-sm z-0 transition-all duration-300" />

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4">
        {/* CARD FORMULIR TRANSPARAN */}
        <Card className="w-full max-w-md overflow-hidden border border-white/40 dark:border-border/60 bg-white/50 dark:bg-card/80 backdrop-blur-md shadow-2xl my-auto text-card-foreground transition-all duration-300">
          <CardContent className="p-6">
            
            {/* Form Section */}
            <form
              className="flex flex-col justify-center"
              onSubmit={(e) => e.preventDefault()}
            >
              <FieldGroup className="gap-3">
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
                  <h1 className="text-xl font-bold tracking-tight text-foreground">Masuk Akun Asesi</h1>
                  <p className="text-xs text-balance text-muted-foreground">
                    Masukkan email dan kata sandi Anda untuk mengakses portal sertifikasi
                  </p>
                </div>

                {/* Input Email / NIK */}
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
                </Field>

                {/* Input Password */}
                <Field className="gap-1">
                  <div className="flex items-center justify-between">
                    <FieldLabel htmlFor="password" className="text-xs text-foreground font-medium">
                      Kata Sandi
                    </FieldLabel>
                    <Link
                      href="#"
                      className="text-[11px] font-medium text-primary hover:underline"
                    >
                      Lupa kata sandi?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    required
                    className="h-8 text-xs bg-white/40 dark:bg-background/50 border-white/60 dark:border-input text-foreground focus:border-primary"
                  />
                </Field>

                {/* Tombol Submit */}
                <Field className="pt-2">
                  <Button
                    type="submit"
                    className="w-full h-9 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer shadow-md"
                  >
                    Masuk Sekarang
                  </Button>
                </Field>

                <FieldDescription className="text-center text-xs pt-1 text-muted-foreground">
                  Belum memiliki akun Asesi?{" "}
                  <Link
                    href="/pendaftaran"
                    className="font-semibold text-primary underline underline-offset-2 hover:text-primary/80"
                  >
                    Daftar Akun Baru
                  </Link>
                </FieldDescription>
              </FieldGroup>
            </form>

          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full py-2 text-center text-[11px] text-foreground/80 shrink-0 bg-white/30 dark:bg-black/40 backdrop-blur-md transition-colors duration-200 border-t border-white/20 dark:border-border">
        Dengan masuk, Anda menyetujui{" "}
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