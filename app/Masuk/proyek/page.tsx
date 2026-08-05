import Navbar from "@/components/User/AI/Navbar";
import Footer from "@/components/User/Materi/Footer";
// import HeroProgramAkhirAI from "@/components/User/Proyek/HeroProgramAkhirAI";
import ProgramAkhirAI from "@/components/User/Proyek/ProgramAkhirAI";


export default function MateriPage() {
    return (
        <main>
            <Navbar />
            {/* <HeroProgramAkhirAI/> */}
            <ProgramAkhirAI/>
            {/* <FinalProjectAI /> */}
            <Footer />
        </main>
    );
}