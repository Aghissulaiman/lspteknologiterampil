import About from "@/components/LandingPage/Landing/About";
import Contact from "@/components/LandingPage/Landing/Contact";
import Features from "@/components/LandingPage/Landing/Features";
import Footer from "@/components/LandingPage/Landing/Footer";
import Hero from "@/components/LandingPage/Landing/Hero";
import Navbar from "@/components/LandingPage/Navbar";
import Schemes from "@/components/LandingPage/Landing/Schemes";
import Workflow from "@/components/LandingPage/Landing/Workflow";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero/>
      <About/>
      <Features/>
      <Schemes/>
      <Workflow/>
      <Contact/>
      <Footer/>
    </>
  )
}