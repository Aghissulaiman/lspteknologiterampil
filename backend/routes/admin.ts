import { Router } from "express";
import { authenticate, authUser, requireRole } from "../lib/express-auth";
import { audit, cleanString, HttpError, isPlainObject, isUuid, parsePositiveInteger, recordApplicationStatus, recordTukStatus } from "../lib/certification-utils";
import { getPool, inTransaction } from "../lib/server-db";
import { hashPassword, newId } from "../lib/server-store";
import { privateFilePath } from "../lib/uploads";

const router = Router();
router.use(authenticate, requireRole("admin_lsp"));

function safeName(value: string) {
  return (value.replace(/[\x00-\x1f\x7f]/g, "").split(/[\\/]/).pop()?.trim() || "dokumen").slice(0, 255);
}

function requiredText(value: unknown, label: string, max: number) {
  const text = cleanString(value);
  if (!text || text.length > max) throw new HttpError(400, `${label} wajib diisi (maksimal ${max} karakter).`);
  return text;
}

function dateValue(value: unknown, name: string) {
  const text = cleanString(value);
  const time = Date.parse(text);
  if (!text || Number.isNaN(time)) throw new HttpError(400, `${name} harus berupa tanggal waktu yang valid.`);
  return new Date(time);
}

router.get("/applications", async (request, response) => {
  const status = cleanString(request.query.status);
  try {
    const result = await getPool().query(
      `SELECT a.id, a.status, a.submitted_at, a.updated_at, a.final_decision, u.id AS participant_id, u.full_name AS participant_name,
              s.id AS scheme_id, s.code AS scheme_code, s.name AS scheme_name, sc.starts_at, sc.ends_at, t.name AS test_site_name,
              x.assessor_id, assessor.full_name AS assessor_name, x.recommendation
       FROM certification_applications a JOIN users u ON u.id = a.participant_id JOIN certification_schemes s ON s.id = a.scheme_id
       JOIN assessment_schedules sc ON sc.id = a.schedule_id JOIN test_sites t ON t.id = sc.test_site_id
       LEFT JOIN assessments x ON x.application_id = a.id LEFT JOIN users assessor ON assessor.id = x.assessor_id
       WHERE ($1 = '' OR a.status = $1) ORDER BY a.created_at DESC LIMIT 500`, [status]);
    response.set("Cache-Control", "private, no-store").json({ applications: result.rows });
  } catch (error) {
    console.error("Daftar permohonan admin gagal dimuat:", error);
    response.status(500).json({ error: "Daftar permohonan belum dapat dimuat." });
  }
});

router.get("/applications/:applicationId", async (request, response) => {
  const { applicationId } = request.params;
  if (!isUuid(applicationId)) return response.status(404).json({ error: "Permohonan tidak ditemukan." });
  try {
    const pool = getPool();
    const [application, docs, apl02, history, assessment, certificate] = await Promise.all([
      pool.query(
        `SELECT a.*, u.full_name AS participant_name, u.email AS participant_email, u.nik AS participant_nik, u.phone AS participant_phone,
                s.code AS scheme_code, s.name AS scheme_name, sc.starts_at, sc.ends_at, t.id AS test_site_id, t.name AS test_site_name, t.address AS test_site_address
         FROM certification_applications a JOIN users u ON u.id = a.participant_id JOIN certification_schemes s ON s.id = a.scheme_id
         JOIN assessment_schedules sc ON sc.id = a.schedule_id JOIN test_sites t ON t.id = sc.test_site_id WHERE a.id = $1`, [applicationId]),
      pool.query("SELECT id, document_type, category, original_name, mime_type, size_bytes, created_at FROM stored_documents WHERE application_id = $1 ORDER BY created_at", [applicationId]),
      pool.query(
        `SELECT r.unit_id, u.code, u.title, r.self_assessment, r.notes,
          COALESCE(json_agg(json_build_object('id', d.id, 'documentType', d.document_type, 'originalName', d.original_name)) FILTER (WHERE d.id IS NOT NULL), '[]'::json) AS evidence
         FROM application_apl02 r JOIN competency_units u ON u.id = r.unit_id
         LEFT JOIN application_apl02_evidence e ON e.application_id = r.application_id AND e.unit_id = r.unit_id
         LEFT JOIN stored_documents d ON d.id = e.document_id WHERE r.application_id = $1 GROUP BY r.application_id, r.unit_id, u.id ORDER BY u.sort_order, u.code`, [applicationId]),
      pool.query("SELECT from_status, to_status, reason, created_at FROM application_status_history WHERE application_id = $1 ORDER BY created_at", [applicationId]),
      pool.query(
        `SELECT x.id, x.assessor_id, usr.full_name AS assessor_name, x.pre_assessment_outcome, x.pre_assessment_notes,
                x.assessment_notes, x.recommendation, x.recommendation_note, x.recommended_at,
                COALESCE(json_agg(json_build_object('unitId', r.unit_id, 'result', r.result, 'notes', r.notes, 'evidenceNotes', r.evidence_notes,
                  'evidence', COALESCE(ev.documents, '[]'::json))) FILTER (WHERE r.unit_id IS NOT NULL), '[]'::json) AS unit_results
         FROM assessments x JOIN users usr ON usr.id = x.assessor_id
         LEFT JOIN assessment_unit_results r ON r.assessment_id = x.id
         LEFT JOIN LATERAL (SELECT json_agg(json_build_object('id', d.id, 'documentType', d.document_type, 'originalName', d.original_name)) AS documents
           FROM assessment_unit_evidence e JOIN stored_documents d ON d.id = e.document_id
           WHERE e.assessment_id = x.id AND e.unit_id = r.unit_id) ev ON true
         WHERE x.application_id = $1 GROUP BY x.id, usr.full_name`, [applicationId]),
      pool.query("SELECT certificate_number, scheme_name, issued_at FROM certificates WHERE application_id = $1", [applicationId]),
    ]);
    if (!application.rowCount) return response.status(404).json({ error: "Permohonan tidak ditemukan." });
    response.set("Cache-Control", "private, no-store").json({ application: application.rows[0], documents: docs.rows, apl02: apl02.rows, history: history.rows, assessment: assessment.rows[0] ?? null, certificate: certificate.rows[0] ?? null });
  } catch (error) {
    console.error("Detail permohonan admin gagal dimuat:", error);
    response.status(500).json({ error: "Detail permohonan belum dapat dimuat." });
  }
});

router.post("/applications/:applicationId/revision", async (request, response) => {
  const { applicationId } = request.params;
  if (!isUuid(applicationId) || !isPlainObject(request.body)) return response.status(400).json({ error: "Permintaan tidak valid." });
  const reason = requiredText(request.body.reason, "Alasan revisi", 5000);
  try {
    await inTransaction(async (client) => {
      const row = await client.query("SELECT status FROM certification_applications WHERE id = $1 FOR UPDATE", [applicationId]);
      if (!row.rowCount) throw new HttpError(404, "Permohonan tidak ditemukan.");
      if (row.rows[0].status !== "submitted") throw new HttpError(409, "Revisi hanya dapat diminta untuk permohonan submitted.");
      await client.query("UPDATE certification_applications SET status = 'revision_required', decision_note = $2, updated_at = now() WHERE id = $1", [applicationId, reason]);
      await recordApplicationStatus(client, applicationId, authUser(response), "submitted", "revision_required", reason, "application.revision_requested");
    });
    response.json({ application: { id: applicationId, status: "revision_required" } });
  } catch (error) {
    if (error instanceof HttpError) return response.status(error.status).json({ error: error.message });
    console.error("Revisi permohonan gagal:", error);
    response.status(500).json({ error: "Revisi belum dapat diproses." });
  }
});

router.post("/applications/:applicationId/verify", async (request, response) => {
  const { applicationId } = request.params;
  if (!isUuid(applicationId)) return response.status(404).json({ error: "Permohonan tidak ditemukan." });
  try {
    await inTransaction(async (client) => {
      const row = await client.query("SELECT status, scheme_id FROM certification_applications WHERE id = $1 FOR UPDATE", [applicationId]);
      if (!row.rowCount) throw new HttpError(404, "Permohonan tidak ditemukan.");
      if (row.rows[0].status !== "submitted") throw new HttpError(409, "Hanya permohonan submitted yang dapat diverifikasi.");
      const [requirements, docs, units, answers] = await Promise.all([
        client.query("SELECT code, category FROM scheme_document_requirements WHERE scheme_id = $1 AND is_required = true", [row.rows[0].scheme_id]),
        client.query("SELECT document_type, category FROM stored_documents WHERE application_id = $1", [applicationId]),
        client.query("SELECT id FROM competency_units WHERE scheme_id = $1", [row.rows[0].scheme_id]),
        client.query("SELECT unit_id FROM application_apl02 WHERE application_id = $1", [applicationId]),
      ]);
      const missingDocs = requirements.rows.filter((item: { code: string; category: string }) => !docs.rows.some((doc: { document_type: string; category: string }) => doc.document_type === item.code && doc.category === item.category));
      if (missingDocs.length) throw new HttpError(409, "Dokumen wajib belum lengkap.", { missingDocuments: missingDocs.map((row: { code: string; category: string }) => ({ code: row.code, category: row.category })) });
      if (units.rowCount < 1 || units.rowCount !== answers.rowCount || units.rows.some((unit: { id: string }) => !answers.rows.some((answer: { unit_id: string }) => answer.unit_id === unit.id))) throw new HttpError(409, "Jawaban APL-02 belum lengkap.");
      await client.query("UPDATE certification_applications SET status = 'verified', updated_at = now() WHERE id = $1", [applicationId]);
      await recordApplicationStatus(client, applicationId, authUser(response), "submitted", "verified", null, "application.verified");
    });
    response.json({ application: { id: applicationId, status: "verified" } });
  } catch (error) {
    if (error instanceof HttpError) return response.status(error.status).json({ error: error.message, details: error.details });
    console.error("Verifikasi permohonan gagal:", error);
    response.status(500).json({ error: "Permohonan belum dapat diverifikasi." });
  }
});

router.get("/schedules", async (_request, response) => {
  try {
    const result = await getPool().query(
      `SELECT sc.*, s.code AS scheme_code, s.name AS scheme_name, t.name AS test_site_name,
        count(a.id) FILTER (WHERE a.status <> 'draft')::int AS booked
       FROM assessment_schedules sc JOIN certification_schemes s ON s.id = sc.scheme_id JOIN test_sites t ON t.id = sc.test_site_id
       LEFT JOIN certification_applications a ON a.schedule_id = sc.id GROUP BY sc.id, s.id, t.id ORDER BY sc.starts_at DESC LIMIT 500`);
    response.set("Cache-Control", "private, no-store").json({ schedules: result.rows });
  } catch (error) {
    console.error("Daftar jadwal admin gagal dimuat:", error);
    response.status(500).json({ error: "Daftar jadwal belum dapat dimuat." });
  }
});

router.post("/schedules", async (request, response) => {
  if (!isPlainObject(request.body) || !isUuid(request.body.schemeId) || !isUuid(request.body.testSiteId)) return response.status(400).json({ error: "schemeId dan testSiteId wajib valid." });
  try {
    const startsAt = dateValue(request.body.startsAt, "startsAt");
    const endsAt = dateValue(request.body.endsAt, "endsAt");
    const capacity = parsePositiveInteger(request.body.capacity, "capacity");
    if (endsAt <= startsAt || endsAt <= new Date()) throw new HttpError(400, "Waktu selesai harus setelah waktu mulai dan keduanya harus berada di masa depan.");
    const schedule = await inTransaction(async (client) => {
      const match = await client.query(
        `SELECT 1 FROM certification_schemes s JOIN test_site_schemes ts ON ts.scheme_id = s.id
         JOIN test_sites t ON t.id = ts.test_site_id WHERE s.id = $1 AND s.is_active = true AND t.id = $2 AND t.is_active = true`,
        [request.body.schemeId, request.body.testSiteId]);
      if (!match.rowCount) throw new HttpError(400, "TUK aktif belum mendukung skema tersebut.");
      const id = newId();
      await client.query(
        `INSERT INTO assessment_schedules (id, scheme_id, test_site_id, starts_at, ends_at, capacity, created_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`, [id, request.body.schemeId, request.body.testSiteId, startsAt, endsAt, capacity, authUser(response).id]);
      await audit(client, authUser(response), "schedule.created", "schedule", id, { schemeId: request.body.schemeId, testSiteId: request.body.testSiteId });
      return { id, schemeId: request.body.schemeId, testSiteId: request.body.testSiteId, startsAt, endsAt, capacity, isActive: true };
    });
    response.status(201).json({ schedule });
  } catch (error) {
    if (error instanceof HttpError) return response.status(error.status).json({ error: error.message });
    console.error("Jadwal gagal dibuat:", error);
    response.status(500).json({ error: "Jadwal belum dapat dibuat." });
  }
});

router.patch("/schedules/:scheduleId", async (request, response) => {
  const { scheduleId } = request.params;
  if (!isUuid(scheduleId) || !isPlainObject(request.body)) return response.status(400).json({ error: "Permintaan tidak valid." });
  try {
    const updated = await inTransaction(async (client) => {
      const current = await client.query("SELECT * FROM assessment_schedules WHERE id = $1 FOR UPDATE", [scheduleId]);
      if (!current.rowCount) throw new HttpError(404, "Jadwal tidak ditemukan.");
      const item = current.rows[0];
      const startsAt = request.body.startsAt !== undefined ? dateValue(request.body.startsAt, "startsAt") : new Date(item.starts_at);
      const endsAt = request.body.endsAt !== undefined ? dateValue(request.body.endsAt, "endsAt") : new Date(item.ends_at);
      const capacity = request.body.capacity !== undefined ? parsePositiveInteger(request.body.capacity, "capacity") : Number(item.capacity);
      const isActive = request.body.isActive !== undefined ? request.body.isActive === true : item.is_active;
      if (request.body.isActive !== undefined && typeof request.body.isActive !== "boolean") throw new HttpError(400, "isActive harus berupa boolean.");
      if (endsAt <= startsAt) throw new HttpError(400, "endsAt harus setelah startsAt.");
      const booked = await client.query("SELECT count(*)::int AS count FROM certification_applications WHERE schedule_id = $1 AND status <> 'draft'", [scheduleId]);
      if (capacity < booked.rows[0].count) throw new HttpError(409, "Kapasitas tidak dapat lebih kecil daripada jumlah permohonan yang sudah terdaftar.");
      if (isActive && endsAt <= new Date()) throw new HttpError(400, "Jadwal yang telah berakhir tidak dapat diaktifkan kembali.");
      await client.query("UPDATE assessment_schedules SET starts_at = $2, ends_at = $3, capacity = $4, is_active = $5, updated_at = now() WHERE id = $1", [scheduleId, startsAt, endsAt, capacity, isActive]);
      await audit(client, authUser(response), "schedule.updated", "schedule", scheduleId, { startsAt, endsAt, capacity, isActive });
      return { id: scheduleId, startsAt, endsAt, capacity, isActive };
    });
    response.json({ schedule: updated });
  } catch (error) {
    if (error instanceof HttpError) return response.status(error.status).json({ error: error.message });
    console.error("Jadwal gagal diperbarui:", error);
    response.status(500).json({ error: "Jadwal belum dapat diperbarui." });
  }
});

router.post("/applications/:applicationId/assign", async (request, response) => {
  const { applicationId } = request.params;
  if (!isUuid(applicationId) || !isPlainObject(request.body) || !isUuid(request.body.assessorId)) return response.status(400).json({ error: "assessorId tidak valid." });
  try {
    const result = await inTransaction(async (client) => {
      const app = await client.query("SELECT id, scheme_id, schedule_id, status FROM certification_applications WHERE id = $1 FOR UPDATE", [applicationId]);
      const application = app.rows[0];
      if (!application) throw new HttpError(404, "Permohonan tidak ditemukan.");
      if (application.status !== "verified") throw new HttpError(409, "Penugasan hanya dapat dilakukan setelah verifikasi.");
      let scheduleId = application.schedule_id as string;
      if (request.body.scheduleId !== undefined) {
        if (!isUuid(request.body.scheduleId)) throw new HttpError(400, "scheduleId tidak valid.");
        scheduleId = request.body.scheduleId;
      }
      const schedule = await client.query(
        `SELECT sc.id, sc.capacity FROM assessment_schedules sc JOIN test_sites t ON t.id = sc.test_site_id AND t.is_active = true
         JOIN test_site_schemes ts ON ts.test_site_id = t.id AND ts.scheme_id = sc.scheme_id
         WHERE sc.id = $1 AND sc.scheme_id = $2 AND sc.is_active = true AND sc.ends_at > now() FOR UPDATE OF sc`, [scheduleId, application.scheme_id]);
      if (!schedule.rowCount) throw new HttpError(400, "Jadwal aktif untuk skema ini tidak ditemukan.");
      const assessor = await client.query("SELECT id FROM users WHERE id = $1 AND role = 'assessor'", [request.body.assessorId]);
      if (!assessor.rowCount) throw new HttpError(400, "Akun asesor tidak ditemukan.");
      const booked = await client.query("SELECT count(*)::int AS count FROM certification_applications WHERE schedule_id = $1 AND id <> $2 AND status <> 'draft'", [scheduleId, applicationId]);
      if (booked.rows[0].count >= schedule.rows[0].capacity) throw new HttpError(409, "Kuota jadwal sudah penuh.");
      const [scheme, site] = await Promise.all([
        client.query("SELECT code, name FROM certification_schemes WHERE id = $1", [application.scheme_id]),
        client.query("SELECT t.id, t.name, t.address FROM assessment_schedules sc JOIN test_sites t ON t.id = sc.test_site_id WHERE sc.id = $1", [scheduleId]),
      ]);
      await client.query("UPDATE certification_applications SET schedule_id = $2, status = 'assessment_scheduled', updated_at = now() WHERE id = $1", [applicationId, scheduleId]);
      await client.query(
        `INSERT INTO assessments (id, application_id, assessor_id, assigned_by)
         VALUES ($1, $2, $3, $4) ON CONFLICT (application_id)
         DO UPDATE SET assessor_id = EXCLUDED.assessor_id, assigned_by = EXCLUDED.assigned_by, updated_at = now()`,
        [newId(), applicationId, request.body.assessorId, authUser(response).id]);
      await recordApplicationStatus(client, applicationId, authUser(response), "verified", "assessment_scheduled", null, "application.assessor_assigned", { assessorId: request.body.assessorId, scheduleId });
      const snapshot = { scheme: { code: scheme.rows[0].code, name: scheme.rows[0].name }, scheduleId, testSite: site.rows[0], assignedAssessorId: request.body.assessorId };
      await client.query("UPDATE certification_applications SET submission_snapshot = COALESCE(submission_snapshot, '{}'::jsonb) || $2::jsonb WHERE id = $1", [applicationId, JSON.stringify({ assignment: snapshot })]);
      return { id: applicationId, status: "assessment_scheduled", scheduleId, assessorId: request.body.assessorId };
    });
    response.json({ application: result });
  } catch (error) {
    if (error instanceof HttpError) return response.status(error.status).json({ error: error.message });
    console.error("Penjadwalan asesmen gagal:", error);
    response.status(500).json({ error: "Penjadwalan asesmen belum dapat dilakukan." });
  }
});

router.post("/applications/:applicationId/final-decision", async (request, response) => {
  const { applicationId } = request.params;
  if (!isUuid(applicationId) || !isPlainObject(request.body)) return response.status(400).json({ error: "Permintaan tidak valid." });
  const decision = cleanString(request.body.decision);
  const note = cleanString(request.body.note);
  if (!["competent", "not_competent"].includes(decision) || note.length > 5000) return response.status(400).json({ error: "Keputusan harus competent atau not_competent; catatan maksimal 5000 karakter." });
  try {
    await inTransaction(async (client) => {
      const row = await client.query(
        `SELECT a.status, x.recommendation FROM certification_applications a JOIN assessments x ON x.application_id = a.id
         WHERE a.id = $1 FOR UPDATE OF a, x`, [applicationId]);
      if (!row.rowCount) throw new HttpError(404, "Permohonan atau rekomendasi asesor tidak ditemukan.");
      if (row.rows[0].status !== "assessment_completed" || !row.rows[0].recommendation) throw new HttpError(409, "Keputusan akhir hanya dapat dibuat setelah rekomendasi asesor.");
      await client.query(
        `UPDATE certification_applications SET status = $2, final_decision = $2, decision_note = $3,
           decision_by = $4, decision_at = now(), updated_at = now() WHERE id = $1`,
        [applicationId, decision, note, authUser(response).id]);
      await recordApplicationStatus(client, applicationId, authUser(response), "assessment_completed", decision, note || null, "application.final_decision_recorded", { decision, assessorRecommendation: row.rows[0].recommendation });
    });
    response.json({ application: { id: applicationId, status: decision, finalDecision: decision } });
  } catch (error) {
    if (error instanceof HttpError) return response.status(error.status).json({ error: error.message });
    console.error("Keputusan akhir gagal disimpan:", error);
    response.status(500).json({ error: "Keputusan akhir belum dapat disimpan." });
  }
});

router.post("/applications/:applicationId/issue-certificate", async (request, response) => {
  const { applicationId } = request.params;
  if (!isUuid(applicationId)) return response.status(404).json({ error: "Permohonan tidak ditemukan." });
  const prefix = (process.env.CERTIFICATE_NUMBER_PREFIX || "LSP").trim().toUpperCase();
  if (!/^[A-Z0-9-]{1,20}$/.test(prefix)) return response.status(500).json({ error: "CERTIFICATE_NUMBER_PREFIX tidak valid." });
  try {
    const certificate = await inTransaction(async (client) => {
      const row = await client.query(
        `SELECT a.status, a.final_decision, s.name AS scheme_name FROM certification_applications a JOIN certification_schemes s ON s.id = a.scheme_id
         WHERE a.id = $1 FOR UPDATE OF a`, [applicationId]);
      if (!row.rowCount) throw new HttpError(404, "Permohonan tidak ditemukan.");
      if (row.rows[0].status !== "competent" || row.rows[0].final_decision !== "competent") throw new HttpError(409, "Sertifikat hanya dapat diterbitkan setelah keputusan Admin LSP competent.");
      const year = new Date().getUTCFullYear();
      const sequence = await client.query(
        `INSERT INTO certificate_sequences (issue_year, last_value) VALUES ($1, 1)
         ON CONFLICT (issue_year) DO UPDATE SET last_value = certificate_sequences.last_value + 1 RETURNING last_value`, [year]);
      const number = `${prefix}-${year}-${String(sequence.rows[0].last_value).padStart(6, "0")}`;
      const id = newId();
      const created = await client.query(
        `INSERT INTO certificates (id, application_id, certificate_number, scheme_name, issued_by)
         VALUES ($1, $2, $3, $4, $5) RETURNING certificate_number, scheme_name, issued_at`,
        [id, applicationId, number, row.rows[0].scheme_name, authUser(response).id]);
      await client.query("UPDATE certification_applications SET status = 'certified', updated_at = now() WHERE id = $1", [applicationId]);
      await recordApplicationStatus(client, applicationId, authUser(response), "competent", "certified", null, "certificate.issued", { certificateNumber: number });
      return created.rows[0];
    });
    response.status(201).json({ certificate });
  } catch (error) {
    if (error instanceof HttpError) return response.status(error.status).json({ error: error.message });
    console.error("Penerbitan sertifikat gagal:", error);
    response.status(500).json({ error: "Sertifikat belum dapat diterbitkan." });
  }
});

router.get("/tuk-submissions", async (request, response) => {
  const status = cleanString(request.query.status);
  try {
    const result = await getPool().query(
      `SELECT t.id, t.applicant_id, u.full_name AS applicant_name, u.email AS applicant_email, t.status, t.profile,
              t.review_note, t.submitted_at, t.created_at, t.approved_test_site_id,
              COALESCE(json_agg(json_build_object('id', s.id, 'code', s.code, 'name', s.name)) FILTER (WHERE s.id IS NOT NULL), '[]'::json) AS schemes
       FROM tuk_submissions t JOIN users u ON u.id = t.applicant_id LEFT JOIN tuk_submission_schemes ts ON ts.tuk_submission_id = t.id
       LEFT JOIN certification_schemes s ON s.id = ts.scheme_id WHERE ($1 = '' OR t.status = $1)
       GROUP BY t.id, u.id ORDER BY t.created_at DESC LIMIT 500`, [status]);
    response.set("Cache-Control", "private, no-store").json({ submissions: result.rows });
  } catch (error) {
    console.error("Daftar pengajuan TUK gagal dimuat:", error);
    response.status(500).json({ error: "Daftar pengajuan TUK belum dapat dimuat." });
  }
});

router.get("/tuk-submissions/:submissionId", async (request, response) => {
  const { submissionId } = request.params;
  if (!isUuid(submissionId)) return response.status(404).json({ error: "Pengajuan TUK tidak ditemukan." });
  try {
    const pool = getPool();
    const [submission, docs, schemes, history] = await Promise.all([
      pool.query("SELECT t.*, u.full_name AS applicant_name, u.email AS applicant_email, u.phone AS applicant_phone FROM tuk_submissions t JOIN users u ON u.id = t.applicant_id WHERE t.id = $1", [submissionId]),
      pool.query("SELECT id, document_type, original_name, mime_type, size_bytes, created_at FROM stored_documents WHERE tuk_submission_id = $1 ORDER BY created_at", [submissionId]),
      pool.query("SELECT s.id, s.code, s.name FROM tuk_submission_schemes ts JOIN certification_schemes s ON s.id = ts.scheme_id WHERE ts.tuk_submission_id = $1", [submissionId]),
      pool.query("SELECT from_status, to_status, reason, created_at FROM tuk_submission_status_history WHERE tuk_submission_id = $1 ORDER BY created_at", [submissionId]),
    ]);
    if (!submission.rowCount) return response.status(404).json({ error: "Pengajuan TUK tidak ditemukan." });
    response.set("Cache-Control", "private, no-store").json({ submission: submission.rows[0], documents: docs.rows, schemes: schemes.rows, history: history.rows });
  } catch (error) {
    console.error("Detail TUK admin gagal dimuat:", error);
    response.status(500).json({ error: "Detail pengajuan TUK belum dapat dimuat." });
  }
});

router.get("/tuk-submissions/:submissionId/documents/:documentId", async (request, response) => {
  const { submissionId, documentId } = request.params;
  if (!isUuid(submissionId) || !isUuid(documentId)) return response.status(404).json({ error: "Dokumen tidak ditemukan." });
  try {
    const result = await getPool().query(
      `SELECT d.storage_key, d.original_name, d.mime_type FROM stored_documents d WHERE d.id = $1 AND d.tuk_submission_id = $2`, [documentId, submissionId]);
    if (!result.rowCount) return response.status(404).json({ error: "Dokumen tidak ditemukan." });
    const doc = result.rows[0];
    response.set({ "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff", "Content-Type": doc.mime_type });
    response.download(privateFilePath(doc.storage_key), safeName(doc.original_name), (error) => { if (error && !response.headersSent) response.status(404).json({ error: "Dokumen tidak ditemukan." }); });
  } catch (error) {
    console.error("Dokumen TUK gagal diunduh:", error);
    if (!response.headersSent) response.status(500).json({ error: "Dokumen belum dapat diunduh." });
  }
});

router.post("/tuk-submissions/:submissionId/review", async (request, response) => {
  const { submissionId } = request.params;
  if (!isUuid(submissionId) || !isPlainObject(request.body)) return response.status(400).json({ error: "Permintaan tidak valid." });
  const decision = cleanString(request.body.decision);
  const note = cleanString(request.body.note);
  if (!["revision_required", "rejected"].includes(decision) || !note || note.length > 5000) return response.status(400).json({ error: "Keputusan harus revision_required atau rejected, dengan catatan maksimal 5000 karakter." });
  try {
    await inTransaction(async (client) => {
      const row = await client.query("SELECT status FROM tuk_submissions WHERE id = $1 FOR UPDATE", [submissionId]);
      if (!row.rowCount) throw new HttpError(404, "Pengajuan TUK tidak ditemukan.");
      if (row.rows[0].status !== "submitted") throw new HttpError(409, "Pengajuan TUK harus berstatus submitted untuk ditinjau.");
      await client.query("UPDATE tuk_submissions SET status = $2, review_note = $3, reviewed_by = $4, reviewed_at = now(), updated_at = now() WHERE id = $1", [submissionId, decision, note, authUser(response).id]);
      await recordTukStatus(client, submissionId, authUser(response), "submitted", decision, note, decision === "rejected" ? "tuk.rejected" : "tuk.revision_requested");
    });
    response.json({ submission: { id: submissionId, status: decision } });
  } catch (error) {
    if (error instanceof HttpError) return response.status(error.status).json({ error: error.message });
    console.error("Review TUK gagal:", error);
    response.status(500).json({ error: "Review pengajuan TUK belum dapat diproses." });
  }
});

router.post("/tuk-submissions/:submissionId/approve", async (request, response) => {
  const { submissionId } = request.params;
  if (!isUuid(submissionId)) return response.status(404).json({ error: "Pengajuan TUK tidak ditemukan." });
  try {
    const result = await inTransaction(async (client) => {
      const row = await client.query("SELECT * FROM tuk_submissions WHERE id = $1 FOR UPDATE", [submissionId]);
      const submission = row.rows[0];
      if (!submission) throw new HttpError(404, "Pengajuan TUK tidak ditemukan.");
      if (submission.status !== "submitted") throw new HttpError(409, "Pengajuan TUK harus berstatus submitted sebelum disetujui.");
      const profile = submission.profile as Record<string, unknown>;
      const name = requiredText(profile.name, "Nama TUK", 200);
      const address = requiredText(profile.address, "Alamat TUK", 2000);
      const phone = requiredText(profile.phone, "Telepon TUK", 30);
      const email = requiredText(profile.email, "Email TUK", 254);
      const siteType = requiredText(profile.siteType, "Jenis TUK", 100);
      const contactPerson = requiredText(profile.contactPerson, "Penanggung jawab", 200);
      const schemes = await client.query("SELECT scheme_id FROM tuk_submission_schemes WHERE tuk_submission_id = $1", [submissionId]);
      if (!schemes.rowCount) throw new HttpError(409, "Pengajuan TUK belum mencantumkan skema.");
      const siteId = newId();
      await client.query(
        `INSERT INTO test_sites (id, name, address, phone, email, site_type, contact_person, checklist, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, true)`,
        [siteId, name, address, phone, email, siteType, contactPerson, JSON.stringify(submission.facility_checklist)]);
      for (const item of schemes.rows) await client.query("INSERT INTO test_site_schemes (test_site_id, scheme_id) VALUES ($1, $2)", [siteId, item.scheme_id]);
      await client.query("UPDATE tuk_submissions SET status = 'approved', approved_test_site_id = $2, review_note = NULL, reviewed_by = $3, reviewed_at = now(), updated_at = now() WHERE id = $1", [submissionId, siteId, authUser(response).id]);
      await recordTukStatus(client, submissionId, authUser(response), "submitted", "approved", null, "tuk.approved");
      return { id: submissionId, status: "approved", testSiteId: siteId };
    });
    response.json({ submission: result });
  } catch (error) {
    if (error instanceof HttpError) return response.status(error.status).json({ error: error.message });
    console.error("Persetujuan TUK gagal:", error);
    response.status(500).json({ error: "Pengajuan TUK belum dapat disetujui." });
  }
});

router.get("/test-sites", async (_request, response) => {
  try {
    const result = await getPool().query(
      `SELECT t.*, COALESCE(json_agg(json_build_object('id', s.id, 'code', s.code, 'name', s.name)) FILTER (WHERE s.id IS NOT NULL), '[]'::json) AS schemes
       FROM test_sites t LEFT JOIN test_site_schemes ts ON ts.test_site_id = t.id LEFT JOIN certification_schemes s ON s.id = ts.scheme_id
       GROUP BY t.id ORDER BY t.name`);
    response.set("Cache-Control", "private, no-store").json({ testSites: result.rows });
  } catch (error) {
    console.error("Daftar TUK gagal dimuat:", error);
    response.status(500).json({ error: "Daftar TUK belum dapat dimuat." });
  }
});

router.post("/test-sites", async (request, response) => {
  if (!isPlainObject(request.body)) return response.status(400).json({ error: "Format data tidak valid." });
  try {
    const name = requiredText(request.body.name, "Nama TUK", 200);
    const address = requiredText(request.body.address, "Alamat", 2000);
    const phone = requiredText(request.body.phone, "Telepon", 30);
    const email = requiredText(request.body.email, "Email", 254);
    const siteType = requiredText(request.body.siteType, "Jenis TUK", 100);
    const contactPerson = requiredText(request.body.contactPerson, "Penanggung jawab", 200);
    const checklist = request.body.checklist ?? {};
    const schemeIds = request.body.schemeIds;
    if (!isPlainObject(checklist)) throw new HttpError(400, "checklist harus berupa objek.");
    if (!Array.isArray(schemeIds) || !schemeIds.length || schemeIds.some((id) => !isUuid(id)) || new Set(schemeIds).size !== schemeIds.length) throw new HttpError(400, "schemeIds harus berisi skema aktif yang unik.");
    const site = await inTransaction(async (client) => {
      const schemes = await client.query("SELECT id FROM certification_schemes WHERE id = ANY($1::uuid[]) AND is_active = true", [schemeIds]);
      if (schemes.rowCount !== schemeIds.length) throw new HttpError(400, "Satu atau lebih skema tidak aktif atau tidak ditemukan.");
      const id = newId();
      await client.query("INSERT INTO test_sites (id, name, address, phone, email, site_type, contact_person, checklist) VALUES ($1,$2,$3,$4,$5,$6,$7,$8::jsonb)",
        [id, name, address, phone, email, siteType, contactPerson, JSON.stringify(checklist)]);
      for (const schemeId of schemeIds) await client.query("INSERT INTO test_site_schemes (test_site_id, scheme_id) VALUES ($1,$2)", [id, schemeId]);
      await audit(client, authUser(response), "test_site.created", "test_site", id, { schemeIds });
      return { id, name, address, phone, email, siteType, contactPerson, checklist, schemeIds, isActive: true };
    });
    response.status(201).json({ testSite: site });
  } catch (error) {
    if (error instanceof HttpError) return response.status(error.status).json({ error: error.message });
    console.error("TUK gagal dibuat:", error);
    response.status(500).json({ error: "TUK belum dapat dibuat." });
  }
});

router.patch("/test-sites/:testSiteId", async (request, response) => {
  const { testSiteId } = request.params;
  if (!isUuid(testSiteId) || !isPlainObject(request.body)) return response.status(400).json({ error: "Permintaan tidak valid." });
  const allowed = ["name", "address", "phone", "email", "siteType", "contactPerson", "checklist", "isActive", "schemeIds"];
  if (Object.keys(request.body).some((key) => !allowed.includes(key))) return response.status(400).json({ error: "Permintaan berisi kolom yang tidak dapat diubah." });
  try {
    const updated = await inTransaction(async (client) => {
      const row = await client.query("SELECT * FROM test_sites WHERE id = $1 FOR UPDATE", [testSiteId]);
      if (!row.rowCount) throw new HttpError(404, "TUK tidak ditemukan.");
      const old = row.rows[0];
      const name = request.body.name !== undefined ? requiredText(request.body.name, "Nama TUK", 200) : old.name;
      const address = request.body.address !== undefined ? requiredText(request.body.address, "Alamat", 2000) : old.address;
      const phone = request.body.phone !== undefined ? requiredText(request.body.phone, "Telepon", 30) : old.phone;
      const email = request.body.email !== undefined ? requiredText(request.body.email, "Email", 254) : old.email;
      const siteType = request.body.siteType !== undefined ? requiredText(request.body.siteType, "Jenis TUK", 100) : old.site_type;
      const contactPerson = request.body.contactPerson !== undefined ? requiredText(request.body.contactPerson, "Penanggung jawab", 200) : old.contact_person;
      const checklist = request.body.checklist !== undefined ? request.body.checklist : old.checklist;
      if (!isPlainObject(checklist)) throw new HttpError(400, "checklist harus berupa objek.");
      const isActive = request.body.isActive !== undefined ? request.body.isActive : old.is_active;
      if (typeof isActive !== "boolean") throw new HttpError(400, "isActive harus berupa boolean.");
      await client.query("UPDATE test_sites SET name=$2, address=$3, phone=$4, email=$5, site_type=$6, contact_person=$7, checklist=$8::jsonb, is_active=$9, updated_at=now() WHERE id=$1", [testSiteId, name, address, phone, email, siteType, contactPerson, JSON.stringify(checklist), isActive]);
      if (request.body.schemeIds !== undefined) {
        const ids = request.body.schemeIds;
        if (!Array.isArray(ids) || ids.some((id) => !isUuid(id)) || new Set(ids).size !== ids.length) throw new HttpError(400, "schemeIds tidak valid.");
        const valid = await client.query("SELECT id FROM certification_schemes WHERE id = ANY($1::uuid[]) AND is_active = true", [ids]);
        if (valid.rowCount !== ids.length) throw new HttpError(400, "Satu atau lebih skema tidak aktif atau tidak ditemukan.");
        await client.query("DELETE FROM test_site_schemes WHERE test_site_id = $1", [testSiteId]);
        for (const schemeId of ids) await client.query("INSERT INTO test_site_schemes (test_site_id, scheme_id) VALUES ($1, $2)", [testSiteId, schemeId]);
      }
      await audit(client, authUser(response), "test_site.updated", "test_site", testSiteId);
      return { id: testSiteId, name, address, phone, email, siteType, contactPerson, checklist, isActive };
    });
    response.json({ testSite: updated });
  } catch (error) {
    if (error instanceof HttpError) return response.status(error.status).json({ error: error.message });
    console.error("TUK gagal diperbarui:", error);
    response.status(500).json({ error: "Data TUK belum dapat diperbarui." });
  }
});

router.get("/assessors", async (_request, response) => {
  try {
    const result = await getPool().query("SELECT id, full_name, email, phone, created_at FROM users WHERE role = 'assessor' ORDER BY full_name");
    response.set("Cache-Control", "private, no-store").json({ assessors: result.rows });
  } catch (error) {
    console.error("Daftar asesor gagal dimuat:", error);
    response.status(500).json({ error: "Daftar asesor belum dapat dimuat." });
  }
});

router.post("/assessors", async (request, response) => {
  if (!isPlainObject(request.body)) return response.status(400).json({ error: "Format data tidak valid." });
  const fullName = cleanString(request.body.fullName);
  const email = cleanString(request.body.email).toLowerCase();
  const nik = cleanString(request.body.nik).replace(/\s/g, "");
  const phone = cleanString(request.body.phone);
  const password = typeof request.body.password === "string" ? request.body.password : "";
  if (fullName.length < 2 || fullName.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || !/^\d{16}$/.test(nik) || !/^[+\d][\d\s()-]{7,19}$/.test(phone) || password.length < 8 || password.length > 128) {
    return response.status(400).json({ error: "Nama, email, NIK, telepon, atau kata sandi asesor tidak valid." });
  }
  try {
    const passwordHash = await hashPassword(password);
    const result = await inTransaction(async (client) => {
      const id = newId();
      await client.query("INSERT INTO users (id, full_name, email, nik, phone, password_hash, role) VALUES ($1,$2,$3,$4,$5,$6,'assessor')", [id, fullName, email, nik, phone, passwordHash]);
      await audit(client, authUser(response), "assessor.created", "user", id, { email });
      return { id, fullName, email, role: "assessor" };
    });
    response.status(201).json({ assessor: result });
  } catch (error) {
    if ((error as { code?: string }).code === "23505") return response.status(409).json({ error: "Email atau NIK sudah digunakan." });
    console.error("Akun asesor gagal dibuat:", error);
    response.status(500).json({ error: "Akun asesor belum dapat dibuat." });
  }
});

router.get("/applications/:applicationId/documents/:documentId", async (request, response) => {
  const { applicationId, documentId } = request.params;
  if (!isUuid(applicationId) || !isUuid(documentId)) return response.status(404).json({ error: "Dokumen tidak ditemukan." });
  try {
    const result = await getPool().query("SELECT storage_key, original_name, mime_type FROM stored_documents WHERE id = $1 AND application_id = $2", [documentId, applicationId]);
    if (!result.rowCount) return response.status(404).json({ error: "Dokumen tidak ditemukan." });
    const doc = result.rows[0];
    response.set({ "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff", "Content-Type": doc.mime_type });
    response.download(privateFilePath(doc.storage_key), safeName(doc.original_name), (error) => { if (error && !response.headersSent) response.status(404).json({ error: "Dokumen tidak ditemukan." }); });
  } catch (error) {
    console.error("Dokumen permohonan gagal diunduh:", error);
    if (!response.headersSent) response.status(500).json({ error: "Dokumen belum dapat diunduh." });
  }
});

router.get("/audit-logs", async (request, response) => {
  const limit = Math.min(Math.max(Number(request.query.limit) || 100, 1), 500);
  try {
    const result = await getPool().query(
      `SELECT id, actor_id, actor_role, action, entity_type, entity_id, details, created_at FROM audit_logs ORDER BY created_at DESC LIMIT $1`, [limit]);
    response.set("Cache-Control", "private, no-store").json({ auditLogs: result.rows });
  } catch (error) {
    console.error("Audit log gagal dimuat:", error);
    response.status(500).json({ error: "Audit log belum dapat dimuat." });
  }
});

export default router;
