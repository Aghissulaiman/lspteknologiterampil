"use client";

import React, { useState, useMemo } from "react";
import { ArrowUpRight, CheckCircle2, Sparkles, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Schemes() {
  const [activeTab, setActiveTab] = useState("semua");

  const categories = [
    { id: "semua", label: "Semua Skema" },
    { id: "ai-web", label: "AI & Web Dev" },
    { id: "teknisigo", label: "Teknisi & Hardware" },
    { id: "digital-marketing", label: "Digital Marketing & Analytics" },
  ];

  const schemes = [
    {
      id: "1",
      category: "ai-web",
      title: "Artificial Intelligence",
      code: "AI-001",
      level: "Beginner",
      prerequisite: "Mampu mengoperasikan komputer",
      tags: ["ChatGPT", "Prompt", "Automation"],
    },
    {
      id: "2",
      category: "teknisigo",
      title: "Service Laptop Interface",
      code: "TKS-002",
      level: "Intermediate",
      prerequisite: "Memahami dasar komputer",
      tags: ["Troubleshooting", "Hardware", "Software"],
    },
    {
      id: "3",
      category: "teknisigo",
      title: "Service Laptop Advance",
      code: "TKS-003",
      level: "Advance",
      prerequisite: "Menguasai Service Laptop Interface",
      tags: ["Motherboard", "Diagnosis", "Repair"],
    },
    {
      id: "4",
      category: "teknisigo",
      title: "Service Android",
      code: "TKS-004",
      level: "Interface - Advance",
      prerequisite: "Terbuka untuk umum",
      tags: ["Flashing", "IC BGA", "eMMC"],
    },
    {
      id: "5",
      category: "digital-marketing",
      title: "Digital Marketing",
      code: "DM-001",
      level: "Beginner - Intermediate",
      prerequisite: "Mampu mengoperasikan komputer dan internet dasar.",
      tags: ["SEO", "Meta Ads", "Content"],
    },
  ];

  // Menggunakan useMemo untuk optimasi performa filtering
  const filteredSchemes = useMemo(() => {
    if (activeTab === "semua") return schemes;
    return schemes.filter((s) => s.category === activeTab);
  }, [activeTab]);

  return (
    <section id="schemes" className="w-full bg-muted/40 py-20 transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Samping */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Program Pelatihan Profesional
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Tingkatkan Kompetensi Bersama Program Pelatihan Kami
            </h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
            Kurikulum sertifikasi yang diselaraskan dengan kebutuhan industri modern: penggabungan teknologi AI modern dan strategi Digital Marketing pada web.
          </p>
        </div>

        {/* Tab Filter Category */}
        <div className="flex flex-wrap items-center gap-2 mb-8 border-b border-border/60 pb-4">
          {categories.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-none"
                  : "bg-background text-muted-foreground hover:bg-background/80 hover:text-foreground border border-border/50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Grid List Skema */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSchemes.map((scheme) => (
            <div
              key={scheme.id}
              className="
                group
                relative
                overflow-hidden
                flex
                flex-col
                justify-between
                p-6
                rounded-xl
                bg-background
                border
                border-border/80
                cursor-pointer
                transition-all
                duration-500
                ease-out
                hover:-translate-y-2
                hover:scale-[1.02]
                hover:border-orange-500
              "
            >
              {/* Background Glow */}
              <div
                className="
                  absolute
                  inset-0
                  opacity-0
                  bg-gradient-to-br
                  from-orange-100/50
                  via-transparent
                  to-transparent
                  transition-opacity
                  duration-500
                  group-hover:opacity-100
                "
              />

              <div className="relative z-10">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className="
                        text-[11px]
                        font-mono
                        font-bold
                        px-2.5
                        py-0.5
                        rounded
                        text-primary
                        bg-primary/10
                        transition-all
                        duration-500
                        group-hover:bg-orange-500
                        group-hover:text-white
                      "
                    >
                      {scheme.code}
                    </span>

                    <span
                      className="
                        text-xs
                        font-medium
                        text-muted-foreground
                        transition-all
                        duration-500
                        group-hover:text-orange-500
                      "
                    >
                      {scheme.level}
                    </span>
                  </div>

                  <h3
                    className="
                      text-lg
                      font-bold
                      text-foreground
                      mb-2
                      transition-all
                      duration-500
                      group-hover:text-orange-500
                      group-hover:translate-x-1
                    "
                  >
                    {scheme.title}
                  </h3>

                  <p
                    className="
                      text-xs
                      text-muted-foreground
                      flex
                      items-center
                      gap-1.5
                      mb-4
                      transition-all
                      duration-500
                      group-hover:text-orange-500
                    "
                  >
                    <CheckCircle2
                      className="
                        w-3.5
                        h-3.5
                        text-primary
                        shrink-0
                        transition-all
                        duration-500
                        group-hover:text-orange-500
                        group-hover:scale-125
                        group-hover:rotate-12
                      "
                    />
                    Prasyarat: {scheme.prerequisite}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-border/40 flex items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1.5">
                    {scheme.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="
                          text-[10px]
                          font-medium
                          bg-muted
                          text-muted-foreground
                          px-2
                          py-0.5
                          rounded
                          border
                          border-border/40
                          transition-all
                          duration-500
                          group-hover:bg-orange-100
                          group-hover:text-orange-700
                          group-hover:border-orange-300
                          hover:scale-110
                        "
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    aria-label={`Detail skema ${scheme.title}`}
                    className="
                      h-8
                      w-8
                      rounded-lg
                      bg-muted
                      flex
                      items-center
                      justify-center
                      text-foreground
                      transition-all
                      duration-500
                      cursor-pointer
                      group-hover:bg-orange-500
                      group-hover:text-white
                      group-hover:rotate-45
                      group-hover:scale-110
                    "
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Link */}
        <div className="mt-8 text-center">
          <Button variant="outline" className="gap-2 border-border/80 font-medium cursor-pointer shadow-none">
            <Search className="w-4 h-4" /> Lihat Seluruh Silabus & Dokumen Uji
          </Button>
        </div>

      </div>
    </section>
  );
}