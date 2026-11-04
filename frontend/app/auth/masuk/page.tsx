import MasukForm from "@/components/Masuk";

const errorMessages: Record<string, string> = {
  invalid: "Email, kata sandi, atau peran tidak sesuai.",
  unavailable: "Masuk belum dapat diproses. Coba lagi.",
};

export default async function MasukPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string | string[] }>;
}) {
  const { error } = await searchParams;
  const errorCode = Array.isArray(error) ? error[0] : error;

  return <MasukForm error={errorCode ? errorMessages[errorCode] : undefined} />;
}
