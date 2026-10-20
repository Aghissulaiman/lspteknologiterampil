import { createRequire } from "node:module";
import { readFile } from "node:fs/promises";
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
  process.exitCode = 1;
} else {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    const baseSchema = await readFile(path.join(scriptDirectory, "..", "db", "schema.sql"), "utf8");
    const certificationSchema = await readFile(path.join(scriptDirectory, "..", "db", "certification.sql"), "utf8");
    await pool.query(`${baseSchema}\n${certificationSchema}`);
    console.log("Skema PostgreSQL dan alur sertifikasi berhasil diterapkan.");
  } catch (error) {
    console.error("Skema PostgreSQL gagal diterapkan:", error instanceof Error ? error.message : error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}
