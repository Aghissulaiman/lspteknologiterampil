import Navbar from "@/components/LandingPage/Navbar";
import Footer from "@/components/LandingPage/Landing/Footer";
import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function MateriPage() {
    return (
        <main className="min-h-screen bg-background flex flex-col justify-between">
            <Navbar />
            <section className="py-20 px-4 max-w-4xl mx-auto text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-[#0070BA] flex items-center justify-center mx-auto">
                    <BookOpen className="w-8 h-8" />
                </div>
                <h1 className="text-3xl font-bold text-[#1a2b4c] dark:text-white">Materi & Standar Kompetensi Kerja (SKKNI)</h1>
                <p className="text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
                    Materi uji dan silabus kompetensi disusun mengacu pada Standar Kompetensi Kerja Nasional Indonesia (SKKNI) resmi dari BNSP.
                </p>
                <div className="pt-2">
                    <Link href="/skema" className="px-6 py-3 rounded-xl bg-[#0070BA] hover:bg-blue-700 text-white font-semibold text-xs transition inline-block">
                        Lihat Katalog Skema & Unit Kompetensi →
                    </Link>
                </div>
            </section>
            <Footer />
        </main>
    );
}
