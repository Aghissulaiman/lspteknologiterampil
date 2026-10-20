import { Router } from "express";
import { getPool } from "../lib/server-db";
import { isUuid } from "../lib/certification-utils";

const router = Router();

async function publicSchemeDetails(schemeId: string) {
  const pool = getPool();
  const scheme = await pool.query(
    `SELECT id, code, name, category, level, description, requirements
     FROM certification_schemes WHERE id = $1 AND is_active = true AND is_public = true`,
    [schemeId],
  );
  if (!scheme.rowCount) return null;

  const [units, documents] = await Promise.all([
    pool.query(
      `SELECT id, code, title, description, sort_order
       FROM competency_units WHERE scheme_id = $1 ORDER BY sort_order, code`,
      [schemeId],
    ),
    pool.query(
      `SELECT code, label, category, is_required, allowed_mime_types
       FROM scheme_document_requirements WHERE scheme_id = $1 ORDER BY category, code`,
      [schemeId],
    ),
  ]);
  return { ...scheme.rows[0], competencyUnits: units.rows, documentRequirements: documents.rows };
}

router.get("/schemes", async (_request, response) => {
  try {
    const result = await getPool().query(
      `SELECT id, code, name, category, level, description, requirements
       FROM certification_schemes WHERE is_active = true AND is_public = true ORDER BY name, code`,
    );
    response.set("Cache-Control", "public, max-age=60, stale-while-revalidate=300").json({ schemes: result.rows });
  } catch (error) {
    console.error("Skema publik gagal dimuat:", error);
    response.status(500).json({ error: "Informasi skema belum dapat dimuat." });
  }
});

router.get("/schemes/:schemeId", async (request, response) => {
  try {
    const parameter = request.params.schemeId;
    const schemeId = isUuid(parameter)
      ? parameter
      : (await getPool().query<{ id: string }>(
          `SELECT id FROM certification_schemes WHERE lower(code) = lower($1) AND is_active = true AND is_public = true`,
          [parameter],
        )).rows[0]?.id;
    if (!schemeId) return response.status(404).json({ error: "Skema tidak ditemukan." });
    const scheme = await publicSchemeDetails(schemeId);
    if (!scheme) return response.status(404).json({ error: "Skema tidak ditemukan." });
    response.set("Cache-Control", "public, max-age=60, stale-while-revalidate=300").json({ scheme });
  } catch (error) {
    console.error("Detail skema publik gagal dimuat:", error);
    response.status(500).json({ error: "Informasi skema belum dapat dimuat." });
  }
});

router.get("/certificates/:certificateNumber", async (request, response) => {
  try {
    const certificateNumber = request.params.certificateNumber.trim();
    if (certificateNumber.length < 4 || certificateNumber.length > 100) {
      return response.status(400).json({ error: "Nomor sertifikat tidak valid." });
    }
    const result = await getPool().query(
      `SELECT certificate_number, scheme_name, issued_at
       FROM certificates WHERE lower(certificate_number) = lower($1) LIMIT 1`,
      [certificateNumber],
    );
    response.set("Cache-Control", "no-store");
    if (!result.rowCount) return response.status(404).json({ valid: false });
    response.json({ valid: true, ...result.rows[0] });
  } catch (error) {
    console.error("Validasi sertifikat gagal:", error);
    response.status(500).json({ error: "Sertifikat belum dapat divalidasi." });
  }
});

export default router;
