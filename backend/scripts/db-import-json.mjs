import { loadEnvConfig } from "@next/env";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Pool } from "pg";

loadEnvConfig(path.join(process.cwd(), "frontend"));

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL belum diatur. Isi variabel ini di .env.local terlebih dahulu.");
  process.exitCode = 1;
} else {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    const sourcePath = process.env.LSP_DATA_FILE || path.join(process.cwd(), "backend", "data", "lspteknologiterampil.json");
    const store = JSON.parse(await readFile(sourcePath, "utf8"));
    if (!Array.isArray(store.users) || !Array.isArray(store.folders)) {
      throw new Error("Format data JSON akun dan folder tidak valid.");
    }

    const folderById = new Map(store.folders.map((folder) => [folder.id, folder]));
    if (folderById.size !== store.folders.length) throw new Error("Ada ID folder ganda di file JSON.");
    const visiting = new Set();
    const visited = new Set();
    const orderedFolders = [];

    function addParentFirst(folder) {
      if (visited.has(folder.id)) return;
      if (visiting.has(folder.id)) throw new Error("Struktur folder di file JSON memiliki siklus.");
      visiting.add(folder.id);

      if (folder.parentId) {
        const parent = folderById.get(folder.parentId);
        if (!parent || parent.ownerId !== folder.ownerId) {
          throw new Error("Folder induk tidak ditemukan atau dimiliki akun berbeda.");
        }
        addParentFirst(parent);
      }

      visiting.delete(folder.id);
      visited.add(folder.id);
      orderedFolders.push(folder);
    }

    for (const folder of store.folders) addParentFirst(folder);

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      for (const user of store.users) {
        await client.query(
          `INSERT INTO users (id, full_name, email, nik, phone, password_hash, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [user.id, user.fullName, user.email, user.nik, user.phone, user.passwordHash, user.createdAt],
        );
      }

      for (const folder of orderedFolders) {
        await client.query(
          `INSERT INTO folders (id, owner_id, name, parent_id, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [folder.id, folder.ownerId, folder.name, folder.parentId, folder.createdAt, folder.updatedAt],
        );
      }

      await client.query("COMMIT");
      console.log(`Impor selesai: ${store.users.length} akun dan ${orderedFolders.length} folder.`);
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Impor data JSON gagal:", error instanceof Error ? error.message : error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}
