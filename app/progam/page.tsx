import Navbar from "@/components/AI/Navbar";
import About from "@/components/AI/About";
import LearningPath from "@/components/AI/LearningPath";
// import Hero from "@/components/AI/Hero";
// import Academy from "@/components/AI/Academy";
import Footer from "@/components/AI/Footer";

// import Materi from "@/components/AI/Materi";
// import Benefit from "@/components/AI/Benefit";
// import Sertifikat from "@/components/AI/Sertifikat";
// import FAQ from "@/components/AI/FAQ";
// import Footer from "@/components/AI/Footer";

export default function AIPage() {
    return (
        <>
            <Navbar />
            <About />
            {/* <Hero /> */}
            {/* <Academy /> */}
            <LearningPath />
            {/* <Academy /> */}
            <Footer />
            {/* <About />
            <Materi /> */}
            {/* <Benefit />
            <Sertifikat />
            <FAQ />
            <Footer /> */} 
        </>
    );
}