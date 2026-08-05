"use client";

import {
    BrainCircuit,
    CheckCircle2,
    Award,
    Users,
    Headphones,
    Laptop,
    Sparkles,
    Rocket,
    BookOpen,
} from "lucide-react";

export default function ProgramAkhirAI() {
    // Materi Pelatihan AI
    const materi = [
        "Pengenalan Artificial Intelligence",
        "Konsep Dasar Machine Learning",
        "Prompt Engineering",
        "Pemanfaatan ChatGPT",
        "AI untuk Produktivitas Kerja",
        "AI untuk Content Creation",
        "AI Image Generator",
        "AI Video Generator",
        "AI Presentation Tools",
        "AI untuk Digital Marketing",
        "AI Automation",
        "Etika Penggunaan AI",
        "Studi Kasus Implementasi AI",
    ];

    // Kompetensi Peserta
    const kompetensi = [
        "Memahami konsep dasar Artificial Intelligence.",
        "Menggunakan berbagai tools AI untuk kebutuhan pekerjaan.",
        "Membuat prompt yang efektif.",
        "Menghasilkan konten dengan bantuan AI.",
        "Mengoptimalkan produktivitas menggunakan AI.",
        "Menerapkan AI secara etis dan bertanggung jawab.",
    ];

    // Benefit Program
    const benefits = [
        { icon: Award, title: "Sertifikat Kompetensi", desc: "Bukti keahlian resmi" },
        { icon: BookOpen, title: "Materi Terstruktur", desc: "Akses modul lengkap" },
        { icon: Laptop, title: "Berbasis Praktik", desc: "Studi kasus nyata" },
        { icon: Headphones, title: "Instruktur Profesional", desc: "Pendampingan ahli" },
        { icon: Sparkles, title: "Lifetime Support", desc: "Dukungan berkelanjutan" },
        { icon: Users, title: "Komunitas Belajar", desc: "Jejaring antar peserta" },
    ];

    return (
        <section id="program-akhir" className="py-16 bg-muted/30">
            <div className="mx-auto max-w-7xl px-6">

                {/* HERO BANNER - PROGRAM AKHIR */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-900 via-neutral-800 to-orange-950 p-8 md:p-12 text-white shadow-xl mb-12 border border-orange-500/20">
                    <div className="relative z-10 max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-widest mb-4">
                            <Rocket className="w-3.5 h-3.5" />
                            <span>Program Akhir AI</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
                            ARTIFICIAL INTELLIGENCE (AI)
                        </h1>
                        <p className="text-neutral-300 text-sm md:text-base leading-relaxed">
                            Program Artificial Intelligence (AI) dirancang untuk memperkenalkan peserta pada pemanfaatan teknologi kecerdasan buatan dalam dunia kerja, bisnis, dan produktivitas. Peserta akan mempelajari penggunaan berbagai tools AI untuk membantu pembuatan konten, analisis data, otomatisasi pekerjaan, hingga meningkatkan efisiensi kerja.
                        </p>
                    </div>
                    {/* Background Accent Decorative */}
                    <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
                </div>

                {/* GRID CONTENT UTAMA */}
                <div className="grid lg:grid-cols-3 gap-8">

                    {/* MATERI PELATIHAN (2 KOLOM) */}
                    <div className="lg:col-span-2 rounded-2xl border border-border bg-background p-6 md:p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-500">
                                    <BrainCircuit className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-foreground">
                                        Materi Pelatihan
                                    </h2>
                                    <p className="text-xs text-muted-foreground">13 Modul Pembelajaran Utama</p>
                                </div>
                            </div>
                        </div>

                        {/* LIST MATERI (HOVER ORANYE) */}
                        <div className="grid sm:grid-cols-2 gap-3">
                            {materi.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3 rounded-xl border border-border bg-card p-3.5 transition-all duration-200 hover:border-orange-500 hover:bg-orange-500/5 hover:shadow-md hover:-translate-y-0.5 group cursor-pointer"
                                >
                                    <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-muted text-xs font-bold text-muted-foreground group-hover:bg-orange-500 group-hover:text-white transition-colors shrink-0">
                                        {index + 1}
                                    </span>
                                    <span className="text-sm font-medium text-foreground group-hover:text-orange-600 transition-colors">
                                        {item}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* SIDEBAR: KOMPETENSI & BENEFIT */}
                    <div className="space-y-6">

                        {/* BOX KOMPETENSI */}
                        <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-foreground mb-4 pb-2 border-b border-border flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                Kompetensi Peserta
                            </h3>
                            <div className="space-y-3">
                                {kompetensi.map((item, index) => (
                                    <div key={index} className="flex gap-3 items-start">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                                        <p className="text-xs md:text-sm text-muted-foreground leading-snug">
                                            {item}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* BOX BENEFIT PROGRAM */}
                        <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-foreground mb-4 pb-2 border-b border-border flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-orange-500" />
                                Benefit Program
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                {benefits.map((item, index) => {
                                    const IconComponent = item.icon;
                                    return (
                                        <div
                                            key={index}
                                            className="p-3.5 rounded-xl border border-border bg-card text-left transition-all duration-200 hover:border-orange-500 hover:bg-orange-500/5 group"
                                        >
                                            <IconComponent className="w-5 h-5 text-orange-500 mb-2 group-hover:scale-110 transition-transform" />
                                            <div className="text-xs font-bold text-foreground group-hover:text-orange-600 transition-colors">
                                                {item.title}
                                            </div>
                                            <div className="text-[10px] text-muted-foreground mt-0.5">
                                                {item.desc}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                    </div>

                </div>

            </div>
        </section>
    );
}