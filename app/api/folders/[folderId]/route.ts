import { getCurrentUser } from "@/lib/server-auth";
import { deleteFolder, toPublicFolder, updateFolder } from "@/lib/server-store";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ folderId: string }> };

export async function PATCH(request: Request, { params }: RouteContext) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Silakan masuk terlebih dahulu." }, { status: 401 });
  const { folderId } = await params;

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

  const name = typeof body.name === "string" ? body.name.trim() : undefined;
  const parentId = body.parentId;
  if (name !== undefined && (name.length < 1 || name.length > 100)) {
    return Response.json({ error: "Nama folder harus terdiri dari 1–100 karakter." }, { status: 400 });
  }
  if (parentId !== undefined && parentId !== null && typeof parentId !== "string") {
    return Response.json({ error: "Folder induk tidak valid." }, { status: 400 });
  }

  try {
    const normalizedParentId = parentId === "" ? null : parentId as string | null | undefined;
    const result = await updateFolder(user.id, folderId, name, normalizedParentId);

    if ("error" in result && result.error === "not-found") {
      return Response.json({ error: "Folder tidak ditemukan." }, { status: 404 });
    }
    if ("error" in result && result.error === "parent-not-found") {
      return Response.json({ error: "Folder induk tidak ditemukan." }, { status: 404 });
    }
    if ("error" in result && result.error === "cycle") {
      return Response.json({ error: "Folder tidak dapat dipindahkan ke dalam turunannya sendiri." }, { status: 400 });
    }
    if ("error" in result && result.error === "duplicate") {
      return Response.json({ error: "Folder dengan nama itu sudah ada di lokasi ini." }, { status: 409 });
    }
    return Response.json({ folder: toPublicFolder(result.folder) });
  } catch {
    return Response.json({ error: "Folder belum dapat diperbarui." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Silakan masuk terlebih dahulu." }, { status: 401 });
  const { folderId } = await params;

  try {
    const result = await deleteFolder(user.id, folderId);

    if (result === "not-found") return Response.json({ error: "Folder tidak ditemukan." }, { status: 404 });
    if (result === "not-empty") return Response.json({ error: "Kosongkan atau pindahkan subfolder sebelum menghapus folder ini." }, { status: 409 });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Folder belum dapat dihapus." }, { status: 500 });
  }
}
