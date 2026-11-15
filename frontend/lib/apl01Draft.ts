const LEGACY_APL01_DRAFT_KEY = "apl01_draft";

function storageKeyForUser(userId: string) {
  return `apl01_draft:${userId}`;
}

function removeLegacyDraft() {
  try {
    window.localStorage.removeItem(LEGACY_APL01_DRAFT_KEY);
  } catch {}
}

export function readApl01DraftForUser(userId: string): string | null {
  if (typeof window === "undefined" || !userId) return null;
  removeLegacyDraft();
  return window.localStorage.getItem(storageKeyForUser(userId));
}

export function saveApl01DraftForUser(userId: string, draft: unknown): void {
  if (typeof window === "undefined" || !userId) {
    throw new Error("Akun login tidak ditemukan.");
  }

  window.localStorage.setItem(storageKeyForUser(userId), JSON.stringify(draft));
  removeLegacyDraft();
}
