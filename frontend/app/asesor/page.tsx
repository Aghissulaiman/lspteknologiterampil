import AssessmentRegister from "@/components/asesor/AssessmentRegister";

export default function DashboardAsesor() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <header className="rounded-xl border border-border bg-card p-6 sm:p-8">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Pemeriksaan Asesi</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">Tinjau penugasan, periksa bukti, dan catat observasi selama ujian. Keputusan akhir diproses oleh Admin LSP.</p>
      </header>
      <AssessmentRegister mode="all" showOverview />
    </div>
  );
}
