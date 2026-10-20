import { Router } from "express";
import { authenticate, authUser, requireRole } from "../lib/express-auth";
import { audit, cleanString, HttpError, isPlainObject, isUuid, recordTukStatus } from "../lib/certification-utils";
import { getPool, inTransaction } from "../lib/server-db";
import { newId } from "../lib/server-store";
import { privateFilePath, removePrivateUpload, savePrivateUpload, upload } from "../lib/uploads";

const router = Router();
router.use(authenticate, requireRole("participant"));

const tukRequiredDocuments = (process.env.TUK_REQUIRED_DOCUMENT_TYPES || "logo,company_profile,mou,layout")
  .split(",").map((value) => value.trim()).filter(Boolean);

function safeName(value: string) {
  return (value.replace(/[\x00-\x1f\x7f]/g, "").split(/[\\/]/).pop()?.trim() || "dokumen").slice(0, 255);
}

async function sendFile(response: import("express").Response, document: { storage_key: string; original_name: string; mime_type: string }) {
  response.set({ "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff", "Content-Type": document.mime_type });
  response.download(privateFilePath(document.storage_key), safeName(document.original_name), (error) => {
    if (error && !response.headersSent) response.status(404).json({ error: "Dokumen tidak ditemukan." });
  });
}

function validateProfile(value: unknown) {
  if (!isPlainObject(value)) throw new HttpError(400, "profile harus berupa objek.");
  const required = ["name", "address", "phone", "email", "siteType", "contactPerson"];
  const missing = required.filter((key) => !cleanString(value[key]));
  if (missing.length) throw new HttpError(400, "Profil TUK belum lengkap.", { missingFields: missing });
  if (cleanString(value.name).length > 200 || cleanString(value.address).length > 2000 || cleanString(value.phone).length > 30 || cleanString(value.email).length > 254 || cleanString(value.contactPerson).length > 200) {
    throw new HttpError(400, "Panjang salah satu kolom profil TUK melebihi batas.");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanString(value.email))) throw new HttpError(400, "Email TUK tidak valid.");
}

function editable(status: string) {
  if (status !== "draft" && status !== "revision_required") throw new HttpError(409, "Pengajuan hanya dapat diubah saat draft atau revision_required.");
}

router.get("/", async (_request, response) => {
  try {
    const submissions = await getPool().query(
      `SELECT t.id, t.status, t.profile, t.facility_checklist, t.review_note, t.submitted_at, t.created_at, t.updated_at,
              t.approved_test_site_id, COALESCE(json_agg(json_build_object('id', s.id, 'code', s.code, 'name', s.name))
                FILTER (WHERE s.id IS NOT NULL), '[]'::json) AS schemes
       FROM tuk_submissions t LEFT JOIN tuk_submission_schemes ts ON ts.tuk_submission_id = t.id
       LEFT JOIN certification_schemes s ON s.id = ts.scheme_id
       WHERE t.applicant_id = $1 GROUP BY t.id ORDER BY t.created_at DESC`, [authUser(response).id]);
    response.set("Cache-Control", "private, no-store").json({ submissions: submissions.rows });
  } catch (error) {
    console.error("Pengajuan TUK gagal dimuat:", error);
    response.status(500).json({ error: "Pengajuan TUK belum dapat dimuat." });
  }
});

router.post("/", async (request, response) => {
  if (!isPlainObject(request.body)) return response.status(400).json({ error: "Format data tidak valid." });
  const schemeIds = request.body.schemeIds;
  if (!Array.isArray(schemeIds) || !schemeIds.length || schemeIds.length > 100 || schemeIds.some((id) => !isUuid(id)) || new Set(schemeIds).size !== schemeIds.length) {
    return response.status(400).json({ error: "schemeIds harus berisi ID skema unik." });
  }
  if (request.body.profile !== undefined) {
    try { validateProfile(request.body.profile); } catch (error) {
      if (error instanceof HttpError) return response.status(error.status).json({ error: error.message, details: error.details });
      throw error;
    }
  }
  if (request.body.facilityChecklist !== undefined && !isPlainObject(request.body.facilityChecklist)) return response.status(400).json({ error: "facilityChecklist harus berupa objek." });
  try {
    const submission = await inTransaction(async (client) => {
      const schemes = await client.query("SELECT id FROM certification_schemes WHERE id = ANY($1::uuid[]) AND is_active = true", [schemeIds]);
      if (schemes.rowCount !== schemeIds.length) throw new HttpError(400, "Satu atau lebih skema tidak aktif atau tidak ditemukan.");
      const id = newId();
      await client.query("INSERT INTO tuk_submissions (id, applicant_id, profile, facility_checklist) VALUES ($1, $2, $3::jsonb, $4::jsonb)",
        [id, authUser(response).id, JSON.stringify(request.body.profile ?? {}), JSON.stringify(request.body.facilityChecklist ?? {})]);
      for (const schemeId of schemeIds) await client.query("INSERT INTO tuk_submission_schemes (tuk_submission_id, scheme_id) VALUES ($1, $2)", [id, schemeId]);
      await recordTukStatus(client, id, authUser(response), "", "draft", null, "tuk.draft_created");
      return { id, status: "draft" };
    });
    response.status(201).json({ submission });
  } catch (error) {
    if (error instanceof HttpError) return response.status(error.status).json({ error: error.message });
    console.error("Draft TUK gagal dibuat:", error);
    response.status(500).json({ error: "Draft pengajuan TUK belum dapat dibuat." });
  }
});

router.get("/:submissionId", async (request, response) => {
  const { submissionId } = request.params;
  if (!isUuid(submissionId)) return response.status(404).json({ error: "Pengajuan TUK tidak ditemukan." });
  try {
    const pool = getPool();
    const [submission, docs, schemes, history] = await Promise.all([
      pool.query("SELECT * FROM tuk_submissions WHERE id = $1 AND applicant_id = $2", [submissionId, authUser(response).id]),
      pool.query("SELECT id, document_type, original_name, mime_type, size_bytes, created_at FROM stored_documents WHERE tuk_submission_id = $1 ORDER BY created_at", [submissionId]),
      pool.query("SELECT s.id, s.code, s.name FROM tuk_submission_schemes ts JOIN certification_schemes s ON s.id = ts.scheme_id WHERE ts.tuk_submission_id = $1 ORDER BY s.code", [submissionId]),
      pool.query("SELECT from_status, to_status, reason, created_at FROM tuk_submission_status_history WHERE tuk_submission_id = $1 ORDER BY created_at", [submissionId]),
    ]);
    if (!submission.rowCount) return response.status(404).json({ error: "Pengajuan TUK tidak ditemukan." });
    response.set("Cache-Control", "private, no-store").json({ submission: submission.rows[0], documents: docs.rows, schemes: schemes.rows, history: history.rows });
  } catch (error) {
    console.error("Detail pengajuan TUK gagal dimuat:", error);
    response.status(500).json({ error: "Detail pengajuan TUK belum dapat dimuat." });
  }
});

router.patch("/:submissionId", async (request, response) => {
  const { submissionId } = request.params;
  if (!isUuid(submissionId) || !isPlainObject(request.body)) return response.status(400).json({ error: "Permintaan tidak valid." });
  if ("status" in request.body || "reviewedBy" in request.body || "approvedTestSiteId" in request.body) return response.status(400).json({ error: "Status pengajuan hanya dapat diubah oleh alur review." });
  try {
    const updated = await inTransaction(async (client) => {
      const current = await client.query("SELECT status FROM tuk_submissions WHERE id = $1 AND applicant_id = $2 FOR UPDATE", [submissionId, authUser(response).id]);
      if (!current.rowCount) throw new HttpError(404, "Pengajuan TUK tidak ditemukan.");
      editable(current.rows[0].status);
      if (request.body.profile !== undefined) validateProfile(request.body.profile);
      if (request.body.facilityChecklist !== undefined && !isPlainObject(request.body.facilityChecklist)) throw new HttpError(400, "facilityChecklist harus berupa objek.");
      const profile = request.body.profile ?? (await client.query("SELECT profile FROM tuk_submissions WHERE id = $1", [submissionId])).rows[0].profile;
      const checklist = request.body.facilityChecklist ?? (await client.query("SELECT facility_checklist FROM tuk_submissions WHERE id = $1", [submissionId])).rows[0].facility_checklist;
      await client.query("UPDATE tuk_submissions SET profile = $2::jsonb, facility_checklist = $3::jsonb, updated_at = now() WHERE id = $1", [submissionId, JSON.stringify(profile), JSON.stringify(checklist)]);
      if (request.body.schemeIds !== undefined) {
        const ids = request.body.schemeIds;
        if (!Array.isArray(ids) || !ids.length || ids.length > 100 || ids.some((id) => !isUuid(id)) || new Set(ids).size !== ids.length) throw new HttpError(400, "schemeIds harus berisi ID skema unik.");
        const valid = await client.query("SELECT id FROM certification_schemes WHERE id = ANY($1::uuid[]) AND is_active = true", [ids]);
        if (valid.rowCount !== ids.length) throw new HttpError(400, "Satu atau lebih skema tidak aktif atau tidak ditemukan.");
        await client.query("DELETE FROM tuk_submission_schemes WHERE tuk_submission_id = $1", [submissionId]);
        for (const schemeId of ids) await client.query("INSERT INTO tuk_submission_schemes (tuk_submission_id, scheme_id) VALUES ($1, $2)", [submissionId, schemeId]);
      }
      await audit(client, authUser(response), "tuk.draft_updated", "tuk_submission", submissionId);
      return { id: submissionId, updated: Object.keys(request.body) };
    });
    response.json({ submission: updated });
  } catch (error) {
    if (error instanceof HttpError) return response.status(error.status).json({ error: error.message, details: error.details });
    console.error("Pengajuan TUK gagal diperbarui:", error);
    response.status(500).json({ error: "Pengajuan TUK belum dapat diperbarui." });
  }
});

router.post("/:submissionId/documents", upload.single("file"), async (request, response) => {
  const { submissionId } = request.params;
  if (!isUuid(submissionId)) return response.status(404).json({ error: "Pengajuan TUK tidak ditemukan." });
  if (!request.file) return response.status(400).json({ error: "Berkas wajib dilampirkan pada field file." });
  const documentType = cleanString(request.body.documentType);
  if (!/^[a-zA-Z0-9_-]{1,80}$/.test(documentType)) return response.status(400).json({ error: "documentType tidak valid." });
  let saved: Awaited<ReturnType<typeof savePrivateUpload>> | undefined;
  try {
    const exists = await getPool().query("SELECT status FROM tuk_submissions WHERE id = $1 AND applicant_id = $2", [submissionId, authUser(response).id]);
    if (!exists.rowCount) return response.status(404).json({ error: "Pengajuan TUK tidak ditemukan." });
    editable(exists.rows[0].status);
    saved = await savePrivateUpload(request.file);
    const document = await inTransaction(async (client) => {
      const locked = await client.query("SELECT status FROM tuk_submissions WHERE id = $1 AND applicant_id = $2 FOR UPDATE", [submissionId, authUser(response).id]);
      if (!locked.rowCount) throw new HttpError(404, "Pengajuan TUK tidak ditemukan.");
      editable(locked.rows[0].status);
      const id = newId();
      const result = await client.query(
        `INSERT INTO stored_documents (id, uploaded_by, tuk_submission_id, document_type, category, original_name, mime_type, size_bytes, storage_key)
         VALUES ($1, $2, $3, $4, 'tuk', $5, $6, $7, $8) RETURNING id, document_type, original_name, mime_type, size_bytes, created_at`,
        [id, authUser(response).id, submissionId, documentType, safeName(request.file!.originalname), saved!.mimeType, saved!.sizeBytes, saved!.storageKey]);
      await audit(client, authUser(response), "tuk.document_uploaded", "tuk_submission", submissionId, { documentId: id, documentType });
      return result.rows[0];
    });
    response.status(201).json({ document });
  } catch (error) {
    if (saved) await removePrivateUpload(saved.storageKey).catch(() => undefined);
    if (error instanceof HttpError) return response.status(error.status).json({ error: error.message });
    if (error instanceof Error && error.name === "UnsupportedUploadTypeError") return response.status(415).json({ error: error.message });
    console.error("Dokumen TUK gagal diunggah:", error);
    response.status(500).json({ error: "Dokumen TUK belum dapat disimpan." });
  }
});

router.delete("/:submissionId/documents/:documentId", async (request, response) => {
  const { submissionId, documentId } = request.params;
  if (!isUuid(submissionId) || !isUuid(documentId)) return response.status(404).json({ error: "Dokumen tidak ditemukan." });
  try {
    const key = await inTransaction(async (client) => {
      const submission = await client.query("SELECT status FROM tuk_submissions WHERE id = $1 AND applicant_id = $2 FOR UPDATE", [submissionId, authUser(response).id]);
      if (!submission.rowCount) throw new HttpError(404, "Dokumen tidak ditemukan.");
      editable(submission.rows[0].status);
      const document = await client.query("DELETE FROM stored_documents WHERE id = $1 AND tuk_submission_id = $2 RETURNING storage_key", [documentId, submissionId]);
      if (!document.rowCount) throw new HttpError(404, "Dokumen tidak ditemukan.");
      await audit(client, authUser(response), "tuk.document_deleted", "tuk_submission", submissionId, { documentId });
      return document.rows[0].storage_key as string;
    });
    await removePrivateUpload(key).catch((error) => console.error("Berkas privat gagal dihapus:", error));
    response.json({ ok: true });
  } catch (error) {
    if (error instanceof HttpError) return response.status(error.status).json({ error: error.message });
    response.status(500).json({ error: "Dokumen TUK belum dapat dihapus." });
  }
});

router.get("/:submissionId/documents/:documentId", async (request, response) => {
  const { submissionId, documentId } = request.params;
  if (!isUuid(submissionId) || !isUuid(documentId)) return response.status(404).json({ error: "Dokumen tidak ditemukan." });
  try {
    const result = await getPool().query(
      `SELECT d.storage_key, d.original_name, d.mime_type FROM stored_documents d JOIN tuk_submissions t ON t.id = d.tuk_submission_id
       WHERE d.id = $1 AND d.tuk_submission_id = $2 AND t.applicant_id = $3`, [documentId, submissionId, authUser(response).id]);
    if (!result.rowCount) return response.status(404).json({ error: "Dokumen tidak ditemukan." });
    await sendFile(response, result.rows[0]);
  } catch (error) {
    console.error("Dokumen TUK gagal diunduh:", error);
    if (!response.headersSent) response.status(500).json({ error: "Dokumen belum dapat diunduh." });
  }
});

router.post("/:submissionId/submit", async (request, response) => {
  const { submissionId } = request.params;
  if (!isUuid(submissionId)) return response.status(404).json({ error: "Pengajuan TUK tidak ditemukan." });
  try {
    const result = await inTransaction(async (client) => {
      const current = await client.query("SELECT * FROM tuk_submissions WHERE id = $1 AND applicant_id = $2 FOR UPDATE", [submissionId, authUser(response).id]);
      const submission = current.rows[0];
      if (!submission) throw new HttpError(404, "Pengajuan TUK tidak ditemukan.");
      editable(submission.status);
      validateProfile(submission.profile);
      if (!isPlainObject(submission.facility_checklist) || Object.values(submission.facility_checklist).some((value) => typeof value !== "boolean")) throw new HttpError(400, "Checklist fasilitas harus berupa objek dengan nilai boolean.");
      const schemes = await client.query("SELECT count(*)::int AS count FROM tuk_submission_schemes WHERE tuk_submission_id = $1", [submissionId]);
      if (schemes.rows[0].count < 1) throw new HttpError(400, "Pilih minimal satu skema yang didukung TUK.");
      const docs = await client.query("SELECT document_type FROM stored_documents WHERE tuk_submission_id = $1", [submissionId]);
      const missing = tukRequiredDocuments.filter((code) => !docs.rows.some((doc: { document_type: string }) => doc.document_type === code));
      if (missing.length) throw new HttpError(400, "Dokumen pengajuan TUK belum lengkap.", { missingDocuments: missing });
      await client.query("UPDATE tuk_submissions SET status = 'submitted', submitted_at = now(), review_note = NULL, updated_at = now() WHERE id = $1", [submissionId]);
      await recordTukStatus(client, submissionId, authUser(response), submission.status, "submitted", null, "tuk.submitted");
      return { id: submissionId, status: "submitted" };
    });
    response.json({ submission: result });
  } catch (error) {
    if (error instanceof HttpError) return response.status(error.status).json({ error: error.message, details: error.details });
    console.error("Pengajuan TUK gagal dikirim:", error);
    response.status(500).json({ error: "Pengajuan TUK belum dapat dikirim." });
  }
});

export default router;
