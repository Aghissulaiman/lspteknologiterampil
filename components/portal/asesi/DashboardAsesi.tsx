"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  ClipboardList,
  FileCheck2,
  Award,
  ArrowRight,
  Clock,
  Users,
  MapPin,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/lib/auth";
import { asesi, errorMessage, JadwalTersedia, PendaftaranSaya, SertifikatSaya } from "@/lib/asesi";

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

export default function DashboardAsesi() {
  const router = useRouter();
  const user = auth.getStoredUser();
  const [jadwal, setJadwal] = useState<JadwalTersedia[]>([]);
  const [pendaftaran, setPendaftaran] = useState<PendaftaranSaya[]>([]);
  const [sertifikat, setSertifikat] = useState<SertifikatSaya[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      router.replace("/auth/masuk");
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const [j, p, s] = await Promise.all([
          asesi.getJadwalTersedia(),
          asesi.getPendaftaranSaya(),
          asesi.getSertifikatSaya(),
        ]);
        if (cancelled) return;
        setJadwal(j || []);
        setPendaftaran(p || []);
        setSertifikat(s || []);
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

  const nama = user?.profile?.nama_lengkap || user?.email || "Peserta";
  const jumlahDraft = pendaftaran.filter((p) => p.status === "DRAFT").length;
  const jumlahDiajukan = pendaftaran.filter((p) => p.status === "SUBMITTED").length;
  const jumlahTerverifikasi = pendaftaran.filter((p) => p.status === "VERIFIED").length;
  const jumlahPerluPerbaikan = pendaftaran.filter((p) => p.status === "REVISION_NEEDED").length;
  const jumlahSertifikatAktif = sertifikat.filter((s) => s.status === "AKTIF").length;

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Hero */}
      <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-primary/10 via-background to-background p-6 sm:p-8 mb-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">
          Dashboard Peserta
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Halo, {nama} 👋
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Pantau pendaftaran sertifikasi, cari jadwal uji kompetensi, dan unduh sertifikat Anda dari satu tempat.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-primary" />
              Pendaftaran
            </CardTitle>
            <CardDescription>Total Anda</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">{pendaftaran.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-500" />
              Menunggu / Draft
            </CardTitle>
            <CardDescription>Belum diproses</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">
              {jumlahDraft + jumlahDiajukan + jumlahPerluPerbaikan}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck2 className="h-4 w-4 text-emerald-500" />
              Terverifikasi
            </CardTitle>
            <CardDescription>Pendaftaran disetujui</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">{jumlahTerverifikasi}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" />
              Sertifikat Aktif
            </CardTitle>
            <CardDescription>Milik Anda</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">{jumlahSertifikatAktif}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Jadwal tersedia */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-primary" />
              Jadwal Uji Terbuka
            </h2>
            <Link
              href="/home/jadwal"
              className="text-xs font-medium text-primary inline-flex items-center gap-1 hover:underline"
            >
              Lihat semua <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {jadwal.length === 0 && (
              <Card>
                <CardContent className="text-sm text-muted-foreground py-6 text-center">
                  Belum ada jadwal terbuka. Silakan cek kembali nanti.
                </CardContent>
              </Card>
            )}
            {jadwal.slice(0, 4).map((j) => (
              <Link key={j.id} href="/home/jadwal" className="block">
                <Card className="hover:border-primary/40 hover:shadow-md transition-all">
                  <CardContent className="py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{j.nama_skema}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
                          <MapPin className="h-3 w-3 shrink-0" />
                          {j.nama_tuk}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {formatTanggal(j.tanggal_mulai)} — {formatTanggal(j.tanggal_selesai)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Users className="h-3.5 w-3.5" />
                          {j.terisi}/{j.kuota}
                        </div>
                        <Badge variant={j.terisi >= j.kuota ? "destructive" : "success"}>
                          {j.terisi >= j.kuota ? "Penuh" : "Terbuka"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Pendaftaran terakhir */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-primary" />
              Pendaftaran Terakhir
            </h2>
            <Link
              href="/home/pendaftaran"
              className="text-xs font-medium text-primary inline-flex items-center gap-1 hover:underline"
            >
              Lihat semua <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {pendaftaran.length === 0 && (
              <Card>
                <CardContent className="text-sm text-muted-foreground py-6 text-center">
                  Anda belum mendaftar uji kompetensi apa pun.
                </CardContent>
              </Card>
            )}
            {pendaftaran.slice(0, 4).map((p) => (
              <Link key={p.id} href={`/home/pendaftaran/${p.id}`} className="block">
                <Card className="hover:border-primary/40 hover:shadow-md transition-all">
                  <CardContent className="py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {p.kode_pendaftaran} · {p.nama_skema}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {formatTanggal(p.tanggal_mulai)} — {formatTanggal(p.tanggal_selesai)}
                        </p>
                      </div>
                      <Badge variant={STATUS_STYLE[p.status] || "muted"}>
                        {asesi.statusLabel(p.status)}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}