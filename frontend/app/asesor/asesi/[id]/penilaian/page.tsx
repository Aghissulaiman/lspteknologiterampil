"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

type Unit = { id: string; code: string; title: string; description: string };
type Document = { id: string; original_name: string; document_type: string };
type UnitEntry = { unit_id: string; notes: string; evidence_notes: string; evidence: { id: string }[] };
type Assessment = {
  id: string;
  status: string;
  participant_name: string;
  scheme_code: string;
  scheme_name: string;
  assessment_notes: string;
};
type UnitNotes = { notes: string; evidenceNotes: string; evidenceDocumentIds: string[] };
type AssessmentPayload = { assessment: Assessment; units: Unit[]; documents: Document[]; unitResults: UnitEntry[] };

const inputClass = "w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/30";

async function requestJson(url: string, init?: RequestInit) {
  const response = await fetch(url, init);
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || "Permintaan belum dapat diproses.");
  return payload;
}

export default function PenilaianAsesiPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [data, setData] = useState<AssessmentPayload | null>(null);
  const [unitNotes, setUnitNotes] = useState<Record<string, UnitNotes>>({});
  const [overallNotes, setOverallNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadAssessment = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const payload = await requestJson(`/api/assessor/${id}`) as AssessmentPayload;
      setData(payload);
      setOverallNotes(payload.assessment.assessment_notes ?? "");
      const entries: Record<string, UnitNotes> = {};
      for (const result of payload.unitResults ?? []) {
        entries[result.unit_id] = {
          notes: result.notes ?? "",
          evidenceNotes: result.evidence_notes ?? "",
          evidenceDocumentIds: result.evidence?.map((document) => document.id) ?? [],
        };
      }
      setUnitNotes(entries);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Detail pemeriksaan belum dapat dimuat.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void loadAssessment();
  }, [loadAssessment]);

  const setUnitValue = (unitId: string, patch: Partial<UnitNotes>) => {
    setUnitNotes((current) => ({
      ...current,
      [unitId]: { notes: "", evidenceNotes: "", evidenceDocumentIds: [], ...current[unitId], ...patch },
    }));
  };

  const saveNotes = async (event?: FormEvent<HTMLFormElement>, complete = false) => {
    event?.preventDefault();
    if (!data) return;
    setSaving(true);
    setError("");
    setNotice("");
    try {
      await requestJson(`/api/assessor/${id}/units`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          results: data.units.map((unit) => ({
            unitId: unit.id,
            notes: unitNotes[unit.id]?.notes ?? "",
            evidenceNotes: unitNotes[unit.id]?.evidenceNotes ?? "",
            evidenceDocumentIds: unitNotes[unit.id]?.evidenceDocumentIds ?? [],
          })),
        }),
      });
      await requestJson(`/api/assessor/${id}/notes`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: overallNotes }),
      });
      if (complete) {
        await requestJson(`/api/assessor/${id}/complete`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ note: overallNotes }),
        });
        router.replace("/asesor/riwayat");
        router.refresh();
        return;
      }
      setNotice("Catatan pemeriksaan berhasil disimpan.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Catatan pemeriksaan belum dapat disimpan.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p role="status" className="mx-auto max-w-4xl px-4 py-10 text-sm text-muted-foreground">Memuat formulir pemeriksaan…</p>;
  if (!data) return <div className="mx-auto max-w-4xl space-y-4 px-4 py-10"><p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">{error || "Penugasan tidak ditemukan."}</p><Button variant="outline" onClick={() => router.push("/asesor")}>Kembali ke penugasan</Button></div>;

  const isCompleted = data.assessment.status !== "assessment_scheduled";
  const canEdit = data.assessment.status === "assessment_scheduled";

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <Button type="button" variant="ghost" onClick={() => router.push(`/asesor/asesi/${id}`)} className="gap-2 px-0 text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Kembali ke detail asesi
      </Button>
      <header className="rounded-xl border border-border bg-card p-6">
        <p className="font-mono text-xs font-semibold text-primary">{data.assessment.scheme_code}</p>
        <h1 className="mt-2 text-2xl font-bold">Catatan pemeriksaan</h1>
        <p className="mt-1 text-sm text-muted-foreground">{data.assessment.participant_name} · {data.assessment.scheme_name}</p>
        {isCompleted && <p className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary"><CheckCircle2 className="h-4 w-4" aria-hidden="true" /> Pemeriksaan selesai</p>}
      </header>

      {error && <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">{error}</p>}
      {notice && <p role="status" className="rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200">{notice}</p>}

      <form onSubmit={(event) => void saveNotes(event)} className="space-y-5">
        {data.units.length === 0 ? (
          <p className="rounded-lg border border-border bg-card px-4 py-5 text-sm text-muted-foreground">Skema ini belum memiliki unit kompetensi untuk diperiksa.</p>
        ) : data.units.map((unit, index) => {
          const values = unitNotes[unit.id] ?? { notes: "", evidenceNotes: "", evidenceDocumentIds: [] };
          return (
            <section key={unit.id} className="space-y-4 rounded-xl border border-border bg-card p-5">
              <div>
                <p className="font-mono text-xs font-semibold text-primary">{unit.code} · Unit {index + 1}</p>
                <h2 className="mt-1 font-bold">{unit.title}</h2>
                {unit.description && <p className="mt-1 text-sm text-muted-foreground">{unit.description}</p>}
              </div>
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold">Catatan observasi / hasil tes</span>
                <textarea className={inputClass} rows={3} maxLength={5000} value={values.notes} onChange={(event) => setUnitValue(unit.id, { notes: event.target.value })} disabled={!canEdit} placeholder="Tuliskan bukti dan observasi selama pemeriksaan" />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold">Catatan bukti yang diperiksa</span>
                <textarea className={inputClass} rows={2} maxLength={5000} value={values.evidenceNotes} onChange={(event) => setUnitValue(unit.id, { evidenceNotes: event.target.value })} disabled={!canEdit} placeholder="Sebutkan bukti yang relevan untuk unit ini" />
              </label>
              {data.documents.length > 0 && (
                <fieldset disabled={!canEdit}>
                  <legend className="mb-2 text-xs font-semibold">Dokumen pendukung unit ini</legend>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {data.documents.map((document) => {
                      const checked = values.evidenceDocumentIds.includes(document.id);
                      return (
                        <label key={document.id} className="flex items-start gap-2 rounded-lg border border-border px-3 py-2 text-xs">
                          <input type="checkbox" checked={checked} onChange={(event) => setUnitValue(unit.id, {
                            evidenceDocumentIds: event.target.checked
                              ? [...values.evidenceDocumentIds, document.id]
                              : values.evidenceDocumentIds.filter((id) => id !== document.id),
                          })} className="mt-0.5 h-4 w-4 accent-primary" />
                          <span>{document.original_name}<span className="mt-0.5 block text-muted-foreground">{document.document_type}</span></span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              )}
            </section>
          );
        })}

        <section className="space-y-3 rounded-xl border border-border bg-card p-5">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">Catatan umum pemeriksaan</span>
            <textarea className={inputClass} rows={4} maxLength={10000} value={overallNotes} onChange={(event) => setOverallNotes(event.target.value)} disabled={!canEdit} placeholder="Catatan pelaksanaan ujian secara keseluruhan" />
          </label>
          {canEdit && (
            <div className="flex flex-wrap justify-end gap-3 border-t border-border pt-4">
              <Button type="submit" variant="outline" disabled={saving} className="gap-2"><Save className="h-4 w-4" aria-hidden="true" />{saving ? "Menyimpan…" : "Simpan catatan"}</Button>
              <Button type="button" disabled={saving || data.units.length === 0} onClick={() => void saveNotes(undefined, true)} className="gap-2">{saving ? "Menyelesaikan…" : "Selesaikan pemeriksaan"}</Button>
            </div>
          )}
        </section>
      </form>
    </div>
  );
}
