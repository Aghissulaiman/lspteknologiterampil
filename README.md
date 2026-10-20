# LSP Teknologi Terampil

## Struktur proyek

```text
frontend/  Root aplikasi Next.js: app/, komponen, utilitas, dan aset statis
backend/   Handler API, autentikasi, database, skrip, dan data impor lokal
```

Aplikasi Next.js berada di `frontend/`, sehingga `frontend/app/` memuat halaman dan route handler penghubung ke implementasi di `backend/api/`. `package.json` di root mengelola workspace dan menyediakan perintah `npm run`; konfigurasi Next.js, file environment, serta `public/` berada di dalam `frontend/`.

## PostgreSQL

Backend akun dan folder memakai PostgreSQL 15 atau yang lebih baru. Akun menyimpan nama, email, NIK, nomor WhatsApp, hash kata sandi, dan tanggal pendaftaran. Folder menyimpan pemilik, induk, dan tanggal perubahan. Kata sandi tetap di-hash sebelum disimpan.

### Menjalankan secara lokal

1. Salin `frontend/.env.example` menjadi `frontend/.env.local`, lalu ubah `AUTH_SECRET` menjadi string acak minimal 32 karakter. `DATABASE_URL` pada contoh terhubung ke PostgreSQL lokal dari Docker Compose.
2. Jalankan PostgreSQL:

   ```bash
   docker compose -f backend/docker-compose.yml up -d db
   ```

3. Buat tabel dan indeks:

   ```bash
   npm run db:setup
   ```

4. Jika ingin memindahkan akun dan folder yang masih ada di `backend/data/lspteknologiterampil.json`, jalankan satu kali:

   ```bash
   npm run db:import-json
   ```

   Impor mempertahankan ID akun dan hash kata sandi agar sesi baru dan login tetap berfungsi. Jika data bertabrakan dengan isi database, seluruh impor dibatalkan tanpa menimpa data yang ada.

5. Jalankan aplikasi:

   ```bash
   npm run dev
   ```

Skrip `db:setup` aman dijalankan ulang. Database harus sudah tersedia dan `DATABASE_URL` harus menunjuk ke database tersebut sebelum aplikasi atau skrip database dijalankan. Untuk server production, gunakan PostgreSQL yang dikelola terpisah dan isi `DATABASE_URL` serta `AUTH_SECRET` melalui konfigurasi environment server.

API pendaftaran dan masuk tersedia di `/api/auth/register` dan `/api/auth/login`. Sesi disimpan sebagai cookie HTTP-only selama tujuh hari. Keluar memakai `/api/auth/logout`, dan `/api/auth/me` mengembalikan akun aktif. Folder memiliki API CRUD bertingkat di `/api/folders` dan `/api/folders/[folderId]`; semua operasi memerlukan sesi dan pengguna hanya dapat membaca atau mengubah folder miliknya. Folder induk tidak dapat dihapus selama masih memiliki subfolder.

API folder saat ini mengelola struktur folder saja, belum mengunggah atau menyimpan file.
