"use client";

import React, { useState } from "react";
import { ArrowUpRight, CheckCircle2, Sparkles, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Schemes() {
  const [activeTab, setActiveTab] = useState("semua");

  const categories = [
    { id: "semua", label: "Semua Skema" },
    { id: "ai-web", label: "AI & Web Dev" },
    { id: "marketing", label: "Digital Marketing & Analytics" },
  ];

  const schemes = [
    {
      id: "1",
      category: "ai-web",
      title: "AI-Powered Web Engineer",
      code: "SKM-2026-AIWEB",
      level: "KKNI Level 4",
      prerequisite: "Pemrograman Web & Dasar AI API",
      tags: ["LLM Integration", "Next.js", "Prompt Engineering"],
    },
    {
      id: "2",
      category: "marketing",
      title: "Digital Marketing & Web Specialist",
      code: "SKM-2026-DGT",
      level: "KKNI Level 3",
      prerequisite: "Dasar Marketing & CMS (WordPress)",
      tags: ["SEO/SEM", "Content Strategy", "Meta Ads"],
    },
    {
      id: "3",
      category: "ai-web",
      title: "Fullstack AI Web Developer",
      code: "SKM-2026-FSAI",
      level: "KKNI Level 5",
      prerequisite: "Pengalaman Web Developer 1 thn",
      tags: ["LangChain/LlamaIndex", "Vector DB", "React/Node"],
    },
    {
      id: "4",
      category: "marketing",
      title: "Web Analytics & Growth Hacker",
      code: "SKM-2026-GWH",
      level: "KKNI Level 4",
      prerequisite: "Paham Optimasi Web & Data",
      tags: ["GA4", "A/B Testing", "Conversion Rate"],
    },
    {
      id: "5",
      category: "ai-web",
      title: "E-Commerce & Smart Web Specialist",
      code: "SKM-2026-ECM",
      level: "KKNI Level 4",
      prerequisite: "Dasar Web Development & E-Commerce",
      tags: ["AI Recommendation", "Payment Gateway", "SEO Product"],
    },
  ];

  const filteredSchemes = activeTab === "semua" 
    ? schemes 
    : schemes.filter(s => s.category === activeTab);

  return (
    <section className="w-full bg-muted/40 py-20 transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Samping */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Program Sertifikasi Masa Depan
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Skema Uji Kompetensi Web, AI & Marketing
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
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-sm"
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
              className="group relative flex flex-col justify-between p-6 rounded-xl bg-background border border-border/80 transition-all duration-200 hover:border-primary hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-mono font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded">
                    {scheme.code}
                  </span>
                  <span className="text-xs font-medium text-muted-foreground">
                    {scheme.level}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                  {scheme.title}
                </h3>

                <p className="text-xs text-muted-foreground flex items-center gap-1.5 mb-4">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                  Prasyarat: {scheme.prerequisite}
                </p>
              </div>

              <div className="pt-4 border-t border-border/40 flex items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1.5">
                  {scheme.tags.map((tag, i) => (
                    <span 
                      key={i} 
                      className="text-[10px] font-medium bg-muted text-muted-foreground px-2 py-0.5 rounded border border-border/40"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <button 
                  type="button" 
                  aria-label={`Detail skema ${scheme.title}`}
                  className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0 cursor-pointer"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Link */}
        <div className="mt-8 text-center">
          <Button variant="outline" className="gap-2 border-border/80 font-medium cursor-pointer">
            <Search className="w-4 h-4" /> Lihat Seluruh Silabus & Dokumen Uji
          </Button>
        </div>

      </div>
    </section>
  );
}