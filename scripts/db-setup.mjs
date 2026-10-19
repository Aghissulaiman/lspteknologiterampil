import { loadEnvConfig } from "@next/env";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Pool } from "pg";

loadEnvConfig(process.cwd());

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL belum diatur. Isi variabel ini di .env.local terlebih dahulu.");
  process.exitCode = 1;
} else {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
    const schema = await readFile(path.join(scriptDirectory, "..", "db", "schema.sql"), "utf8");
    await pool.query(schema);
    console.log("Skema PostgreSQL berhasil diterapkan.");
  } catch (error) {
    console.error("Skema PostgreSQL gagal diterapkan:", error instanceof Error ? error.message : error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}
