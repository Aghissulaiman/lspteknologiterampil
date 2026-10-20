import { createHmac, timingSafeEqual } from "node:crypto";
import type { Request, RequestHandler, Response } from "express";
import { findUserById, toPublicUser } from "./server-store";
import type { UserRole } from "./server-store";

const COOKIE_NAME = "lsp_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;
function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  };
}

type SessionPayload = { sub: string; exp: number };
export type AuthenticatedUser = { id: string; fullName: string; email: string; role: UserRole };

function getSessionSecret() {
  const configuredSecret = process.env.AUTH_SECRET;
  if (process.env.NODE_ENV === "production" && (!configuredSecret || configuredSecret.length < 32)) {
    throw new Error("AUTH_SECRET harus diatur dan memiliki minimal 32 karakter di production.");
  }
  return configuredSecret || "local-development-only-secret-change-before-deploy";
}

function sign(value: string) {
  return createHmac("sha256", getSessionSecret()).update(value).digest("base64url");
}

function createSessionToken(userId: string) {
  const payload: SessionPayload = {
    sub: userId,
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS,
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const content = `v1.${encodedPayload}`;
  return `${content}.${sign(content)}`;
}

function verifySessionToken(token: string): SessionPayload | null {
  try {
    const [version, encodedPayload, signature, extra] = token.split(".");
    if (version !== "v1" || !encodedPayload || !signature || extra) return null;

    const content = `${version}.${encodedPayload}`;
    const expected = Buffer.from(sign(content), "base64url");
    const received = Buffer.from(signature, "base64url");
    if (expected.length !== received.length || !timingSafeEqual(expected, received)) return null;

    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")) as Partial<SessionPayload>;
    if (typeof payload.sub !== "string" || typeof payload.exp !== "number" || payload.exp <= Date.now() / 1000) {
      return null;
    }
    return { sub: payload.sub, exp: payload.exp };
  } catch {
    return null;
  }
}

function readSessionCookie(request: Request) {
  const cookieHeader = request.headers.cookie;
  if (!cookieHeader) return null;

  for (const cookie of cookieHeader.split(";")) {
    const separator = cookie.indexOf("=");
    if (separator < 0 || cookie.slice(0, separator).trim() !== COOKIE_NAME) continue;
    return cookie.slice(separator + 1).trim() || null;
  }
  return null;
}

export function setSessionCookie(response: Response, userId: string) {
  response.cookie(COOKIE_NAME, createSessionToken(userId), {
    ...cookieOptions(),
    maxAge: SESSION_MAX_AGE_SECONDS * 1000,
  });
  return response;
}

export function clearSessionCookie(response: Response) {
  response.clearCookie(COOKIE_NAME, cookieOptions());
  return response;
}

export async function getCurrentUser(request: Request) {
  const token = readSessionCookie(request);
  if (!token) return null;
  const session = verifySessionToken(token);
  if (!session) return null;

  const user = await findUserById(session.sub);
  return user ? toPublicUser(user) : null;
}

export const authenticate: RequestHandler = async (request, response, next) => {
  try {
    const user = await getCurrentUser(request);
    if (!user) return response.status(401).json({ error: "Silakan masuk terlebih dahulu." });
    response.locals.authUser = user;
    next();
  } catch (error) {
    next(error);
  }
};

export function requireRole(...roles: UserRole[]): RequestHandler {
  return (_request, response, next) => {
    const user = response.locals.authUser as AuthenticatedUser | undefined;
    if (!user) return response.status(401).json({ error: "Silakan masuk terlebih dahulu." });
    if (!roles.includes(user.role)) return response.status(403).json({ error: "Anda tidak memiliki akses." });
    next();
  };
}

export function authUser(response: Response) {
  return response.locals.authUser as AuthenticatedUser;
}
