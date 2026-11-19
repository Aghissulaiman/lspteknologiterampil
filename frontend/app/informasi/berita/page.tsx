import type { Metadata } from "next";
import InformasiBerita from "@/components/LandingPage/informasi/Berita/InformasiBerita";
import Footer from "@/components/LandingPage/Landing/Footer";
import Navbar from "@/components/LandingPage/Navbar";

export const metadata: Metadata = {
  title: "Berita dan Panduan | LSP Teknologi Terampil",
  description: "Informasi dan panduan layanan sertifikasi LSP Teknologi Terampil.",
};

export default function BeritaPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <InformasiBerita />
      </main>
      <Footer />
    </div>
  );
}
