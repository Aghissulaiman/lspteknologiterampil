import { getCurrentUser } from "@/lib/server-auth";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return Response.json({ user: null }, { status: 401 });
    return Response.json({ user }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "Sesi belum dapat diperiksa." }, { status: 500 });
  }
}
