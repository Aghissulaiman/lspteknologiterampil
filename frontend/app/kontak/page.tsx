import type { Metadata } from "next";
import KontakHalaman from "@/components/LandingPage/Kontak/KontakHalaman";
import Footer from "@/components/LandingPage/Landing/Footer";
import Navbar from "@/components/LandingPage/Navbar";

export const metadata: Metadata = {
  title: "Kontak | LSP Teknologi Terampil",
  description: "Hubungi LSP Teknologi Terampil untuk informasi sertifikasi.",
};

export default function KontakPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <KontakHalaman />
      </main>
      <Footer />
    </div>
  );
}
