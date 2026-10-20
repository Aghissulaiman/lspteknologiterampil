import path from "node:path";
import { fileURLToPath } from "node:url";
import express, { type ErrorRequestHandler, type Request } from "express";
import { loadEnvConfig } from "@next/env";
import { clearSessionCookie, getCurrentUser, setSessionCookie } from "./lib/express-auth";
import { getPool } from "./lib/server-db";
import {
  createFolder,
  createUser,
  deleteFolder,
  findFoldersByOwner,
  findUserByEmail,
  hashPassword,
  newId,
  toPublicFolder,
  toPublicUser,
  updateFolder,
  verifyPassword,
  type UserRecord,
} from "./lib/server-store";

const backendDirectory = path.dirname(fileURLToPath(import.meta.url));
loadEnvConfig(path.resolve(backendDirectory, "..", "frontend"));

const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "32kb" }));

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isObjectBody(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requireUser(request: Request, response: express.Response) {
  return getCurrentUser(request).then((user) => {
    if (!user) response.status(401).json({ error: "Silakan masuk terlebih dahulu." });
    return user;
  });
}

app.get("/health", (_request, response) => response.json({ ok: true }));

app.post("/api/auth/register", async (request, response) => {
  if (!isObjectBody(request.body)) return response.status(400).json({ error: "Format data tidak valid." });

  const body = request.body;
  const fullName = text(body.fullName);
  const nik = text(body.nik).replace(/\s/g, "");
  const phone = text(body.phone);
  const email = text(body.email).toLowerCase();
  const password = typeof body.password === "string" ? body.password : "";

  if (fullName.length < 2 || fullName.length > 100) {
    return response.status(400).json({ error: "Nama lengkap harus terdiri dari 2–100 karakter." });
  }
  if (!/^\d{16}$/.test(nik)) return response.status(400).json({ error: "NIK harus terdiri dari 16 angka." });
  if (!/^[+\d][\d\s()-]{7,19}$/.test(phone)) {
    return response.status(400).json({ error: "Nomor WhatsApp tidak valid." });
  }
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return response.status(400).json({ error: "Alamat email tidak valid." });
  }
  if (password.length < 8 || password.length > 128) {
    return response.status(400).json({ error: "Kata sandi harus terdiri dari 8–128 karakter." });
  }

  try {
    const user: UserRecord = {
      id: newId(),
      fullName,
      email,
      nik,
      phone,
      passwordHash: await hashPassword(password),
      createdAt: new Date().toISOString(),
    };
    const result = await createUser(user);

    if ("error" in result && result.error === "email-exists") {
      return response.status(409).json({ error: "Email sudah terdaftar." });
    }
    if ("error" in result && result.error === "nik-exists") {
      return response.status(409).json({ error: "NIK sudah terdaftar." });
    }

    setSessionCookie(response, user.id).status(201).json({ user: toPublicUser(result.user) });
  } catch (error) {
    console.error("Pendaftaran gagal:", error);
    response.status(500).json({ error: "Pendaftaran belum dapat diproses. Coba lagi." });
  }
});

app.post("/api/auth/login", async (request, response) => {
  if (!isObjectBody(request.body)) return response.status(400).json({ error: "Format data tidak valid." });

  const email = text(request.body.email).toLowerCase();
  const password = typeof request.body.password === "string" ? request.body.password : "";
  if (!email || !password || email.length > 254 || password.length > 128) {
    return response.status(400).json({ error: "Email dan kata sandi wajib diisi." });
  }

  try {
    const user = await findUserByEmail(email);
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return response.status(401).json({ error: "Email atau kata sandi salah." });
    }

    setSessionCookie(response, user.id).json({ user: toPublicUser(user) });
  } catch (error) {
    console.error("Masuk gagal:", error);
    response.status(500).json({ error: "Masuk belum dapat diproses. Coba lagi." });
  }
});

app.post("/api/auth/logout", (_request, response) => {
  clearSessionCookie(response).json({ ok: true });
});

app.get("/api/auth/me", async (request, response) => {
  try {
    const user = await getCurrentUser(request);
    if (!user) return response.status(401).json({ user: null });
    response.set("Cache-Control", "no-store").json({ user });
  } catch (error) {
    console.error("Pemeriksaan sesi gagal:", error);
    response.status(500).json({ error: "Sesi belum dapat diperiksa." });
  }
});

app.get("/api/folders", async (request, response) => {
  try {
    const user = await requireUser(request, response);
    if (!user) return;
    const folders = await findFoldersByOwner(user.id);
    response.set("Cache-Control", "no-store").json({ folders: folders.map(toPublicFolder) });
  } catch (error) {
    console.error("Folder gagal dimuat:", error);
    response.status(500).json({ error: "Folder belum dapat dimuat." });
  }
});

app.post("/api/folders", async (request, response) => {
  const user = await requireUser(request, response).catch((error) => {
    console.error("Pemeriksaan sesi gagal:", error);
    response.status(500).json({ error: "Sesi belum dapat diperiksa." });
    return null;
  });
  if (!user) return;
  if (!isObjectBody(request.body)) return response.status(400).json({ error: "Format data tidak valid." });

  const name = text(request.body.name);
  const rawParentId = request.body.parentId;
  const parentId = rawParentId === null || rawParentId === undefined || rawParentId === "" ? null : rawParentId;
  if (name.length < 1 || name.length > 100) {
    return response.status(400).json({ error: "Nama folder harus terdiri dari 1–100 karakter." });
  }
  if (parentId !== null && typeof parentId !== "string") {
    return response.status(400).json({ error: "Folder induk tidak valid." });
  }

  try {
    const result = await createFolder(user.id, name, parentId);
    if ("error" in result) {
      const duplicate = result.error === "duplicate";
      return response.status(duplicate ? 409 : 404).json({
        error: duplicate ? "Folder dengan nama itu sudah ada di lokasi ini." : "Folder induk tidak ditemukan.",
      });
    }
    response.status(201).json({ folder: toPublicFolder(result.folder) });
  } catch (error) {
    console.error("Folder gagal dibuat:", error);
    response.status(500).json({ error: "Folder belum dapat dibuat." });
  }
});

app.patch("/api/folders/:folderId", async (request, response) => {
  const user = await requireUser(request, response).catch((error) => {
    console.error("Pemeriksaan sesi gagal:", error);
    response.status(500).json({ error: "Sesi belum dapat diperiksa." });
    return null;
  });
  if (!user) return;
  if (!isObjectBody(request.body)) return response.status(400).json({ error: "Format data tidak valid." });

  const name = typeof request.body.name === "string" ? request.body.name.trim() : undefined;
  const parentId = request.body.parentId;
  if (name !== undefined && (name.length < 1 || name.length > 100)) {
    return response.status(400).json({ error: "Nama folder harus terdiri dari 1–100 karakter." });
  }
  if (parentId !== undefined && parentId !== null && typeof parentId !== "string") {
    return response.status(400).json({ error: "Folder induk tidak valid." });
  }

  try {
    const normalizedParentId = parentId === "" ? null : parentId as string | null | undefined;
    const result = await updateFolder(user.id, request.params.folderId, name, normalizedParentId);
    if ("error" in result) {
      if (result.error === "not-found") return response.status(404).json({ error: "Folder tidak ditemukan." });
      if (result.error === "parent-not-found") return response.status(404).json({ error: "Folder induk tidak ditemukan." });
      if (result.error === "cycle") {
        return response.status(400).json({ error: "Folder tidak dapat dipindahkan ke dalam turunannya sendiri." });
      }
      return response.status(409).json({ error: "Folder dengan nama itu sudah ada di lokasi ini." });
    }
    response.json({ folder: toPublicFolder(result.folder) });
  } catch (error) {
    console.error("Folder gagal diperbarui:", error);
    response.status(500).json({ error: "Folder belum dapat diperbarui." });
  }
});

app.delete("/api/folders/:folderId", async (request, response) => {
  const user = await requireUser(request, response).catch((error) => {
    console.error("Pemeriksaan sesi gagal:", error);
    response.status(500).json({ error: "Sesi belum dapat diperiksa." });
    return null;
  });
  if (!user) return;

  try {
    const result = await deleteFolder(user.id, request.params.folderId);
    if (result === "not-found") return response.status(404).json({ error: "Folder tidak ditemukan." });
    if (result === "not-empty") {
      return response.status(409).json({ error: "Kosongkan atau pindahkan subfolder sebelum menghapus folder ini." });
    }
    response.json({ ok: true });
  } catch (error) {
    console.error("Folder gagal dihapus:", error);
    response.status(500).json({ error: "Folder belum dapat dihapus." });
  }
});

const jsonErrorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error instanceof SyntaxError && "body" in error) {
    return response.status(400).json({ error: "Format data tidak valid." });
  }
  console.error("Permintaan API gagal:", error);
  response.status(500).json({ error: "Permintaan belum dapat diproses." });
};

app.use(jsonErrorHandler);
app.use((_request, response) => response.status(404).json({ error: "Endpoint tidak ditemukan." }));

async function start() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL belum diatur.");
  if (process.env.NODE_ENV === "production" && (!process.env.AUTH_SECRET || process.env.AUTH_SECRET.length < 32)) {
    throw new Error("AUTH_SECRET harus diatur dan memiliki minimal 32 karakter di production.");
  }

  await getPool().query("SELECT 1");
  const port = Number(process.env.PORT ?? 4000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("PORT tidak valid.");

  const server = app.listen(port, "0.0.0.0", () => {
    console.log(`Express API berjalan di http://localhost:${port}`);
  });

  const shutdown = () => {
    server.close(() => {
      void getPool().end().finally(() => process.exit(0));
    });
  };
  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);
}

void start().catch(async (error) => {
  console.error("Express API gagal dijalankan:", error);
  await getPool().end().catch(() => undefined);
  process.exitCode = 1;
});
