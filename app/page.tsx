import About from "@/components/Home/About";
import Features from "@/components/Home/Features";
import Footer from "@/components/Home/Footer";
import Hero from "@/components/Home/Hero";
import Navbar from "@/components/Home/Navbar";
import Schemes from "@/components/Home/Schemes";
import Workflow from "@/components/Home/Workflow";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero/>
      <About/>
      <Features/>
      <Schemes/>
      <Workflow/>
      <Footer/>
    </>
  )
}