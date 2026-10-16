import { getCurrentUser } from "@/lib/server-auth";
import { toPublicFolder, updateStore } from "@/lib/server-store";

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
    const result = await updateStore((store) => {
      const folder = store.folders.find((item) => item.id === folderId && item.ownerId === user.id);
      if (!folder) return { error: "not-found" as const };

      const nextParentId = parentId === undefined ? folder.parentId : parentId === "" ? null : parentId as string | null;
      if (nextParentId) {
        const newParent = store.folders.find((item) => item.id === nextParentId && item.ownerId === user.id);
        if (!newParent) return { error: "parent-not-found" as const };
        let ancestor: typeof newParent | undefined = newParent;
        while (ancestor) {
          if (ancestor.id === folder.id) return { error: "cycle" as const };
          ancestor = ancestor.parentId ? store.folders.find((item) => item.id === ancestor?.parentId && item.ownerId === user.id) : undefined;
        }
      }

      const nextName = name ?? folder.name;
      if (store.folders.some((item) => item.id !== folder.id && item.ownerId === user.id && item.parentId === nextParentId && item.name.toLowerCase() === nextName.toLowerCase())) {
        return { error: "duplicate" as const };
      }

      folder.name = nextName;
      folder.parentId = nextParentId;
      folder.updatedAt = new Date().toISOString();
      return { folder };
    });

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
    const result = await updateStore((store) => {
      const index = store.folders.findIndex((folder) => folder.id === folderId && folder.ownerId === user.id);
      if (index === -1) return "not-found" as const;
      if (store.folders.some((folder) => folder.ownerId === user.id && folder.parentId === folderId)) return "not-empty" as const;
      store.folders.splice(index, 1);
      return "deleted" as const;
    });

    if (result === "not-found") return Response.json({ error: "Folder tidak ditemukan." }, { status: 404 });
    if (result === "not-empty") return Response.json({ error: "Kosongkan atau pindahkan subfolder sebelum menghapus folder ini." }, { status: 409 });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Folder belum dapat dihapus." }, { status: 500 });
  }
}
