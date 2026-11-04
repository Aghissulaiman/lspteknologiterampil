"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

type Evidence = { id: string; documentType: string; originalName: string };
type ApplicationUnit = { unit_id: string; notes: string; evidence: Evidence[] };
type AssessmentDetail = {
  id: string;
  status: string;
  participant_name: string;
  participant_email: string;
  scheme_code: string;
  scheme_name: string;
  starts_at: string;
  ends_at: string;
  test_site_name: string;
  test_site_address: string;
};
type Unit = { id: string; code: string; title: string; description: string };
type Document = { id: string; document_type: string; category: string; original_name: string; mime_type: string };

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? "—" : new Intl.DateTimeFormat("id-ID", { dateStyle: "full", timeStyle: "short" }).format(date);
}

export default function DetailAsesorAsesiPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [assessment, setAssessment] = useState<AssessmentDetail | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [apl02, setApl02] = useState<ApplicationUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    void fetch(`/api/assessor/${id}`, { cache: "no-store" })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error || "Detail penugasan belum dapat dimuat.");
        if (!active) return;
        setAssessment(payload.assessment);
        setUnits(payload.units ?? []);
        setDocuments(payload.documents ?? []);
        setApl02(payload.apl02 ?? []);
      })
      .catch((fetchError) => {
        if (active) setError(fetchError instanceof Error ? fetchError.message : "Detail penugasan belum dapat dimuat.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [id]);

  if (loading) return <p role="status" className="mx-auto max-w-5xl px-4 py-10 text-sm text-muted-foreground">Memuat detail penugasan…</p>;
  if (error || !assessment) {
    return <div className="mx-auto max-w-5xl space-y-4 px-4 py-10"><p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">{error || "Penugasan tidak ditemukan."}</p><Button variant="outline" onClick={() => router.push("/asesor")}>Kembali ke daftar</Button></div>;
  }

  const documentUrl = (documentId: string) => `/api/assessor/${id}/documents/${documentId}`;
  const isCompleted = assessment.status !== "assessment_scheduled";

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <Button type="button" variant="ghost" onClick={() => router.push("/asesor")} className="gap-2 px-0 text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Kembali ke penugasan
      </Button>

      <section className="rounded-xl border border-border bg-card p-6 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-mono text-xs font-semibold text-primary">{assessment.scheme_code}</p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">{assessment.participant_name}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{assessment.scheme_name}</p>
          </div>
          <span className={`inline-flex w-fit rounded-md px-3 py-1.5 text-xs font-semibold ${isCompleted ? "bg-primary/10 text-primary" : "bg-amber-500/10 text-amber-700 dark:text-amber-300"}`}>
            {isCompleted ? "Pemeriksaan selesai" : "Menunggu pemeriksaan"}
          </span>
        </div>
        <dl className="mt-6 grid gap-4 border-t border-border pt-5 sm:grid-cols-3">
          <div><dt className="text-xs font-medium text-muted-foreground">Email</dt><dd className="mt-1 text-sm font-medium">{assessment.participant_email}</dd></div>
          <div><dt className="text-xs font-medium text-muted-foreground">Jadwal ujian</dt><dd className="mt-1 text-sm font-medium">{formatDate(assessment.starts_at)}</dd></div>
          <div><dt className="text-xs font-medium text-muted-foreground">Tempat uji</dt><dd className="mt-1 text-sm font-medium">{assessment.test_site_name}</dd><dd className="mt-1 text-xs text-muted-foreground">{assessment.test_site_address}</dd></div>
        </dl>
        <div className="mt-6 flex justify-end border-t border-border pt-5">
          <Button onClick={() => router.push(`/asesor/asesi/${id}/penilaian`)} disabled={!isCompleted && assessment.status !== "assessment_scheduled"} className="gap-2">
            {isCompleted ? "Lihat catatan pemeriksaan" : "Mulai pemeriksaan"}<ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" aria-hidden="true" />
          <h2 className="font-bold">Dokumen asesi</h2>
        </div>
        {documents.length === 0 ? (
          <p className="text-sm text-muted-foreground">Belum ada dokumen yang diunggah.</p>
        ) : (
          <ul className="divide-y divide-border">
            {documents.map((document) => (
              <li key={document.id} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <div><p className="text-sm font-medium">{document.original_name}</p><p className="mt-0.5 text-xs text-muted-foreground">{document.category === "administrative" ? "Administrasi" : "Portofolio"} · {document.document_type}</p></div>
                <a href={documentUrl(document.id)} className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline" target="_blank" rel="noreferrer">
                  <Download className="h-4 w-4" aria-hidden="true" /> Buka dokumen
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-border bg-card p-6">
        <div className="mb-4">
          <h2 className="font-bold">Catatan mandiri asesi per unit</h2>
          <p className="mt-1 text-xs text-muted-foreground">Informasi ini berasal dari formulir asesi dan menjadi bahan persiapan pemeriksaan.</p>
        </div>
        {units.length === 0 ? (
          <p className="text-sm text-muted-foreground">Skema ini belum memiliki unit kompetensi.</p>
        ) : (
          <div className="space-y-3">
            {units.map((unit) => {
              const answer = apl02.find((item) => item.unit_id === unit.id);
              return (
                <article key={unit.id} className="rounded-lg border border-border p-4">
                  <p className="font-mono text-xs font-semibold text-primary">{unit.code}</p>
                  <h3 className="mt-1 text-sm font-semibold">{unit.title}</h3>
                  {unit.description && <p className="mt-1 text-xs text-muted-foreground">{unit.description}</p>}
                  {answer?.notes && <p className="mt-2 whitespace-pre-wrap text-sm">{answer.notes}</p>}
                  {answer?.evidence?.length ? <ul className="mt-2 space-y-1">{answer.evidence.map((evidence) => <li key={evidence.id}><a href={documentUrl(evidence.id)} target="_blank" rel="noreferrer" className="text-xs font-medium text-primary hover:underline">{evidence.originalName}</a></li>)}</ul> : null}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
