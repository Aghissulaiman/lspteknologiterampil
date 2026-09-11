"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  MapPin,
  Users,
  Wallet,
  Timer,
  Loader2,
  ClipboardCheck,
  CheckCircle2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth } from "@/lib/auth";
import type { JadwalTersedia as JadwalItem } from "@/lib/asesi";
import { asesi, errorMessage, PendaftaranSaya } from "@/lib/asesi";

function formatTanggal(value: string | null | undefined): string {
  if (!value) return "-";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("id-ID", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatHarga(value: number | null | undefined): string {
  if (!value) return "Gratis";
  return `Rp ${value.toLocaleString("id-ID")}`;
}

export default function JadwalTersedia() {
  const router = useRouter();
  const [jadwal, setJadwal] = useState<JadwalItem[]>([]);
  const [pendaftaranList, setPendaftaranList] = useState<PendaftaranSaya[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selected, setSelected] = useState<JadwalItem | null>(null);
  const [tujuan, setTujuan] = useState("Sertifikasi");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState<PendaftaranSaya | null>(null);

  const load = async () => {
    try {
      const [j, p] = await Promise.all([
        asesi.getJadwalTersedia(),
        asesi.getPendaftaranSaya(),
      ]);
      setJadwal(j || []);
      setPendaftaranList(p || []);
      setError(null);
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
        const [j, p] = await Promise.all([
          asesi.getJadwalTersedia(),
          asesi.getPendaftaranSaya(),
        ]);
        if (cancelled) return;
        setJadwal(j || []);
        setPendaftaranList(p || []);
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

  const sudahDaftar = (jadwalId: string) =>
    pendaftaranList.some((p) => p.jadwal_id === jadwalId);

  const openModal = (j: JadwalItem) => {
    setTujuan("Sertifikasi");
    setSubmitError(null);
    setSuccess(null);
    setSelected(j);
  };

  const handleDaftar = async () => {
    if (!selected) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const created = await asesi.daftarPendaftaran(selected.id, tujuan);
      setSuccess(created);
      await load();
    } catch (err: unknown) {
      setSubmitError(errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error && jadwal.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-primary/10 via-background to-background p-6 sm:p-8 mb-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">
          Pendaftaran Uji Kompetensi
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Jadwal Tersedia</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Pilih jadwal asesmen yang masih terbuka, lalu daftarkan diri Anda. Kuota terbatas — jangan sampai terlewat.
        </p>
      </div>

      {error && (
        <p className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-500">
          {error}
        </p>
      )}

      {jadwal.length === 0 && (
        <Card className="py-14 text-center">
          <CardContent>
            <CalendarDays className="mx-auto h-10 w-10 text-muted-foreground/40" />
            <p className="mt-3 text-sm text-muted-foreground">
              Belum ada jadwal uji kompetensi yang terbuka untuk saat ini.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {jadwal.map((j) => {
          const full = j.terisi >= j.kuota;
          const terdaftar = sudahDaftar(j.id);
          return (
            <Card key={j.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-base leading-snug">{j.nama_skema}</CardTitle>
                  <Badge variant={terdaftar ? "success" : full ? "destructive" : "success"}>
                    {terdaftar ? "Terdaftar" : full ? "Penuh" : "Terbuka"}
                  </Badge>
                </div>
                <CardDescription className="flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                  {formatTanggal(j.tanggal_mulai)} — {formatTanggal(j.tanggal_selesai)}
                </CardDescription>
                <CardDescription className="flex items-center gap-1.5">
                  <Timer className="h-3.5 w-3.5 shrink-0" />
                  {j.jam_mulai || "-"} — {j.jam_selesai || "-"} WIB
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-2.5 text-sm">
                  <p className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 shrink-0 text-primary" />
                    <span className="truncate">{j.nama_tuk}</span>
                  </p>
                  <p className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4 shrink-0 text-primary" />
                    Kuota: <strong className="text-foreground">{j.terisi}/{j.kuota}</strong> peserta terisi
                  </p>
                  <p className="flex items-center gap-2 text-muted-foreground">
                    <Wallet className="h-4 w-4 shrink-0 text-primary" />
                    Biaya: <strong className="text-foreground">{formatHarga(j.biaya)}</strong>
                  </p>
                  <p className="text-xs text-muted-foreground">Kode Jadwal: {j.kode_jadwal}</p>
                </div>
              </CardContent>
              <div className="px-(--card-spacing) pb-(--card-spacing)">
                <Button
                  className="w-full"
                  size="lg"
                  disabled={full || terdaftar}
                  onClick={() => openModal(j)}
                >
                  {terdaftar ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" /> Sudah Terdaftar
                    </>
                  ) : (
                    <>
                      <ClipboardCheck className="h-4 w-4" /> Daftar Sekarang
                    </>
                  )}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Modal Konfirmasi */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelected(null)}>
          <div
            className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-foreground">Konfirmasi Pendaftaran</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {selected.nama_skema} · {formatTanggal(selected.tanggal_mulai)}
                </p>
              </div>
              <Button variant="ghost" size="icon" className="shrink-0" onClick={() => setSelected(null)} aria-label="Tutup">
                <X className="h-4 w-4" />
              </Button>
            </div>

            {success ? (
              <div className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-center">
                <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500" />
                <p className="mt-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  Pendaftaran berhasil dibuat!
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Kode: {success.kode_pendaftaran}. Lengkapi bukti kelengkapan lalu kirim pendaftaran Anda.
                </p>
                <Button
                  className="mt-4 w-full"
                  onClick={() => {
                    router.push(`/home/pendaftaran/${success.id}`);
                  }}
                >
                  Lanjut ke Pendaftaran {success.kode_pendaftaran}
                </Button>
              </div>
            ) : (
              <>
                <div className="mt-5 space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="tujuan">Tujuan Asesmen</Label>
                    <Input
                      id="tujuan"
                      value={tujuan}
                      onChange={(e) => setTujuan(e.target.value)}
                      placeholder="Contoh: Sertifikasi"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Anda akan membuat pendaftaran APL-01 berstatus <strong>Draft</strong>. Setelah itu lengkapi
                    bukti kelengkapan dan kirim untuk diverifikasi admin.
                  </p>
                </div>

                {submitError && (
                  <p className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-500">
                    {submitError}
                  </p>
                )}

                <div className="mt-6 flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setSelected(null)}>
                    Batal
                  </Button>
                  <Button
                    className="flex-1"
                    disabled={submitting}
                    onClick={handleDaftar}
                  >
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ya, Daftar"}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
