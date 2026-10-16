import { setSessionCookie } from "@/lib/server-auth";
import { findUserByEmail, toPublicUser, verifyPassword } from "@/lib/server-store";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    const parsed: unknown = await request.json();
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return Response.json({ error: "Format data tidak valid." }, { status: 400 });
    }
    body = parsed as Record<string, unknown>;
  } catch {
    return Response.json({ error: "Format data tidak valid." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  if (!email || !password || email.length > 254 || password.length > 128) {
    return Response.json({ error: "Email dan kata sandi wajib diisi." }, { status: 400 });
  }

  try {
    const user = await findUserByEmail(email);
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return Response.json({ error: "Email atau kata sandi salah." }, { status: 401 });
    }

    const response = Response.json({ user: toPublicUser(user) });
    return setSessionCookie(response, user.id);
  } catch {
    return Response.json({ error: "Masuk belum dapat diproses. Coba lagi." }, { status: 500 });
  }
}
