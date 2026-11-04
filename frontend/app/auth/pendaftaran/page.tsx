import PendaftaranForm from "@/components/signup-form";

const errorMessages: Record<string, string> = {
  invalid: "Data pendaftaran belum valid. Periksa kembali isian Anda.",
  taken: "Email atau NIK sudah terdaftar.",
  unavailable: "Pendaftaran belum dapat diproses. Coba lagi.",
};

export default async function PendaftaranPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string | string[] }>;
}) {
  const { error } = await searchParams;
  const errorCode = Array.isArray(error) ? error[0] : error;

  return <PendaftaranForm error={errorCode ? errorMessages[errorCode] : undefined} />;
}
