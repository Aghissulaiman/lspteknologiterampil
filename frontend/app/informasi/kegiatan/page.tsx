import type { Metadata } from "next";
import Footer from "@/components/LandingPage/Landing/Footer";
import Navbar from "@/components/LandingPage/Navbar";
import InformasiKegiatan from "@/components/LandingPage/informasi/Kegiatan/InformasiKegiatan";

export const metadata: Metadata = {
  title: "Kegiatan | LSP Teknologi Terampil",
  description:
    "Lihat ragam kegiatan LSP Teknologi Terampil, mulai dari uji kompetensi dan pembekalan hingga kolaborasi bersama Tempat Uji Kompetensi.",
};

export default function KegiatanPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <InformasiKegiatan />
      <Footer />
    </main>
  );
}
