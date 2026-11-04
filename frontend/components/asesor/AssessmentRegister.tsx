"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ClipboardList, Clock3, Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

type Assessment = {
  application_id: string;
  status: string;
  completed_at: string | null;
  scheme_code: string;
  scheme_name: string;
  participant_name: string;
  starts_at: string;
  ends_at: string;
  test_site_name: string;
};

type Props = {
  mode: "all" | "completed";
  showOverview?: boolean;
};

const isCompleted = (status: string) => status !== "assessment_scheduled";

function formatDate(value: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? "—" : new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

export default function AssessmentRegister({ mode, showOverview = false }: Props) {
  const router = useRouter();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    void fetch("/api/assessor", { cache: "no-store" })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error || "Daftar pemeriksaan belum dapat dimuat.");
        if (active) setAssessments(payload.assessments ?? []);
      })
      .catch((fetchError) => {
        if (active) setError(fetchError instanceof Error ? fetchError.message : "Daftar pemeriksaan belum dapat dimuat.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const completedCount = assessments.filter((item) => isCompleted(item.status)).length;
  const scheduledCount = assessments.filter((item) => item.status === "assessment_scheduled").length;
  const visibleAssessments = useMemo(() => {
    const query = search.trim().toLowerCase();
    return assessments
      .filter((item) => mode !== "completed" || isCompleted(item.status))
      .filter((item) => !query || `${item.participant_name} ${item.scheme_name} ${item.scheme_code}`.toLowerCase().includes(query));
  }, [assessments, mode, search]);

  return (
    <div className="space-y-6">
      {showOverview && (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex items-center justify-between rounded-xl border border-border bg-card p-5">
            <div><p className="text-xs font-semibold text-muted-foreground">Semua penugasan</p><p className="mt-2 text-2xl font-bold">{assessments.length}</p></div>
            <Users className="h-5 w-5 text-primary" aria-hidden="true" />
          </div>
          <div className="flex items-center justify-between rounded-xl border border-border bg-card p-5">
            <div><p className="text-xs font-semibold text-muted-foreground">Menunggu pemeriksaan</p><p className="mt-2 text-2xl font-bold">{scheduledCount}</p></div>
            <Clock3 className="h-5 w-5 text-amber-600" aria-hidden="true" />
          </div>
          <div className="flex items-center justify-between rounded-xl border border-border bg-card p-5">
            <div><p className="text-xs font-semibold text-muted-foreground">Pemeriksaan selesai</p><p className="mt-2 text-2xl font-bold">{completedCount}</p></div>
            <ClipboardList className="h-5 w-5 text-primary" aria-hidden="true" />
          </div>
        </div>
      )}

      <section className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex flex-col gap-4 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-bold">{mode === "completed" ? "Pemeriksaan selesai" : "Daftar asesi dan jadwal ujian"}</h2>
            <p className="mt-1 text-xs text-muted-foreground">Buka penugasan untuk melihat dokumen dan mencatat hasil pemeriksaan.</p>
          </div>
          <label className="relative w-full sm:max-w-xs">
            <span className="sr-only">Cari asesi atau skema</span>
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <input type="search" placeholder="Cari asesi atau skema" value={search} onChange={(event) => setSearch(event.target.value)} className="h-10 w-full rounded-lg border border-border bg-background pl-10 pr-3 text-sm outline-none focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/30" />
          </label>
        </div>

        {error && <p role="alert" className="m-5 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">{error}</p>}
        {loading ? (
          <p role="status" className="px-5 py-10 text-center text-sm text-muted-foreground">Memuat penugasan…</p>
        ) : visibleAssessments.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-muted-foreground">{search ? "Tidak ada penugasan yang cocok." : mode === "completed" ? "Belum ada pemeriksaan yang selesai." : "Belum ada penugasan pemeriksaan."}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground">
                  <th className="px-5 py-3">Nama asesi</th>
                  <th className="px-4 py-3">Skema</th>
                  <th className="px-4 py-3">Jadwal</th>
                  <th className="px-4 py-3">TUK</th>
                  <th className="px-4 py-3">Status pemeriksaan</th>
                  <th className="px-5 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {visibleAssessments.map((item) => (
                  <tr key={item.application_id} className="hover:bg-muted/20">
                    <td className="px-5 py-4 font-semibold">{item.participant_name}</td>
                    <td className="px-4 py-4"><span className="font-mono text-xs text-primary">{item.scheme_code}</span><span className="mt-1 block">{item.scheme_name}</span></td>
                    <td className="px-4 py-4 text-muted-foreground">{formatDate(item.starts_at)}</td>
                    <td className="px-4 py-4 text-muted-foreground">{item.test_site_name}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex rounded-md px-2 py-1 text-xs font-medium ${isCompleted(item.status) ? "bg-primary/10 text-primary" : "bg-amber-500/10 text-amber-700 dark:text-amber-300"}`}>
                        {isCompleted(item.status) ? `Selesai · ${formatDate(item.completed_at)}` : "Menunggu pemeriksaan"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Button size="sm" variant="outline" className="gap-2" onClick={() => router.push(`/asesor/asesi/${item.application_id}`)}>
                        Buka <ArrowRight className="h-4 w-4" aria-hidden="true" />
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
