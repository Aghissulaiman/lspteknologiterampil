"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ClipboardCheck, ShieldCheck, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type LoginRole = "participant" | "assessor" | "admin_lsp";

const roleOptions: { value: LoginRole; label: string; Icon: typeof UserRound }[] = [
  { value: "participant", label: "Asesi", Icon: UserRound },
  { value: "assessor", label: "Asesor", Icon: ClipboardCheck },
  { value: "admin_lsp", label: "Admin", Icon: ShieldCheck },
];

const roleDestinations: Record<LoginRole, string> = {
  participant: "/dashboard",
  assessor: "/asesor",
  admin_lsp: "/admin",
};

export default function MasukForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRole, setSelectedRole] = useState<LoginRole>("participant");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.get("email"), password: formData.get("password"), role: selectedRole }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Tidak dapat masuk.");
      router.push(roleDestinations[selectedRole]);
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Terjadi kesalahan. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="relative min-h-screen w-full flex flex-col justify-between bg-cover bg-center bg-no-repeat text-foreground overflow-hidden"
      style={{ backgroundImage: "url('/Hero/Foto1.png')" }}
    >
      {/* OVERLAY BACKGROUND */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm dark:bg-black/70 dark:backdrop-blur-sm z-0 transition-all duration-300" />

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4">
        {/* CARD FORMULIR TRANSPARAN */}
        <Card className="w-full max-w-md overflow-hidden border border-white/40 dark:border-border/60 bg-white/50 dark:bg-card/80 backdrop-blur-md shadow-2xl my-auto text-card-foreground transition-all duration-300">
          <CardContent className="p-6">
            {/* Form Section */}
            <form
              className="flex flex-col justify-center"
              onSubmit={handleSubmit}
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
                      LSP{" "}
                      <span className="text-primary">Teknologi Terampil</span>
                    </span>
                  </div>
                  <h1 className="text-xl font-bold tracking-tight text-foreground">
                    Masuk ke Akun
                  </h1>
                  <p className="text-xs text-balance text-muted-foreground">
                    Pilih peran Anda dan masukkan akun untuk melanjutkan
                  </p>
                </div>

                <fieldset className="space-y-1.5">
                  <legend className="text-xs font-medium text-foreground">
                    Pilih Peran Anda
                  </legend>
                  <div className="grid grid-cols-3 gap-2">
                    {roleOptions.map(({ value, label, Icon }) => {
                      const isSelected = selectedRole === value;

                      return (
                        <label key={value} className="relative block cursor-pointer">
                          <input
                            type="radio"
                            name="role"
                            value={value}
                            checked={isSelected}
                            onChange={() => setSelectedRole(value)}
                            required
                            className="peer sr-only"
                          />
                          <span
                            className={`flex min-h-[76px] flex-col items-center justify-center gap-1.5 rounded-lg border px-2 py-2 text-center transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2 ${
                              isSelected
                                ? "border-primary bg-primary/5 text-primary"
                                : "border-border bg-background/60 text-muted-foreground hover:border-primary/50 hover:text-foreground"
                            }`}
                          >
                            <Icon className="h-5 w-5" aria-hidden="true" />
                            <span className="text-[11px] font-semibold leading-tight">
                              {label}
                            </span>
                          </span>
                          <span className="absolute right-1.5 top-1.5 hidden h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground peer-checked:flex" aria-hidden="true">
                            ✓
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>

                {/* Input Khusus Email */}
                <Field className="gap-1">
                  <FieldLabel
                    htmlFor="email"
                    className="text-xs text-foreground font-medium"
                  >
                    Email Aktif
                  </FieldLabel>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="nama@email.com"
                    required
                    autoComplete="email"
                    className="h-8 text-xs bg-white/40 dark:bg-background/50 border-white/60 dark:border-input text-foreground placeholder:text-muted-foreground focus:border-primary"
                  />
                </Field>

                {/* Input Password */}
                <Field className="gap-1">
                  <div className="flex items-center justify-between">
                    <FieldLabel
                      htmlFor="password"
                      className="text-xs text-foreground font-medium"
                    >
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
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    className="h-8 text-xs bg-white/40 dark:bg-background/50 border-white/60 dark:border-input text-foreground focus:border-primary"
                  />
                </Field>

                {error && <p role="alert" className="text-xs font-medium text-red-600">{error}</p>}

                {/* Tombol Submit Navigasi */}
                <Field className="pt-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-9 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer shadow-md"
                  >
                    {isSubmitting ? "Memeriksa akun..." : "Masuk Sekarang"}
                  </Button>
                </Field>

                <FieldDescription className="text-center text-xs pt-1 text-muted-foreground">
                  Belum memiliki akun Asesi?{" "}
                  <Link
                    href="/auth/pendaftaran"
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
        <Link
          href="#"
          className="underline underline-offset-2 hover:text-foreground"
        >
          Syarat &amp; Ketentuan
        </Link>{" "}
        serta{" "}
        <Link
          href="#"
          className="underline underline-offset-2 hover:text-foreground"
        >
          Kebijakan Privasi
        </Link>{" "}
        LSP Teknologi Terampil.
      </footer>
    </div>
  );
}
