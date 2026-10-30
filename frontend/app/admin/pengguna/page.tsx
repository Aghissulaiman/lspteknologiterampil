"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Eye, EyeOff, Pencil, Search, UserPlus, Users, X } from "lucide-react";

type AccountRole = "participant" | "assessor";

type Account = {
  id: string;
  full_name: string;
  email: string;
  nik: string | null;
  phone: string | null;
  role: AccountRole;
  created_at: string;
};

type AccountForm = {
  fullName: string;
  email: string;
  nik: string;
  phone: string;
};

type AssessorForm = AccountForm & { password: string };

const PAGE_SIZE = 20;
const inputClass = "w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 dark:border-slate-700 dark:bg-[#071120] dark:text-white";

export default function PenggunaPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [role, setRole] = useState<"all" | AccountRole>("all");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [editing, setEditing] = useState<Account | null>(null);
  const [addingAssessor, setAddingAssessor] = useState(false);
  const [form, setForm] = useState<AccountForm>({ fullName: "", email: "", nik: "", phone: "" });
  const [assessorForm, setAssessorForm] = useState<AssessorForm>({ fullName: "", email: "", nik: "", phone: "", password: "" });
  const [saving, setSaving] = useState(false);
  const [creatingAssessor, setCreatingAssessor] = useState(false);
  const [createError, setCreateError] = useState("");
  const [showAssessorPassword, setShowAssessorPassword] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({ role, search, page: String(page), pageSize: String(PAGE_SIZE) });

    fetch(`/api/admin/users?${params.toString()}`, {
      credentials: "same-origin",
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Daftar akun belum dapat dimuat.");
        setAccounts(result.users ?? []);
        setTotal(result.total ?? 0);
        setError("");
      })
      .catch((requestError: unknown) => {
        if (controller.signal.aborted) return;
        setError(requestError instanceof Error ? requestError.message : "Daftar akun belum dapat dimuat.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [page, refreshKey, role, search]);

  const openEditor = (account: Account) => {
    setNotice("");
    setEditing(account);
    setForm({
      fullName: account.full_name,
      email: account.email,
      nik: account.nik ?? "",
      phone: account.phone ?? "",
    });
  };

  const saveAccount = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editing) return;

    setSaving(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/users/${encodeURIComponent(editing.id)}`, {
        method: "PATCH",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Profil akun belum dapat diperbarui.");

      setEditing(null);
      setNotice("Profil akun berhasil diperbarui.");
      setLoading(true);
      setRefreshKey((value) => value + 1);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Profil akun belum dapat diperbarui.");
    } finally {
      setSaving(false);
    }
  };

  const createAssessor = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCreatingAssessor(true);
    setCreateError("");
    try {
      const response = await fetch("/api/admin/assessors", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(assessorForm),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Akun asesor belum dapat dibuat.");

      setAddingAssessor(false);
      setAssessorForm({ fullName: "", email: "", nik: "", phone: "", password: "" });
      setShowAssessorPassword(false);
      setNotice("Akun asesor berhasil dibuat.");
      setError("");
      setSearchInput("");
      setSearch("");
      setRole("assessor");
      setPage(1);
      setLoading(true);
      setRefreshKey((value) => value + 1);
    } catch (requestError) {
      setCreateError(requestError instanceof Error ? requestError.message : "Akun asesor belum dapat dibuat.");
    } finally {
      setCreatingAssessor(false);
    }
  };

  const applySearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setPage(1);
    setSearch(searchInput.trim());
    setRefreshKey((value) => value + 1);
  };

  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#0A1D37] dark:text-white sm:text-3xl">Kelola Akun</h1>
          <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">
            Lihat dan perbarui data profil peserta serta asesor.
          </p>
        </div>
        <button
          type="button"
          onClick={() => { setCreateError(""); setNotice(""); setShowAssessorPassword(false); setAddingAssessor(true); }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0066CC] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
        >
          <UserPlus className="h-4 w-4" aria-hidden="true" />
          Tambah asesor
        </button>
      </header>

      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#0B192C] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#0066CC] dark:bg-slate-800 dark:text-blue-400">
            <Users className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{total} akun</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">Peserta dan asesor terdaftar</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="sr-only" htmlFor="role-filter">Filter jenis akun</label>
          <select
            id="role-filter"
            value={role}
            onChange={(event) => { setLoading(true); setRole(event.target.value as "all" | AccountRole); setPage(1); }}
            className={inputClass + " sm:w-44"}
          >
            <option value="all">Semua akun</option>
            <option value="participant">Peserta</option>
            <option value="assessor">Asesor</option>
          </select>
          <form onSubmit={applySearch} className="flex gap-2">
            <label className="sr-only" htmlFor="account-search">Cari akun</label>
            <div className="relative min-w-0 flex-1 sm:w-64">
              <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-500" aria-hidden="true" />
              <input
                id="account-search"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Cari nama, email, NIK..."
                className={inputClass + " pl-9"}
              />
            </div>
            <button type="submit" className="rounded-xl bg-[#0066CC] px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700">
              Cari
            </button>
          </form>
        </div>
      </div>

      {notice && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">{notice}</p>}
      {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">{error}</p>}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#0B192C]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-600 dark:bg-[#071120] dark:text-slate-400">
              <tr>
                <th scope="col" className="px-5 py-4 font-semibold">Nama</th>
                <th scope="col" className="px-5 py-4 font-semibold">Email</th>
                <th scope="col" className="px-5 py-4 font-semibold">NIK</th>
                <th scope="col" className="px-5 py-4 font-semibold">Peran</th>
                <th scope="col" className="px-5 py-4 text-right font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {loading ? (
                <tr><td colSpan={5} className="px-5 py-12 text-center text-slate-600 dark:text-slate-400">Memuat akun...</td></tr>
              ) : accounts.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-12 text-center text-slate-600 dark:text-slate-400">Tidak ada akun yang cocok.</td></tr>
              ) : accounts.map((account) => (
                <tr key={account.id} className="text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-900/50">
                  <td className="px-5 py-4 font-semibold text-slate-900 dark:text-white">{account.full_name}</td>
                  <td className="px-5 py-4">{account.email}</td>
                  <td className="px-5 py-4">{account.nik || "—"}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${account.role === "assessor" ? "bg-violet-50 text-violet-800 dark:bg-violet-950/50 dark:text-violet-300" : "bg-blue-50 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300"}`}>
                      {account.role === "assessor" ? "Asesor" : "Peserta"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => openEditor(account)}
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-800 hover:border-blue-600 hover:text-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 dark:border-slate-700 dark:text-slate-200 dark:hover:text-blue-400"
                      aria-label={`Edit profil ${account.full_name}`}
                    >
                      <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                      Edit profil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <footer className="flex items-center justify-between border-t border-slate-200 px-5 py-4 text-sm dark:border-slate-800">
          <p className="text-slate-600 dark:text-slate-400">Halaman {page} dari {pageCount}</p>
          <div className="flex gap-2">
            <button type="button" onClick={() => { setLoading(true); setPage((value) => Math.max(1, value - 1)); }} disabled={page <= 1 || loading} className="rounded-lg border border-slate-300 px-3 py-2 text-slate-800 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">Sebelumnya</button>
            <button type="button" onClick={() => { setLoading(true); setPage((value) => Math.min(pageCount, value + 1)); }} disabled={page >= pageCount || loading} className="rounded-lg border border-slate-300 px-3 py-2 text-slate-800 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">Berikutnya</button>
          </div>
        </footer>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget && !saving) setEditing(null); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="edit-account-title" className="my-auto w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-[#0B192C]">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 id="edit-account-title" className="text-xl font-bold text-slate-900 dark:text-white">Edit profil akun</h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Peran akun tidak dapat diubah dari formulir ini.</p>
              </div>
              <button type="button" onClick={() => setEditing(null)} disabled={saving} aria-label="Tutup formulir" className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 disabled:opacity-50 dark:text-slate-300 dark:hover:bg-slate-800">
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={saveAccount} className="space-y-4">
              <label className="block space-y-1.5 text-sm font-medium text-slate-800 dark:text-slate-200">
                Nama lengkap
                <input required minLength={2} maxLength={100} value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} className={inputClass} />
              </label>
              <label className="block space-y-1.5 text-sm font-medium text-slate-800 dark:text-slate-200">
                Email
                <input required type="email" maxLength={254} value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className={inputClass} />
              </label>
              <label className="block space-y-1.5 text-sm font-medium text-slate-800 dark:text-slate-200">
                NIK
                <input required inputMode="numeric" minLength={16} maxLength={16} pattern="[0-9]{16}" value={form.nik} onChange={(event) => setForm({ ...form, nik: event.target.value })} className={inputClass} />
              </label>
              <label className="block space-y-1.5 text-sm font-medium text-slate-800 dark:text-slate-200">
                Nomor telepon
                <input required type="tel" maxLength={20} value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} className={inputClass} />
              </label>
              {error && <p role="alert" className="text-sm text-red-700 dark:text-red-300">{error}</p>}
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setEditing(null)} disabled={saving} className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">Batal</button>
                <button type="submit" disabled={saving} className="rounded-xl bg-[#0066CC] px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60">{saving ? "Menyimpan..." : "Simpan perubahan"}</button>
              </div>
            </form>
          </section>
        </div>
      )}

      {addingAssessor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget && !creatingAssessor) setAddingAssessor(false); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="add-assessor-title" className="my-auto w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-[#0B192C]">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 id="add-assessor-title" className="text-xl font-bold text-slate-900 dark:text-white">Tambah akun asesor</h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Asesor dapat masuk menggunakan email dan kata sandi yang dibuat di sini.</p>
              </div>
              <button type="button" onClick={() => setAddingAssessor(false)} disabled={creatingAssessor} aria-label="Tutup formulir" className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 disabled:opacity-50 dark:text-slate-300 dark:hover:bg-slate-800">
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={createAssessor} className="space-y-4">
              <label className="block space-y-1.5 text-sm font-medium text-slate-800 dark:text-slate-200">
                Nama lengkap
                <input required minLength={2} maxLength={100} value={assessorForm.fullName} onChange={(event) => setAssessorForm({ ...assessorForm, fullName: event.target.value })} className={inputClass} />
              </label>
              <label className="block space-y-1.5 text-sm font-medium text-slate-800 dark:text-slate-200">
                Email untuk masuk
                <input required type="email" maxLength={254} value={assessorForm.email} onChange={(event) => setAssessorForm({ ...assessorForm, email: event.target.value })} className={inputClass} />
              </label>
              <label className="block space-y-1.5 text-sm font-medium text-slate-800 dark:text-slate-200">
                NIK
                <input required inputMode="numeric" minLength={16} maxLength={16} pattern="[0-9]{16}" value={assessorForm.nik} onChange={(event) => setAssessorForm({ ...assessorForm, nik: event.target.value })} className={inputClass} />
              </label>
              <label className="block space-y-1.5 text-sm font-medium text-slate-800 dark:text-slate-200">
                Nomor telepon
                <input required type="tel" maxLength={20} value={assessorForm.phone} onChange={(event) => setAssessorForm({ ...assessorForm, phone: event.target.value })} className={inputClass} />
              </label>
              <label className="block space-y-1.5 text-sm font-medium text-slate-800 dark:text-slate-200">
                Kata sandi awal
                <span className="relative block">
                  <input required type={showAssessorPassword ? "text" : "password"} minLength={8} maxLength={128} autoComplete="new-password" value={assessorForm.password} onChange={(event) => setAssessorForm({ ...assessorForm, password: event.target.value })} className={inputClass + " pr-11"} />
                  <button
                    type="button"
                    onClick={() => setShowAssessorPassword((visible) => !visible)}
                    aria-label={showAssessorPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                    aria-pressed={showAssessorPassword}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-600 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-700 dark:text-slate-400 dark:hover:text-white"
                  >
                    {showAssessorPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
                  </button>
                </span>
                <span className="block text-xs font-normal text-slate-600 dark:text-slate-400">Minimal 8 karakter. Sampaikan kata sandi ini kepada asesor secara aman.</span>
              </label>
              {createError && <p role="alert" className="text-sm text-red-700 dark:text-red-300">{createError}</p>}
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setAddingAssessor(false)} disabled={creatingAssessor} className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">Batal</button>
                <button type="submit" disabled={creatingAssessor} className="rounded-xl bg-[#0066CC] px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60">{creatingAssessor ? "Membuat akun..." : "Buat akun asesor"}</button>
              </div>
            </form>
          </section>
        </div>
      )}
    </section>
  );
}
