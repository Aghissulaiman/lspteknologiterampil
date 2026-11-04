import AssessmentRegister from "@/components/asesor/AssessmentRegister";

export default function RiwayatAsesorPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Riwayat Pemeriksaan</h1>
        <p className="mt-2 text-sm text-muted-foreground">Pemeriksaan yang sudah Anda selesaikan.</p>
      </header>
      <AssessmentRegister mode="completed" />
    </div>
  );
}
