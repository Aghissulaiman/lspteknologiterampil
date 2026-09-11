import { api } from "./api";

export function errorMessage(err: unknown, fallback = "Terjadi kesalahan. Coba lagi."): string {
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}

export interface JadwalTersedia {
  id: string;
  kode_jadwal: string;
  nama_jadwal: string;
  skema_id: string;
  tuk_id: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  jam_mulai: string | null;
  jam_selesai: string | null;
  kuota: number;
  terisi: number;
  is_open: boolean;
  biaya: number | null;
  nama_skema: string;
  nama_tuk: string;
}

export interface PendaftaranSaya {
  id: string;
  kode_pendaftaran: string;
  jadwal_id: string;
  asesi_id: string;
  tujuan_asesmen: string;
  status: string;
  alasan_reject: string | null;
  created_at: string;
  updated_at: string;
  nama_jadwal: string;
  kode_jadwal: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  nama_skema: string;
  kode_skema: string;
  skema_id: string;
  nama_tuk: string;
}

export interface DetailPendaftaran extends PendaftaranSaya {
  nama_asesi: string;
  email: string;
  bukti_kelengkapan: Bukti[];
}

export interface Bukti {
  id: string;
  pendaftaran_id: string;
  jenis_dokumen: string;
  nama_dokumen: string;
  file_path: string;
  file_size: number | null;
  mime_type: string | null;
  is_valid: boolean;
  catatan_validasi: string | null;
  created_at: string;
}

export interface SertifikatSaya {
  id: string;
  pendaftaran_id: string;
  no_blanko: string;
  no_registrasi: string;
  nomor_sertifikat: string;
  tanggal_terbit: string;
  tanggal_kadaluarsa: string;
  status: string;
  nama_asesi: string;
  nik: string;
  email: string;
  nama_skema: string;
  kode_skema: string;
  level_kkni: string | null;
}

export interface Kuk {
  kuk_id: string;
  pernyataan_kuk: string;
  urutan: number;
  asesi_mengaku_kompeten?: boolean;
}

export interface Elemen {
  elemen_id: string;
  nama_elemen: string;
  urutan: number;
  kuk: Kuk[];
}

export interface UnitKompetensi {
  unit_id: string;
  kode_unit: string;
  judul_unit: string;
  deskripsi: string | null;
  urutan: number;
  elemen: Elemen[];
}

export interface Apl02 {
  id: string;
  pendaftaran_id: string;
  status: string;
  rekomendasi_lanjut: boolean | null;
  catatan_asesor: string | null;
  detail_kuk: Array<Kuk & { id: string; unit_id: string; asesi_mengaku_kompeten: boolean }>;
}

const STATUS_LABEL: Record<string, string> = {
  DRAFT: "Draft",
  SUBMITTED: "Diajukan",
  VERIFIED: "Terverifikasi",
  REVISION_NEEDED: "Perlu Perbaikan",
  AKTIF: "Aktif",
};

export const asesi = {
  getJadwalTersedia(): Promise<JadwalTersedia[]> {
    return api.get<JadwalTersedia[]>("/jadwal/open");
  },

  daftarPendaftaran(jadwal_id: string, tujuan_asesmen = "Sertifikasi"): Promise<PendaftaranSaya> {
    return api.post<PendaftaranSaya>("/pendaftaran", { jadwal_id, tujuan_asesmen });
  },

  getPendaftaranSaya(): Promise<PendaftaranSaya[]> {
    return api.get<PendaftaranSaya[]>("/pendaftaran/saya");
  },

  getDetailPendaftaran(id: string): Promise<DetailPendaftaran> {
    return api.get<DetailPendaftaran>(`/pendaftaran/${id}`);
  },

  submitPendaftaran(id: string): Promise<PendaftaranSaya> {
    return api.put<PendaftaranSaya>(`/pendaftaran/${id}/submit`);
  },

  async uploadBukti(
    pendaftaran_id: string,
    file: File,
    jenis_dokumen: string,
    nama_dokumen?: string,
  ): Promise<Bukti> {
    const form = new FormData();
    form.append("file", file);
    form.append("jenis_dokumen", jenis_dokumen);
    if (nama_dokumen) form.append("nama_dokumen", nama_dokumen);
    return api.post<Bukti>(`/pendaftaran/${pendaftaran_id}/bukti`, form);
  },

  getKompetensi(skema_id: string): Promise<UnitKompetensi[]> {
    return api.get<UnitKompetensi[]>(`/skema/${skema_id}/kompetensi`);
  },

  getApl02(pendaftaran_id: string): Promise<Apl02> {
    return api.get<Apl02>(`/pendaftaran/${pendaftaran_id}/apl02`);
  },

  submitApl02(
    pendaftaran_id: string,
    detail_kuk: Array<{
      kuk_id: string;
      unit_id: string;
      asesi_mengaku_kompeten: boolean;
      bukti_lain?: string;
    }>,
  ): Promise<Apl02> {
    return api.put<Apl02>(`/pendaftaran/${pendaftaran_id}/apl02/submit`, { detail_kuk });
  },

  getSertifikatSaya(): Promise<SertifikatSaya[]> {
    return api.get<SertifikatSaya[]>("/sertifikat/saya");
  },

  statusLabel(status: string): string {
    return STATUS_LABEL[status] || status;
  },
};

export default asesi;