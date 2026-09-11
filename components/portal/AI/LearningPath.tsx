"use client";

import React from "react";
import {
  BrainCircuit,
  Bot,
  Sparkles,
  Cpu,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Fundamental AI",
    icon: BrainCircuit,
    tagline: "Konsep Dasar & Etika",
    description:
      "Memahami konsep dasar Artificial Intelligence dan perkembangan teknologi AI.",
    materi: [
      "Pengenalan Artificial Intelligence",
      "Konsep Dasar Machine Learning",
      "Etika Penggunaan AI",
    ],
  },
  {
    number: "02",
    title: "Prompt Engineering",
    icon: Bot,
    tagline: "Mastering AI Prompts",
    description:
      "Belajar membuat prompt yang efektif menggunakan ChatGPT dan AI Assistant.",
    materi: ["Prompt Engineering", "Pemanfaatan ChatGPT"],
  },
  {
    number: "03",
    title: "AI Productivity",
    icon: Sparkles,
    tagline: "Konten & Efisiensi Kerja",
    description:
      "Menggunakan AI untuk meningkatkan produktivitas dan pembuatan konten.",
    materi: [
      "AI untuk Produktivitas Kerja",
      "AI untuk Content Creation",
      "AI Image Generator",
      "AI Video Generator",
      "AI Presentation Tools",
      "AI untuk Digital Marketing",
    ],
  },
  {
    number: "04",
    title: "Automation & Project",
    icon: Cpu,
    tagline: "Studi Kasus Real-World",
    description:
      "Implementasi AI melalui studi kasus dan otomatisasi pekerjaan.",
    materi: ["AI Automation", "Studi Kasus Implementasi AI"],
  },
];

export default function LearningPath() {
  return (
    <section
      id="workflow"
      className="py-16 sm:py-20 bg-background text-foreground transition-colors duration-300 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
         

          <h2 className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
            Alur Pembelajaran AI
          </h2>

          <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
            Kurikulum disusun secara bertahap agar peserta memahami konsep
            Artificial Intelligence hingga mampu mengimplementasikannya dalam
            dunia kerja.
          </p>
        </div>

        {/* Timeline Section */}
        <div className="relative">
          
          {/* Garis Vertikal Tengah (Desktop Only) */}
          <div className="hidden lg:block absolute left-1/2 top-4 bottom-4 w-0.5 -translate-x-1/2 bg-border/80" />

          <div className="space-y-12 lg:space-y-16">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isEven = index % 2 === 0;

              return (
                <div
                  key={index}
                  className="relative flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-0"
                >
                  {/* Timeline Node Center Dot (Desktop Only) */}
                  <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-background border-2 border-primary shadow-md items-center justify-center z-20">
                    <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                  </div>

                  {/* SISI KIRI */}
                  <div
                    className={`w-full lg:w-[45%] ${
                      isEven ? "lg:order-1 lg:pr-6" : "lg:order-2 lg:pl-6"
                    }`}
                  >
                    {/* Main Card Content */}
                    <div className="group relative rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-primary/50 transition-all duration-300">
                      
                      {/* Top Row: Number & Icon */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shrink-0">
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-primary block">
                              Langkah {step.number}
                            </span>
                            <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                              {step.title}
                            </h3>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4">
                        {step.description}
                      </p>

                      {/* Materi List */}
                      <div className="space-y-2 pt-2 border-t border-border/50">
                        {step.materi.map((item, i) => (
                          <div key={i} className="flex items-center gap-2.5">
                            <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                            <span className="text-xs sm:text-sm font-medium text-foreground">
                              {item}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* SISI KANAN (Pengisi Ruang Kosong / Side Preview Card) */}
                  <div
                    className={`hidden lg:flex w-[45%] flex-col justify-center ${
                      isEven
                        ? "lg:order-2 lg:pl-12 text-left"
                        : "lg:order-1 lg:pr-12 text-right"
                    }`}
                  >
                    <div
                      className={`flex flex-col gap-2 ${
                        isEven ? "items-start" : "items-end"
                      }`}
                    >
                      <span className="text-5xl font-black text-primary/15 tracking-tight">
                        PHASE {step.number}
                      </span>
                      <h4 className="text-base font-bold text-foreground/80">
                        {step.tagline}
                      </h4>
                      <div
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold text-primary/80 group cursor-default mt-1`}
                      >
                        <span>Fokus Utama Modul</span>
                        <ArrowRight
                          className={`w-3.5 h-3.5 transition-transform ${
                            !isEven ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    </div>
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