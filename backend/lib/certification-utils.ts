import { randomUUID } from "node:crypto";
import type { PoolClient } from "pg";
import type { AuthenticatedUser } from "./express-auth";

export function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function cleanString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function isUuid(value: unknown): value is string {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export class HttpError extends Error {
  status: number;
  details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.details = details;
  }
}

export async function audit(
  client: PoolClient,
  actor: AuthenticatedUser | null,
  action: string,
  entityType: string,
  entityId: string | null,
  details: Record<string, unknown> = {},
) {
  await client.query(
    `INSERT INTO audit_logs (id, actor_id, actor_role, action, entity_type, entity_id, details)
     VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb)`,
    [randomUUID(), actor?.id ?? null, actor?.role ?? null, action, entityType, entityId, JSON.stringify(details)],
  );
}

export async function recordApplicationStatus(
  client: PoolClient,
  applicationId: string,
  actor: AuthenticatedUser,
  fromStatus: string,
  toStatus: string,
  reason: string | null,
  action: string,
  details: Record<string, unknown> = {},
) {
  await client.query(
    `INSERT INTO application_status_history (id, application_id, actor_id, from_status, to_status, reason)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [randomUUID(), applicationId, actor.id, fromStatus, toStatus, reason],
  );
  await audit(client, actor, action, "application", applicationId, { fromStatus, toStatus, reason, ...details });
}

export async function recordTukStatus(
  client: PoolClient,
  submissionId: string,
  actor: AuthenticatedUser,
  fromStatus: string,
  toStatus: string,
  reason: string | null,
  action: string,
) {
  await client.query(
    `INSERT INTO tuk_submission_status_history (id, tuk_submission_id, actor_id, from_status, to_status, reason)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [randomUUID(), submissionId, actor.id, fromStatus, toStatus, reason],
  );
  await audit(client, actor, action, "tuk_submission", submissionId, { fromStatus, toStatus, reason });
}

export function parsePositiveInteger(value: unknown, name: string) {
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < 1) throw new HttpError(400, `${name} harus berupa bilangan bulat positif.`);
  return parsed;
}

export function jsonString(value: unknown) {
  return JSON.stringify(value ?? {});
}
