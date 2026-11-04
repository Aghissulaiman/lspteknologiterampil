import AssessmentRegister from "@/components/asesor/AssessmentRegister";

export default function PenugasanAsesorPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Daftar Penugasan</h1>
        <p className="mt-2 text-sm text-muted-foreground">Jadwal pemeriksaan dan asesi yang ditugaskan kepada Anda.</p>
      </header>
      <AssessmentRegister mode="all" />
    </div>
  );
}
