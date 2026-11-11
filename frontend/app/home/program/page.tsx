import Navbar from "@/components/LandingPage/Navbar";
import Footer from "@/components/LandingPage/Landing/Footer";
import Link from "next/link";
import { Award, CheckCircle2 } from "lucide-react";

export default function ProgramPage() {
    return (
        <main className="min-h-screen bg-background flex flex-col justify-between">
            <Navbar />
            <section className="py-20 px-4 max-w-4xl mx-auto text-center space-y-5">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 flex items-center justify-center mx-auto">
                    <Award className="w-8 h-8" />
                </div>
                <h1 className="text-3xl font-bold text-[#1a2b4c] dark:text-white">Program Sertifikasi Profesi Terakreditasi</h1>
                <p className="text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
                    LSP Teknologi Terampil menyelenggarakan uji kompetensi berlisensi resmi BNSP di bidang teknologi informasi, rekayasa perangkat lunak, dan kecerdasan buatan.
                </p>
                <div className="pt-2 flex justify-center gap-3">
                    <Link href="/skema" className="px-6 py-3 rounded-xl bg-[#0070BA] hover:bg-blue-700 text-white font-semibold text-xs transition inline-block">
                        Jelajahi Skema Sertifikasi →
                    </Link>
                    <Link href="/dashboard" className="px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition inline-block">
                        Masuk ke Dashboard Asesi
                    </Link>
                </div>
            </section>
            <Footer />
        </main>
    );
}
