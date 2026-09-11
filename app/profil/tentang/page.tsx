import AboutHero from "@/components/landing/Profile/Tentang/AboutHero";
import Navbar from "@/components/landing/Navbar";
import AboutVisiMisi from "@/components/landing/Profile/Tentang/AboutVisiMisi";
import Footer from "@/components/landing/Landing/Footer";

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
      <Footer/>
  
    </main>
  );
}