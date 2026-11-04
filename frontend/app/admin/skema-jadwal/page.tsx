"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { ArrowDown, ArrowUp, Check, Edit3, FileText, Plus, Save, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type SchemeSummary = {
  id: string;
  code: string;
  name: string;
  category: string;
  level: string;
  is_public: boolean;
  is_active: boolean;
  unit_count: number;
  document_requirement_count: number;
  application_count: number;
};

type UnitDraft = {
  key: string;
  id?: string;
  code: string;
  title: string;
  description: string;
  sortOrder: number;
};

type DocumentDraft = {
  key: string;
  code: string;
  label: string;
  category: "administrative" | "portfolio";
  isRequired: boolean;
  allowedMimeTypes: string;
};

type SchemeDraft = {
  id?: string;
  code: string;
  name: string;
  category: string;
  level: string;
  description: string;
  requirementsText: string;
  isPublic: boolean;
  isActive: boolean;
  applicationCount: number;
  units: UnitDraft[];
  documentRequirements: DocumentDraft[];
};

function itemKey() {
  return crypto.randomUUID();
}

function emptyDraft(): SchemeDraft {
  return {
    code: "",
    name: "",
    category: "",
    level: "",
    description: "",
    requirementsText: "{}",
    isPublic: false,
    isActive: true,
    applicationCount: 0,
    units: [{ key: itemKey(), code: "", title: "", description: "", sortOrder: 0 }],
    documentRequirements: [],
  };
}

function responseError(payload: unknown, fallback: string) {
  if (payload && typeof payload === "object" && "error" in payload && typeof payload.error === "string") {
    return payload.error;
  }
  return fallback;
}

const inputClass = "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#0066CC] focus:ring-2 focus:ring-[#0066CC]/20 dark:border-slate-700 dark:bg-[#071120] dark:text-white";
const labelClass = "mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300";

export default function SkemaJadwalPage() {
  const [schemes, setSchemes] = useState<SchemeSummary[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState("");
  const [draft, setDraft] = useState<SchemeDraft | null>(null);
  const [editorLoading, setEditorLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [notice, setNotice] = useState("");

  const loadSchemes = useCallback(async () => {
    setLoading(true);
    setListError("");
    try {
      const response = await fetch("/api/admin/schemes", { cache: "no-store" });
      const payload = await response.json();
      if (!response.ok) throw new Error(responseError(payload, "Daftar skema belum dapat dimuat."));
      setSchemes(payload.schemes ?? []);
    } catch (error) {
      setListError(error instanceof Error ? error.message : "Daftar skema belum dapat dimuat.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSchemes();
  }, [loadSchemes]);

  const filteredSchemes = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return schemes;
    return schemes.filter((scheme) => `${scheme.code} ${scheme.name} ${scheme.category}`.toLowerCase().includes(query));
  }, [schemes, search]);

  const startCreate = () => {
    setNotice("");
    setSaveError("");
    setDraft(emptyDraft());
  };

  const startEdit = async (schemeId: string) => {
    setNotice("");
    setSaveError("");
    setListError("");
    setEditorLoading(true);
    setDraft(null);
    try {
      const response = await fetch(`/api/admin/schemes/${schemeId}`, { cache: "no-store" });
      const payload = await response.json();
      if (!response.ok) throw new Error(responseError(payload, "Detail skema belum dapat dimuat."));
      const scheme = payload.scheme;
      setDraft({
        id: scheme.id,
        code: scheme.code,
        name: scheme.name,
        category: scheme.category ?? "",
        level: scheme.level ?? "",
        description: scheme.description ?? "",
        requirementsText: JSON.stringify(scheme.requirements ?? {}, null, 2),
        isPublic: scheme.is_public,
        isActive: scheme.is_active,
        applicationCount: scheme.applicationCount ?? 0,
        units: (scheme.units ?? []).map((unit: { id: string; code: string; title: string; description: string; sort_order: number }) => ({
          key: itemKey(),
          id: unit.id,
          code: unit.code,
          title: unit.title,
          description: unit.description ?? "",
          sortOrder: unit.sort_order,
        })),
        documentRequirements: (scheme.documentRequirements ?? []).map((document: {
          code: string;
          label: string;
          category: "administrative" | "portfolio";
          is_required: boolean;
          allowed_mime_types: string[];
        }) => ({
          key: itemKey(),
          code: document.code,
          label: document.label,
          category: document.category,
          isRequired: document.is_required,
          allowedMimeTypes: document.allowed_mime_types.join(", "),
        })),
      });
    } catch (error) {
      setListError(error instanceof Error ? error.message : "Detail skema belum dapat dimuat.");
    } finally {
      setEditorLoading(false);
    }
  };

  const updateDraft = (patch: Partial<SchemeDraft>) => {
    setDraft((current) => current ? { ...current, ...patch } : current);
  };

  const updateUnit = (key: string, patch: Partial<UnitDraft>) => {
    setDraft((current) => current ? {
      ...current,
      units: current.units.map((unit) => unit.key === key ? { ...unit, ...patch } : unit),
    } : current);
  };

  const moveUnit = (index: number, offset: -1 | 1) => {
    setDraft((current) => {
      if (!current) return current;
      const target = index + offset;
      if (target < 0 || target >= current.units.length) return current;
      const units = [...current.units];
      [units[index], units[target]] = [units[target], units[index]];
      return { ...current, units: units.map((unit, sortOrder) => ({ ...unit, sortOrder })) };
    });
  };

  const updateDocument = (key: string, patch: Partial<DocumentDraft>) => {
    setDraft((current) => current ? {
      ...current,
      documentRequirements: current.documentRequirements.map((document) => document.key === key ? { ...document, ...patch } : document),
    } : current);
  };

  const saveScheme = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft) return;
    setSaveError("");

    let requirements: unknown;
    try {
      requirements = JSON.parse(draft.requirementsText);
    } catch {
      setSaveError("Persyaratan skema harus berupa JSON yang valid.");
      return;
    }
    if (!requirements || typeof requirements !== "object" || Array.isArray(requirements)) {
      setSaveError("Persyaratan skema harus berupa objek JSON.");
      return;
    }

    const payload = {
      code: draft.code,
      name: draft.name,
      category: draft.category,
      level: draft.level,
      description: draft.description,
      requirements,
      isPublic: draft.isPublic,
      isActive: draft.isActive,
      units: draft.units.map((unit, index) => ({
        id: unit.id,
        code: unit.code,
        title: unit.title,
        description: unit.description,
        sortOrder: index,
      })),
      documentRequirements: draft.documentRequirements.map((document) => ({
        code: document.code,
        label: document.label,
        category: document.category,
        isRequired: document.isRequired,
        allowedMimeTypes: document.allowedMimeTypes.split(",").map((mime) => mime.trim()).filter(Boolean),
      })),
    };

    setSaving(true);
    try {
      const response = await fetch(draft.id ? `/api/admin/schemes/${draft.id}` : "/api/admin/schemes", {
        method: draft.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(responseError(result, "Skema belum dapat disimpan."));
      setDraft(null);
      setNotice(draft.id ? "Perubahan skema berhasil disimpan." : "Skema baru berhasil ditambahkan.");
      await loadSchemes();
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Skema belum dapat disimpan.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-7">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0A1D37] dark:text-white sm:text-3xl">Skema Sertifikasi</h1>
          <p className="mt-1.5 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
            Kelola identitas skema, persyaratan, unit kompetensi, dan dokumen yang diminta kepada asesi.
          </p>
        </div>
        <Button onClick={startCreate} className="gap-2 self-start sm:self-auto">
          <Plus className="h-4 w-4" aria-hidden="true" /> Tambah Skema
        </Button>
      </header>

      <section className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#0B192C] sm:flex-row sm:items-center sm:justify-between" aria-label="Ringkasan skema">
        <div>
          <p className="text-3xl font-bold text-[#0A1D37] dark:text-white">{loading ? "…" : schemes.length}</p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Skema terdaftar</p>
        </div>
        <label className="w-full sm:max-w-sm">
          <span className={labelClass}>Cari skema</span>
          <input className={inputClass} type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Kode, nama, atau kategori" />
        </label>
      </section>

      {notice && <p role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200">{notice}</p>}
      {listError && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200">{listError}</div>}

      {(draft || editorLoading) && (
        <section className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#0B192C] sm:p-7" aria-labelledby="scheme-editor-heading">
          {editorLoading ? (
            <p role="status" className="text-sm text-slate-600 dark:text-slate-400">Memuat detail skema…</p>
          ) : draft && (
            <>
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <h2 id="scheme-editor-heading" className="text-lg font-bold text-[#0A1D37] dark:text-white">{draft.id ? `Edit ${draft.code}` : "Skema Baru"}</h2>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Perubahan disimpan ke data skema yang digunakan sistem.</p>
                </div>
                <Button type="button" variant="ghost" size="icon" onClick={() => { setDraft(null); setSaveError(""); }} aria-label="Tutup editor">
                  <X className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>

              {draft.applicationCount > 0 && (
                <p className="mb-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900/70 dark:bg-amber-950/30 dark:text-amber-100">
                  Skema ini sudah memiliki {draft.applicationCount} permohonan. Detail baru dipakai untuk pendaftaran berikutnya; unit lama yang sudah dipakai tetap diarsipkan untuk menjaga catatan pemeriksaan.
                </p>
              )}

              <form onSubmit={saveScheme} className="space-y-7">
                <section className="space-y-4" aria-labelledby="scheme-info-heading">
                  <h3 id="scheme-info-heading" className="border-b border-slate-200 pb-2 text-sm font-bold text-[#0A1D37] dark:border-slate-800 dark:text-white">Identitas skema</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <label>
                      <span className={labelClass}>Kode skema</span>
                      <input className={inputClass} required maxLength={50} value={draft.code} onChange={(event) => updateDraft({ code: event.target.value })} placeholder="Contoh: SKM-11" />
                    </label>
                    <label>
                      <span className={labelClass}>Nama skema</span>
                      <input className={inputClass} required minLength={2} maxLength={200} value={draft.name} onChange={(event) => updateDraft({ name: event.target.value })} placeholder="Nama sertifikasi" />
                    </label>
                    <label>
                      <span className={labelClass}>Kategori</span>
                      <input className={inputClass} maxLength={100} value={draft.category} onChange={(event) => updateDraft({ category: event.target.value })} placeholder="Contoh: Pemrograman" />
                    </label>
                    <label>
                      <span className={labelClass}>Level</span>
                      <input className={inputClass} maxLength={100} value={draft.level} onChange={(event) => updateDraft({ level: event.target.value })} placeholder="Contoh: Level 3" />
                    </label>
                  </div>
                  <label className="block">
                    <span className={labelClass}>Deskripsi skema</span>
                    <textarea className={inputClass} rows={4} maxLength={20000} value={draft.description} onChange={(event) => updateDraft({ description: event.target.value })} placeholder="Ruang lingkup dan tujuan skema" />
                  </label>
                  <div className="flex flex-wrap gap-x-6 gap-y-3">
                    <label className="inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                      <input type="checkbox" checked={draft.isPublic} onChange={(event) => updateDraft({ isPublic: event.target.checked })} className="h-4 w-4 accent-[#0066CC]" />
                      Tampilkan di katalog publik
                    </label>
                    <label className="inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                      <input type="checkbox" checked={draft.isActive} onChange={(event) => updateDraft({ isActive: event.target.checked })} className="h-4 w-4 accent-[#0066CC]" />
                      Skema aktif
                    </label>
                  </div>
                </section>

                <section className="space-y-3" aria-labelledby="scheme-requirements-heading">
                  <div>
                    <h3 id="scheme-requirements-heading" className="text-sm font-bold text-[#0A1D37] dark:text-white">Konfigurasi persyaratan</h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Simpan sebagai objek JSON. Contoh: <code>{'{ "requiredApl01Fields": ["education"] }'}</code></p>
                  </div>
                  <label>
                    <span className="sr-only">Konfigurasi persyaratan skema dalam format JSON</span>
                    <textarea className={`${inputClass} font-mono text-xs`} rows={5} value={draft.requirementsText} onChange={(event) => updateDraft({ requirementsText: event.target.value })} spellCheck={false} />
                  </label>
                </section>

                <section className="space-y-4" aria-labelledby="scheme-units-heading">
                  <div className="flex flex-col gap-3 border-b border-slate-200 pb-2 dark:border-slate-800 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <h3 id="scheme-units-heading" className="text-sm font-bold text-[#0A1D37] dark:text-white">Unit kompetensi</h3>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Urutan unit mengikuti urutan yang ditampilkan di bawah.</p>
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={() => updateDraft({ units: [...draft.units, { key: itemKey(), code: "", title: "", description: "", sortOrder: draft.units.length }] })} className="gap-2">
                      <Plus className="h-4 w-4" aria-hidden="true" /> Tambah unit
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {draft.units.map((unit, index) => (
                      <article key={unit.key} className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                        <div className="mb-3 flex items-center justify-between">
                          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Unit {index + 1}</h4>
                          <div className="flex items-center gap-1">
                            <Button type="button" variant="ghost" size="icon" disabled={index === 0} aria-label={`Pindahkan unit ${index + 1} ke atas`} onClick={() => moveUnit(index, -1)}>
                              <ArrowUp className="h-4 w-4" aria-hidden="true" />
                            </Button>
                            <Button type="button" variant="ghost" size="icon" disabled={index === draft.units.length - 1} aria-label={`Pindahkan unit ${index + 1} ke bawah`} onClick={() => moveUnit(index, 1)}>
                              <ArrowDown className="h-4 w-4" aria-hidden="true" />
                            </Button>
                            <Button type="button" variant="ghost" size="icon" onClick={() => updateDraft({ units: draft.units.filter((item) => item.key !== unit.key) })} disabled={draft.units.length === 1} aria-label={`Hapus unit ${index + 1}`}>
                              <Trash2 className="h-4 w-4" aria-hidden="true" />
                            </Button>
                          </div>
                        </div>
                        <div className="grid gap-3 md:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)]">
                          <label>
                            <span className={labelClass}>Kode unit</span>
                            <input className={inputClass} required maxLength={80} value={unit.code} onChange={(event) => updateUnit(unit.key, { code: event.target.value })} placeholder="J.620900.010.02" />
                          </label>
                          <label>
                            <span className={labelClass}>Judul unit</span>
                            <input className={inputClass} required minLength={2} maxLength={250} value={unit.title} onChange={(event) => updateUnit(unit.key, { title: event.target.value })} placeholder="Judul unit kompetensi" />
                          </label>
                          <label className="md:col-span-2">
                            <span className={labelClass}>Deskripsi unit</span>
                            <textarea className={inputClass} rows={2} maxLength={5000} value={unit.description} onChange={(event) => updateUnit(unit.key, { description: event.target.value })} placeholder="Uraian unit kompetensi" />
                          </label>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>

                <section className="space-y-4" aria-labelledby="scheme-documents-heading">
                  <div className="flex flex-col gap-3 border-b border-slate-200 pb-2 dark:border-slate-800 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <h3 id="scheme-documents-heading" className="text-sm font-bold text-[#0A1D37] dark:text-white">Persyaratan dokumen</h3>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Atur dokumen administrasi dan portofolio beserta format berkas yang diterima.</p>
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={() => updateDraft({ documentRequirements: [...draft.documentRequirements, { key: itemKey(), code: "", label: "", category: "administrative", isRequired: true, allowedMimeTypes: "application/pdf, image/jpeg, image/png" }] })} className="gap-2">
                      <Plus className="h-4 w-4" aria-hidden="true" /> Tambah dokumen
                    </Button>
                  </div>
                  {draft.documentRequirements.length === 0 ? (
                    <p className="rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:bg-[#071120] dark:text-slate-400">Belum ada persyaratan dokumen khusus.</p>
                  ) : (
                    <div className="space-y-3">
                      {draft.documentRequirements.map((document, index) => (
                        <article key={document.key} className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                          <div className="mb-3 flex items-center justify-between">
                            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Dokumen {index + 1}</h4>
                            <Button type="button" variant="ghost" size="icon" onClick={() => updateDraft({ documentRequirements: draft.documentRequirements.filter((item) => item.key !== document.key) })} aria-label={`Hapus dokumen ${index + 1}`}>
                              <Trash2 className="h-4 w-4" aria-hidden="true" />
                            </Button>
                          </div>
                          <div className="grid gap-3 md:grid-cols-2">
                            <label>
                              <span className={labelClass}>Kode dokumen</span>
                              <input className={inputClass} required maxLength={80} value={document.code} onChange={(event) => updateDocument(document.key, { code: event.target.value })} placeholder="ktp" />
                            </label>
                            <label>
                              <span className={labelClass}>Nama dokumen</span>
                              <input className={inputClass} required minLength={2} maxLength={200} value={document.label} onChange={(event) => updateDocument(document.key, { label: event.target.value })} placeholder="Kartu identitas" />
                            </label>
                            <label>
                              <span className={labelClass}>Kategori</span>
                              <select className={inputClass} value={document.category} onChange={(event) => updateDocument(document.key, { category: event.target.value as DocumentDraft["category"] })}>
                                <option value="administrative">Administrasi</option>
                                <option value="portfolio">Portofolio</option>
                              </select>
                            </label>
                            <label>
                              <span className={labelClass}>MIME type (pisahkan dengan koma)</span>
                              <input className={inputClass} required value={document.allowedMimeTypes} onChange={(event) => updateDocument(document.key, { allowedMimeTypes: event.target.value })} placeholder="application/pdf, image/jpeg" />
                            </label>
                            <label className="inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 md:col-span-2">
                              <input type="checkbox" checked={document.isRequired} onChange={(event) => updateDocument(document.key, { isRequired: event.target.checked })} className="h-4 w-4 accent-[#0066CC]" />
                              Wajib diserahkan
                            </label>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </section>

                {saveError && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200">{saveError}</p>}
                <div className="flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-5 dark:border-slate-800">
                  <Button type="button" variant="outline" onClick={() => { setDraft(null); setSaveError(""); }} disabled={saving}>Batal</Button>
                  <Button type="submit" disabled={saving} className="gap-2">
                    <Save className="h-4 w-4" aria-hidden="true" /> {saving ? "Menyimpan…" : "Simpan seluruh detail"}
                  </Button>
                </div>
              </form>
            </>
          )}
        </section>
      )}

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0B192C]" aria-labelledby="scheme-list-heading">
        <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <FileText className="h-5 w-5 text-[#0066CC]" aria-hidden="true" />
          <div>
            <h2 id="scheme-list-heading" className="font-bold text-[#0A1D37] dark:text-white">Daftar skema</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Pilih Edit untuk mengubah metadata dan struktur skema.</p>
          </div>
        </div>
        {loading ? (
          <p role="status" className="px-5 py-10 text-center text-sm text-slate-600 dark:text-slate-400">Memuat daftar skema…</p>
        ) : filteredSchemes.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-slate-600 dark:text-slate-400">{search ? "Tidak ada skema yang cocok dengan pencarian." : "Belum ada skema. Tambahkan skema untuk mulai mengelola sertifikasi."}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600 dark:border-slate-800 dark:bg-[#071120] dark:text-slate-300">
                  <th className="px-5 py-3">Kode / nama</th>
                  <th className="px-4 py-3">Kategori / level</th>
                  <th className="px-4 py-3">Struktur</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {filteredSchemes.map((scheme) => (
                  <tr key={scheme.id} className="align-top hover:bg-slate-50/70 dark:hover:bg-[#071120]/70">
                    <td className="px-5 py-4">
                      <p className="font-mono text-xs font-semibold text-[#0066CC]">{scheme.code}</p>
                      <p className="mt-1 font-semibold text-[#0A1D37] dark:text-white">{scheme.name}</p>
                    </td>
                    <td className="px-4 py-4 text-slate-600 dark:text-slate-300">
                      <p>{scheme.category || "—"}</p><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{scheme.level || "Level belum diatur"}</p>
                    </td>
                    <td className="px-4 py-4 text-slate-600 dark:text-slate-300">
                      <p>{scheme.unit_count} unit</p><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{scheme.document_requirement_count} persyaratan dokumen</p>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col items-start gap-1.5">
                        <span className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium ${scheme.is_active ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"}`}>
                          <Check className="h-3 w-3" aria-hidden="true" /> {scheme.is_active ? "Aktif" : "Nonaktif"}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">{scheme.is_public ? "Publik" : "Internal"}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Button variant="outline" size="sm" onClick={() => void startEdit(scheme.id)} className="gap-2">
                        <Edit3 className="h-3.5 w-3.5" aria-hidden="true" /> Edit detail
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
