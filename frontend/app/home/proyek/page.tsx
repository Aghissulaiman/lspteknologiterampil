import Navbar from "@/components/LandingPage/Navbar";
import Footer from "@/components/LandingPage/Landing/Footer";
import Link from "next/link";
import { FolderGit2 } from "lucide-react";

export default function ProyekPage() {
    return (
        <main className="min-h-screen bg-background flex flex-col justify-between">
            <Navbar />
            <section className="py-20 px-4 max-w-4xl mx-auto text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-purple-50 dark:bg-purple-950/30 text-purple-600 flex items-center justify-center mx-auto">
                    <FolderGit2 className="w-8 h-8" />
                </div>
                <h1 className="text-3xl font-bold text-[#1a2b4c] dark:text-white">Portofolio & Proyek Asesi</h1>
                <p className="text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
                    Bukti karya nyata dan proyek portofolio yang diserahkan oleh asesi sebagai pemenuhan dokumen pendukung asesmen mandiri FR.APL.02.
                </p>
                <div className="pt-2">
                    <Link href="/dashboard" className="px-6 py-3 rounded-xl bg-[#0070BA] hover:bg-blue-700 text-white font-semibold text-xs transition inline-block">
                        Upload Portofolio di Portal Asesi →
                    </Link>
                </div>
            </section>
            <Footer />
        </main>
    );
}
