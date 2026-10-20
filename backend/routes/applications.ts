import { Router } from "express";
import { authenticate, authUser, requireRole } from "../lib/express-auth";
import { HttpError, audit, cleanString, isPlainObject, isUuid, recordApplicationStatus } from "../lib/certification-utils";
import { inTransaction, getPool } from "../lib/server-db";
import { newId } from "../lib/server-store";
import { privateFilePath, removePrivateUpload, savePrivateUpload, upload } from "../lib/uploads";

const router = Router();
router.use(authenticate, requireRole("participant"));

const APL01_REQUIRED_TEXT: Array<[string, string, number]> = [
  ["fullName", "Nama lengkap", 150],
  ["birthPlace", "Tempat lahir", 100],
  ["address", "Alamat", 500],
  ["province", "Provinsi", 100],
  ["city", "Kota/kabupaten", 100],
  ["district", "Kecamatan", 100],
  ["phone", "Nomor telepon", 30],
  ["educationLevel", "Pendidikan terakhir", 100],
  ["institution", "Nama sekolah/perguruan tinggi", 200],
  ["studyProgram", "Jurusan/program studi", 200],
  ["employment", "Pekerjaan saat ini", 200],
];

function validateApl01(value: unknown) {
  if (!isPlainObject(value)) return ["Data APL-01 harus berupa objek."];
  const errors: string[] = [];
  const nik = cleanString(value.nik).replace(/\s/g, "");
  if (!/^\d{16}$/.test(nik)) errors.push("NIK harus terdiri dari 16 angka.");
  for (const [key, label, max] of APL01_REQUIRED_TEXT) {
    const field = cleanString(value[key]);
    if (field.length < 2 || field.length > max) errors.push(`${label} wajib diisi (maksimal ${max} karakter).`);
  }
  if (!new Set(["male", "female"]).has(cleanString(value.gender))) errors.push("Jenis kelamin harus male atau female.");
  const birthDate = cleanString(value.birthDate);
  const validDate = /^\d{4}-\d{2}-\d{2}$/.test(birthDate) && !Number.isNaN(Date.parse(`${birthDate}T00:00:00Z`))
    && new Date(`${birthDate}T00:00:00Z`).toISOString().slice(0, 10) === birthDate;
  if (!validDate) {
    errors.push("Tanggal lahir harus menggunakan format YYYY-MM-DD.");
  }
  const email = cleanString(value.email);
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("Alamat email tidak valid.");
  if (!/^[+\d][\d\s()-]{7,29}$/.test(cleanString(value.phone))) errors.push("Nomor telepon tidak valid.");
  return errors;
}

function assertEditable(status: string) {
  if (status !== "draft" && status !== "revision_required") {
    throw new HttpError(409, "Permohonan hanya dapat diubah saat berstatus draft atau revision_required.");
  }
}

function safeOriginalName(value: string) {
  const baseName = value.replace(/[\x00-\x1f\x7f]/g, "").split(/[\\/]/).pop()?.trim() || "dokumen";
  return baseName.slice(0, 255);
}

async function sendStoredDocument(response: import("express").Response, document: {
  storage_key: string;
  original_name: string;
  mime_type: string;
}) {
  const filePath = privateFilePath(document.storage_key);
  response.set({
    "Cache-Control": "private, no-store",
    "X-Content-Type-Options": "nosniff",
    "Content-Type": document.mime_type,
  });
  response.download(filePath, safeOriginalName(document.original_name), (error) => {
    if (error && !response.headersSent) response.status(404).json({ error: "Dokumen tidak ditemukan." });
  });
}

router.get("/schedules", async (request, response) => {
  const schemeId = request.query.schemeId;
  if (!isUuid(schemeId)) return response.status(400).json({ error: "schemeId tidak valid." });
  try {
    const result = await getPool().query(
      `SELECT s.id, s.scheme_id, s.test_site_id, s.starts_at, s.ends_at, s.capacity,
              greatest(s.capacity - count(a.id) FILTER (WHERE a.status <> 'draft'), 0)::int AS available_slots,
              t.name AS test_site_name, t.address AS test_site_address, t.site_type AS test_site_type
       FROM assessment_schedules s
       JOIN certification_schemes cs ON cs.id = s.scheme_id AND cs.is_active = true AND cs.is_public = true
       JOIN test_sites t ON t.id = s.test_site_id AND t.is_active = true
       JOIN test_site_schemes ts ON ts.test_site_id = t.id AND ts.scheme_id = s.scheme_id
       LEFT JOIN certification_applications a ON a.schedule_id = s.id
       WHERE s.scheme_id = $1 AND s.is_active = true AND s.ends_at > now()
       GROUP BY s.id, t.id
       HAVING count(a.id) FILTER (WHERE a.status <> 'draft') < s.capacity
       ORDER BY s.starts_at, t.name`,
      [schemeId],
    );
    response.set("Cache-Control", "private, no-store").json({ schedules: result.rows });
  } catch (error) {
    console.error("Jadwal gagal dimuat:", error);
    response.status(500).json({ error: "Jadwal belum dapat dimuat." });
  }
});

router.get("/", async (_request, response) => {
  try {
    const result = await getPool().query(
      `SELECT a.id, a.scheme_id, s.code AS scheme_code, s.name AS scheme_name, a.schedule_id,
              sc.starts_at, sc.ends_at, t.name AS test_site_name, a.status, a.submitted_at,
              a.updated_at, a.final_decision
       FROM certification_applications a
       JOIN certification_schemes s ON s.id = a.scheme_id
       JOIN assessment_schedules sc ON sc.id = a.schedule_id
       JOIN test_sites t ON t.id = sc.test_site_id
       WHERE a.participant_id = $1 ORDER BY a.created_at DESC`,
      [authUser(response).id],
    );
    response.set("Cache-Control", "private, no-store").json({ applications: result.rows });
  } catch (error) {
    console.error("Permohonan gagal dimuat:", error);
    response.status(500).json({ error: "Daftar permohonan belum dapat dimuat." });
  }
});

router.post("/", async (request, response) => {
  const body = request.body;
  if (!isPlainObject(body) || !isUuid(body.schemeId) || !isUuid(body.scheduleId)) {
    return response.status(400).json({ error: "schemeId dan scheduleId wajib valid." });
  }

  try {
    const applicationId = newId();
    const result = await inTransaction(async (client) => {
      const schedule = await client.query(
        `SELECT s.id, s.scheme_id FROM assessment_schedules s
         JOIN certification_schemes cs ON cs.id = s.scheme_id AND cs.is_active = true AND cs.is_public = true
         JOIN test_sites t ON t.id = s.test_site_id AND t.is_active = true
         JOIN test_site_schemes ts ON ts.test_site_id = t.id AND ts.scheme_id = s.scheme_id
         WHERE s.id = $1 AND s.scheme_id = $2 AND s.is_active = true AND s.ends_at > now()
         FOR UPDATE OF s`,
        [body.scheduleId, body.schemeId],
      );
      if (!schedule.rowCount) throw new HttpError(404, "Jadwal aktif untuk skema tersebut tidak ditemukan.");

      await client.query(
        `INSERT INTO certification_applications (id, participant_id, scheme_id, schedule_id, apl01)
         VALUES ($1, $2, $3, $4, $5::jsonb)`,
        [applicationId, authUser(response).id, body.schemeId, body.scheduleId, JSON.stringify(isPlainObject(body.apl01) ? body.apl01 : {})],
      );
      await recordApplicationStatus(client, applicationId, authUser(response), "", "draft", null, "application.draft_created", {
        schemeId: body.schemeId,
        scheduleId: body.scheduleId,
      });
      return { id: applicationId, status: "draft" };
    });
    response.status(201).json({ application: result });
  } catch (error) {
    if (error instanceof HttpError) return response.status(error.status).json({ error: error.message });
    console.error("Draft permohonan gagal dibuat:", error);
    response.status(500).json({ error: "Draft permohonan belum dapat dibuat." });
  }
});

router.get("/:applicationId", async (request, response) => {
  const { applicationId } = request.params;
  if (!isUuid(applicationId)) return response.status(404).json({ error: "Permohonan tidak ditemukan." });
  try {
    const pool = getPool();
    const application = await pool.query(
      `SELECT a.id, a.participant_id, a.scheme_id, a.schedule_id, a.status, a.apl01,
              a.submission_snapshot, a.final_decision, a.decision_note, a.submitted_at, a.created_at, a.updated_at,
              s.code AS scheme_code, s.name AS scheme_name, s.requirements AS scheme_requirements,
              sc.starts_at, sc.ends_at, t.id AS test_site_id, t.name AS test_site_name, t.address AS test_site_address
       FROM certification_applications a
       JOIN certification_schemes s ON s.id = a.scheme_id
       JOIN assessment_schedules sc ON sc.id = a.schedule_id
       JOIN test_sites t ON t.id = sc.test_site_id
       WHERE a.id = $1 AND a.participant_id = $2`,
      [applicationId, authUser(response).id],
    );
    if (!application.rowCount) return response.status(404).json({ error: "Permohonan tidak ditemukan." });
    const [documents, selfAssessment, history, assessment, certificate] = await Promise.all([
      pool.query(
        `SELECT id, document_type, category, original_name, mime_type, size_bytes, created_at
         FROM stored_documents WHERE application_id = $1 ORDER BY created_at, id`,
        [applicationId],
      ),
      pool.query(
        `SELECT r.unit_id, u.code AS unit_code, u.title AS unit_title, r.self_assessment, r.notes,
                COALESCE(json_agg(json_build_object('id', d.id, 'documentType', d.document_type, 'originalName', d.original_name))
                  FILTER (WHERE d.id IS NOT NULL), '[]'::json) AS evidence
         FROM application_apl02 r JOIN competency_units u ON u.id = r.unit_id
         LEFT JOIN application_apl02_evidence e ON e.application_id = r.application_id AND e.unit_id = r.unit_id
         LEFT JOIN stored_documents d ON d.id = e.document_id
         WHERE r.application_id = $1 GROUP BY r.application_id, r.unit_id, u.code, u.title
         ORDER BY u.code`,
        [applicationId],
      ),
      pool.query(
        `SELECT from_status, to_status, reason, created_at FROM application_status_history
         WHERE application_id = $1 ORDER BY created_at, id`,
        [applicationId],
      ),
      pool.query(
        `SELECT a.recommendation, a.recommendation_note, a.pre_assessment_outcome, a.pre_assessment_notes, a.assessment_notes,
                COALESCE(json_agg(json_build_object('unitId', r.unit_id, 'result', r.result, 'evidenceNotes', r.evidence_notes, 'notes', r.notes))
                  FILTER (WHERE r.unit_id IS NOT NULL), '[]'::json) AS unit_results
         FROM assessments a LEFT JOIN assessment_unit_results r ON r.assessment_id = a.id
         WHERE a.application_id = $1 GROUP BY a.id`,
        [applicationId],
      ),
      pool.query(
        `SELECT certificate_number, scheme_name, issued_at FROM certificates WHERE application_id = $1`,
        [applicationId],
      ),
    ]);
    response.set("Cache-Control", "private, no-store").json({
      application: {
        ...application.rows[0],
        documents: documents.rows,
        apl02: selfAssessment.rows,
        statusHistory: history.rows,
        assessment: assessment.rows[0] ?? null,
        certificate: certificate.rows[0] ?? null,
      },
    });
  } catch (error) {
    console.error("Detail permohonan gagal dimuat:", error);
    response.status(500).json({ error: "Permohonan belum dapat dimuat." });
  }
});

router.patch("/:applicationId", async (request, response) => {
  const { applicationId } = request.params;
  if (!isUuid(applicationId) || !isPlainObject(request.body)) {
    return response.status(400).json({ error: "Permintaan tidak valid." });
  }
  if ("status" in request.body || "finalDecision" in request.body) {
    return response.status(400).json({ error: "Status permohonan hanya dapat diubah melalui alur verifikasi." });
  }
  const hasApl01 = "apl01" in request.body;
  const hasSchedule = "scheduleId" in request.body;
  if (!hasApl01 && !hasSchedule) return response.status(400).json({ error: "Tidak ada data yang diperbarui." });
  if (hasApl01 && !isPlainObject(request.body.apl01)) return response.status(400).json({ error: "Data APL-01 tidak valid." });
  if (hasSchedule && !isUuid(request.body.scheduleId)) return response.status(400).json({ error: "scheduleId tidak valid." });

  try {
    const result = await inTransaction(async (client) => {
      const current = await client.query(
        `SELECT id, scheme_id, schedule_id, status FROM certification_applications
         WHERE id = $1 AND participant_id = $2 FOR UPDATE`,
        [applicationId, authUser(response).id],
      );
      const application = current.rows[0];
      if (!application) throw new HttpError(404, "Permohonan tidak ditemukan.");
      assertEditable(application.status);

      let scheduleId = application.schedule_id;
      if (hasSchedule) {
        const schedule = await client.query(
          `SELECT sc.id FROM assessment_schedules sc
           JOIN certification_schemes cs ON cs.id = sc.scheme_id AND cs.is_active = true AND cs.is_public = true
           JOIN test_sites t ON t.id = sc.test_site_id AND t.is_active = true
           JOIN test_site_schemes ts ON ts.test_site_id = t.id AND ts.scheme_id = sc.scheme_id
           WHERE sc.id = $1 AND sc.scheme_id = $2 AND sc.is_active = true AND sc.ends_at > now() FOR UPDATE OF sc`,
          [request.body.scheduleId, application.scheme_id],
        );
        if (!schedule.rowCount) throw new HttpError(404, "Jadwal aktif untuk skema tersebut tidak ditemukan.");
        scheduleId = request.body.scheduleId;
      }
      await client.query(
        `UPDATE certification_applications SET schedule_id = $2, apl01 = $3::jsonb, updated_at = now()
         WHERE id = $1`,
        [applicationId, scheduleId, JSON.stringify(hasApl01 ? request.body.apl01 : await readApl01(client, applicationId))],
      );
      return { id: applicationId, scheduleId, updated: { apl01: hasApl01, schedule: hasSchedule } };
    });
    response.json({ application: result });
  } catch (error) {
    if (error instanceof HttpError) return response.status(error.status).json({ error: error.message });
    console.error("Permohonan gagal diperbarui:", error);
    response.status(500).json({ error: "Permohonan belum dapat diperbarui." });
  }
});

async function readApl01(client: import("pg").PoolClient, applicationId: string) {
  const result = await client.query("SELECT apl01 FROM certification_applications WHERE id = $1", [applicationId]);
  return result.rows[0]?.apl01 ?? {};
}

router.put("/:applicationId/apl02", async (request, response) => {
  const { applicationId } = request.params;
  const entries = request.body?.responses;
  if (!isUuid(applicationId) || !Array.isArray(entries)) {
    return response.status(400).json({ error: "Data APL-02 harus berisi array responses." });
  }
  if (entries.length > 500 || entries.some((entry) => !isPlainObject(entry))) {
    return response.status(400).json({ error: "Daftar APL-02 tidak valid." });
  }

  try {
    const saved = await inTransaction(async (client) => {
      const current = await client.query(
        `SELECT id, scheme_id, status FROM certification_applications
         WHERE id = $1 AND participant_id = $2 FOR UPDATE`,
        [applicationId, authUser(response).id],
      );
      const application = current.rows[0];
      if (!application) throw new HttpError(404, "Permohonan tidak ditemukan.");
      assertEditable(application.status);

      const units = await client.query("SELECT id FROM competency_units WHERE scheme_id = $1", [application.scheme_id]);
      const unitIds = new Set(units.rows.map((row: { id: string }) => row.id));
      const requestedIds = entries.map((entry: Record<string, unknown>) => entry.unitId);
      if (requestedIds.some((id: unknown) => !isUuid(id) || !unitIds.has(id)) || new Set(requestedIds).size !== requestedIds.length) {
        throw new HttpError(400, "Unit kompetensi APL-02 tidak valid atau berulang.");
      }

      const evidenceLists = entries.map((entry: Record<string, unknown>) =>
        Array.isArray(entry.evidenceDocumentIds) ? entry.evidenceDocumentIds : [],
      );
      if (evidenceLists.some((ids: unknown[]) => new Set(ids).size !== ids.length)) throw new HttpError(400, "Bukti APL-02 tidak boleh berulang pada unit yang sama.");
      const evidenceIds = [...new Set(evidenceLists.flat())];
      if (evidenceIds.some((id) => !isUuid(id))) throw new HttpError(400, "ID bukti APL-02 tidak valid.");
      if (evidenceIds.length) {
        const ownedDocuments = await client.query(
          `SELECT id FROM stored_documents WHERE application_id = $1 AND id = ANY($2::uuid[])`,
          [applicationId, evidenceIds],
        );
        if (ownedDocuments.rowCount !== evidenceIds.length) throw new HttpError(400, "Bukti harus berasal dari dokumen permohonan ini.");
      }

      await client.query("DELETE FROM application_apl02 WHERE application_id = $1", [applicationId]);
      for (const entry of entries as Array<Record<string, unknown>>) {
        if (!isUuid(entry.unitId) || !["competent", "not_competent"].includes(cleanString(entry.answer))) {
          throw new HttpError(400, "Jawaban APL-02 harus competent atau not_competent.");
        }
        const notes = cleanString(entry.notes);
        if (notes.length > 2000) throw new HttpError(400, "Catatan APL-02 maksimal 2000 karakter.");
        await client.query(
          `INSERT INTO application_apl02 (application_id, unit_id, self_assessment, notes)
           VALUES ($1, $2, $3, $4)`,
          [applicationId, entry.unitId, entry.answer, notes],
        );
        for (const documentId of Array.isArray(entry.evidenceDocumentIds) ? entry.evidenceDocumentIds : []) {
          await client.query(
            `INSERT INTO application_apl02_evidence (application_id, unit_id, document_id) VALUES ($1, $2, $3)`,
            [applicationId, entry.unitId, documentId],
          );
        }
      }
      await audit(client, authUser(response), "application.apl02_updated", "application", applicationId, { responseCount: entries.length });
      return { responseCount: entries.length };
    });
    response.json({ ok: true, ...saved });
  } catch (error) {
    if (error instanceof HttpError) return response.status(error.status).json({ error: error.message });
    console.error("APL-02 gagal disimpan:", error);
    response.status(500).json({ error: "APL-02 belum dapat disimpan." });
  }
});

router.post("/:applicationId/documents", upload.single("file"), async (request, response) => {
  const { applicationId } = request.params;
  if (!isUuid(applicationId)) return response.status(404).json({ error: "Permohonan tidak ditemukan." });
  if (!request.file) return response.status(400).json({ error: "Berkas wajib dilampirkan pada field file." });
  const category = cleanString(request.body.category);
  const documentType = cleanString(request.body.documentType);
  if (!["administrative", "portfolio"].includes(category)) {
    return response.status(400).json({ error: "category harus administrative atau portfolio." });
  }
  if (!/^[a-zA-Z0-9_-]{1,80}$/.test(documentType)) {
    return response.status(400).json({ error: "documentType harus berupa kode tanpa spasi." });
  }

  let savedFile: Awaited<ReturnType<typeof savePrivateUpload>> | undefined;
  try {
    const application = await getPool().query(
      `SELECT id, scheme_id, status FROM certification_applications
       WHERE id = $1 AND participant_id = $2`,
      [applicationId, authUser(response).id],
    );
    if (!application.rowCount) return response.status(404).json({ error: "Permohonan tidak ditemukan." });
    assertEditable(application.rows[0].status);

    savedFile = await savePrivateUpload(request.file);
    const requirement = await getPool().query(
      `SELECT allowed_mime_types FROM scheme_document_requirements
       WHERE scheme_id = $1 AND code = $2 AND category = $3`,
      [application.rows[0].scheme_id, documentType, category],
    );
    if (!requirement.rowCount) throw new HttpError(400, "Kode dokumen tidak terdaftar pada skema dan kategori tersebut.");
    const allowedTypes = requirement.rows[0].allowed_mime_types as string[];
    if (!allowedTypes.includes(savedFile.mimeType)) throw new HttpError(415, "Tipe berkas tidak sesuai persyaratan skema.");
    const document = await inTransaction(async (client) => {
      const locked = await client.query(
        `SELECT status FROM certification_applications WHERE id = $1 AND participant_id = $2 FOR UPDATE`,
        [applicationId, authUser(response).id],
      );
      if (!locked.rowCount) throw new HttpError(404, "Permohonan tidak ditemukan.");
      assertEditable(locked.rows[0].status);
      const id = newId();
      const result = await client.query(
        `INSERT INTO stored_documents
           (id, uploaded_by, application_id, document_type, category, original_name, mime_type, size_bytes, storage_key)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING id, document_type, category, original_name, mime_type, size_bytes, created_at`,
        [id, authUser(response).id, applicationId, documentType, category, safeOriginalName(request.file!.originalname), savedFile!.mimeType, savedFile!.sizeBytes, savedFile!.storageKey],
      );
      await audit(client, authUser(response), "application.document_uploaded", "application", applicationId, { documentId: id, category, documentType });
      return result.rows[0];
    });
    response.status(201).json({ document });
  } catch (error) {
    if (savedFile) await removePrivateUpload(savedFile.storageKey).catch(() => undefined);
    if (error instanceof HttpError) return response.status(error.status).json({ error: error.message });
    if (error instanceof Error && error.name === "UnsupportedUploadTypeError") {
      return response.status(415).json({ error: error.message });
    }
    console.error("Dokumen permohonan gagal diunggah:", error);
    response.status(500).json({ error: "Dokumen belum dapat disimpan." });
  }
});

router.delete("/:applicationId/documents/:documentId", async (request, response) => {
  const { applicationId, documentId } = request.params;
  if (!isUuid(applicationId) || !isUuid(documentId)) return response.status(404).json({ error: "Dokumen tidak ditemukan." });
  try {
    const storageKey = await inTransaction(async (client) => {
      const application = await client.query(
        `SELECT status FROM certification_applications WHERE id = $1 AND participant_id = $2 FOR UPDATE`,
        [applicationId, authUser(response).id],
      );
      if (!application.rowCount) throw new HttpError(404, "Dokumen tidak ditemukan.");
      assertEditable(application.rows[0].status);
      const document = await client.query(
        `DELETE FROM stored_documents WHERE id = $1 AND application_id = $2 RETURNING storage_key`,
        [documentId, applicationId],
      );
      if (!document.rowCount) throw new HttpError(404, "Dokumen tidak ditemukan.");
      await audit(client, authUser(response), "application.document_deleted", "application", applicationId, { documentId });
      return document.rows[0].storage_key as string;
    });
    await removePrivateUpload(storageKey).catch((error) => console.error("Berkas privat gagal dihapus:", error));
    response.json({ ok: true });
  } catch (error) {
    if (error instanceof HttpError) return response.status(error.status).json({ error: error.message });
    console.error("Dokumen permohonan gagal dihapus:", error);
    response.status(500).json({ error: "Dokumen belum dapat dihapus." });
  }
});

router.get("/:applicationId/documents/:documentId", async (request, response) => {
  const { applicationId, documentId } = request.params;
  if (!isUuid(applicationId) || !isUuid(documentId)) return response.status(404).json({ error: "Dokumen tidak ditemukan." });
  try {
    const result = await getPool().query(
      `SELECT d.storage_key, d.original_name, d.mime_type FROM stored_documents d
       JOIN certification_applications a ON a.id = d.application_id
       WHERE d.id = $1 AND d.application_id = $2 AND a.participant_id = $3`,
      [documentId, applicationId, authUser(response).id],
    );
    if (!result.rowCount) return response.status(404).json({ error: "Dokumen tidak ditemukan." });
    await sendStoredDocument(response, result.rows[0]);
  } catch (error) {
    console.error("Dokumen permohonan gagal diunduh:", error);
    if (!response.headersSent) response.status(500).json({ error: "Dokumen belum dapat diunduh." });
  }
});

router.post("/:applicationId/submit", async (request, response) => {
  const { applicationId } = request.params;
  if (!isUuid(applicationId)) return response.status(404).json({ error: "Permohonan tidak ditemukan." });
  try {
    const submitted = await inTransaction(async (client) => {
      const selected = await client.query(
        `SELECT a.*, s.code AS scheme_code, s.name AS scheme_name, s.requirements AS scheme_requirements, participant.nik AS account_nik
         FROM certification_applications a JOIN certification_schemes s ON s.id = a.scheme_id
         JOIN users participant ON participant.id = a.participant_id
         WHERE a.id = $1 AND a.participant_id = $2 FOR UPDATE OF a`,
        [applicationId, authUser(response).id],
      );
      const application = selected.rows[0];
      if (!application) throw new HttpError(404, "Permohonan tidak ditemukan.");
      if (application.status !== "draft" && application.status !== "revision_required") {
        throw new HttpError(409, "Permohonan tidak berada pada status yang dapat dikirim.");
      }

      const aplErrors = validateApl01(application.apl01);
      if (cleanString(application.apl01?.nik).replace(/\s/g, "") !== application.account_nik) aplErrors.push("NIK APL-01 harus sesuai dengan NIK akun peserta.");
      const schemeRequirements = application.scheme_requirements ?? {};
      const configuredRequired = Array.isArray(schemeRequirements.requiredApl01Fields)
        ? schemeRequirements.requiredApl01Fields as unknown[]
        : [];
      for (const field of configuredRequired) {
        const name = cleanString(field);
        if (name && !cleanString(application.apl01?.[name])) aplErrors.push(`Kolom ${name} wajib diisi sesuai persyaratan skema.`);
      }
      if (aplErrors.length) throw new HttpError(400, "Data APL-01 belum lengkap.", { fields: aplErrors });

      const units = await client.query(
        `SELECT id, code, title FROM competency_units WHERE scheme_id = $1 ORDER BY sort_order, code`,
        [application.scheme_id],
      );
      if (!units.rowCount) throw new HttpError(409, "Skema belum memiliki unit kompetensi yang dapat dinilai.");
      const answers = await client.query(
        `SELECT r.unit_id, r.self_assessment, r.notes,
                COALESCE(json_agg(json_build_object('id', d.id, 'documentType', d.document_type, 'originalName', d.original_name))
                  FILTER (WHERE d.id IS NOT NULL), '[]'::json) AS evidence
         FROM application_apl02 r
         LEFT JOIN application_apl02_evidence e ON e.application_id = r.application_id AND e.unit_id = r.unit_id
         LEFT JOIN stored_documents d ON d.id = e.document_id
         WHERE r.application_id = $1 GROUP BY r.application_id, r.unit_id`,
        [applicationId],
      );
      if (answers.rowCount !== units.rowCount || units.rows.some((unit: { id: string }) => !answers.rows.some((answer: { unit_id: string }) => answer.unit_id === unit.id))) {
        throw new HttpError(400, "APL-02 harus memiliki jawaban untuk setiap unit kompetensi.");
      }

      const requiredDocs = await client.query(
        `SELECT code, label, category FROM scheme_document_requirements WHERE scheme_id = $1 AND is_required = true`,
        [application.scheme_id],
      );
      const uploadedDocs = await client.query(
        `SELECT id, document_type, category, original_name, mime_type, size_bytes, created_at
         FROM stored_documents WHERE application_id = $1 ORDER BY created_at, id`,
        [applicationId],
      );
      const missingDocs = requiredDocs.rows.filter((requirement: { code: string; category: string }) =>
        !uploadedDocs.rows.some((document: { document_type: string; category: string }) =>
          document.document_type === requirement.code && document.category === requirement.category,
        ),
      );
      if (missingDocs.length) throw new HttpError(400, "Dokumen wajib belum lengkap.", { missingDocuments: missingDocs });

      const schedule = await client.query(
        `SELECT sc.id, sc.scheme_id, sc.starts_at, sc.ends_at, sc.capacity,
                cs.code AS scheme_code, cs.name AS scheme_name,
                t.id AS test_site_id, t.name AS test_site_name, t.address AS test_site_address
         FROM assessment_schedules sc
         JOIN certification_schemes cs ON cs.id = sc.scheme_id AND cs.is_active = true AND cs.is_public = true
         JOIN test_sites t ON t.id = sc.test_site_id AND t.is_active = true
         JOIN test_site_schemes ts ON ts.test_site_id = t.id AND ts.scheme_id = sc.scheme_id
         WHERE sc.id = $1 AND sc.scheme_id = $2 AND sc.is_active = true AND sc.ends_at > now()
         FOR UPDATE OF sc`,
        [application.schedule_id, application.scheme_id],
      );
      if (!schedule.rowCount) throw new HttpError(409, "Jadwal atau TUK yang dipilih sudah tidak tersedia.");
      const booked = await client.query(
        `SELECT count(*)::int AS count FROM certification_applications
         WHERE schedule_id = $1 AND status <> 'draft' AND id <> $2`,
        [application.schedule_id, applicationId],
      );
      if (booked.rows[0].count >= schedule.rows[0].capacity) throw new HttpError(409, "Kuota jadwal sudah penuh.");

      const snapshot = {
        submittedAt: new Date().toISOString(),
        scheme: { id: application.scheme_id, code: schedule.rows[0].scheme_code, name: schedule.rows[0].scheme_name },
        schedule: {
          id: schedule.rows[0].id,
          startsAt: schedule.rows[0].starts_at,
          endsAt: schedule.rows[0].ends_at,
          testSite: { id: schedule.rows[0].test_site_id, name: schedule.rows[0].test_site_name, address: schedule.rows[0].test_site_address },
        },
        apl01: application.apl01,
        apl02: units.rows.map((unit: { id: string; code: string; title: string }) => ({
          unitId: unit.id,
          code: unit.code,
          title: unit.title,
          response: answers.rows.find((answer: { unit_id: string }) => answer.unit_id === unit.id),
        })),
        documents: uploadedDocs.rows,
      };
      await client.query(
        `UPDATE certification_applications SET status = 'submitted', submitted_at = now(),
         submission_snapshot = $2::jsonb, updated_at = now() WHERE id = $1`,
        [applicationId, JSON.stringify(snapshot)],
      );
      await recordApplicationStatus(client, applicationId, authUser(response), application.status, "submitted", null, "application.submitted", {
        schemeId: application.scheme_id,
        scheduleId: application.schedule_id,
      });
      return { id: applicationId, status: "submitted", submittedAt: snapshot.submittedAt };
    });
    response.json({ application: submitted });
  } catch (error) {
    if (error instanceof HttpError) return response.status(error.status).json({ error: error.message, details: error.details });
    console.error("Permohonan gagal dikirim:", error);
    response.status(500).json({ error: "Permohonan belum dapat dikirim." });
  }
});

export default router;
