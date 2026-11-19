import type { Metadata } from "next";
import VerifikasiSertifikat from "@/components/LandingPage/informasi/verifikasi-sertifikat/VerifikasiSertifikat";
import Footer from "@/components/LandingPage/Landing/Footer";
import Navbar from "@/components/LandingPage/Navbar";

export const metadata: Metadata = {
  title: "Cek Pemegang Sertifikat | LSP Teknologi Terampil",
  description: "Periksa nomor sertifikat pada basis data LSP Teknologi Terampil.",
};

export default function VerifikasiSertifikatPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <VerifikasiSertifikat />
      </main>
      <Footer />
    </div>
  );
}
