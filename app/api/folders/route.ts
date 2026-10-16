import { getCurrentUser } from "@/lib/server-auth";
import { findFoldersByOwner, newId, toPublicFolder, updateStore } from "@/lib/server-store";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return Response.json({ error: "Silakan masuk terlebih dahulu." }, { status: 401 });

    return Response.json(
      { folders: (await findFoldersByOwner(user.id)).map(toPublicFolder) },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json({ error: "Folder belum dapat dimuat." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Silakan masuk terlebih dahulu." }, { status: 401 });

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

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const parentId = body.parentId === null || body.parentId === undefined || body.parentId === "" ? null : body.parentId;
  if (name.length < 1 || name.length > 100) {
    return Response.json({ error: "Nama folder harus terdiri dari 1–100 karakter." }, { status: 400 });
  }
  if (parentId !== null && typeof parentId !== "string") {
    return Response.json({ error: "Folder induk tidak valid." }, { status: 400 });
  }

  try {
    const result = await updateStore((store) => {
      if (parentId && !store.folders.some((folder) => folder.id === parentId && folder.ownerId === user.id)) {
        return { error: "parent-not-found" as const };
      }
      if (store.folders.some((folder) => folder.ownerId === user.id && folder.parentId === parentId && folder.name.toLowerCase() === name.toLowerCase())) {
        return { error: "duplicate" as const };
      }

      const timestamp = new Date().toISOString();
      const folder = { id: newId(), ownerId: user.id, name, parentId, createdAt: timestamp, updatedAt: timestamp };
      store.folders.push(folder);
      return { folder };
    });

    if ("error" in result) {
      return Response.json({ error: result.error === "duplicate" ? "Folder dengan nama itu sudah ada di lokasi ini." : "Folder induk tidak ditemukan." }, { status: result.error === "duplicate" ? 409 : 404 });
    }
    return Response.json({ folder: toPublicFolder(result.folder) }, { status: 201 });
  } catch {
    return Response.json({ error: "Folder belum dapat dibuat." }, { status: 500 });
  }
}
