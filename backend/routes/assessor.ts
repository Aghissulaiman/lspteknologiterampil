import { randomUUID } from "node:crypto";
import { Router } from "express";
import { authenticate, authUser, requireRole } from "../lib/express-auth";
import { audit, cleanString, HttpError, isPlainObject, isUuid } from "../lib/certification-utils";
import { getPool, inTransaction } from "../lib/server-db";
import { privateFilePath } from "../lib/uploads";

const router = Router();
router.use(authenticate, requireRole("assessor"));

function safeName(value: string) {
  return (value.replace(/[\x00-\x1f\x7f]/g, "").split(/[\\/]/).pop()?.trim() || "dokumen").slice(0, 255);
}

router.get("/", async (_request, response) => {
  try {
    const result = await getPool().query(
      `SELECT a.id AS application_id, a.status, a.submitted_at, s.code AS scheme_code, s.name AS scheme_name,
              u.full_name AS participant_name, sc.starts_at, sc.ends_at, t.name AS test_site_name,
              x.pre_assessment_outcome, x.recommendation, x.recommended_at
       FROM assessments x JOIN certification_applications a ON a.id = x.application_id
       JOIN certification_schemes s ON s.id = a.scheme_id JOIN users u ON u.id = a.participant_id
       JOIN assessment_schedules sc ON sc.id = a.schedule_id JOIN test_sites t ON t.id = sc.test_site_id
       WHERE x.assessor_id = $1 ORDER BY sc.starts_at, a.created_at DESC`, [authUser(response).id]);
    response.set("Cache-Control", "private, no-store").json({ assessments: result.rows });
  } catch (error) {
    console.error("Daftar asesmen gagal dimuat:", error);
    response.status(500).json({ error: "Daftar asesmen belum dapat dimuat." });
  }
});

router.get("/:applicationId", async (request, response) => {
  const { applicationId } = request.params;
  if (!isUuid(applicationId)) return response.status(404).json({ error: "Asesmen tidak ditemukan." });
  try {
    const pool = getPool();
    const [assessment, units, documents, selfAssessment, results] = await Promise.all([
      pool.query(
        `SELECT a.id, a.status, a.apl01, a.submission_snapshot, a.submitted_at, s.code AS scheme_code, s.name AS scheme_name,
                u.full_name AS participant_name, u.email AS participant_email, sc.starts_at, sc.ends_at,
                t.name AS test_site_name, t.address AS test_site_address, x.id AS assessment_id,
                x.pre_assessment_outcome, x.pre_assessment_notes, x.assessment_notes, x.recommendation, x.recommendation_note, x.recommended_at
         FROM assessments x JOIN certification_applications a ON a.id = x.application_id
         JOIN certification_schemes s ON s.id = a.scheme_id JOIN users u ON u.id = a.participant_id
         JOIN assessment_schedules sc ON sc.id = a.schedule_id JOIN test_sites t ON t.id = sc.test_site_id
         WHERE a.id = $1 AND x.assessor_id = $2`, [applicationId, authUser(response).id]),
      pool.query("SELECT id, code, title, description, sort_order FROM competency_units WHERE scheme_id = (SELECT scheme_id FROM certification_applications WHERE id = $1) ORDER BY sort_order, code", [applicationId]),
      pool.query("SELECT id, document_type, category, original_name, mime_type, size_bytes, created_at FROM stored_documents WHERE application_id = $1 ORDER BY created_at", [applicationId]),
      pool.query(
        `SELECT r.unit_id, r.self_assessment, r.notes, COALESCE(json_agg(json_build_object('id', d.id, 'documentType', d.document_type, 'originalName', d.original_name)) FILTER (WHERE d.id IS NOT NULL), '[]'::json) AS evidence
         FROM application_apl02 r LEFT JOIN application_apl02_evidence e ON e.application_id = r.application_id AND e.unit_id = r.unit_id
         LEFT JOIN stored_documents d ON d.id = e.document_id WHERE r.application_id = $1 GROUP BY r.application_id, r.unit_id`, [applicationId]),
      pool.query(
        `SELECT r.unit_id, r.result, r.evidence_notes, r.notes,
                COALESCE(json_agg(json_build_object('id', d.id, 'documentType', d.document_type, 'originalName', d.original_name)) FILTER (WHERE d.id IS NOT NULL), '[]'::json) AS evidence
         FROM assessment_unit_results r LEFT JOIN assessment_unit_evidence e ON e.assessment_id = r.assessment_id AND e.unit_id = r.unit_id
         LEFT JOIN stored_documents d ON d.id = e.document_id WHERE r.assessment_id = (SELECT id FROM assessments WHERE application_id = $1 AND assessor_id = $2)
         GROUP BY r.assessment_id, r.unit_id`, [applicationId, authUser(response).id]),
    ]);
    if (!assessment.rowCount) return response.status(404).json({ error: "Asesmen tidak ditemukan." });
    response.set("Cache-Control", "private, no-store").json({ assessment: assessment.rows[0], units: units.rows, documents: documents.rows, apl02: selfAssessment.rows, unitResults: results.rows });
  } catch (error) {
    console.error("Detail asesmen gagal dimuat:", error);
    response.status(500).json({ error: "Detail asesmen belum dapat dimuat." });
  }
});

router.patch("/:applicationId/pre-assessment", async (request, response) => {
  const { applicationId } = request.params;
  if (!isUuid(applicationId) || !isPlainObject(request.body)) return response.status(400).json({ error: "Permintaan tidak valid." });
  const outcome = cleanString(request.body.outcome);
  const notes = cleanString(request.body.notes);
  if (outcome.length < 1 || outcome.length > 100 || notes.length > 5000) return response.status(400).json({ error: "Outcome wajib diisi (maksimal 100 karakter) dan catatan maksimal 5000 karakter." });
  try {
    await inTransaction(async (client) => {
      const result = await client.query(
        `UPDATE assessments x SET pre_assessment_outcome = $3, pre_assessment_notes = $4, updated_at = now()
         FROM certification_applications a WHERE x.application_id = a.id AND x.application_id = $1 AND x.assessor_id = $2
           AND a.status = 'assessment_scheduled' AND x.recommendation IS NULL RETURNING x.id`,
        [applicationId, authUser(response).id, outcome, notes]);
      if (!result.rowCount) throw new HttpError(404, "Asesmen aktif yang ditugaskan kepada Anda tidak ditemukan.");
      await audit(client, authUser(response), "assessment.pre_assessment_recorded", "application", applicationId, { outcome });
    });
    response.json({ ok: true });
  } catch (error) {
    if (error instanceof HttpError) return response.status(error.status).json({ error: error.message });
    console.error("Pra-asesmen gagal disimpan:", error);
    response.status(500).json({ error: "Pra-asesmen belum dapat disimpan." });
  }
});

router.put("/:applicationId/units", async (request, response) => {
  const { applicationId } = request.params;
  const results = request.body?.results;
  if (!isUuid(applicationId) || !Array.isArray(results) || results.length > 500 || results.some((entry) => !isPlainObject(entry))) return response.status(400).json({ error: "results harus berupa array yang valid." });
  try {
    const savedCount = await inTransaction(async (client) => {
      const assignment = await client.query(
        `SELECT x.id, a.scheme_id FROM assessments x JOIN certification_applications a ON a.id = x.application_id
         WHERE x.application_id = $1 AND x.assessor_id = $2 AND a.status = 'assessment_scheduled' AND x.recommendation IS NULL FOR UPDATE OF x`,
        [applicationId, authUser(response).id]);
      const assessment = assignment.rows[0];
      if (!assessment) throw new HttpError(404, "Asesmen aktif yang ditugaskan kepada Anda tidak ditemukan.");
      const units = await client.query("SELECT id FROM competency_units WHERE scheme_id = $1", [assessment.scheme_id]);
      const validUnitIds = new Set(units.rows.map((unit: { id: string }) => unit.id));
      const ids = results.map((entry: Record<string, unknown>) => entry.unitId);
      if (new Set(ids).size !== ids.length || ids.some((id: unknown) => !isUuid(id) || !validUnitIds.has(id))) throw new HttpError(400, "Unit kompetensi tidak valid atau berulang.");
      const documentIds = [...new Set(results.flatMap((entry: Record<string, unknown>) => Array.isArray(entry.evidenceDocumentIds) ? entry.evidenceDocumentIds : []))];
      if (documentIds.some((id) => !isUuid(id))) throw new HttpError(400, "ID bukti tidak valid.");
      if (documentIds.length) {
        const docs = await client.query("SELECT id FROM stored_documents WHERE application_id = $1 AND id = ANY($2::uuid[])", [applicationId, documentIds]);
        if (docs.rowCount !== documentIds.length) throw new HttpError(400, "Bukti harus berasal dari dokumen permohonan yang sedang dinilai.");
      }
      for (const entry of results as Array<Record<string, unknown>>) {
        const resultValue = cleanString(entry.result);
        const notes = cleanString(entry.notes);
        const evidenceNotes = cleanString(entry.evidenceNotes);
        if (!isUuid(entry.unitId) || !["competent", "not_competent"].includes(resultValue) || notes.length > 5000 || evidenceNotes.length > 5000) throw new HttpError(400, "Hasil unit atau catatan tidak valid.");
        await client.query(
          `INSERT INTO assessment_unit_results (assessment_id, unit_id, result, evidence_notes, notes)
           VALUES ($1, $2, $3, $4, $5) ON CONFLICT (assessment_id, unit_id)
           DO UPDATE SET result = EXCLUDED.result, evidence_notes = EXCLUDED.evidence_notes, notes = EXCLUDED.notes, updated_at = now()`,
          [assessment.id, entry.unitId, resultValue, evidenceNotes, notes]);
        await client.query("DELETE FROM assessment_unit_evidence WHERE assessment_id = $1 AND unit_id = $2", [assessment.id, entry.unitId]);
        for (const documentId of Array.isArray(entry.evidenceDocumentIds) ? [...new Set(entry.evidenceDocumentIds)] : []) {
          await client.query("INSERT INTO assessment_unit_evidence (assessment_id, unit_id, document_id) VALUES ($1, $2, $3)", [assessment.id, entry.unitId, documentId]);
        }
      }
      await audit(client, authUser(response), "assessment.unit_results_updated", "application", applicationId, { resultCount: results.length });
      return results.length;
    });
    response.json({ ok: true, savedCount });
  } catch (error) {
    if (error instanceof HttpError) return response.status(error.status).json({ error: error.message });
    console.error("Hasil unit gagal disimpan:", error);
    response.status(500).json({ error: "Hasil unit belum dapat disimpan." });
  }
});

router.patch("/:applicationId/notes", async (request, response) => {
  const { applicationId } = request.params;
  if (!isUuid(applicationId) || !isPlainObject(request.body)) return response.status(400).json({ error: "Permintaan tidak valid." });
  const notes = cleanString(request.body.notes);
  if (notes.length > 10000) return response.status(400).json({ error: "Catatan asesmen maksimal 10000 karakter." });
  try {
    await inTransaction(async (client) => {
      const result = await client.query(
        `UPDATE assessments x SET assessment_notes = $3, updated_at = now() FROM certification_applications a
         WHERE x.application_id = a.id AND x.application_id = $1 AND x.assessor_id = $2 AND a.status = 'assessment_scheduled'
           AND x.recommendation IS NULL RETURNING x.id`, [applicationId, authUser(response).id, notes]);
      if (!result.rowCount) throw new HttpError(404, "Asesmen aktif yang ditugaskan kepada Anda tidak ditemukan.");
      await audit(client, authUser(response), "assessment.notes_updated", "application", applicationId);
    });
    response.json({ ok: true });
  } catch (error) {
    if (error instanceof HttpError) return response.status(error.status).json({ error: error.message });
    response.status(500).json({ error: "Catatan asesmen belum dapat disimpan." });
  }
});

router.post("/:applicationId/recommendation", async (request, response) => {
  const { applicationId } = request.params;
  if (!isUuid(applicationId) || !isPlainObject(request.body)) return response.status(400).json({ error: "Permintaan tidak valid." });
  const recommendation = cleanString(request.body.recommendation);
  const note = cleanString(request.body.note);
  if (!["competent", "not_competent"].includes(recommendation) || note.length > 5000) return response.status(400).json({ error: "Rekomendasi harus competent atau not_competent; catatan maksimal 5000 karakter." });
  try {
    await inTransaction(async (client) => {
      const assigned = await client.query(
        `SELECT x.id, x.pre_assessment_outcome, a.status, a.scheme_id FROM assessments x JOIN certification_applications a ON a.id = x.application_id
         WHERE x.application_id = $1 AND x.assessor_id = $2 FOR UPDATE OF x, a`, [applicationId, authUser(response).id]);
      const assignment = assigned.rows[0];
      if (!assignment || assignment.status !== "assessment_scheduled") throw new HttpError(404, "Asesmen aktif yang ditugaskan kepada Anda tidak ditemukan.");
      if (assignment.pre_assessment_outcome === null) throw new HttpError(409, "Catat pra-asesmen sebelum memberi rekomendasi.");
      const [units, results] = await Promise.all([
        client.query("SELECT count(*)::int AS count FROM competency_units WHERE scheme_id = $1", [assignment.scheme_id]),
        client.query("SELECT count(*)::int AS count FROM assessment_unit_results WHERE assessment_id = $1", [assignment.id]),
      ]);
      if (units.rows[0].count < 1 || results.rows[0].count !== units.rows[0].count) throw new HttpError(409, "Catat hasil untuk setiap unit kompetensi sebelum memberi rekomendasi.");
      await client.query("UPDATE assessments SET recommendation = $2, recommendation_note = $3, recommended_at = now(), updated_at = now() WHERE id = $1", [assignment.id, recommendation, note]);
      await client.query("UPDATE certification_applications SET status = 'assessment_completed', updated_at = now() WHERE id = $1", [applicationId]);
      await client.query(
        `INSERT INTO application_status_history (id, application_id, actor_id, from_status, to_status, reason)
         VALUES ($1, $2, $3, 'assessment_scheduled', 'assessment_completed', $4)`,
        [randomUUID(), applicationId, authUser(response).id, note || null]);
      await audit(client, authUser(response), "assessment.recommendation_recorded", "application", applicationId, { recommendation, note });
    });
    response.json({ application: { id: applicationId, status: "assessment_completed", recommendation } });
  } catch (error) {
    if (error instanceof HttpError) return response.status(error.status).json({ error: error.message });
    console.error("Rekomendasi asesmen gagal disimpan:", error);
    response.status(500).json({ error: "Rekomendasi belum dapat disimpan." });
  }
});

router.get("/:applicationId/documents/:documentId", async (request, response) => {
  const { applicationId, documentId } = request.params;
  if (!isUuid(applicationId) || !isUuid(documentId)) return response.status(404).json({ error: "Dokumen tidak ditemukan." });
  try {
    const result = await getPool().query(
      `SELECT d.storage_key, d.original_name, d.mime_type FROM stored_documents d JOIN assessments x ON x.application_id = d.application_id
       WHERE d.id = $1 AND d.application_id = $2 AND x.assessor_id = $3`, [documentId, applicationId, authUser(response).id]);
    if (!result.rowCount) return response.status(404).json({ error: "Dokumen tidak ditemukan." });
    const doc = result.rows[0];
    response.set({ "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff", "Content-Type": doc.mime_type });
    response.download(privateFilePath(doc.storage_key), safeName(doc.original_name), (error) => {
      if (error && !response.headersSent) response.status(404).json({ error: "Dokumen tidak ditemukan." });
    });
  } catch (error) {
    console.error("Dokumen asesmen gagal diunduh:", error);
    if (!response.headersSent) response.status(500).json({ error: "Dokumen belum dapat diunduh." });
  }
});

export default router;
