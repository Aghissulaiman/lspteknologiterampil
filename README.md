# LSP Teknologi Terampil

## Struktur proyek

```text
frontend/  Aplikasi Next.js dan halaman pengguna
backend/   API Express, autentikasi, akses PostgreSQL, migrasi, dan penyimpanan berkas privat
```

Frontend Next.js meneruskan `/api/*` ke Express melalui `API_URL` (default `http://127.0.0.1:4000`). Cookie sesi bersifat HTTP-only. Backend menggunakan PostgreSQL 15 atau lebih baru.

## Menjalankan secara lokal

1. Salin `backend/.env.example` menjadi `backend/.env`. Isi `DATABASE_URL` untuk PostgreSQL lokal dan ganti `AUTH_SECRET` dengan string acak minimal 32 karakter. `frontend/.env.local` hanya diperlukan jika alamat proxy `API_URL` ingin diubah dari nilai default.
2. Jalankan PostgreSQL jika memakai Docker:

   ```bash
   docker compose -f backend/docker-compose.yml up -d db
   ```

3. Siapkan tabel akun, folder, dan sertifikasi:

   ```bash
   npm run db:setup
   ```

4. Jalankan server Express dan Next.js di terminal terpisah dari root proyek:

   ```bash
   npm run dev:backend
   npm run dev
   ```

   Dari folder `backend/`, `npm run dev` menjalankan Express, dan `npm start` menjalankan Express. Dari root, `npm run start:backend` menjalankan Express; `npm run start` tetap menjalankan frontend Next.js.

5. Buat Admin LSP pertama secara terpisah dari akun peserta. Isi `INITIAL_ADMIN_NAME`, `INITIAL_ADMIN_EMAIL`, `INITIAL_ADMIN_PHONE`, dan `INITIAL_ADMIN_PASSWORD` di `backend/.env`, lalu jalankan:

   ```bash
   npm run db:bootstrap-admin
   ```

   Script membuat pengguna baru dengan role `admin_lsp`; akun peserta yang sudah ada tidak diubah. Bootstrap hanya dapat membuat Admin pertama satu kali. Kata sandi minimal 8 karakter dan disimpan sebagai hash. Setelah Admin masuk, buat skema dan unit kompetensi lewat `/api/admin/schemes`. Akun asesor dibuat Admin melalui `/api/admin/assessors`.

Jika masih ada akun dan folder pada `backend/data/lspteknologiterampil.json`, data tersebut dapat dipindahkan dengan `npm run db:import-json`. Siapkan skema, TUK, dan jadwal terlebih dahulu sebelum peserta mengajukan sertifikasi.

## Role dan akses

Backend menetapkan tepat tiga role: `participant`, `admin_lsp`, dan `assessor`. Pendaftaran publik selalu membuat akun `participant`; role lain hanya dibuat atau ditetapkan melalui proses Admin/bootstrap.

- **Peserta** hanya dapat membaca atau mengubah permohonan dan dokumen miliknya. Peserta dapat mengisi APL-01/APL-02, mengirim dokumen, memilih jadwal/TUK aktif, melihat status, hasil, dan sertifikatnya.
- **Admin LSP** mengelola skema, jadwal, dan TUK; meninjau permohonan; meminta revisi atau memverifikasi; menugaskan asesor; meninjau rekomendasi; menetapkan keputusan akhir; dan menerbitkan sertifikat.
- **Asesor** hanya dapat membaca asesmen yang ditugaskan kepadanya. Asesor mencatat pra-asesmen, hasil per unit, bukti, dan rekomendasi. Asesor tidak dapat menetapkan keputusan akhir atau menerbitkan sertifikat.
- **Tanpa login** hanya dapat melihat skema publik dan memvalidasi nomor sertifikat. Validasi sertifikat hanya mengembalikan status valid, nomor, nama skema, serta tanggal penerbitan.

## Alur status

Permohonan sertifikasi bergerak melalui `draft` → `submitted` → `verified` → `assessment_scheduled` → `assessment_completed`. Admin dapat mengubah `submitted` menjadi `revision_required`; peserta memperbaiki dan mengirim ulang. Setelah rekomendasi asesor, Admin menetapkan `competent` atau `not_competent`. Status `competent` dapat dilanjutkan menjadi `certified` ketika Admin menerbitkan sertifikat. Tidak ada aturan pembayaran atau remediasi yang dipaksakan.

Pengajuan TUK berjalan terpisah: `draft` → `submitted` → `approved`, `revision_required`, atau `rejected`. Setelah revisi, peserta mengirim ulang. Persetujuan Admin membuat data TUK aktif dan mengaitkannya dengan skema yang diajukan.

Perubahan penting disimpan pada riwayat status dan `audit_logs`. Keputusan akhir dan penerbitan sertifikat memakai transaksi database; nomor sertifikat unik dibuat dari `CERTIFICATE_NUMBER_PREFIX`, tahun, dan nomor urut.

## Endpoint

Semua endpoint menerima/mengembalikan JSON kecuali unggah berkas (`multipart/form-data`, field `file`). ID skema, jadwal, dan dokumen dikirim sebagai UUID.

### Publik dan akun

| Method dan path | Fungsi |
| --- | --- |
| `GET /api/public/schemes` | Daftar skema aktif dan publik |
| `GET /api/public/schemes/:schemeId` | Detail skema, unit, dan persyaratan |
| `GET /api/public/certificates/:certificateNumber` | Validasi sertifikat; nomor berbentuk `PREFIX-TAHUN-NOMOR` |
| `POST /api/auth/register` | Daftar akun peserta |
| `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me` | Sesi akun |

### Peserta

| Method dan path | Fungsi |
| --- | --- |
| `GET /api/applications/schedules?schemeId=...` | Jadwal aktif dengan kuota tersedia dan TUK |
| `POST /api/applications` | Membuat draft dengan `schemeId`, `scheduleId`, dan APL-01 opsional |
| `GET /api/applications`, `GET /api/applications/:applicationId` | Daftar/detail permohonan sendiri |
| `PATCH /api/applications/:applicationId` | Mengubah `apl01` dan/atau `scheduleId` saat draft atau revisi |
| `PUT /api/applications/:applicationId/apl02` | Mengirim `{ "responses": [{ "unitId", "answer", "notes", "evidenceDocumentIds" }] }` untuk tiap unit |
| `POST /api/applications/:applicationId/documents` | Unggah dengan `category` (`administrative`/`portfolio`) dan `documentType` |
| `GET` atau `DELETE /api/applications/:applicationId/documents/:documentId` | Unduh/hapus dokumen milik sendiri (hapus hanya saat draft/revisi) |
| `POST /api/applications/:applicationId/submit` | Validasi kelengkapan, kuota, snapshot, dan kirim permohonan |
| `GET/POST /api/tuk-submissions` | Daftar/membuat draft pengajuan lokasi TUK |
| `GET/PATCH /api/tuk-submissions/:submissionId` | Membaca atau mengubah profil, checklist, dan skema TUK |
| `POST /api/tuk-submissions/:submissionId/documents` | Unggah dokumen TUK dengan `documentType` |
| `GET/DELETE /api/tuk-submissions/:submissionId/documents/:documentId` | Unduh/hapus dokumen sendiri |
| `POST /api/tuk-submissions/:submissionId/submit` | Validasi dan kirim pengajuan TUK |

### Admin LSP

| Method dan path | Fungsi |
| --- | --- |
| `GET/POST /api/admin/schemes`, `GET/PATCH /api/admin/schemes/:schemeId` | Daftar, buat, lihat, atau ubah skema |
| `PUT /api/admin/schemes/:schemeId/structure` | Mengganti unit/persyaratan dokumen sebelum ada permohonan |
| `GET /api/admin/applications?status=...`, `GET /api/admin/applications/:applicationId` | Antrean dan detail permohonan |
| `POST /api/admin/applications/:applicationId/revision` | Meminta revisi dengan `{ "reason": "..." }` |
| `POST /api/admin/applications/:applicationId/verify` | Verifikasi kelengkapan |
| `POST /api/admin/applications/:applicationId/assign` | Menjadwalkan dan menugaskan `{ "assessorId": "...", "scheduleId": "..." }` (`scheduleId` opsional) |
| `POST /api/admin/applications/:applicationId/final-decision` | Keputusan akhir `{ "decision": "competent"|"not_competent", "note": "..." }` |
| `POST /api/admin/applications/:applicationId/issue-certificate` | Menerbitkan sertifikat untuk keputusan `competent` |
| `GET/POST /api/admin/schedules`, `PATCH /api/admin/schedules/:scheduleId` | Kelola jadwal dan kuota |
| `GET /api/admin/tuk-submissions`, `GET /api/admin/tuk-submissions/:submissionId` | Antrean/detail pengajuan TUK |
| `POST /api/admin/tuk-submissions/:submissionId/review` | Minta revisi atau tolak dengan keputusan dan catatan |
| `POST /api/admin/tuk-submissions/:submissionId/approve` | Setujui dan aktifkan TUK |
| `GET/POST /api/admin/test-sites`, `PATCH /api/admin/test-sites/:testSiteId` | Kelola TUK dan skema yang didukung |
| `GET/POST /api/admin/assessors` | Daftar atau buat akun asesor |
| `GET /api/admin/audit-logs` | Riwayat audit terbaru |

Admin mengunduh dokumen permohonan lewat `GET /api/admin/applications/:applicationId/documents/:documentId` dan dokumen TUK lewat `GET /api/admin/tuk-submissions/:submissionId/documents/:documentId`.

### Asesor

| Method dan path | Fungsi |
| --- | --- |
| `GET /api/assessor` | Daftar asesmen yang ditugaskan |
| `GET /api/assessor/:applicationId` | Detail permohonan, APL-02, dokumen, dan hasil saat ini |
| `PATCH /api/assessor/:applicationId/pre-assessment` | Simpan `{ "outcome": "...", "notes": "..." }` |
| `PUT /api/assessor/:applicationId/units` | Simpan `{ "results": [{ "unitId", "result", "notes", "evidenceNotes", "evidenceDocumentIds" }] }` |
| `PATCH /api/assessor/:applicationId/notes` | Simpan catatan asesmen |
| `POST /api/assessor/:applicationId/recommendation` | Rekomendasi `{ "recommendation": "competent"|"not_competent", "note": "..." }` setelah pra-asesmen dan semua hasil unit dicatat |
| `GET /api/assessor/:applicationId/documents/:documentId` | Unduh dokumen hanya jika asesmen ditugaskan kepada asesor tersebut |

## Konfigurasi

Konfigurasi backend dibaca dari `backend/.env` (atau environment server). Frontend memakai `frontend/.env.local` hanya untuk pengaturan Next.js seperti `API_URL`:

| Variabel | Kegunaan |
| --- | --- |
| `DATABASE_URL` | Koneksi PostgreSQL |
| `AUTH_SECRET` | Kunci penandatanganan sesi; minimal 32 karakter saat production |
| `PORT` | Port Express, default `4000` |
| `UPLOAD_MAX_FILE_SIZE_BYTES` | Batas satu file, default `2097152` (2 MiB) |
| `UPLOAD_ALLOWED_MIME_TYPES` | MIME yang diterima; default PDF, JPEG, PNG dan isi berkas diperiksa server |
| `PRIVATE_UPLOAD_DIR` | Direktori file privat; default `backend/storage/private`, tidak disajikan sebagai file statis |
| `TUK_REQUIRED_DOCUMENT_TYPES` | Kode dokumen wajib TUK dipisahkan koma; default `logo,company_profile,mou,layout` |
| `CERTIFICATE_NUMBER_PREFIX` | Awalan nomor sertifikat, default `LSPTT` |
| `INITIAL_ADMIN_NAME` | Nama untuk akun Admin pertama yang dibuat saat bootstrap |
| `INITIAL_ADMIN_EMAIL` | Email khusus akun Admin pertama |
| `INITIAL_ADMIN_PHONE` | Nomor WhatsApp untuk akun Admin pertama |
| `INITIAL_ADMIN_PASSWORD` | Kata sandi awal akun Admin; minimal 8 karakter |

Untuk mengubah tujuan proxy dari Next.js ke Express, isi `API_URL` di `frontend/.env.local` (default `http://127.0.0.1:4000`).

Profil APL-01, daftar dokumen tiap skema, dan checklist TUK disimpan sesuai input Admin/peserta. Backend mensyaratkan kolom APL-01 yang ditentukan validator, semua unit APL-02, dokumen wajib skema, dan pilihan jadwal yang masih berkuota. Kebijakan pembayaran dan tindak lanjut peserta yang belum kompeten tetap menjadi kebijakan LSP.
