import { Pool, type PoolClient } from "pg";

type GlobalWithPostgresPool = typeof globalThis & {
  lspPostgresPool?: Pool;
};

const globalWithPostgresPool = globalThis as GlobalWithPostgresPool;

export function getPool() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL belum diatur. Isi variabel ini sebelum menjalankan aplikasi.");
  }

  if (!globalWithPostgresPool.lspPostgresPool) {
    globalWithPostgresPool.lspPostgresPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 10,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
    });
  }

  return globalWithPostgresPool.lspPostgresPool;
}

export async function inTransaction<T>(work: (client: PoolClient) => Promise<T>) {
  const client = await getPool().connect();

  try {
    await client.query("BEGIN");
    const result = await work(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
