import About from "@/components/LandingPage/Landing/About";
import Features from "@/components/LandingPage/Landing/Features";
import Footer from "@/components/LandingPage/Landing/Footer";
import Hero from "@/components/LandingPage/Landing/Hero";
import InformationLinks from "@/components/LandingPage/Landing/InformationLinks";
import Navbar from "@/components/LandingPage/Navbar";
import Workflow from "@/components/LandingPage/Landing/Workflow";


export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Features />
        <Workflow />
        <InformationLinks />
      </main>
      <Footer />
    </>
  );
}
