import { createRequire } from "node:module";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Pool } from "pg";

const require = createRequire(import.meta.url);
const { loadEnvConfig } = require("@next/env");

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const backendRoot = path.resolve(scriptDirectory, "..");
loadEnvConfig(backendRoot);

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL belum diatur. Isi variabel ini di backend/.env terlebih dahulu.");
  process.exit(1);
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const TEST_SITES = [
  {
    name: "TUK Mandiri LSP Teknologi Terampil Pusat",
    address: "Gedung Cyber Terampil Lt. 3, Jl. Kemang Timur No. 12, Jakarta Selatan",
    phone: "021-7890123",
    email: "tuk-pusat@lspteknologiterampil.id",
    siteType: "Mandiri",
    contactPerson: "Ir. Hendra Wijaya, M.Kom",
    checklist: { komputer: true, internet_100mbps: true, ac: true, cctv: true, genset: true },
  },
  {
    name: "TUK Sewaktu Lab Komputer Terpadu A",
    address: "Kampus Politeknik Mitra Informatika, Gedung B Lt. 2, Bandung",
    phone: "022-8765432",
    email: "tuk-bandung@lspteknologiterampil.id",
    siteType: "Sewaktu",
    contactPerson: "Dra. Nurul Hidayati, M.T.",
    checklist: { komputer: true, internet_50mbps: true, proyektor: true, ac: true },
  },
];

const SCHEMES = [
  {
    code: "SKM-01",
    name: "Teknisi Desktop (Desktop Technician)",
    category: "Teknologi Informasi",
    level: "Level 3",
    description: "Lakukan instalasi, konfigurasi, perawatan, dan penanganan masalah pada perangkat keras serta sistem operasi komputer desktop sesuai standar industri.",
    requirements: {
      type: "Okupasi",
      method: "Tatap Muka",
      price: "Rp 1.200.000",
      rating: 4.8,
      reviewCount: 12,
      asesiCount: 50,
      image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=600&q=80",
      nomorSkema: "SKM/BNSP/001/LSP-TTM/2026",
      masaBerlaku: "3 Tahun",
    },
    units: [
      { code: "J.620900.010.02", title: "Memasang Motherboard", sortOrder: 1 },
      { code: "J.620900.014.02", title: "Merawat CPU", sortOrder: 2 },
      { code: "J.620900.015.02", title: "Merawat Hard Disk", sortOrder: 3 },
      { code: "J.620900.016.02", title: "Merawat Peripheral", sortOrder: 4 },
      { code: "J.620900.025.02", title: "Melakukan Instalasi Sistem Operasi", sortOrder: 5 },
      { code: "J.620900.026.02", title: "Melakukan Instalasi Software Aplikasi", sortOrder: 6 },
      { code: "J.620900.031.02", title: "Merawat Sistem Operasi", sortOrder: 7 },
    ],
  },
  {
    code: "SKM-02",
    name: "Teknisi Perbaikan Komputer (Computer Repair Technician)",
    category: "Teknologi Informasi",
    level: "Level 3",
    description: "Periksa, diagnosis, dan perbaiki kerusakan perangkat keras maupun perangkat lunak pada komputer secara menyeluruh.",
    requirements: {
      type: "Okupasi",
      method: "Tatap Muka",
      price: "Rp 1.250.000",
      rating: 4.9,
      reviewCount: 18,
      asesiCount: 42,
      image: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=600&q=80",
      nomorSkema: "SKM/BNSP/002/LSP-TTM/2026",
      masaBerlaku: "3 Tahun",
    },
    units: [
      { code: "J.620200.004.01", title: "Mendiagnosis Kerusakan Perangkat Keras", sortOrder: 1 },
      { code: "J.620200.005.01", title: "Melakukan Perbaikan Perangkat Keras", sortOrder: 2 },
      { code: "J.620200.008.01", title: "Melakukan Perbaikan Peripheral Komputer", sortOrder: 3 },
    ],
  },
  {
    code: "SKM-03",
    name: "Asisten Instalasi dan Pemeliharaan Perangkat Keras",
    category: "Teknologi Informasi",
    level: "Level 2",
    description: "Bantu proses persiapan, instalasi, pemeriksaan, dan pemeliharaan berkala perangkat keras komputer sesuai prosedur kerja standar.",
    requirements: {
      type: "Klaster",
      method: "Tatap Muka",
      price: "Rp 1.000.000",
      rating: 4.7,
      reviewCount: 10,
      asesiCount: 28,
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
      nomorSkema: "SKM/BNSP/003/LSP-TTM/2026",
      masaBerlaku: "3 Tahun",
    },
    units: [
      { code: "J.620200.006.01", title: "Menyiapkan Perangkat Keras Komputer", sortOrder: 1 },
      { code: "J.620200.007.01", title: "Melakukan Pemeliharaan Rutin", sortOrder: 2 },
    ],
  },
  {
    code: "SKM-04",
    name: "Analis Web (Web Analyst)",
    category: "Pengembangan Web",
    level: "Level 4",
    description: "Analisis struktur, kebutuhan pengguna, fungsi, dan kinerja situs web untuk menentukan rekomendasi arsitektur serta perbaikan.",
    requirements: {
      type: "Okupasi",
      method: "Blended Learning",
      price: "Rp 1.500.000",
      rating: 5.0,
      reviewCount: 8,
      asesiCount: 35,
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
      nomorSkema: "SKM/BNSP/004/LSP-TTM/2026",
      masaBerlaku: "3 Tahun",
    },
    units: [
      { code: "M.722000.001.02", title: "Menganalisis Kebutuhan Sistem Web", sortOrder: 1 },
      { code: "M.722000.005.02", title: "Melakukan Audit Performa Web", sortOrder: 2 },
      { code: "M.722000.007.02", title: "Merumuskan Rekomendasi Optimasi Web", sortOrder: 3 },
    ],
  },
  {
    code: "SKM-05",
    name: "Pemrogram Muda (Associate Programmer)",
    category: "Pengembangan Perangkat Lunak",
    level: "Level 3",
    description: "Menulis, menguji, dan memelihara kode program sederhana hingga menengah menggunakan bahasa standar industri.",
    requirements: {
      type: "Okupasi",
      method: "Tatap Muka",
      price: "Rp 1.350.000",
      rating: 4.9,
      reviewCount: 22,
      asesiCount: 60,
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80",
      nomorSkema: "SKM/BNSP/005/LSP-TTM/2026",
      masaBerlaku: "3 Tahun",
    },
    units: [
      { code: "J.620900.001.01", title: "Menggunakan Struktur Data", sortOrder: 1 },
      { code: "J.620900.002.01", title: "Mengimplementasikan Algoritma Pemrograman", sortOrder: 2 },
      { code: "J.620900.005.02", title: "Mengimplementasikan User Interface", sortOrder: 3 },
      { code: "J.620900.010.01", title: "Melakukan Debugging dan Pengujian Unit", sortOrder: 4 },
    ],
  },
  {
    code: "SKM-06",
    name: "Pemasaran Digital Berbasis AI (AI Powered Digital Marketing)",
    category: "Kecerdasan Buatan & Pemasaran",
    level: "Level 3",
    description: "Mengoptimalkan strategi pemasaran digital menggunakan tools kecerdasan buatan (AI) untuk konten, analisis pasar, dan iklan.",
    requirements: {
      type: "Klaster",
      method: "Online / Daring",
      price: "Rp 1.100.000",
      rating: 4.8,
      reviewCount: 15,
      asesiCount: 45,
      image: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?auto=format&fit=crop&w=600&q=80",
      nomorSkema: "SKM/BNSP/006/LSP-TTM/2026",
      masaBerlaku: "3 Tahun",
    },
    units: [
      { code: "N.791000.010.01", title: "Membuat Konten Pemasaran dengan AI", sortOrder: 1 },
      { code: "N.791000.012.01", title: "Menganalisis Kampanye Iklan Digital", sortOrder: 2 },
    ],
  },
  {
    code: "SKM-07",
    name: "Penerapan AI Untuk Pembelajaran",
    category: "Pendidikan & AI",
    level: "Level 3",
    description: "Memanfaatkan teknologi AI generatif dan sistem cerdas untuk merancang media serta materi pembelajaran yang interaktif.",
    requirements: {
      type: "Klaster",
      method: "Blended Learning",
      price: "Rp 1.150.000",
      rating: 4.7,
      reviewCount: 11,
      asesiCount: 30,
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80",
      nomorSkema: "SKM/BNSP/007/LSP-TTM/2026",
      masaBerlaku: "3 Tahun",
    },
    units: [
      { code: "E.850000.001.01", title: "Merancang Media Pembelajaran Berbasis AI", sortOrder: 1 },
      { code: "E.850000.003.01", title: "Evaluasi Pembelajaran Berbantuan AI", sortOrder: 2 },
    ],
  },
  {
    code: "SKM-08",
    name: "Pengembang AI Agent (AI Agent Developer)",
    category: "Kecerdasan Buatan",
    level: "Level 4",
    description: "Membangun, melatih, dan mengintegrasikan agen cerdas menggunakan Large Language Models (LLM) dan kerangka kerja modern.",
    requirements: {
      type: "Okupasi",
      method: "Tatap Muka",
      price: "Rp 1.750.000",
      rating: 5.0,
      reviewCount: 19,
      asesiCount: 40,
      image: "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=600&q=80",
      nomorSkema: "SKM/BNSP/008/LSP-TTM/2026",
      masaBerlaku: "3 Tahun",
    },
    units: [
      { code: "AI.010.01", title: "Memetakan Kebutuhan AI Agent", sortOrder: 1 },
      { code: "AI.012.01", title: "Mengintegrasikan LLM dan Vector Database", sortOrder: 2 },
      { code: "AI.015.01", title: "Menguji Keandalan dan Evaluasi AI Agent", sortOrder: 3 },
    ],
  },
  {
    code: "SKM-09",
    name: "Pengembang AI Otomasi (AI Automation Developer)",
    category: "Kecerdasan Buatan",
    level: "Level 4",
    description: "Merancang alur kerja otomatis (workflow automation) yang digabungkan dengan kecerdasan buatan untuk efisiensi bisnis.",
    requirements: {
      type: "Okupasi",
      method: "Blended Learning",
      price: "Rp 1.600.000",
      rating: 4.9,
      reviewCount: 14,
      asesiCount: 38,
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
      nomorSkema: "SKM/BNSP/009/LSP-TTM/2026",
      masaBerlaku: "3 Tahun",
    },
    units: [
      { code: "AUTO.001.01", title: "Mendesain Business Workflow Otomasi", sortOrder: 1 },
      { code: "AUTO.003.01", title: "Menghubungkan API & AI Services", sortOrder: 2 },
    ],
  },
  {
    code: "SKM-10",
    name: "Teknisi Laptop (Laptop Technician)",
    category: "Teknologi Informasi",
    level: "Level 3",
    description: "Bongkar pasang, pemeliharaan, deteksi kerusakan motherboard, serta perbaikan komponen fisik laptop berbagai merk.",
    requirements: {
      type: "Okupasi",
      method: "Tatap Muka",
      price: "Rp 1.300.000",
      rating: 4.8,
      reviewCount: 25,
      asesiCount: 55,
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80",
      nomorSkema: "SKM/BNSP/010/LSP-TTM/2026",
      masaBerlaku: "3 Tahun",
    },
    units: [
      { code: "J.620900.050.02", title: "Pembongkaran dan Pemasangan Komponen Laptop", sortOrder: 1 },
      { code: "J.620900.055.02", title: "Perbaikan Modul Catu Daya dan Motherboard Laptop", sortOrder: 2 },
    ],
  },
];

const STANDARD_DOCUMENT_REQUIREMENTS = [
  { code: "ktp", label: "Scan KTP / Kartu Pelajar Asli", category: "administrative", isRequired: true },
  { code: "ijazah", label: "Scan Ijazah Terakhir / Surat Keterangan Lulus", category: "administrative", isRequired: true },
  { code: "pasfoto", label: "Pasfoto Formal (3x4 Latar Merah/Biru)", category: "administrative", isRequired: true },
  { code: "sertifikat_pelatihan", label: "Sertifikat Pelatihan Terkait / Surat Keterangan PKL", category: "portfolio", isRequired: false },
  { code: "portofolio_kerja", label: "Dokumen Bukti Portofolio / Hasil Karya / Surat Pengalaman Kerja", category: "portfolio", isRequired: false },
];

async function seed() {
  const client = await pool.connect();
  try {
    console.log("Memulai seeding database LSP Teknologi Terampil...");
    await client.query("BEGIN");

    // 1. Seed Tempat Uji Kompetensi (TUK)
    const siteIds = [];
    for (const site of TEST_SITES) {
      const existing = await client.query("SELECT id FROM test_sites WHERE lower(name) = lower($1)", [site.name]);
      let siteId;
      if (existing.rowCount > 0) {
        siteId = existing.rows[0].id;
        await client.query(
          `UPDATE test_sites SET address = $2, phone = $3, email = $4, site_type = $5, contact_person = $6, checklist = $7::jsonb, is_active = true, updated_at = now()
           WHERE id = $1`,
          [siteId, site.address, site.phone, site.email, site.siteType, site.contactPerson, JSON.stringify(site.checklist)],
        );
      } else {
        siteId = randomUUID();
        await client.query(
          `INSERT INTO test_sites (id, name, address, phone, email, site_type, contact_person, checklist, is_active)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, true)`,
          [siteId, site.name, site.address, site.phone, site.email, site.siteType, site.contactPerson, JSON.stringify(site.checklist)],
        );
      }
      siteIds.push(siteId);
    }
    console.log(`✓ ${siteIds.length} Tempat Uji Kompetensi (TUK) tersimpan.`);

    // 2. Seed Skema Sertifikasi, Unit Kompetensi, dan Syarat Dokumen
    let schemeCount = 0;
    let unitCount = 0;
    let scheduleCount = 0;

    for (const item of SCHEMES) {
      const existingScheme = await client.query("SELECT id FROM certification_schemes WHERE lower(code) = lower($1)", [item.code]);
      let schemeId;
      if (existingScheme.rowCount > 0) {
        schemeId = existingScheme.rows[0].id;
        await client.query(
          `UPDATE certification_schemes
           SET name = $2, category = $3, level = $4, description = $5, requirements = $6::jsonb, is_public = true, is_active = true, updated_at = now()
           WHERE id = $1`,
          [schemeId, item.name, item.category, item.level, item.description, JSON.stringify(item.requirements)],
        );
      } else {
        schemeId = randomUUID();
        await client.query(
          `INSERT INTO certification_schemes (id, code, name, category, level, description, requirements, is_public, is_active)
           VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, true, true)`,
          [schemeId, item.code, item.name, item.category, item.level, item.description, JSON.stringify(item.requirements)],
        );
      }
      schemeCount++;

      // Unit Kompetensi
      for (const unit of item.units) {
        const unitId = randomUUID();
        await client.query(
          `INSERT INTO competency_units (id, scheme_id, code, title, description, sort_order, is_active)
           VALUES ($1, $2, $3, $4, '', $5, true)
           ON CONFLICT (scheme_id, code) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order, is_active = true`,
          [unitId, schemeId, unit.code, unit.title, unit.sortOrder],
        );
        unitCount++;
      }

      // Dokumen Persyaratan
      for (const doc of STANDARD_DOCUMENT_REQUIREMENTS) {
        const docId = randomUUID();
        await client.query(
          `INSERT INTO scheme_document_requirements (id, scheme_id, code, label, category, is_required, allowed_mime_types)
           VALUES ($1, $2, $3, $4, $5, $6, ARRAY['application/pdf', 'image/jpeg', 'image/png'])
           ON CONFLICT (scheme_id, code) DO UPDATE SET label = EXCLUDED.label, category = EXCLUDED.category, is_required = EXCLUDED.is_required`,
          [docId, schemeId, doc.code, doc.label, doc.category, doc.isRequired],
        );
      }

      // Hubungkan TUK dengan Skema ini
      for (const sId of siteIds) {
        await client.query(
          `INSERT INTO test_site_schemes (test_site_id, scheme_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
          [sId, schemeId],
        );
      }

      // Jadwal Ujian Aktif (Jadwal 7 hari & 14 hari ke depan)
      const now = new Date();
      const defaultSchedules = [
        {
          siteId: siteIds[0],
          startsAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
          endsAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000),
          capacity: 25,
        },
        {
          siteId: siteIds[1] || siteIds[0],
          startsAt: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
          endsAt: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000),
          capacity: 20,
        },
      ];

      for (const sched of defaultSchedules) {
        const existingSched = await client.query(
          `SELECT id FROM assessment_schedules
           WHERE scheme_id = $1 AND test_site_id = $2 AND starts_at > now() LIMIT 1`,
          [schemeId, sched.siteId],
        );
        if (existingSched.rowCount === 0) {
          await client.query(
            `INSERT INTO assessment_schedules (id, scheme_id, test_site_id, starts_at, ends_at, capacity, is_active)
             VALUES ($1, $2, $3, $4, $5, $6, true)`,
            [randomUUID(), schemeId, sched.siteId, sched.startsAt.toISOString(), sched.endsAt.toISOString(), sched.capacity],
          );
          scheduleCount++;
        }
      }
    }

    await client.query("COMMIT");
    console.log(`✓ ${schemeCount} Skema Sertifikasi BNSP berhasil di-seed.`);
    console.log(`✓ ${unitCount} Unit Kompetensi (SKKNI) berhasil di-seed.`);
    console.log(`✓ ${scheduleCount} Jadwal Ujian Kompetensi mendatang berhasil disiapkan.`);
    console.log("Seeding database LSP Teknologi Terampil selesai dengan sukses!");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Gagal melakukan seeding database:", error);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

void seed();
