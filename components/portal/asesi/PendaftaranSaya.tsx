"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ClipboardList,
  Loader2,
  ArrowRight,
  CalendarDays,
  MapPin,
  RefreshCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/lib/auth";
import { asesi, errorMessage, PendaftaranSaya as Pendaftaran } from "@/lib/asesi";

function formatTanggal(value: string | null | undefined): string {
  if (!value) return "-";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const STATUS_STYLE: Record<string, "muted" | "warning" | "success" | "destructive"> = {
  DRAFT: "muted",
  SUBMITTED: "warning",
  VERIFIED: "success",
  REVISION_NEEDED: "destructive",
};

export default function PendaftaranSaya() {
  const router = useRouter();
  const [list, setList] = useState<Pendaftaran[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await asesi.getPendaftaranSaya();
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
        const data = await asesi.getPendaftaranSaya();
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
            Pendaftaran Saya
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            {list.length} Pendaftaran Uji Kompetensi
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Kelola pendaftaran APL-01, lengkapi bukti, dan kirim untuk diverifikasi admin.
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
        <div className="space-y-4">
          <Card className="py-14 text-center">
            <CardContent>
              <ClipboardList className="mx-auto h-10 w-10 text-muted-foreground/40" />
              <p className="mt-3 text-sm font-medium text-foreground">Belum ada pendaftaran</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Anda belum mendaftar uji kompetensi. Mulai dari halaman jadwal yang tersedia.
              </p>
              <Button className="mt-5" onClick={() => router.push("/home/jadwal")}>
                Lihat Jadwal Tersedia <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {list.map((p) => (
          <Link key={p.id} href={`/home/pendaftaran/${p.id}`} className="block group">
            <Card className="h-full transition-all group-hover:border-primary/40 group-hover:shadow-md">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <CardTitle className="font-mono text-sm">{p.kode_pendaftaran}</CardTitle>
                    <CardDescription className="mt-0.5 truncate">{p.nama_skema}</CardDescription>
                  </div>
                  <Badge variant={STATUS_STYLE[p.status] || "muted"}>
                    {asesi.statusLabel(p.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="text-sm">
                <div className="space-y-2 text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <CalendarDays className="h-3.5 w-3.5 shrink-0 text-primary" />
                    {formatTanggal(p.tanggal_mulai)} — {formatTanggal(p.tanggal_selesai)}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
                    <span className="truncate">{p.nama_tuk}</span>
                  </p>
                  {p.alasan_reject && (
                    <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-500">
                      Alasan: {p.alasan_reject}
                    </p>
                  )}
                </div>
                <p className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary">
                  Buka detail <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}