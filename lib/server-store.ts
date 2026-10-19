import "server-only";

import { randomBytes, randomUUID, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { getPool, inTransaction } from "@/lib/server-db";

const scrypt = promisify(scryptCallback);

export type UserRecord = {
  id: string;
  fullName: string;
  email: string;
  nik: string;
  phone: string;
  passwordHash: string;
  createdAt: string;
};

export type FolderRecord = {
  id: string;
  ownerId: string;
  name: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
};

type UserRow = {
  id: string;
  full_name: string;
  email: string;
  nik: string;
  phone: string;
  password_hash: string;
  created_at: Date | string;
};

type FolderRow = {
  id: string;
  owner_id: string;
  name: string;
  parent_id: string | null;
  created_at: Date | string;
  updated_at: Date | string;
};

function iso(value: Date | string) {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function userRecord(row: UserRow): UserRecord {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    nik: row.nik,
    phone: row.phone,
    passwordHash: row.password_hash,
    createdAt: iso(row.created_at),
  };
}

function folderRecord(row: FolderRow): FolderRecord {
  return {
    id: row.id,
    ownerId: row.owner_id,
    name: row.name,
    parentId: row.parent_id,
    createdAt: iso(row.created_at),
    updatedAt: iso(row.updated_at),
  };
}

function postgresError(error: unknown) {
  if (typeof error !== "object" || error === null) return {};
  const candidate = error as { code?: string; constraint?: string };
  return { code: candidate.code, constraint: candidate.constraint };
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export async function createUser(user: UserRecord) {
  try {
    const result = await getPool().query<UserRow>(
      `INSERT INTO users (id, full_name, email, nik, phone, password_hash, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, full_name, email, nik, phone, password_hash, created_at`,
      [user.id, user.fullName, user.email, user.nik, user.phone, user.passwordHash, user.createdAt],
    );
    return { user: userRecord(result.rows[0]) } as const;
  } catch (error) {
    const { code, constraint } = postgresError(error);
    if (code === "23505" && (constraint === "users_email_lower_unique" || constraint === "users_email_key")) {
      return { error: "email-exists" } as const;
    }
    if (code === "23505" && constraint === "users_nik_unique") {
      return { error: "nik-exists" } as const;
    }
    throw error;
  }
}

export async function findUserByEmail(email: string) {
  const result = await getPool().query<UserRow>(
    `SELECT id, full_name, email, nik, phone, password_hash, created_at
     FROM users WHERE lower(email) = lower($1) LIMIT 1`,
    [email],
  );
  return result.rows[0] ? userRecord(result.rows[0]) : null;
}

export async function findUserById(id: string) {
  if (!isUuid(id)) return null;
  const result = await getPool().query<UserRow>(
    `SELECT id, full_name, email, nik, phone, password_hash, created_at
     FROM users WHERE id = $1 LIMIT 1`,
    [id],
  );
  return result.rows[0] ? userRecord(result.rows[0]) : null;
}

export async function findFoldersByOwner(ownerId: string) {
  const result = await getPool().query<FolderRow>(
    `SELECT id, owner_id, name, parent_id, created_at, updated_at
     FROM folders WHERE owner_id = $1 ORDER BY created_at ASC, id ASC`,
    [ownerId],
  );
  return result.rows.map(folderRecord);
}

export async function createFolder(ownerId: string, name: string, parentId: string | null) {
  if (parentId !== null && !isUuid(parentId)) return { error: "parent-not-found" } as const;

  try {
    return await inTransaction(async (client) => {
      await client.query("SELECT id FROM users WHERE id = $1 FOR UPDATE", [ownerId]);

      if (parentId) {
        const parent = await client.query("SELECT id FROM folders WHERE id = $1 AND owner_id = $2", [parentId, ownerId]);
        if (parent.rowCount === 0) return { error: "parent-not-found" } as const;
      }

      const id = newId();
      const result = await client.query<FolderRow>(
        `INSERT INTO folders (id, owner_id, name, parent_id)
         VALUES ($1, $2, $3, $4)
         RETURNING id, owner_id, name, parent_id, created_at, updated_at`,
        [id, ownerId, name, parentId],
      );
      return { folder: folderRecord(result.rows[0]) } as const;
    });
  } catch (error) {
    const { code, constraint } = postgresError(error);
    if (code === "23505" && constraint === "folders_sibling_name_unique") return { error: "duplicate" } as const;
    if (code === "23503" && constraint === "folders_parent_same_owner_fk") return { error: "parent-not-found" } as const;
    throw error;
  }
}

export async function updateFolder(
  ownerId: string,
  folderId: string,
  name: string | undefined,
  requestedParentId: string | null | undefined,
) {
  if (!isUuid(folderId)) return { error: "not-found" } as const;
  if (requestedParentId !== undefined && requestedParentId !== null && !isUuid(requestedParentId)) {
    return { error: "parent-not-found" } as const;
  }

  try {
    return await inTransaction(async (client) => {
      await client.query("SELECT id FROM users WHERE id = $1 FOR UPDATE", [ownerId]);
      const currentResult = await client.query<FolderRow>(
        `SELECT id, owner_id, name, parent_id, created_at, updated_at
         FROM folders WHERE id = $1 AND owner_id = $2 FOR UPDATE`,
        [folderId, ownerId],
      );
      const current = currentResult.rows[0];
      if (!current) return { error: "not-found" } as const;

      const parentId = requestedParentId === undefined ? current.parent_id : requestedParentId;
      if (parentId) {
        const parent = await client.query("SELECT id FROM folders WHERE id = $1 AND owner_id = $2", [parentId, ownerId]);
        if (parent.rowCount === 0) return { error: "parent-not-found" } as const;

        const cycleCheck = await client.query<{ would_cycle: boolean }>(
          `WITH RECURSIVE ancestors AS (
             SELECT id, parent_id FROM folders WHERE id = $1 AND owner_id = $2
             UNION ALL
             SELECT parent.id, parent.parent_id
             FROM folders AS parent
             INNER JOIN ancestors AS child ON parent.id = child.parent_id
             WHERE parent.owner_id = $2
           )
           SELECT EXISTS (SELECT 1 FROM ancestors WHERE id = $3) AS would_cycle`,
          [parentId, ownerId, folderId],
        );
        if (cycleCheck.rows[0].would_cycle) return { error: "cycle" } as const;
      }

      const nextName = name ?? current.name;
      const duplicate = await client.query(
        `SELECT id FROM folders
         WHERE owner_id = $1 AND id <> $2 AND parent_id IS NOT DISTINCT FROM $3::uuid
           AND lower(name) = lower($4) LIMIT 1`,
        [ownerId, folderId, parentId, nextName],
      );
      if (duplicate.rowCount) return { error: "duplicate" } as const;

      const result = await client.query<FolderRow>(
        `UPDATE folders SET name = $3, parent_id = $4, updated_at = now()
         WHERE id = $1 AND owner_id = $2
         RETURNING id, owner_id, name, parent_id, created_at, updated_at`,
        [folderId, ownerId, nextName, parentId],
      );
      return { folder: folderRecord(result.rows[0]) } as const;
    });
  } catch (error) {
    const { code, constraint } = postgresError(error);
    if (code === "23505" && constraint === "folders_sibling_name_unique") return { error: "duplicate" } as const;
    if (code === "23503" && constraint === "folders_parent_same_owner_fk") return { error: "parent-not-found" } as const;
    throw error;
  }
}

export async function deleteFolder(ownerId: string, folderId: string) {
  if (!isUuid(folderId)) return "not-found" as const;

  try {
    return await inTransaction(async (client) => {
      await client.query("SELECT id FROM users WHERE id = $1 FOR UPDATE", [ownerId]);
      const folder = await client.query("SELECT id FROM folders WHERE id = $1 AND owner_id = $2 FOR UPDATE", [folderId, ownerId]);
      if (!folder.rowCount) return "not-found" as const;

      const children = await client.query("SELECT id FROM folders WHERE owner_id = $1 AND parent_id = $2 LIMIT 1", [ownerId, folderId]);
      if (children.rowCount) return "not-empty" as const;

      await client.query("DELETE FROM folders WHERE id = $1 AND owner_id = $2", [folderId, ownerId]);
      return "deleted" as const;
    });
  } catch (error) {
    const { code, constraint } = postgresError(error);
    if (code === "23503" && constraint === "folders_parent_same_owner_fk") return "not-empty" as const;
    throw error;
  }
}

export function toPublicUser(user: UserRecord) {
  return { id: user.id, fullName: user.fullName, email: user.email };
}

export function toPublicFolder(folder: FolderRecord) {
  return {
    id: folder.id,
    name: folder.name,
    parentId: folder.parentId,
    createdAt: folder.createdAt,
    updatedAt: folder.updatedAt,
  };
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
  return `${salt.toString("base64url")}:${derivedKey.toString("base64url")}`;
}

export async function verifyPassword(password: string, passwordHash: string) {
  const [encodedSalt, encodedHash, extra] = passwordHash.split(":");
  if (!encodedSalt || !encodedHash || extra) return false;

  try {
    const salt = Buffer.from(encodedSalt, "base64url");
    const expected = Buffer.from(encodedHash, "base64url");
    if (salt.length !== 16 || expected.length !== 64) return false;
    const actual = (await scrypt(password, salt, 64)) as Buffer;
    return timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

export function newId() {
  return randomUUID();
}
