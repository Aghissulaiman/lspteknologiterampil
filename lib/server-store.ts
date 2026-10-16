import { randomBytes, randomUUID, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);

export type UserRecord = {
  id: string;
  fullName: string;
  email: string;
  nik: string;
  phone: string;
  passwordHash: string;
  createdAt: string;
};

export type FolderRecord = {
  id: string;
  ownerId: string;
  name: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AppStore = {
  users: UserRecord[];
  folders: FolderRecord[];
};

const emptyStore = (): AppStore => ({ users: [], folders: [] });
const storePath = () => process.env.LSP_DATA_FILE || path.join(/*turbopackIgnore: true*/ process.cwd(), "data", "lspteknologiterampil.json");

async function readStore(): Promise<AppStore> {
  try {
    const contents = await readFile(storePath(), "utf8");
    const parsed: unknown = JSON.parse(contents);
    if (
      typeof parsed !== "object" || parsed === null ||
      !Array.isArray((parsed as AppStore).users) ||
      !Array.isArray((parsed as AppStore).folders)
    ) {
      throw new Error("Format data backend tidak valid.");
    }
    return parsed as AppStore;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return emptyStore();
    throw error;
  }
}

async function writeStore(store: AppStore) {
  const filePath = storePath();
  const directory = path.dirname(filePath);
  await mkdir(directory, { recursive: true });
  const temporaryPath = `${filePath}.${randomUUID()}.tmp`;
  await writeFile(temporaryPath, JSON.stringify(store, null, 2), { encoding: "utf8", mode: 0o600 });
  await rename(temporaryPath, filePath);
}

let writeQueue: Promise<unknown> = Promise.resolve();

/** Serializes mutations within this Node.js process and replaces the data file atomically. */
export function updateStore<T>(mutate: (store: AppStore) => Promise<T> | T): Promise<T> {
  const operation = writeQueue.then(async () => {
    const store = await readStore();
    const result = await mutate(store);
    await writeStore(store);
    return result;
  });
  writeQueue = operation.then(() => undefined, () => undefined);
  return operation;
}

export async function findUserByEmail(email: string) {
  const store = await readStore();
  return store.users.find((user) => user.email === email) ?? null;
}

export async function findUserById(id: string) {
  const store = await readStore();
  return store.users.find((user) => user.id === id) ?? null;
}

export async function findFoldersByOwner(ownerId: string) {
  const store = await readStore();
  return store.folders.filter((folder) => folder.ownerId === ownerId);
}

export function toPublicUser(user: UserRecord) {
  return { id: user.id, fullName: user.fullName, email: user.email };
}

export function toPublicFolder(folder: FolderRecord) {
  return {
    id: folder.id,
    name: folder.name,
    parentId: folder.parentId,
    createdAt: folder.createdAt,
    updatedAt: folder.updatedAt,
  };
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
  return `${salt.toString("base64url")}:${derivedKey.toString("base64url")}`;
}

export async function verifyPassword(password: string, passwordHash: string) {
  const [encodedSalt, encodedHash, extra] = passwordHash.split(":");
  if (!encodedSalt || !encodedHash || extra) return false;

  try {
    const salt = Buffer.from(encodedSalt, "base64url");
    const expected = Buffer.from(encodedHash, "base64url");
    if (salt.length !== 16 || expected.length !== 64) return false;
    const actual = (await scrypt(password, salt, 64)) as Buffer;
    return timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

export function newId() {
  return randomUUID();
}
