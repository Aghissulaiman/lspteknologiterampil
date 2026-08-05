import AboutHero from "@/components/Profile/Tentang/AboutHero";
import Navbar from "@/components/LandingPage/Navbar";
import AboutVisiMisi from "@/components/Profile/Tentang/AboutVisiMisi";

export const metadata = {
  title: "Tentang LSP | LSP Teknologi Terampil",
  description: "Profil lengkap, visi, misi, dan komitmen mutu LSP Teknologi Terampil.",
};

export default function TentangLSPPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar/>
      <AboutHero />
      <AboutVisiMisi/>
  
    </main>
  );
}