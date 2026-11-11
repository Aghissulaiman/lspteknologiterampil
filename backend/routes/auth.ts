import { Router, type Request, type Response } from "express";
import { clearSessionCookie, getCurrentUser, setSessionCookie } from "../lib/express-auth";
import { createUser, findUserByEmail, hashPassword, newId, toPublicUser, verifyPassword, type UserRecord, type UserRole } from "../lib/server-store";
import { cleanString, isPlainObject } from "../lib/certification-utils";

const router = Router();

function isFormRequest(request: Request) {
  return request.is("application/x-www-form-urlencoded") === "application/x-www-form-urlencoded";
}

function authFailure(request: Request, response: Response, status: number, message: string, page: string, code: string) {
  if (isFormRequest(request)) return response.redirect(303, `${page}?error=${code}`);
  return response.status(status).json({ error: message });
}

function roleDestination(role: UserRole) {
  if (role === "admin_lsp") return "/admin";
  if (role === "assessor") return "/asesor";
  return "/dashboard";
}

function isUserRole(role: unknown): role is UserRole {
  return role === "participant" || role === "assessor" || role === "admin_lsp";
}

router.post("/register", async (request, response) => {
  if (!isPlainObject(request.body)) return authFailure(request, response, 400, "Format data tidak valid.", "/auth/pendaftaran", "invalid");

  const body = request.body;
  const fullName = cleanString(body.fullName);
  const nik = cleanString(body.nik).replace(/\s/g, "");
  const phone = cleanString(body.phone);
  const email = cleanString(body.email).toLowerCase();
  const password = typeof body.password === "string" ? body.password : "";
  const confirmPassword = typeof body.confirmPassword === "string" ? body.confirmPassword : "";

  if (fullName.length < 2 || fullName.length > 100) {
    return authFailure(request, response, 400, "Nama lengkap harus terdiri dari 2–100 karakter.", "/auth/pendaftaran", "invalid");
  }
  if (!/^\d{16}$/.test(nik)) return authFailure(request, response, 400, "NIK harus terdiri dari 16 angka.", "/auth/pendaftaran", "invalid");
  if (!/^[+\d][\d\s()-]{7,19}$/.test(phone)) {
    return authFailure(request, response, 400, "Nomor WhatsApp tidak valid.", "/auth/pendaftaran", "invalid");
  }
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return authFailure(request, response, 400, "Alamat email tidak valid.", "/auth/pendaftaran", "invalid");
  }
  if (password.length < 8 || password.length > 128) {
    return authFailure(request, response, 400, "Kata sandi harus terdiri dari 8–128 karakter.", "/auth/pendaftaran", "invalid");
  }
  if (password !== confirmPassword) return authFailure(request, response, 400, "Konfirmasi kata sandi tidak sama.", "/auth/pendaftaran", "invalid");

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
      return authFailure(request, response, 409, "Email sudah terdaftar.", "/auth/pendaftaran", "taken");
    }
    if ("error" in result && result.error === "nik-exists") {
      return authFailure(request, response, 409, "NIK sudah terdaftar.", "/auth/pendaftaran", "taken");
    }

    setSessionCookie(response, user.id);
    if (isFormRequest(request)) return response.redirect(303, "/dashboard/profile");
    return response.status(201).json({ user: toPublicUser(result.user) });
  } catch (error) {
    console.error("Pendaftaran gagal:", error);
    authFailure(request, response, 500, "Pendaftaran belum dapat diproses. Coba lagi.", "/auth/pendaftaran", "unavailable");
  }
});

router.post("/login", async (request, response) => {
  if (!isPlainObject(request.body)) return authFailure(request, response, 400, "Format data tidak valid.", "/auth/masuk", "invalid");

  const role = request.body.role;
  if (!isUserRole(role)) return authFailure(request, response, 400, "Pilih peran yang valid.", "/auth/masuk", "invalid");

  const email = cleanString(request.body.email).toLowerCase();
  const password = typeof request.body.password === "string" ? request.body.password : "";
  if (!email || !password || email.length > 254 || password.length > 128) {
    return authFailure(request, response, 400, "Email dan kata sandi wajib diisi.", "/auth/masuk", "invalid");
  }

  try {
    const user = await findUserByEmail(email);
    if (!user || !(await verifyPassword(password, user.passwordHash)) || user.role !== role) {
      return authFailure(request, response, 401, "Email, kata sandi, atau peran tidak sesuai.", "/auth/masuk", "invalid");
    }
    setSessionCookie(response, user.id);
    if (isFormRequest(request)) return response.redirect(303, roleDestination(user.role));
    return response.json({ user: toPublicUser(user) });
  } catch (error) {
    console.error("Masuk gagal:", error);
    authFailure(request, response, 500, "Masuk belum dapat diproses. Coba lagi.", "/auth/masuk", "unavailable");
  }
});

router.post("/logout", (request, response) => {
  clearSessionCookie(response);
  if (isFormRequest(request)) return response.redirect(303, "/auth/masuk");
  return response.json({ ok: true });
});

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
