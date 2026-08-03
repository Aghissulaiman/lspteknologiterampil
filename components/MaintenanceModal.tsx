"use client";

import React, { useState, useEffect } from "react";
import { Wrench, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MaintenanceModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Munculkan popup setelah komponen dirender di client
    setIsOpen(true);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-card p-6 shadow-2xl border border-border text-center flex flex-col items-center">
        
        {/* Tombol Close di sudut kanan atas */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          aria-label="Tutup"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Ikon Maintenance */}
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-500/10 text-orange-500 ring-8 ring-orange-500/5">
          <Wrench className="h-8 w-8 animate-bounce" />
        </div>

        {/* Judul & Deskripsi */}
        <h2 className="text-xl font-bold text-foreground">
          Sistem Dalam Pemeliharaan
        </h2>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          Kami sedang melakukan pemeliharaan sistem berkala untuk meningkatkan kualitas layanan. Beberapa fitur mungkin tidak dapat diakses untuk sementara waktu.
        </p>

        {/* Tombol Aksi */}
        <div className="mt-6 w-full">
          <Button
            onClick={() => setIsOpen(false)}
            className="w-full font-semibold bg-orange-500 text-white hover:bg-orange-600 transition-colors"
          >
            Saya Mengerti
          </Button>
        </div>
      </div>
    </div>
  );
}