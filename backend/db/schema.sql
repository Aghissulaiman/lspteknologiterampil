-- Active: 1792400357433@@localhost@5432@lsp
  CREATE TABLE IF NOT EXISTS users (
    id uuid PRIMARY KEY,
    full_name varchar(100) NOT NULL,
    email varchar(254) NOT NULL,
    nik varchar(16) NOT NULL,
    phone varchar(20) NOT NULL,
    password_hash text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT users_nik_unique UNIQUE (nik)
  );

  CREATE UNIQUE INDEX IF NOT EXISTS users_email_lower_unique
    ON users (lower(email));

  CREATE TABLE IF NOT EXISTS folders (
    id uuid PRIMARY KEY,
    owner_id uuid NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    name varchar(100) NOT NULL,
    parent_id uuid,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT folders_id_owner_unique UNIQUE (id, owner_id),
    CONSTRAINT folders_parent_same_owner_fk
      FOREIGN KEY (parent_id, owner_id)
      REFERENCES folders (id, owner_id)
      ON DELETE RESTRICT
  );

  CREATE UNIQUE INDEX IF NOT EXISTS folders_sibling_name_unique
    ON folders (owner_id, parent_id, lower(name)) NULLS NOT DISTINCT;

  CREATE INDEX IF NOT EXISTS folders_owner_parent_idx
    ON folders (owner_id, parent_id);
