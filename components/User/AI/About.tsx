"use client";

import { Sparkles, Workflow, BarChart3, Bot } from "lucide-react";

export default function About() {
    const benefits = [
        {
            icon: Bot,
            title: "Pemanfaatan Tools AI",
            desc: "Mengenal berbagai tools AI untuk meningkatkan produktivitas dan kreativitas.",
        },
        {
            icon: Workflow,
            title: "Otomatisasi Kerja",
            desc: "Mempelajari penerapan AI untuk menyederhanakan proses kerja.",
        },
        {
            icon: BarChart3,
            title: "Analisis & Produktivitas",
            desc: "Menggunakan AI dalam pengolahan data dan pengambilan keputusan.",
        },
    ];

    return (
        <section
            id="tentang"
            className="py-24 bg-background transition-colors duration-300"
        >
            <div className="max-w-7xl mx-auto px-6">

                <div className="grid lg:grid-cols-2 gap-12 items-center">

                    {/* Text */}
                    <div>
                        {/* <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                            <Sparkles className="w-4 h-4" />
                            Program Artificial Intelligence
                        </span> */}

                        <h2 className="mt-6 text-4xl font-bold tracking-tight text-foreground">
                            Artificial Intelligence untuk{" "}
                            <span className="text-primary transition-colors duration-300 hover:text-orange-500 cursor-pointer">
                                Dunia Industri
                            </span>
                        </h2>

                        <p className="mt-6 text-muted-foreground leading-8">
                            Program Artificial Intelligence (AI) dirancang untuk
                            membekali peserta dengan pemahaman dan keterampilan dalam
                            memanfaatkan teknologi kecerdasan buatan secara efektif
                            di lingkungan kerja modern.
                        </p>

                        <p className="mt-4 text-muted-foreground leading-8">
                            Melalui pembelajaran teori dan praktik, peserta akan
                            memahami penerapan AI dalam pembuatan konten, analisis data,
                            otomatisasi proses kerja, serta peningkatan produktivitas
                            sesuai kebutuhan industri saat ini.
                        </p>
                    </div>


                    {/* Kompetensi Card */}
                    <div className="grid gap-5">
                        {benefits.map((item, index) => {
                            const Icon = item.icon;

                            return (
                                <div
                                    key={index}
                                    className="
                                        group flex gap-4 
                                        rounded-2xl 
                                        border border-border 
                                        bg-card 
                                        p-5
                                        transition-all 
                                        duration-300
                                        hover:border-orange-500
                                        hover:shadow-lg
                                        hover:shadow-orange-500/20
                                    "
                                >
                                    <div
                                        className="
                                            flex h-11 w-11 shrink-0 
                                            items-center justify-center 
                                            rounded-xl 
                                            bg-primary/10 
                                            text-primary
                                            transition-all 
                                            duration-300
                                            group-hover:bg-orange-500/10
                                            group-hover:text-orange-500
                                        "
                                    >
                                        <Icon className="w-5 h-5" />
                                    </div>

                                    <div>
                                        <h3
                                            className="
                                                font-semibold 
                                                text-foreground
                                                transition-colors
                                                duration-300
                                                group-hover:text-orange-500
                                            "
                                        >
                                            {item.title}
                                        </h3>

                                        <p className="mt-1 text-sm text-muted-foreground leading-6">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                </div>

            </div>
        </section>
    );
}