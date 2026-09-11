import About from "@/components/landing/Landing/About";
// import Contact from "@/components/landing/Landing/Contact";
import Features from "@/components/landing/Landing/Features";
import Footer from "@/components/landing/Landing/Footer";
import Hero from "@/components/landing/Landing/Hero";
import Navbar from "@/components/landing/Navbar";
// import Schemes from "@/components/landing/Landing/Schemes";
import Workflow from "@/components/landing/Landing/Workflow";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero/>
      <About/>
      <Features/>
      {/* <Schemes/> */}
      <Workflow/>
      {/* <Contact/> */}
      <Footer/>
    </>
  )
}