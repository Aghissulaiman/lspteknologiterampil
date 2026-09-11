"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Award,
  Loader2,
  RefreshCcw,
  CalendarDays,
  ShieldCheck,
  FileDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/lib/auth";
import type { SertifikatSaya as SertifikatItem } from "@/lib/asesi";
import { asesi, errorMessage } from "@/lib/asesi";

function formatTanggal(value: string | null | undefined): string {
  if (!value) return "-";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function masihAktif(tanggalKadaluarsa: string | undefined): boolean {
  if (!tanggalKadaluarsa) return true;
  return new Date(tanggalKadaluarsa) > new Date();
}

export default function SertifikatSaya() {
  const router = useRouter();
  const [list, setList] = useState<SertifikatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await asesi.getSertifikatSaya();
      setList(data || []);
    } catch (err: unknown) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      router.replace("/auth/masuk");
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const data = await asesi.getSertifikatSaya();
        if (cancelled) return;
        setList(data || []);
        setError(null);
      } catch (err: unknown) {
        if (!cancelled) setError(errorMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 rounded-2xl border border-border/60 bg-gradient-to-br from-primary/10 via-background to-background p-6 sm:p-8 mb-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">
            Sertifikat Saya
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            {list.length} Sertifikat Kompetensi
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Sertifikat yang telah diterbitkan LSP Teknologi Terampil atas nama Anda.
          </p>
        </div>
        <Button variant="outline" onClick={load} className="self-start sm:self-auto">
          <RefreshCcw className="h-4 w-4" /> Muat Ulang
        </Button>
      </div>

      {error && (
        <p className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-500">
          {error}
        </p>
      )}

      {list.length === 0 && (
        <Card className="py-14 text-center">
          <CardContent>
            <Award className="mx-auto h-10 w-10 text-muted-foreground/40" />
            <p className="mt-3 text-sm font-medium text-foreground">Belum ada sertifikat</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Sertifikat akan muncul di sini setelah Anda menyelesaikan asesmen dan lulus uji kompetensi.
            </p>
            <Button className="mt-5" onClick={() => router.push("/home/jadwal")}>
              Cari Jadwal Uji Kompetensi
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {list.map((s) => {
          const aktif = masihAktif(s.tanggal_kadaluarsa) && s.status === "AKTIF";
          return (
            <Card
              key={s.id}
              className={`group/card relative overflow-hidden ${
                aktif ? "" : "opacity-80"
              }`}
            >
              <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="font-mono text-sm">{s.nomor_sertifikat}</CardTitle>
                      <CardDescription className="mt-0.5 flex items-center gap-1">
                        <ShieldCheck className="h-3 w-3" /> No. Registrasi: {s.no_registrasi}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant={aktif ? "success" : "warning"}>
                    {aktif ? "Aktif" : "Kadaluarsa"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2.5 text-sm">
                <div>
                  <p className="text-xs font-medium text-foreground">Skema</p>
                  <p className="text-muted-foreground">
                    {s.nama_skema} <span className="text-xs">({s.kode_skema})</span>
                  </p>
                  {s.level_kkni && (
                    <p className="text-[11px] text-muted-foreground">Level KKNI {s.level_kkni}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <p className="flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5 text-primary shrink-0" />
                    Terbit: {formatTanggal(s.tanggal_terbit)}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5 text-primary shrink-0" />
                    Sampai: {formatTanggal(s.tanggal_kadaluarsa)}
                  </p>
                </div>
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <FileDown className="h-3.5 w-3.5 shrink-0" />
                  No. Blanko: {s.no_blanko || "-"}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </main>
  );
}