import { clearSessionCookie } from "@/lib/server-auth";

export async function POST() {
  return clearSessionCookie(Response.json({ ok: true }));
}
