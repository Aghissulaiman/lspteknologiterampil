import { Router } from "express";
import { authenticate, authUser, requireRole } from "../lib/express-auth";
import { createFolder, deleteFolder, findFoldersByOwner, toPublicFolder, updateFolder } from "../lib/server-store";
import { cleanString, isPlainObject } from "../lib/certification-utils";

const router = Router();
router.use(authenticate, requireRole("participant"));

router.get("/", async (_request, response) => {
  try {
    const folders = await findFoldersByOwner(authUser(response).id);
    response.set("Cache-Control", "no-store").json({ folders: folders.map(toPublicFolder) });
  } catch (error) {
    console.error("Folder gagal dimuat:", error);
    response.status(500).json({ error: "Folder belum dapat dimuat." });
  }
});

router.post("/", async (request, response) => {
  if (!isPlainObject(request.body)) return response.status(400).json({ error: "Format data tidak valid." });
  const name = cleanString(request.body.name);
  const rawParentId = request.body.parentId;
  const parentId = rawParentId === null || rawParentId === undefined || rawParentId === "" ? null : rawParentId;
  if (name.length < 1 || name.length > 100) {
    return response.status(400).json({ error: "Nama folder harus terdiri dari 1–100 karakter." });
  }
  if (parentId !== null && typeof parentId !== "string") {
    return response.status(400).json({ error: "Folder induk tidak valid." });
  }

  try {
    const result = await createFolder(authUser(response).id, name, parentId);
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

router.patch("/:folderId", async (request, response) => {
  if (!isPlainObject(request.body)) return response.status(400).json({ error: "Format data tidak valid." });
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
    const result = await updateFolder(authUser(response).id, request.params.folderId, name, normalizedParentId);
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

router.delete("/:folderId", async (request, response) => {
  try {
    const result = await deleteFolder(authUser(response).id, request.params.folderId);
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

export default router;
