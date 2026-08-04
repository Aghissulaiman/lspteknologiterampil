"use client";

import React, { useState, useEffect, useSyncExternalStore } from "react";
import Image from "next/image";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

// Helper/Hook untuk mendeteksi status mounted secara aman tanpa re-render berantai
const emptySubscribe = () => () => {};
function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,  // Hasil saat di Client
    () => false  // Hasil saat di SSR (Server)
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const mounted = useIsMounted();

  const activeTheme = mounted ? (resolvedTheme || theme || "light") : "light";
  const isDarkTheme = activeTheme === "dark";

  const syncThemeToRoot = (nextTheme: "light" | "dark") => {
    if (typeof window === "undefined") return;

    const root = document.documentElement;
    if (nextTheme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
    }
  };

  useEffect(() => {
    if (!mounted || typeof window === "undefined") return;
    syncThemeToRoot(isDarkTheme ? "dark" : "light");
  }, [mounted, isDarkTheme]);

  const applyTheme = (nextTheme: "light" | "dark") => {
    setTheme(nextTheme);
    syncThemeToRoot(nextTheme);
  };

  const toggleTheme = () => {
    const isCurrentlyDark =
      (typeof document !== "undefined" && document.documentElement.classList.contains("dark")) ||
      (resolvedTheme === "dark") ||
      (theme === "dark");

    const nextTheme = isCurrentlyDark ? "light" : "dark";
    applyTheme(nextTheme);
  };

  // Tautan disesuaikan persis dengan komponen di Home
    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href && href.startsWith("#")) {
      e.preventDefault();
      const targetId = href.replace("#", "");
      const element = document.getElementById(targetId);
      if (element) {
        const navHeight = 80;
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - navHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    }
    setIsOpen(false);
  };

  const navLinks = [
    { name: "Beranda", href: "#hero" },
    { name: "Tentang Kami", href: "#about" },
    { name: "Keunggulan", href: "#features" },
    { name: "Skema Sertifikasi", href: "#schemes" },
    { name: "Alur Pendaftaran", href: "#workflow" },
    { name: "Kontak", href: "#kontak" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-md transition-colors duration-200">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo Section */}
        <a href="#hero" onClick={(e) => handleNavClick(e, "#hero")} className="flex items-center gap-3 cursor-pointer">
          <div>
            <Image 
              src="/Logo/Logo2.png" 
              alt="Logo LSP Teknologi Terampil"
              width={80}
              height={80}
              className="object-contain"
              priority
            />
          </div>
          
          {/* Teks Brand */}
          <div className="flex flex-col">
            <span className="text-lg font-bold leading-tight tracking-tight text-foreground">
              LSP <span className="text-primary transition-colors duration-200">Teknologi Terampil</span>
            </span>
          </div>
        </a>

        {/* Desktop Links */}
        <div className="hidden items-center space-x-6 lg:space-x-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-sm font-medium text-muted-foreground transition-all duration-300 hover:text-orange-500 hover:-translate-y-0.5"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Action Buttons (Theme Switcher + CTA) */}
        <div className="hidden items-center gap-3 md:flex">
          
          {/* Theme Toggle Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="h-10 w-10 cursor-pointer rounded-md border border-border bg-background transition-all hover:bg-accent hover:text-accent-foreground select-none"
            aria-label="Ganti Tema"
          >
            {mounted && isDarkTheme ? (
              <Moon className="h-4 w-4 text-blue-400 transition-transform duration-200 hover:rotate-12" />
            ) : (
              <Sun className="h-4 w-4 text-amber-500 transition-transform duration-200 hover:rotate-45" />
            )}
          </Button>

          {/* CTA Button Tanpa asChild */}
          <a
            href="#schemes"
            className="inline-flex h-10 items-center justify-center rounded-md px-6 text-sm font-semibold shadow-md bg-primary text-primary-foreground hover:bg-orange-500 hover:text-white transition-colors"
          >
            Pendaftaran Sertifikasi
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9 cursor-pointer rounded-md border border-border bg-background transition-all hover:bg-accent hover:text-accent-foreground select-none"
            aria-label="Ganti Tema"
          >
            {mounted && isDarkTheme ? (
              <Moon className="h-4 w-4 text-blue-400" />
            ) : (
              <Sun className="h-4 w-4 text-amber-500" />
            )}
          </Button>

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
              onClick={() => setIsOpen(false)}
              className="block py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              {link.name}
            </a>
          ))}
          <a
            href="#schemes"
            onClick={() => setIsOpen(false)}
            className="flex w-full h-10 items-center justify-center rounded-md mt-2 text-sm font-semibold bg-primary text-primary-foreground hover:bg-orange-500 hover:text-white transition-colors"
          >
            Pendaftaran Sertifikasi
          </a>
        </div>
      )}
    </nav>
  );
}