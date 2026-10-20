import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";
import { Pool } from "pg";

const require = createRequire(import.meta.url);
const { loadEnvConfig } = require("@next/env");

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const backendRoot = path.resolve(scriptDirectory, "..");
loadEnvConfig(backendRoot);

const email = process.env.INITIAL_ADMIN_EMAIL?.trim().toLowerCase();
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL belum diatur. Isi variabel ini di backend/.env terlebih dahulu.");
  process.exitCode = 1;
} else if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  console.error("Isi INITIAL_ADMIN_EMAIL di backend/.env dengan email akun yang akan dijadikan Admin LSP.");
  process.exitCode = 1;
} else {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("SELECT pg_advisory_xact_lock(hashtext('lsp-initial-admin-bootstrap'))");
    const target = await client.query("SELECT id, role FROM users WHERE lower(email) = $1 FOR UPDATE", [email]);
    if (!target.rowCount) throw new Error("Akun belum ditemukan. Daftarkan akun melalui aplikasi lebih dahulu.");

    const user = target.rows[0];
    if (user.role !== "admin_lsp") {
      const existingAdmin = await client.query("SELECT id FROM users WHERE role = 'admin_lsp' LIMIT 1 FOR UPDATE");
      if (existingAdmin.rowCount) throw new Error("Admin LSP sudah pernah diinisialisasi.");

      await client.query("UPDATE users SET role = 'admin_lsp' WHERE id = $1", [user.id]);
      await client.query(
        `INSERT INTO audit_logs (id, actor_id, actor_role, action, entity_type, entity_id, details)
         VALUES ($1, $2, 'admin_lsp', 'admin.bootstrap', 'user', $2, $3::jsonb)`,
        [randomUUID(), user.id, JSON.stringify({ email })],
      );
    }

    await client.query("COMMIT");
    console.log(`Admin LSP siap: ${email}`);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Admin LSP belum dapat dibuat:", error instanceof Error ? error.message : error);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}
