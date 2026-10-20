import { Router } from "express";
import { authenticate, authUser, requireRole } from "../lib/express-auth";
import { audit, cleanString, HttpError, isPlainObject, isUuid } from "../lib/certification-utils";
import { allowedUploadMimeTypes } from "../lib/uploads";
import { getPool, inTransaction } from "../lib/server-db";
import { newId } from "../lib/server-store";

const router = Router();
router.use(authenticate, requireRole("admin_lsp"));

function structureFrom(body: Record<string, unknown>) {
  if (!Array.isArray(body.units) || body.units.length === 0 || body.units.length > 500) {
    throw new HttpError(400, "Skema harus memiliki 1–500 unit kompetensi.");
  }
  const units: Array<{ code: string; title: string; description: string; sortOrder: number }> = [];
  const unitCodes = new Set<string>();
  for (const value of body.units) {
    if (!isPlainObject(value)) throw new HttpError(400, "Format unit kompetensi tidak valid.");
    const code = cleanString(value.code);
    const title = cleanString(value.title);
    const description = cleanString(value.description);
    const sortOrder = Number.isSafeInteger(value.sortOrder) && Number(value.sortOrder) >= 0 ? Number(value.sortOrder) : units.length;
    if (!/^[a-zA-Z0-9_-]{1,80}$/.test(code) || title.length < 2 || title.length > 250 || description.length > 5000) {
      throw new HttpError(400, "Kode, nama, atau deskripsi unit kompetensi tidak valid.");
    }
    if (unitCodes.has(code.toLowerCase())) throw new HttpError(400, "Kode unit kompetensi tidak boleh berulang.");
    unitCodes.add(code.toLowerCase());
    units.push({ code, title, description, sortOrder });
  }

  const documentRequirements: Array<{ code: string; label: string; category: string; isRequired: boolean; allowedMimeTypes: string[] }> = [];
  const documentCodes = new Set<string>();
  if (body.documentRequirements !== undefined && !Array.isArray(body.documentRequirements)) {
    throw new HttpError(400, "documentRequirements harus berupa array.");
  }
  for (const value of (body.documentRequirements ?? []) as unknown[]) {
    if (!isPlainObject(value)) throw new HttpError(400, "Format persyaratan dokumen tidak valid.");
    const code = cleanString(value.code);
    const label = cleanString(value.label);
    const category = cleanString(value.category);
    const isRequired = value.isRequired !== false;
    const mimeTypes = Array.isArray(value.allowedMimeTypes)
      ? value.allowedMimeTypes.map((mime) => cleanString(mime).toLowerCase())
      : [...allowedUploadMimeTypes];
    if (!/^[a-zA-Z0-9_-]{1,80}$/.test(code) || label.length < 2 || label.length > 200) {
      throw new HttpError(400, "Kode atau label persyaratan dokumen tidak valid.");
    }
    if (category !== "administrative" && category !== "portfolio") {
      throw new HttpError(400, "Kategori persyaratan dokumen harus administrative atau portfolio.");
    }
    if (documentCodes.has(code.toLowerCase())) throw new HttpError(400, "Kode persyaratan dokumen tidak boleh berulang.");
    if (!mimeTypes.length || mimeTypes.some((mime) => !allowedUploadMimeTypes.has(mime))) {
      throw new HttpError(400, "Tipe berkas persyaratan harus berasal dari UPLOAD_ALLOWED_MIME_TYPES.");
    }
    documentCodes.add(code.toLowerCase());
    documentRequirements.push({ code, label, category, isRequired, allowedMimeTypes: mimeTypes });
  }
  return { units, documentRequirements };
}

async function insertStructure(client: import("pg").PoolClient, schemeId: string, structure: ReturnType<typeof structureFrom>) {
  for (const unit of structure.units) {
    await client.query(
      `INSERT INTO competency_units (id, scheme_id, code, title, description, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [newId(), schemeId, unit.code, unit.title, unit.description, unit.sortOrder],
    );
  }
  for (const document of structure.documentRequirements) {
    await client.query(
      `INSERT INTO scheme_document_requirements (id, scheme_id, code, label, category, is_required, allowed_mime_types)
       VALUES ($1, $2, $3, $4, $5, $6, $7::text[])`,
      [newId(), schemeId, document.code, document.label, document.category, document.isRequired, document.allowedMimeTypes],
    );
  }
}

router.get("/", async (_request, response) => {
  try {
    const result = await getPool().query(
      `SELECT s.id, s.code, s.name, s.category, s.level, s.description, s.requirements,
              s.is_public, s.is_active, s.created_at, s.updated_at,
              count(DISTINCT u.id)::int AS unit_count, count(DISTINCT d.id)::int AS document_requirement_count
       FROM certification_schemes s
       LEFT JOIN competency_units u ON u.scheme_id = s.id
       LEFT JOIN scheme_document_requirements d ON d.scheme_id = s.id
       GROUP BY s.id ORDER BY s.name, s.code`,
    );
    response.set("Cache-Control", "private, no-store").json({ schemes: result.rows });
  } catch (error) {
    console.error("Skema gagal dimuat:", error);
    response.status(500).json({ error: "Daftar skema belum dapat dimuat." });
  }
});

router.post("/", async (request, response) => {
  if (!isPlainObject(request.body)) return response.status(400).json({ error: "Format data tidak valid." });
  const body = request.body;
  const code = cleanString(body.code).toUpperCase();
  const name = cleanString(body.name);
  if (!/^[A-Z0-9][A-Z0-9_-]{1,49}$/.test(code) || name.length < 2 || name.length > 200) {
    return response.status(400).json({ error: "Kode atau nama skema tidak valid." });
  }
  if (body.requirements !== undefined && !isPlainObject(body.requirements)) {
    return response.status(400).json({ error: "requirements harus berupa objek." });
  }

  try {
    const structure = structureFrom(body);
    const schemeId = await inTransaction(async (client) => {
      const id = newId();
      await client.query(
        `INSERT INTO certification_schemes
           (id, code, name, category, level, description, requirements, is_public, is_active, created_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8, $9, $10)`,
        [id, code, name, cleanString(body.category), cleanString(body.level), cleanString(body.description),
          JSON.stringify(body.requirements ?? {}), body.isPublic === true, body.isActive !== false, authUser(response).id],
      );
      await insertStructure(client, id, structure);
      await audit(client, authUser(response), "scheme.created", "scheme", id, { code, unitCount: structure.units.length });
      return id;
    });
    response.status(201).json({ schemeId });
  } catch (error) {
    if (error instanceof HttpError) return response.status(error.status).json({ error: error.message });
    if ((error as { code?: string }).code === "23505") return response.status(409).json({ error: "Kode skema sudah digunakan." });
    console.error("Skema gagal dibuat:", error);
    response.status(500).json({ error: "Skema belum dapat dibuat." });
  }
});

router.get("/:schemeId", async (request, response) => {
  if (!isUuid(request.params.schemeId)) return response.status(400).json({ error: "schemeId tidak valid." });
  try {
    const pool = getPool();
    const [scheme, units, documents] = await Promise.all([
      pool.query("SELECT * FROM certification_schemes WHERE id = $1", [request.params.schemeId]),
      pool.query("SELECT * FROM competency_units WHERE scheme_id = $1 ORDER BY sort_order, code", [request.params.schemeId]),
      pool.query("SELECT * FROM scheme_document_requirements WHERE scheme_id = $1 ORDER BY category, code", [request.params.schemeId]),
    ]);
    if (!scheme.rowCount) return response.status(404).json({ error: "Skema tidak ditemukan." });
    response.set("Cache-Control", "private, no-store").json({ scheme: { ...scheme.rows[0], units: units.rows, documentRequirements: documents.rows } });
  } catch (error) {
    console.error("Detail skema gagal dimuat:", error);
    response.status(500).json({ error: "Detail skema belum dapat dimuat." });
  }
});

router.patch("/:schemeId", async (request, response) => {
  if (!isUuid(request.params.schemeId) || !isPlainObject(request.body)) {
    return response.status(400).json({ error: "Permintaan tidak valid." });
  }
  const body = request.body;
  if ("code" in body) return response.status(400).json({ error: "Kode skema tidak dapat diganti setelah dibuat." });
  if (body.requirements !== undefined && !isPlainObject(body.requirements)) {
    return response.status(400).json({ error: "requirements harus berupa objek." });
  }
  if (body.isPublic !== undefined && typeof body.isPublic !== "boolean") return response.status(400).json({ error: "isPublic harus boolean." });
  if (body.isActive !== undefined && typeof body.isActive !== "boolean") return response.status(400).json({ error: "isActive harus boolean." });

  try {
    const result = await inTransaction(async (client) => {
      const updated = await client.query(
        `UPDATE certification_schemes SET
           name = COALESCE($2, name), category = COALESCE($3, category), level = COALESCE($4, level),
           description = COALESCE($5, description), requirements = COALESCE($6::jsonb, requirements),
           is_public = COALESCE($7, is_public), is_active = COALESCE($8, is_active), updated_at = now()
         WHERE id = $1 RETURNING id, code, name, is_public, is_active, updated_at`,
        [request.params.schemeId, body.name === undefined ? null : cleanString(body.name),
          body.category === undefined ? null : cleanString(body.category), body.level === undefined ? null : cleanString(body.level),
          body.description === undefined ? null : cleanString(body.description),
          body.requirements === undefined ? null : JSON.stringify(body.requirements), body.isPublic ?? null, body.isActive ?? null],
      );
      if (!updated.rowCount) throw new HttpError(404, "Skema tidak ditemukan.");
      await audit(client, authUser(response), "scheme.updated", "scheme", request.params.schemeId, { fields: Object.keys(body) });
      return updated.rows[0];
    });
    response.json({ scheme: result });
  } catch (error) {
    if (error instanceof HttpError) return response.status(error.status).json({ error: error.message });
    console.error("Skema gagal diperbarui:", error);
    response.status(500).json({ error: "Skema belum dapat diperbarui." });
  }
});

router.put("/:schemeId/structure", async (request, response) => {
  if (!isUuid(request.params.schemeId) || !isPlainObject(request.body)) {
    return response.status(400).json({ error: "Permintaan tidak valid." });
  }
  try {
    const structure = structureFrom(request.body);
    await inTransaction(async (client) => {
      const scheme = await client.query("SELECT id FROM certification_schemes WHERE id = $1 FOR UPDATE", [request.params.schemeId]);
      if (!scheme.rowCount) throw new HttpError(404, "Skema tidak ditemukan.");
      const applications = await client.query("SELECT id FROM certification_applications WHERE scheme_id = $1 LIMIT 1", [request.params.schemeId]);
      if (applications.rowCount) throw new HttpError(409, "Struktur unit/dokumen tidak dapat diganti setelah ada permohonan.");
      await client.query("DELETE FROM competency_units WHERE scheme_id = $1", [request.params.schemeId]);
      await client.query("DELETE FROM scheme_document_requirements WHERE scheme_id = $1", [request.params.schemeId]);
      await insertStructure(client, request.params.schemeId, structure);
      await audit(client, authUser(response), "scheme.structure_updated", "scheme", request.params.schemeId, {
        unitCount: structure.units.length,
        documentRequirementCount: structure.documentRequirements.length,
      });
    });
    response.json({ ok: true });
  } catch (error) {
    if (error instanceof HttpError) return response.status(error.status).json({ error: error.message });
    console.error("Struktur skema gagal diperbarui:", error);
    response.status(500).json({ error: "Struktur skema belum dapat diperbarui." });
  }
});

export default router;
