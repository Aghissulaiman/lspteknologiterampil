"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Menu, X, Sun, Moon, Flame, Check } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Mencegah hydration mismatch & panic di Server-Side Rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  // Sinkronkan class tema di HTML root secara aman saat theme berubah
  useEffect(() => {
    if (!mounted || typeof window === "undefined") return;

    const root = document.documentElement;
    root.classList.remove("dark", "orange");

    if (theme === "dark") root.classList.add("dark");
    if (theme === "orange") root.classList.add("orange");
  }, [mounted, theme]);

  const applyTheme = (nextTheme: "light" | "dark" | "orange") => {
    setTheme(nextTheme);
  };

  const navLinks = [
    { name: "Beranda", href: "#" },
    { name: "Skema Sertifikasi", href: "#" },
    { name: "Jadwal Uji", href: "#" },
    { name: "Tempat Uji (TUK)", href: "#" },
    { name: "Profil LSP", href: "#" },
    { name: "Berita", href: "#" },
    { name: "Kontak", href: "#" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-md transition-colors duration-200">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo Section */}
        <div className="flex items-center gap-3 cursor-pointer">
          <div>
            <Image 
              src="/Logo/Logo.png" 
              alt="Logo LSP Teknologi Terampil"
              width={80}
              height={80}
              className="object-contain"
              priority
            />
          </div>
          
          {/* Teks Brand 2 Baris */}
          <div className="flex flex-col">
            <span className="text-lg font-bold leading-tight tracking-tight text-foreground">
              LSP <span className="text-primary transition-colors duration-200">Teknologi Terampil</span>
            </span>
            {/* <span className="text-sm font-semibold tracking-wide text-primary transition-colors ml-10 duration-200">
              Mayantara
            </span> */}
          </div>
        </div>

        {/* Desktop Links */}
        <div className="hidden items-center space-x-6 lg:space-x-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Action Buttons (Theme Switcher + CTA) */}
        <div className="hidden items-center gap-3 md:flex">
          
          {/* Theme Dropdown Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div
                role="button"
                tabIndex={0}
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-background text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer select-none"
                aria-label="Pilih Tema"
              >
                {mounted && theme === "dark" && <Moon className="h-4 w-4 text-blue-400" />}
                {mounted && theme === "orange" && <Flame className="h-4 w-4 text-orange-500" />}
                {mounted && (theme === "light" || !theme) && <Sun className="h-4 w-4 text-amber-500" />}
              </div>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuItem 
                onClick={() => applyTheme("light")} 
                className="flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Sun className="h-4 w-4 text-amber-500" />
                  <span>Terang</span>
                </div>
                {mounted && theme === "light" && <Check className="h-4 w-4" />}
              </DropdownMenuItem>

              <DropdownMenuItem 
                onClick={() => applyTheme("dark")} 
                className="flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Moon className="h-4 w-4 text-blue-400" />
                  <span>Gelap</span>
                </div>
                {mounted && theme === "dark" && <Check className="h-4 w-4" />}
              </DropdownMenuItem>

              <DropdownMenuItem 
                onClick={() => applyTheme("orange")} 
                className="flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Flame className="h-4 w-4 text-orange-500" />
                  <span>Oranye</span>
                </div>
                {mounted && theme === "orange" && <Check className="h-4 w-4" />}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* CTA Button */}
          <Button variant="default" size="lg" className="font-semibold shadow-md bg-primary text-primary-foreground hover:opacity-90">
            Pendaftaran Sertifikasi
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div
                role="button"
                tabIndex={0}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer select-none"
                aria-label="Pilih Tema"
              >
                {mounted && theme === "dark" && <Moon className="h-4 w-4 text-blue-400" />}
                {mounted && theme === "orange" && <Flame className="h-4 w-4 text-orange-500" />}
                {mounted && (theme === "light" || !theme) && <Sun className="h-4 w-4 text-amber-500" />}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => applyTheme("light")} className="gap-2 cursor-pointer">
                <Sun className="h-4 w-4 text-amber-500" /> Terang
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => applyTheme("dark")} className="gap-2 cursor-pointer">
                <Moon className="h-4 w-4 text-blue-400" /> Gelap
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => applyTheme("orange")} className="gap-2 cursor-pointer">
                <Flame className="h-4 w-4 text-orange-500" /> Oranye
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="bg-background px-4 pt-2 pb-6 md:hidden space-y-3 border-b border-border/50">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="block py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              {link.name}
            </a>
          ))}
          <Button variant="default" className="w-full mt-2 font-semibold bg-primary text-primary-foreground">
            Pendaftaran Sertifikasi
          </Button>
        </div>
      )}
    </nav>
  );
}