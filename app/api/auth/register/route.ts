import { setSessionCookie } from "@/lib/server-auth";
import { createUser, hashPassword, newId, toPublicUser, type UserRecord } from "@/lib/server-store";

export const runtime = "nodejs";

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

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

  const fullName = text(body.fullName);
  const nik = text(body.nik).replace(/\s/g, "");
  const phone = text(body.phone);
  const email = text(body.email).toLowerCase();
  const password = typeof body.password === "string" ? body.password : "";

  if (fullName.length < 2 || fullName.length > 100) {
    return Response.json({ error: "Nama lengkap harus terdiri dari 2–100 karakter." }, { status: 400 });
  }
  if (!/^\d{16}$/.test(nik)) {
    return Response.json({ error: "NIK harus terdiri dari 16 angka." }, { status: 400 });
  }
  if (!/^[+\d][\d\s()-]{7,19}$/.test(phone)) {
    return Response.json({ error: "Nomor WhatsApp tidak valid." }, { status: 400 });
  }
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "Alamat email tidak valid." }, { status: 400 });
  }
  if (password.length < 8 || password.length > 128) {
    return Response.json({ error: "Kata sandi harus terdiri dari 8–128 karakter." }, { status: 400 });
  }

  const passwordHash = await hashPassword(password);
  const user: UserRecord = {
    id: newId(), fullName, email, nik, phone, passwordHash, createdAt: new Date().toISOString(),
  };

  try {
    const result = await createUser(user);

    if ("error" in result && result.error === "email-exists") {
      return Response.json({ error: "Email sudah terdaftar." }, { status: 409 });
    }
    if ("error" in result && result.error === "nik-exists") {
      return Response.json({ error: "NIK sudah terdaftar." }, { status: 409 });
    }

    const response = Response.json({ user: toPublicUser(result.user) }, { status: 201 });
    return setSessionCookie(response, user.id);
  } catch {
    return Response.json({ error: "Pendaftaran belum dapat diproses. Coba lagi." }, { status: 500 });
  }
}
