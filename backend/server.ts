import "./lib/env";
import express, { type ErrorRequestHandler } from "express";
import { getPool } from "./lib/server-db";
import { HttpError } from "./lib/certification-utils";
import authRoutes from "./routes/auth";
import folderRoutes from "./routes/folders";
import publicRoutes from "./routes/public";
import applicationRoutes from "./routes/applications";
import tukSubmissionRoutes from "./routes/tuk-submissions";
import assessorRoutes from "./routes/assessor";
import adminRoutes from "./routes/admin";
import adminSchemeRoutes from "./routes/admin-schemes";
import multer from "multer";

const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "256kb" }));

app.get("/health", (_request, response) => response.json({ ok: true }));
app.use("/api/auth", authRoutes);
app.use("/api/folders", folderRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/tuk-submissions", tukSubmissionRoutes);
app.use("/api/assessor", assessorRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/schemes", adminSchemeRoutes);

const apiErrorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error instanceof HttpError) return response.status(error.status).json({ error: error.message, details: error.details });
  if (error instanceof SyntaxError && "body" in error) return response.status(400).json({ error: "Format data tidak valid." });
  if (error instanceof multer.MulterError) {
    const status = error.code === "LIMIT_FILE_SIZE" ? 413 : 400;
    return response.status(status).json({ error: error.code === "LIMIT_FILE_SIZE" ? "Ukuran berkas melebihi batas." : "Unggahan tidak valid." });
  }
  if (error instanceof Error && error.name === "UnsupportedUploadTypeError") return response.status(415).json({ error: error.message });
  console.error("Permintaan API gagal:", error);
  return response.status(500).json({ error: "Permintaan belum dapat diproses." });
};

app.use(apiErrorHandler);
app.use((_request, response) => response.status(404).json({ error: "Endpoint tidak ditemukan." }));

async function start() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL belum diatur.");
  if (process.env.NODE_ENV === "production" && (!process.env.AUTH_SECRET || process.env.AUTH_SECRET.length < 32)) {
    throw new Error("AUTH_SECRET harus diatur dan memiliki minimal 32 karakter di production.");
  }
  await getPool().query("SELECT 1");
  const port = Number(process.env.PORT ?? 4000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("PORT tidak valid.");
  const server = app.listen(port, "0.0.0.0", () => console.log(`Express API berjalan di http://localhost:${port}`));
  const shutdown = () => {
    server.close(() => { void getPool().end().finally(() => process.exit(0)); });
  };
  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);
}

void start().catch(async (error) => {
  console.error("Express API gagal dijalankan:", error);
  if (process.env.DATABASE_URL) await getPool().end().catch(() => undefined);
  process.exitCode = 1;
});
