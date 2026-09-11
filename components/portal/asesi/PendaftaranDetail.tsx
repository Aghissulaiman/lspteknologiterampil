"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FileUp,
  Loader2,
  ChevronLeft,
  Send,
  Upload,
  FileText,
  CheckCircle2,
  ShieldCheck,
  ClipboardCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth } from "@/lib/auth";
import { ApiError } from "@/lib/api";
import {
  asesi,
  errorMessage,
  DetailPendaftaran,
  Bukti,
  UnitKompetensi,
  Apl02,
} from "@/lib/asesi";

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

function formatBytes(value: number | null | undefined): string {
  if (!value) return "-";
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

const STATUS_STYLE: Record<string, "muted" | "warning" | "success" | "destructive"> = {
  DRAFT: "muted",
  SUBMITTED: "warning",
  VERIFIED: "success",
  REVISION_NEEDED: "destructive",
};

const JENIS_DOKUMEN = [
  "KTP",
  "Ijazah",
  "Transkrip Nilai",
  "Sertifikat Pelatihan",
  "Portofolio",
  "Surat Keterangan Kerja",
  "Pas Foto",
  "Lainnya",
];

interface ParsedKuk {
  kuk_id: string;
  unit_id: string;
  pernyataan_kuk: string;
  urutan: number;
  asesi_mengaku_kompeten: boolean;
}

export default function PendaftaranDetail({
  id,
}: {
  id: string;
}) {
  const router = useRouter();
  const [data, setData] = useState<DetailPendaftaran | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // upload bukti
  const [file, setFile] = useState<File | null>(null);
  const [jenisDokumen, setJenisDokumen] = useState(JENIS_DOKUMEN[0]);
  const [namaDokumen, setNamaDokumen] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // submit
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState<string | null>(null);

  // APL-02
  const [units, setUnits] = useState<UnitKompetensi[]>([]);
  const [loadedCompetency, setLoadedCompetency] = useState(false);
  const [kukState, setKukState] = useState<Record<string, boolean>>({});
  const [apl02, setApl02] = useState<Apl02 | null>(null);
  const [apl02Saving, setApl02Saving] = useState(false);
  const [apl02Msg, setApl02Msg] = useState<string | null>(null);
  const [apl02Error, setApl02Error] = useState<string | null>(null);

  const loadKompetensi = async (skemaId: string, cancelled: () => boolean) => {
    try {
      const unitsData = await asesi.getKompetensi(skemaId);
      if (cancelled()) return;
      setUnits(unitsData || []);

      const initial: Record<string, boolean> = {};
      unitsData?.forEach((u) =>
        u.elemen?.forEach((el) =>
          el.kuk?.forEach((k) => {
            initial[k.kuk_id] = k.asesi_mengaku_kompeten ?? true;
          })
        )
      );
      setKukState(initial);

      try {
        const existing = await asesi.getApl02(id);
        if (cancelled()) return;
        setApl02(existing);
        if (existing?.detail_kuk?.length) {
          const mapped: Record<string, boolean> = {};
          existing.detail_kuk.forEach((d) => {
            mapped[d.kuk_id] = d.asesi_mengaku_kompeten;
          });
          setKukState(mapped);
        }
      } catch {
        setApl02(null);
      }
    } catch (err: unknown) {
      if (!cancelled()) setApl02Error(errorMessage(err));
    } finally {
      if (!cancelled()) setLoadedCompetency(true);
    }
  };

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      router.replace("/auth/masuk");
      return;
    }

    let cancelled = false;
    const isCancelled = () => cancelled;
    (async () => {
      try {
        const d = await asesi.getDetailPendaftaran(id);
        if (cancelled) return;
        setData(d);
        if (d.status === "VERIFIED" && d.skema_id) {
          await loadKompetensi(d.skema_id, isCancelled);
        }
      } catch (err: unknown) {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 404) {
          setError("Pendaftaran tidak ditemukan.");
        } else {
          setError(errorMessage(err));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, router]);

  const handleUpload = async () => {
    if (!file) {
      setUploadError("Pilih file terlebih dahulu.");
      return;
    }
    setUploading(true);
    setUploadError(null);
    setUploadMsg(null);
    try {
      const created = await asesi.uploadBukti(id, file, jenisDokumen, namaDokumen || undefined);
      setUploadMsg(`File "${created.nama_dokumen}" berhasil diunggah.`);
      setFile(null);
      setNamaDokumen("");
      const d = await asesi.getDetailPendaftaran(id);
      setData(d);
    } catch (err: unknown) {
      setUploadError(errorMessage(err));
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitMsg(null);
    try {
      const updated = await asesi.submitPendaftaran(id);
      setData({ ...data!, ...updated } as DetailPendaftaran);
      setSubmitMsg("Pendaftaran berhasil dikirim untuk diverifikasi.");
    } catch (err: unknown) {
      setSubmitMsg(`Gagal: ${errorMessage(err)}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveApl02 = async () => {
    const detail: ParsedKuk[] = [];
    units.forEach((u) =>
      u.elemen?.forEach((el) =>
        el.kuk?.forEach((k) => {
          detail.push({
            kuk_id: k.kuk_id,
            unit_id: u.unit_id,
            pernyataan_kuk: k.pernyataan_kuk,
            urutan: k.urutan,
            asesi_mengaku_kompeten: kukState[k.kuk_id] ?? true,
          });
        })
      )
    );

    if (detail.length === 0) {
      setApl02Error("Skema belum memiliki daftar KUK untuk diisi.");
      return;
    }

    setApl02Saving(true);
    setApl02Error(null);
    setApl02Msg(null);
    try {
      const result = await asesi.submitApl02(
        id,
        detail.map((d) => ({
          kuk_id: d.kuk_id,
          unit_id: d.unit_id,
          asesi_mengaku_kompeten: d.asesi_mengaku_kompeten,
        }))
      );
      setApl02(result);
      setApl02Msg("Asesmen mandiri (APL-02) berhasil disimpan.");
    } catch (err: unknown) {
      setApl02Error(errorMessage(err));
    } finally {
      setApl02Saving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-sm text-red-500">{error}</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push("/home/pendaftaran")}>
          <ChevronLeft className="h-4 w-4" /> Kembali
        </Button>
      </main>
    );
  }

  const buktiList: Bukti[] = data.bukti_kelengkapan || [];
  const verifiedCount = buktiList.filter((b) => b.is_valid).length;
  const canSubmit = data.status === "DRAFT";

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <Link
        href="/home/pendaftaran"
        className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-primary transition-colors mb-6"
      >
        <ChevronLeft className="h-3.5 w-3.5" /> Kembali ke Pendaftaran Saya
      </Link>

      {/* Header */}
      <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-primary/10 via-background to-background p-6 sm:p-8 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-primary mb-1.5">
              APL-01 · {data.kode_pendaftaran}
            </p>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">{data.nama_skema}</h1>
            <p className="mt-1.5 text-xs text-muted-foreground">
              Jadwal {formatTanggal(data.tanggal_mulai)} — {formatTanggal(data.tanggal_selesai)} ·{" "}
              {data.nama_tuk} · Tujuan: {data.tujuan_asesmen}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={STATUS_STYLE[data.status] || "muted"} className="px-3 py-1.5 text-xs">
              {asesi.statusLabel(data.status)}
            </Badge>
          </div>
        </div>

        {data.alasan_reject && (
          <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-600 dark:text-red-400">
            <strong>Alasan perbaikan:</strong> {data.alasan_reject}
          </div>
        )}

        {submitMsg && (
          <div
            className={`mt-4 rounded-xl border px-4 py-3 text-xs ${
              submitMsg.startsWith("Gagal")
                ? "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400"
                : "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            }`}
          >
            {submitMsg}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bukti Kelengkapan */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileUp className="h-4 w-4 text-primary" />
              Bukti Kelengkapan
            </CardTitle>
            <CardDescription>
              {verifiedCount}/{buktiList.length} dokumen tervalidasi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {buktiList.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  Belum ada dokumen. Unggah persyaratan seperti KTP, ijazah, atau sertifikat keahlian.
                </p>
              )}
              {buktiList.map((b) => (
                <div
                  key={b.id}
                  className="flex items-start justify-between gap-3 rounded-lg border border-border bg-muted/30 px-3.5 py-3"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <FileText className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">{b.nama_dokumen}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {b.jenis_dokumen} · {formatBytes(b.file_size)}
                      </p>
                      {b.catatan_validasi && (
                        <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1">
                          {b.catatan_validasi}
                        </p>
                      )}
                    </div>
                  </div>
                  {b.is_valid ? (
                    <Badge variant="success" className="shrink-0">
                      <CheckCircle2 className="h-3 w-3" /> Valid
                    </Badge>
                  ) : (
                    <Badge variant="warning" className="shrink-0">
                      Menunggu Validasi
                    </Badge>
                  )}
                </div>
              ))}
            </div>

            {/* Form Upload */}
            <div className="mt-5 rounded-lg border border-dashed border-border p-4">
              <p className="text-xs font-semibold text-foreground mb-3">Unggah Dokumen Baru</p>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor={`jenis-${data.id}`}>Jenis Dokumen</Label>
                  <select
                    id={`jenis-${data.id}`}
                    value={jenisDokumen}
                    onChange={(e) => setJenisDokumen(e.target.value)}
                    className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    {JENIS_DOKUMEN.map((j) => (
                      <option key={j} value={j}>
                        {j}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`nama-${data.id}`}>Nama Dokumen (opsional)</Label>
                  <Input
                    id={`nama-${data.id}`}
                    value={namaDokumen}
                    onChange={(e) => setNamaDokumen(e.target.value)}
                    placeholder="Contoh: Ijazah S1"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`file-${data.id}`}>File</Label>
                  <Input
                    id={`file-${data.id}`}
                    type="file"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                </div>

                {uploadMsg && (
                  <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-600 dark:text-emerald-400">
                    {uploadMsg}
                  </p>
                )}
                {uploadError && (
                  <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-500">
                    {uploadError}
                  </p>
                )}

                <Button
                  variant="outline"
                  className="w-full"
                  disabled={uploading}
                  onClick={handleUpload}
                >
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  {uploading ? "Mengunggah..." : "Unggah Dokumen"}
                </Button>
              </div>
            </div>

            {/* Submit */}
            {canSubmit && (
              <div className="mt-5 rounded-lg border border-border bg-muted/30 p-4">
                <p className="text-xs font-semibold text-foreground mb-1.5">Kirim Pendaftaran</p>
                <p className="text-[11px] text-muted-foreground mb-3">
                  Setelah lengkap, kirim pendaftaran Anda untuk divalidasi admin LSP. Status akan menjadi{" "}
                  <strong>Diajukan</strong>.
                </p>
                <Button className="w-full" disabled={submitting} onClick={handleSubmit}>
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  {submitting ? "Mengirim..." : "Kirim Pendaftaran"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* APL-02 Asesmen Mandiri */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardCheck className="h-4 w-4 text-primary" />
              Asesmen Mandiri (APL-02)
            </CardTitle>
            <CardDescription>
              Nyatakan apakah Anda mengaku kompeten pada setiap butir KUK skema ini.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {data.status !== "VERIFIED" && (
              <p className="rounded-lg border border-border bg-muted/30 px-3.5 py-3 text-xs text-muted-foreground">
                Asesmen mandiri dapat diisi setelah pendaftaran Anda <strong>Terverifikasi</strong> oleh
                admin LSP.
              </p>
            )}

            {data.status === "VERIFIED" && !loadedCompetency && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Memuat daftar kompetensi...
              </div>
            )}

            {data.status === "VERIFIED" && loadedCompetency && units.length === 0 && (
              <p className="rounded-lg border border-border bg-muted/30 px-3.5 py-3 text-xs text-muted-foreground">
                Skema ini belum memiliki unit kompetensi / KUK yang terdaftar.
              </p>
            )}

            {data.status === "VERIFIED" &&
              loadedCompetency &&
              units.map((u) => (
                <div key={u.unit_id} className="mb-5">
                  <p className="text-sm font-semibold text-foreground">
                    {u.kode_unit} — {u.judul_unit}
                  </p>
                  {u.deskripsi && (
                    <p className="mt-0.5 text-[11px] text-muted-foreground">{u.deskripsi}</p>
                  )}
                  <div className="mt-2 space-y-2">
                    {u.elemen?.map((el) => (
                      <div key={el.elemen_id} className="rounded-lg border border-border bg-muted/20 px-3.5 py-3">
                        <p className="text-[11px] font-semibold text-primary uppercase tracking-wide mb-1.5">
                          Elemen {el.urutan}: {el.nama_elemen}
                        </p>
                        <div className="space-y-2">
                          {el.kuk?.map((k) => (
                            <label key={k.kuk_id} className="flex items-start gap-3 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={kukState[k.kuk_id] ?? true}
                                onChange={(e) =>
                                  setKukState((prev) => ({
                                    ...prev,
                                    [k.kuk_id]: e.target.checked,
                                  }))
                                }
                                className="mt-0.5 h-4 w-4 rounded border-input accent-[var(--primary)]"
                              />
                              <span className="text-xs text-foreground leading-relaxed">
                                {k.urutan}. {k.pernyataan_kuk}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

            {data.status === "VERIFIED" && loadedCompetency && units.length > 0 && (
              <div className="mt-2">
                {apl02Msg && (
                  <p className="mb-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-600 dark:text-emerald-400">
                    {apl02Msg}
                  </p>
                )}
                {apl02Error && (
                  <p className="mb-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-500">
                    {apl02Error}
                  </p>
                )}
                {apl02 && (
                  <div className="mb-3 flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3.5 py-3">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    <p className="text-[11px] text-muted-foreground">
                      APL-02 terakhir tersimpan: <strong>{asesi.statusLabel(apl02.status)}</strong>
                    </p>
                  </div>
                )}
                <Button
                  className="w-full"
                  disabled={apl02Saving}
                  onClick={handleSaveApl02}
                >
                  {apl02Saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ShieldCheck className="h-4 w-4" />
                  )}
                  {apl02Saving ? "Menyimpan..." : apl02 ? "Simpan Ulang APL-02" : "Simpan Asesmen Mandiri"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}