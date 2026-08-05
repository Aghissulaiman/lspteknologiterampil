"use client";

import React, { useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

const emptySubscribe = () => () => {};
function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const mounted = useIsMounted();

  const activeTheme = mounted ? (resolvedTheme || theme) : "light";
  const isDarkTheme = activeTheme === "dark";

  // FUNGSI TOGGLE KESERAP SMOOTH & MEWAH
  const toggleTheme = (event: React.MouseEvent<HTMLButtonElement>) => {
    const nextTheme = isDarkTheme ? "light" : "dark";

    // Fallback jika browser belum mendukung View Transitions
    if (!document.startViewTransition) {
      setTheme(nextTheme);
      return;
    }

    // Mengambil titik pusat klik mouse
    const x = event.clientX;
    const y = event.clientY;

    // Menghitung jarak terjauh ke sudut layar
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = document.startViewTransition(() => {
      setTheme(nextTheme);
    });

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ];

      document.documentElement.animate(
        {
          clipPath: clipPath,
        },
        {
          /* Durasi 1100ms untuk gerakan yang tenang & lembut */
          duration: 1100,
          /* Easing ultra smooth: awal lambat, mengalir halus, berhenti sangat tenang */
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    });
  };

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
          behavior: "smooth",
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
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <a href="#hero" onClick={(e) => handleNavClick(e, "#hero")} className="flex items-center gap-3 cursor-pointer">
          <div className="relative h-12 w-12 sm:h-14 sm:w-14">
            <Image 
              src="/Logo/Logo2.png" 
              alt="Logo LSP Teknologi Terampil"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold leading-tight tracking-tight text-foreground">
              LSP <span className="text-primary">Teknologi Terampil</span>
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden items-center space-x-6 lg:space-x-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          
          {/* Tombol Theme Switcher Keserap */}
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="h-10 w-10 cursor-pointer rounded-md border border-input bg-background text-foreground transition-transform active:scale-95 select-none"
            aria-label="Ganti Tema"
          >
            {mounted && isDarkTheme ? (
              <Moon className="h-4 w-4 text-blue-400" />
            ) : (
              <Sun className="h-4 w-4 text-amber-500" />
            )}
          </Button>

          <Link
            href="/pendaftaran"
            className="inline-flex h-10 items-center justify-center rounded-md px-6 text-sm font-semibold shadow-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Pendaftaran Sertifikasi
          </Link>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9 cursor-pointer rounded-md border border-input bg-background text-foreground transition-transform active:scale-95 select-none"
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
        <div className="bg-background/95 backdrop-blur-md px-4 pt-2 pb-6 md:hidden space-y-3 border-b border-border">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="block py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              {link.name}
            </a>
          ))}
          <Link
            href="/pendaftaran"
            onClick={() => setIsOpen(false)}
            className="flex w-full h-10 items-center justify-center rounded-md mt-2 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Pendaftaran Sertifikasi
          </Link>
        </div>
      )}
    </nav>
  );
}