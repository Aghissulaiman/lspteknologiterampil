import { createRequire } from "node:module";
import { randomBytes, randomUUID, scrypt as scryptCallback } from "node:crypto";
import { promisify } from "node:util";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Pool } from "pg";

const require = createRequire(import.meta.url);
const { loadEnvConfig } = require("@next/env");
const scrypt = promisify(scryptCallback);

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const backendRoot = path.resolve(scriptDirectory, "..");
loadEnvConfig(backendRoot);

const fullName = process.env.INITIAL_ADMIN_NAME?.trim() ?? "";
const email = process.env.INITIAL_ADMIN_EMAIL?.trim().toLowerCase() ?? "";
const phone = process.env.INITIAL_ADMIN_PHONE?.trim() ?? "";
const password = process.env.INITIAL_ADMIN_PASSWORD ?? "";

const missingFields = [
  ["INITIAL_ADMIN_NAME", fullName],
  ["INITIAL_ADMIN_EMAIL", email],
  ["INITIAL_ADMIN_PHONE", phone],
  ["INITIAL_ADMIN_PASSWORD", password],
].filter(([, value]) => !value).map(([name]) => name);

const invalidFields = [];
if (fullName.length > 100 || (fullName && fullName.length < 2)) invalidFields.push("INITIAL_ADMIN_NAME harus terdiri dari 2–100 karakter.");
if (email.length > 254 || (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) invalidFields.push("INITIAL_ADMIN_EMAIL tidak valid.");
if (phone && !/^[+\d][\d\s()-]{7,19}$/.test(phone)) invalidFields.push("INITIAL_ADMIN_PHONE tidak valid.");
if (password && (password.length < 8 || password.length > 128)) invalidFields.push("INITIAL_ADMIN_PASSWORD harus terdiri dari 8–128 karakter.");

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL belum diatur. Isi variabel ini di backend/.env terlebih dahulu.");
  process.exitCode = 1;
} else if (missingFields.length || invalidFields.length) {
  if (missingFields.length) console.error(`Lengkapi variabel ini di backend/.env: ${missingFields.join(", ")}.`);
  for (const message of invalidFields) console.error(message);
  process.exitCode = 1;
} else {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  let client;
  let transactionStarted = false;

  try {
    client = await pool.connect();
    await client.query("BEGIN");
    transactionStarted = true;
    await client.query("SELECT pg_advisory_xact_lock(hashtext('lsp-initial-admin-bootstrap'))");

    const existingAdmin = await client.query("SELECT id FROM users WHERE role = 'admin_lsp' LIMIT 1 FOR UPDATE");
    if (existingAdmin.rowCount) throw new Error("Admin LSP sudah pernah dibuat. Bootstrap ini hanya untuk Admin pertama.");

    const conflict = await client.query("SELECT id FROM users WHERE lower(email) = $1 FOR UPDATE", [email]);
    if (conflict.rowCount) {
      throw new Error("Email sudah terdaftar. Gunakan email khusus Admin agar akun peserta tidak terubah.");
    }

    const salt = randomBytes(16);
    const derivedKey = await scrypt(password, salt, 64);
    const passwordHash = `${salt.toString("base64url")}:${derivedKey.toString("base64url")}`;
    const adminId = randomUUID();

    await client.query(
      "INSERT INTO users (id, full_name, email, nik, phone, password_hash, role) VALUES ($1, $2, $3, NULL, $4, $5, 'admin_lsp')",
      [adminId, fullName, email, phone, passwordHash],
    );
    await client.query(
      `INSERT INTO audit_logs (id, actor_id, actor_role, action, entity_type, entity_id, details)
       VALUES ($1, $2, 'admin_lsp', 'admin.bootstrap', 'user', $2, $3::jsonb)`,
      [randomUUID(), adminId, JSON.stringify({ email, method: "direct-bootstrap" })],
    );

    await client.query("COMMIT");
    transactionStarted = false;
    console.log(`Admin LSP berhasil dibuat: ${email}`);
  } catch (error) {
    if (client && transactionStarted) await client.query("ROLLBACK").catch(() => undefined);
    console.error("Admin LSP belum dapat dibuat:", error instanceof Error ? error.message : error);
    process.exitCode = 1;
  } finally {
    client?.release();
    await pool.end();
  }
}
