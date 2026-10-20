"use client";

import React, { useState } from "react";
import {
  Search,
  CheckCircle2,
  XCircle,
  Award,
  ShieldCheck,
  Download,
  QrCode,
  Calendar,
  User,
  Building2,
  FileBadge,
  RotateCcw,
  ExternalLink,
} from "lucide-react";

// Tipe Data Hasil Verifikasi
interface CertificateData {
  nomorRegistrasi: string;
  nomorSertifikat: string;
  namaLengkap: string;
  skemaKompetensi: string;
  bidang: string;
  status: "VALID" | "EXPIRED" | "NOT_FOUND";
  tanggalTerbit: string;
  tanggalMasaBerlaku: string;
  penerbit: string;
  asesor: string;
}

export default function VerifikasiSertifikat() {
  const [searchKey, setSearchKey] = useState("");
  const [isSearched, setIsSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CertificateData | null>(null);

  // Data Dummy untuk Simulasi Verifikasi
  const dummyDatabase: Record<string, CertificateData> = {
    "BNSP-2026-88912": {
      nomorRegistrasi: "BNSP-2026-88912",
      nomorSertifikat: "50300 2411 0001234 2026",
      namaLengkap: "Aghis Sulaiman",
      skemaKompetensi: "Software Engineering & Web Development Specialist",
      bidang: "Teknologi Informasi dan Komunikasi",
      status: "VALID",
      tanggalTerbit: "04 Agustus 2026",
      tanggalMasaBerlaku: "04 Agustus 2029",
      penerbit: "LSP Teknologi Digital / TUK Daring Center",
      asesor: "Master Asesor BNSP Team",
    },
    "BNSP-2026-11029": {
      nomorRegistrasi: "BNSP-2026-11029",
      nomorSertifikat: "50300 2411 0005678 2026",
      namaLengkap: "Nadya Cheril",
      skemaKompetensi: "Digital Marketing Manager",
      bidang: "Pemasaran Digital & Bisnis",
      status: "VALID",
      tanggalTerbit: "15 Juli 2026",
      tanggalMasaBerlaku: "15 Juli 2029",
      penerbit: "LSP Teknologi Digital / TUK Daring Center",
      asesor: "Tim Asesor Utama",
    },
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchKey.trim()) return;

    setLoading(true);
    setIsSearched(false);

    setTimeout(() => {
      const found = dummyDatabase[searchKey.trim()];
      if (found) {
        setResult(found);
      } else {
        setResult(null);
      }
      setLoading(false);
      setIsSearched(true);
    }, 600);
  };

  const handleReset = () => {
    setSearchKey("");
    setIsSearched(false);
    setResult(null);
  };

  return (
    <section className="py-12 lg:py-20 bg-background text-foreground relative overflow-hidden">
      {/* Visual Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl text-foreground">
            Verifikasi Keaslian Sertifikat
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Masukkan Nomor Registrasi BNSP atau Nomor Sertifikat untuk memastikan keaslian status kompetensi asesi.
          </p>
        </div>

        {/* Search Box Card */}
        <div className="bg-muted/20 border border-muted/30 p-6 sm:p-8 rounded-3xl space-y-6 shadow-sm">
          <form onSubmit={handleSearch} className="space-y-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Cari Berdasarkan Nomor Registrasi / Sertifikat
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchKey}
                  onChange={(e) => setSearchKey(e.target.value)}
                  placeholder="Contoh: BNSP-2026-88912"
                  className="w-full bg-background border border-muted/30 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                />
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto bg-primary text-primary-foreground px-6 py-3.5 rounded-2xl font-bold text-xs sm:text-sm hover:opacity-90 transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span>Memeriksa...</span>
                  ) : (
                    <>
                      <Search className="h-4 w-4" />
                      <span>Verifikasi</span>
                    </>
                  )}
                </button>
                {isSearched && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="p-3.5 rounded-2xl border border-muted/30 bg-background text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all"
                    title="Reset Pencarian"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </form>

          {/* Quick Helper / Demo Badges */}
          <div className="pt-4 border-t border-muted/20 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">Coba No. Registrasi Demo:</span>
            <button
              onClick={() => setSearchKey("BNSP-2026-88912")}
              className="px-2.5 py-1 rounded-lg bg-background border border-muted/30 font-mono text-[11px] hover:border-primary/50 transition-all text-primary"
            >
              BNSP-2026-88912
            </button>
            <button
              onClick={() => setSearchKey("BNSP-2026-11029")}
              className="px-2.5 py-1 rounded-lg bg-background border border-muted/30 font-mono text-[11px] hover:border-primary/50 transition-all text-primary"
            >
              BNSP-2026-11029
            </button>
          </div>
        </div>

        {/* Result State: TERDAPAT DATA */}
        {isSearched && result && (
          <div className="bg-background border-2 border-emerald-500/30 rounded-3xl p-6 sm:p-8 space-y-8 shadow-xl relative overflow-hidden">
            {/* Status Top Banner */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-muted/20">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                      Sertifikat Sah & Terverifikasi
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-foreground mt-1">
                    Status: KOMPETEN ({result.status})
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => window.print()}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-muted/30 hover:bg-muted/50 border border-muted/30 px-4 py-2.5 rounded-xl text-xs font-bold transition-all"
                >
                  <Download className="h-4 w-4 text-primary" />
                  <span>Cetak / Unduh Bukti</span>
                </button>
              </div>
            </div>

            {/* Certificate Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-primary" /> Nama Pemilik Sertifikat
                  </span>
                  <p className="text-lg font-black text-foreground">{result.namaLengkap}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="h-3.5 w-3.5 text-primary" /> Skema / Unit Kompetensi
                  </span>
                  <p className="text-sm font-bold text-foreground">{result.skemaKompetensi}</p>
                  <p className="text-xs text-muted-foreground">{result.bidang}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5 text-primary" /> Lembaga Sertifikasi (LSP/TUK)
                  </span>
                  <p className="text-xs font-semibold text-foreground">{result.penerbit}</p>
                </div>
              </div>

              <div className="space-y-4 bg-muted/10 p-5 rounded-2xl border border-muted/20">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <FileBadge className="h-3.5 w-3.5 text-primary" /> Nomor Registrasi & Sertifikat
                  </span>
                  <p className="text-xs font-mono font-bold text-primary">{result.nomorRegistrasi}</p>
                  <p className="text-xs font-mono text-muted-foreground">{result.nomorSertifikat}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-muted/20">
                  <div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> Tanggal Terbit
                    </span>
                    <p className="text-xs font-bold text-foreground mt-0.5">{result.tanggalTerbit}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> Masa Berlaku
                    </span>
                    <p className="text-xs font-bold text-foreground mt-0.5">{result.tanggalMasaBerlaku}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-muted/20 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Asesor Penguji:</span>
                  <span className="font-semibold text-foreground">{result.asesor}</span>
                </div>
              </div>
            </div>

            {/* Verification Footer Note */}
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2 text-muted-foreground">
                <QrCode className="h-5 w-5 text-primary shrink-0" />
                <span>Terdaftar resmi pada basis data sistem lisensi sertifikasi nasional.</span>
              </div>
              <a
                href="#"
                className="font-bold text-primary hover:underline shrink-0 inline-flex items-center gap-1"
              >
                <span>Lihat e-Sertifikat</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        )}

        {/* Result State: TIDAK DITEMUKAN */}
        {isSearched && !result && (
          <div className="bg-background border-2 border-rose-500/30 rounded-3xl p-8 text-center space-y-4 shadow-lg">
            <div className="p-4 rounded-full bg-rose-500/10 text-rose-500 w-16 h-16 mx-auto flex items-center justify-center">
              <XCircle className="h-10 w-10" />
            </div>
            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="text-lg font-black text-foreground">
                Sertifikat Tidak Ditemukan
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Nomor registrasi <span className="font-mono font-bold text-foreground">{searchKey}</span> tidak terdaftar dalam database kami. Silakan periksa kembali penulisan nomor registrasi atau hubungi Sekretariat TUK.
              </p>
            </div>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 bg-muted/30 hover:bg-muted/50 border border-muted/30 px-5 py-2.5 rounded-xl text-xs font-bold transition-all"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Coba Pencarian Lain</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}