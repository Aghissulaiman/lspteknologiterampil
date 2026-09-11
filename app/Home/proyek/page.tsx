import Navbar from "@/components/portal/AI/Navbar";
import Footer from "@/components/portal/Materi/Footer";
// import HeroProgramAkhirAI from "@/components/portal/Proyek/HeroProgramAkhirAI";
import ProgramAkhirAI from "@/components/portal/Proyek/ProgramAkhirAI";


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