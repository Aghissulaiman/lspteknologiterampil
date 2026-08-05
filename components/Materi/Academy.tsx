"use client";

import {
    BrainCircuit,
    CheckCircle2,
    Sparkles,
} from "lucide-react";

export default function Academy() {
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

    return (
        <section
            id="academy"
            className="py-20 bg-muted/30 transition-colors duration-300"
        >
            <div className="mx-auto max-w-7xl px-6">


                {/* Content */}
                <div className="mt-1 grid lg:grid-cols-2 gap-8">

                    {/* Materi */}
                    <div className="rounded-2xl border border-border bg-background p-6">

                        <div className="flex items-center gap-3 mb-6">
                            <BrainCircuit className="w-8 h-8 text-primary" />
                            <h3 className="text-xl font-semibold text-foreground">
                                Materi Pelatihan
                            </h3>
                        </div>

                        <div className="grid gap-3">

                            {materi.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-3 rounded-xl border border-border p-3 transition hover:border-orange-500"
                                >
                                    <CheckCircle2 className="w-5 h-5 text-orange-500 mt-0.5 shrink-0" />

                                    <span className="text-sm text-foreground">
                                        {item}
                                    </span>
                                </div>
                            ))}

                        </div>

                    </div>

                    {/* Kompetensi */}
                    <div className="rounded-2xl border border-border bg-background p-6">

                        <h3 className="text-xl font-semibold text-foreground mb-6">
                            Kompetensi Peserta
                        </h3>

                        <div className="space-y-4">

                            {[
                                "Memahami konsep dasar Artificial Intelligence.",
                                "Menggunakan berbagai tools AI untuk kebutuhan pekerjaan.",
                                "Membuat prompt yang efektif.",
                                "Menghasilkan konten dengan bantuan AI.",
                                "Mengoptimalkan produktivitas menggunakan AI.",
                                "Menerapkan AI secara etis dan bertanggung jawab.",
                            ].map((item, index) => (
                                <div
                                    key={index}
                                    className="flex gap-3"
                                >
                                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />

                                    <p className="text-sm text-muted-foreground">
                                        {item}
                                    </p>

                                </div>
                            ))}

                        </div>

                    </div>

                </div>

            </div>
        </section>
    );
}