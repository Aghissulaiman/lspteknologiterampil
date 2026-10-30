-- Active: 1792400357433@@localhost@5432@lsp
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'participant';

ALTER TABLE users
  ALTER COLUMN nik DROP NOT NULL;

DO $nik_role_constraint$
BEGIN
  ALTER TABLE users
    ADD CONSTRAINT users_nik_role_check
    CHECK (role = 'admin_lsp' OR (nik IS NOT NULL AND nik ~ '^[0-9]{16}$'));
EXCEPTION WHEN duplicate_object THEN
  NULL;
END
$nik_role_constraint$;

DO $role_constraint$
BEGIN
  ALTER TABLE users
    ADD CONSTRAINT users_role_check
    CHECK (role IN ('participant', 'admin_lsp', 'assessor'));
EXCEPTION WHEN duplicate_object THEN
  NULL;
END
$role_constraint$;

CREATE TABLE IF NOT EXISTS certification_schemes (
  id uuid PRIMARY KEY,
  code varchar(50) NOT NULL UNIQUE,
  name varchar(200) NOT NULL,
  category varchar(100) NOT NULL DEFAULT '',
  level varchar(100) NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  requirements jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_public boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  created_by uuid REFERENCES users (id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS competency_units (
  id uuid PRIMARY KEY,
  scheme_id uuid NOT NULL REFERENCES certification_schemes (id) ON DELETE CASCADE,
  code varchar(80) NOT NULL,
  title varchar(250) NOT NULL,
  description text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT competency_units_scheme_code_unique UNIQUE (scheme_id, code),
  CONSTRAINT competency_units_id_scheme_unique UNIQUE (id, scheme_id)
);

CREATE TABLE IF NOT EXISTS scheme_document_requirements (
  id uuid PRIMARY KEY,
  scheme_id uuid NOT NULL REFERENCES certification_schemes (id) ON DELETE CASCADE,
  code varchar(80) NOT NULL,
  label varchar(200) NOT NULL,
  category text NOT NULL CHECK (category IN ('administrative', 'portfolio')),
  is_required boolean NOT NULL DEFAULT true,
  allowed_mime_types text[] NOT NULL DEFAULT ARRAY['application/pdf', 'image/jpeg', 'image/png']::text[],
  CONSTRAINT scheme_document_requirement_code_unique UNIQUE (scheme_id, code)
);

CREATE TABLE IF NOT EXISTS test_sites (
  id uuid PRIMARY KEY,
  name varchar(200) NOT NULL,
  address text NOT NULL,
  phone varchar(30) NOT NULL DEFAULT '',
  email varchar(254) NOT NULL DEFAULT '',
  site_type varchar(100) NOT NULL DEFAULT '',
  contact_person varchar(200) NOT NULL DEFAULT '',
  checklist jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS test_site_schemes (
  test_site_id uuid NOT NULL REFERENCES test_sites (id) ON DELETE CASCADE,
  scheme_id uuid NOT NULL REFERENCES certification_schemes (id) ON DELETE RESTRICT,
  PRIMARY KEY (test_site_id, scheme_id)
);

CREATE TABLE IF NOT EXISTS tuk_submissions (
  id uuid PRIMARY KEY,
  applicant_id uuid NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'submitted', 'revision_required', 'approved', 'rejected')),
  profile jsonb NOT NULL DEFAULT '{}'::jsonb,
  facility_checklist jsonb NOT NULL DEFAULT '{}'::jsonb,
  review_note text,
  reviewed_by uuid REFERENCES users (id),
  reviewed_at timestamptz,
  approved_test_site_id uuid REFERENCES test_sites (id),
  submitted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT approved_tuk_submission_has_site CHECK (status <> 'approved' OR approved_test_site_id IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS tuk_submissions_applicant_idx
  ON tuk_submissions (applicant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS tuk_submissions_status_idx
  ON tuk_submissions (status, created_at);

CREATE TABLE IF NOT EXISTS tuk_submission_schemes (
  tuk_submission_id uuid NOT NULL REFERENCES tuk_submissions (id) ON DELETE CASCADE,
  scheme_id uuid NOT NULL REFERENCES certification_schemes (id) ON DELETE RESTRICT,
  PRIMARY KEY (tuk_submission_id, scheme_id)
);

CREATE TABLE IF NOT EXISTS assessment_schedules (
  id uuid PRIMARY KEY,
  scheme_id uuid NOT NULL REFERENCES certification_schemes (id) ON DELETE RESTRICT,
  test_site_id uuid NOT NULL REFERENCES test_sites (id) ON DELETE RESTRICT,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  capacity integer NOT NULL CHECK (capacity > 0),
  is_active boolean NOT NULL DEFAULT true,
  created_by uuid REFERENCES users (id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT assessment_schedule_time_order CHECK (ends_at > starts_at)
);

CREATE INDEX IF NOT EXISTS assessment_schedules_available_idx
  ON assessment_schedules (scheme_id, is_active, starts_at);

CREATE TABLE IF NOT EXISTS certification_applications (
  id uuid PRIMARY KEY,
  participant_id uuid NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
  scheme_id uuid NOT NULL REFERENCES certification_schemes (id) ON DELETE RESTRICT,
  schedule_id uuid NOT NULL REFERENCES assessment_schedules (id) ON DELETE RESTRICT,
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'submitted', 'revision_required', 'verified', 'assessment_scheduled', 'assessment_completed', 'competent', 'not_competent', 'certified')),
  apl01 jsonb NOT NULL DEFAULT '{}'::jsonb,
  submission_snapshot jsonb,
  final_decision text CHECK (final_decision IS NULL OR final_decision IN ('competent', 'not_competent')),
  decision_note text,
  decision_by uuid REFERENCES users (id),
  decision_at timestamptz,
  submitted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS certification_applications_participant_idx
  ON certification_applications (participant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS certification_applications_status_idx
  ON certification_applications (status, created_at);
CREATE INDEX IF NOT EXISTS certification_applications_schedule_idx
  ON certification_applications (schedule_id, status);

CREATE TABLE IF NOT EXISTS stored_documents (
  id uuid PRIMARY KEY,
  uploaded_by uuid NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
  application_id uuid REFERENCES certification_applications (id) ON DELETE RESTRICT,
  tuk_submission_id uuid REFERENCES tuk_submissions (id) ON DELETE RESTRICT,
  document_type varchar(100) NOT NULL,
  category text NOT NULL CHECK (category IN ('administrative', 'portfolio', 'tuk')),
  original_name varchar(255) NOT NULL,
  mime_type varchar(150) NOT NULL,
  size_bytes bigint NOT NULL CHECK (size_bytes > 0),
  storage_key varchar(100) NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT stored_document_has_one_parent CHECK (
    (application_id IS NOT NULL AND tuk_submission_id IS NULL)
    OR (application_id IS NULL AND tuk_submission_id IS NOT NULL)
  )
);

CREATE INDEX IF NOT EXISTS stored_documents_application_idx
  ON stored_documents (application_id, category, document_type);
CREATE INDEX IF NOT EXISTS stored_documents_tuk_submission_idx
  ON stored_documents (tuk_submission_id, document_type);

CREATE TABLE IF NOT EXISTS application_apl02 (
  application_id uuid NOT NULL REFERENCES certification_applications (id) ON DELETE CASCADE,
  unit_id uuid NOT NULL REFERENCES competency_units (id) ON DELETE RESTRICT,
  self_assessment text NOT NULL CHECK (self_assessment IN ('competent', 'not_competent')),
  notes text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (application_id, unit_id)
);

CREATE TABLE IF NOT EXISTS application_apl02_evidence (
  application_id uuid NOT NULL,
  unit_id uuid NOT NULL,
  document_id uuid NOT NULL REFERENCES stored_documents (id) ON DELETE RESTRICT,
  PRIMARY KEY (application_id, unit_id, document_id),
  FOREIGN KEY (application_id, unit_id)
    REFERENCES application_apl02 (application_id, unit_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS application_status_history (
  id uuid PRIMARY KEY,
  application_id uuid NOT NULL REFERENCES certification_applications (id) ON DELETE CASCADE,
  actor_id uuid REFERENCES users (id),
  from_status text,
  to_status text NOT NULL,
  reason text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS application_status_history_app_idx
  ON application_status_history (application_id, created_at);

CREATE TABLE IF NOT EXISTS tuk_submission_status_history (
  id uuid PRIMARY KEY,
  tuk_submission_id uuid NOT NULL REFERENCES tuk_submissions (id) ON DELETE CASCADE,
  actor_id uuid REFERENCES users (id),
  from_status text,
  to_status text NOT NULL,
  reason text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS tuk_submission_status_history_app_idx
  ON tuk_submission_status_history (tuk_submission_id, created_at);

CREATE TABLE IF NOT EXISTS assessments (
  id uuid PRIMARY KEY,
  application_id uuid NOT NULL UNIQUE REFERENCES certification_applications (id) ON DELETE RESTRICT,
  assessor_id uuid NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
  assigned_by uuid NOT NULL REFERENCES users (id),
  pre_assessment_outcome text,
  pre_assessment_notes text NOT NULL DEFAULT '',
  assessment_notes text NOT NULL DEFAULT '',
  recommendation text CHECK (recommendation IS NULL OR recommendation IN ('competent', 'not_competent')),
  recommendation_note text,
  recommended_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS assessments_assessor_idx ON assessments (assessor_id, created_at DESC);

CREATE TABLE IF NOT EXISTS assessment_unit_results (
  assessment_id uuid NOT NULL REFERENCES assessments (id) ON DELETE CASCADE,
  unit_id uuid NOT NULL REFERENCES competency_units (id) ON DELETE RESTRICT,
  result text NOT NULL CHECK (result IN ('competent', 'not_competent')),
  evidence_notes text NOT NULL DEFAULT '',
  notes text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (assessment_id, unit_id)
);

CREATE TABLE IF NOT EXISTS assessment_unit_evidence (
  assessment_id uuid NOT NULL,
  unit_id uuid NOT NULL,
  document_id uuid NOT NULL REFERENCES stored_documents (id) ON DELETE RESTRICT,
  PRIMARY KEY (assessment_id, unit_id, document_id),
  FOREIGN KEY (assessment_id, unit_id)
    REFERENCES assessment_unit_results (assessment_id, unit_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS certificates (
  id uuid PRIMARY KEY,
  application_id uuid NOT NULL UNIQUE REFERENCES certification_applications (id) ON DELETE RESTRICT,
  certificate_number varchar(100) NOT NULL UNIQUE,
  scheme_name varchar(200) NOT NULL,
  issued_at timestamptz NOT NULL DEFAULT now(),
  issued_by uuid NOT NULL REFERENCES users (id),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS certificate_sequences (
  issue_year integer PRIMARY KEY,
  last_value bigint NOT NULL CHECK (last_value > 0)
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY,
  actor_id uuid REFERENCES users (id),
  actor_role text CHECK (actor_role IS NULL OR actor_role IN ('participant', 'admin_lsp', 'assessor')),
  action varchar(100) NOT NULL,
  entity_type varchar(80) NOT NULL,
  entity_id uuid,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS audit_logs_entity_idx
  ON audit_logs (entity_type, entity_id, created_at DESC);
CREATE INDEX IF NOT EXISTS audit_logs_actor_idx
  ON audit_logs (actor_id, created_at DESC);
