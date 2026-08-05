"use client";

import { Rocket } from "lucide-react";

export default function HeroProgramAkhirAI() {
  return (
    <div className="rounded-2xl border border-border bg-background p-6 md:p-8 shadow-sm mb-8">
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 text-xs font-semibold tracking-wide">
          <Rocket className="w-3.5 h-3.5" />
          <span>Program Akhir AI</span>
        </div>
        <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-foreground">
          ARTIFICIAL INTELLIGENCE (AI)
        </h1>
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
          Program Artificial Intelligence (AI) dirancang untuk memperkenalkan peserta pada pemanfaatan teknologi kecerdasan buatan dalam dunia kerja, bisnis, dan produktivitas. Peserta akan mempelajari penggunaan berbagai tools AI untuk membantu pembuatan konten, analisis data, otomatisasi pekerjaan, hingga meningkatkan efisiensi kerja.
        </p>
      </div>
    </div>
  );
}