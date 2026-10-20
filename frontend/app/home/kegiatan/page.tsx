import type { Metadata } from "next";
import Navbar from "@/components/User/AI/Navbar";
import Footer from "@/components/User/Materi/Footer";
import InformasiKegiatan from "@/components/LandingPage/informasi/Kegiatan/InformasiKegiatan";

export const metadata: Metadata = {
  title: "Kegiatan | LSP Teknologi Terampil",
  description:
    "Lihat ragam kegiatan LSP Teknologi Terampil, mulai dari uji kompetensi dan pembekalan hingga kolaborasi bersama Tempat Uji Kompetensi.",
};

export default function HomeKegiatanPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <InformasiKegiatan />
      <Footer />
    </main>
  );
}
