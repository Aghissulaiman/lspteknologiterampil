import path from "node:path";
import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import multer from "multer";
import { fileTypeFromBuffer } from "file-type";

const backendDirectory = path.dirname(fileURLToPath(import.meta.url));
const defaultUploadDirectory = path.resolve(backendDirectory, "..", "storage", "private");
export const privateUploadDirectory = path.resolve(process.env.PRIVATE_UPLOAD_DIR || defaultUploadDirectory);

function positiveInteger(value: string | undefined, fallback: number, setting: string) {
  if (!value) return fallback;
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < 1) throw new Error(`${setting} harus berupa bilangan bulat positif.`);
  return parsed;
}

export const maxUploadSizeBytes = positiveInteger(process.env.UPLOAD_MAX_FILE_SIZE_BYTES, 2 * 1024 * 1024, "UPLOAD_MAX_FILE_SIZE_BYTES");
export const allowedUploadMimeTypes = new Set(
  (process.env.UPLOAD_ALLOWED_MIME_TYPES || "application/pdf,image/jpeg,image/png")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean),
);

if (allowedUploadMimeTypes.size === 0) throw new Error("UPLOAD_ALLOWED_MIME_TYPES harus berisi minimal satu MIME type.");

export class UnsupportedUploadTypeError extends Error {
  constructor() {
    super("Tipe berkas tidak diizinkan atau tidak cocok dengan isi berkas.");
    this.name = "UnsupportedUploadTypeError";
  }
}

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: maxUploadSizeBytes, files: 1, fields: 20 },
  fileFilter: (_request, file, callback) => {
    if (!allowedUploadMimeTypes.has(file.mimetype.toLowerCase())) {
      callback(new UnsupportedUploadTypeError());
      return;
    }
    callback(null, true);
  },
});

export async function savePrivateUpload(file: Express.Multer.File) {
  const detected = await fileTypeFromBuffer(file.buffer);
  if (!detected || !allowedUploadMimeTypes.has(detected.mime.toLowerCase())) throw new UnsupportedUploadTypeError();

  await mkdir(privateUploadDirectory, { recursive: true, mode: 0o700 });
  const storageKey = `${randomUUID()}.${detected.ext}`;
  const absolutePath = path.resolve(privateUploadDirectory, storageKey);
  await writeFile(absolutePath, file.buffer, { flag: "wx", mode: 0o600 });
  return { storageKey, absolutePath, mimeType: detected.mime, sizeBytes: file.size };
}

export function privateFilePath(storageKey: string) {
  if (!/^[0-9a-f-]{36}\.[a-z0-9]+$/i.test(storageKey)) throw new Error("Storage key tidak valid.");
  const absolutePath = path.resolve(privateUploadDirectory, storageKey);
  const relative = path.relative(privateUploadDirectory, absolutePath);
  if (!relative || relative.startsWith("..") || path.isAbsolute(relative)) throw new Error("Storage key tidak valid.");
  return absolutePath;
}

export async function removePrivateUpload(storageKey: string) {
  await unlink(privateFilePath(storageKey));
}
