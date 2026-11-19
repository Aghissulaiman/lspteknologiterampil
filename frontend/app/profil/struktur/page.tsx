import type { Metadata } from "next";
import Footer from "@/components/LandingPage/Landing/Footer";
import Navbar from "@/components/LandingPage/Navbar";
import StrukturBagan from "@/components/LandingPage/Profile/struktur/StrukturBagan";

export const metadata: Metadata = {
  title: "Struktur Organisasi | LSP Teknologi Terampil",
  description: "Informasi struktur organisasi LSP Teknologi Terampil.",
};

export default function StrukturPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <StrukturBagan />
      </main>
      <Footer />
    </div>
  );
}
