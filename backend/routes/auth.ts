import { Router } from "express";
import { clearSessionCookie, getCurrentUser, setSessionCookie } from "../lib/express-auth";
import { createUser, findUserByEmail, hashPassword, newId, toPublicUser, verifyPassword, type UserRecord, type UserRole } from "../lib/server-store";
import { cleanString, isPlainObject } from "../lib/certification-utils";

const router = Router();

function isUserRole(role: unknown): role is UserRole {
  return role === "participant" || role === "assessor" || role === "admin_lsp";
}

router.post("/register", async (request, response) => {
  if (!isPlainObject(request.body)) return response.status(400).json({ error: "Format data tidak valid." });

  const body = request.body;
  const fullName = cleanString(body.fullName);
  const nik = cleanString(body.nik).replace(/\s/g, "");
  const phone = cleanString(body.phone);
  const email = cleanString(body.email).toLowerCase();
  const password = typeof body.password === "string" ? body.password : "";

  if (fullName.length < 2 || fullName.length > 100) {
    return response.status(400).json({ error: "Nama lengkap harus terdiri dari 2–100 karakter." });
  }
  if (!/^\d{16}$/.test(nik)) return response.status(400).json({ error: "NIK harus terdiri dari 16 angka." });
  if (!/^[+\d][\d\s()-]{7,19}$/.test(phone)) {
    return response.status(400).json({ error: "Nomor WhatsApp tidak valid." });
  }
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return response.status(400).json({ error: "Alamat email tidak valid." });
  }
  if (password.length < 8 || password.length > 128) {
    return response.status(400).json({ error: "Kata sandi harus terdiri dari 8–128 karakter." });
  }

  try {
    const user: UserRecord = {
      id: newId(),
      fullName,
      email,
      nik,
      phone,
      passwordHash: await hashPassword(password),
      createdAt: new Date().toISOString(),
      role: "participant",
    };
    const result = await createUser(user);

    if ("error" in result && result.error === "email-exists") {
      return response.status(409).json({ error: "Email sudah terdaftar." });
    }
    if ("error" in result && result.error === "nik-exists") {
      return response.status(409).json({ error: "NIK sudah terdaftar." });
    }

    setSessionCookie(response, user.id).status(201).json({ user: toPublicUser(result.user) });
  } catch (error) {
    console.error("Pendaftaran gagal:", error);
    response.status(500).json({ error: "Pendaftaran belum dapat diproses. Coba lagi." });
  }
});

router.post("/login", async (request, response) => {
  if (!isPlainObject(request.body)) return response.status(400).json({ error: "Format data tidak valid." });

  const role = request.body.role;
  if (!isUserRole(role)) return response.status(400).json({ error: "Pilih peran yang valid." });

  const email = cleanString(request.body.email).toLowerCase();
  const password = typeof request.body.password === "string" ? request.body.password : "";
  if (!email || !password || email.length > 254 || password.length > 128) {
    return response.status(400).json({ error: "Email dan kata sandi wajib diisi." });
  }

  try {
    const user = await findUserByEmail(email);
    if (!user || !(await verifyPassword(password, user.passwordHash)) || user.role !== role) {
      return response.status(401).json({ error: "Email, kata sandi, atau peran tidak sesuai." });
    }
    setSessionCookie(response, user.id).json({ user: toPublicUser(user) });
  } catch (error) {
    console.error("Masuk gagal:", error);
    response.status(500).json({ error: "Masuk belum dapat diproses. Coba lagi." });
  }
});

router.post("/logout", (_request, response) => clearSessionCookie(response).json({ ok: true }));

router.get("/me", async (request, response) => {
  try {
    const user = await getCurrentUser(request);
    if (!user) return response.status(401).json({ user: null });
    response.set("Cache-Control", "no-store").json({ user });
  } catch (error) {
    console.error("Pemeriksaan sesi gagal:", error);
    response.status(500).json({ error: "Sesi belum dapat diperiksa." });
  }
});

export default router;
