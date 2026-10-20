import AboutHero from "@/components/LandingPage/Profile/Tentang/AboutHero";
import Navbar from "@/components/LandingPage/Navbar";
import AboutVisiMisi from "@/components/LandingPage/Profile/Tentang/AboutVisiMisi";
import Footer from "@/components/LandingPage/Landing/Footer";

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