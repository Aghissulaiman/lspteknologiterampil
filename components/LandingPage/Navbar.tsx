"use client";

import React, { useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, Sun, Moon, ChevronDown } from "lucide-react";
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
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

  const { theme, setTheme, resolvedTheme } = useTheme();
  const mounted = useIsMounted();

  const activeTheme = mounted ? resolvedTheme || theme : "light";
  const isDarkTheme = activeTheme === "dark";

  const toggleTheme = (event: React.MouseEvent<HTMLButtonElement>) => {
    const nextTheme = isDarkTheme ? "light" : "dark";

    if (!document.startViewTransition) {
      setTheme(nextTheme);
      return;
    }

    const x = event.clientX;
    const y = event.clientY;

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
        { clipPath },
        {
          duration: 1100,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    });
  };

  const toggleMobileAccordion = (title: string) => {
    setMobileExpanded(mobileExpanded === title ? null : title);
  };

  const menuItems = [
    {
      title: "Beranda",
      href: "/",
    },
    {
      title: "Profil",
      href: "#",
      children: [
        { name: "Tentang LSP", href: "/Landing-Page/profil/tentang" },
        { name: "Struktur Organisasi", href: "/Landing-Page/profil/struktur" },
        { name: "Legalitas & Lisensi", href: "/Landing-Page/profil/legalitas" },
      ],
    },
    {
      title: "Skema",
      href: "#",
      children: [
        { name: "Skema Sertifikasi", href: "/Landing-Page/skema" },
        { name: "Tempat Uji Kompetensi (TUK)", href: "/Landing-Page/skema/tuk" },
        { name: "Persyaratan Asesi", href: "/Landing-Page/skema/persyaratan" },
      ],
    },
    {
      title: "Informasi",
      href: "#",
      children: [
        { name: "Berita & Kegiatan", href: "/Landing-Page/informasi/berita" },
        { name: "Cek Pemegang Sertifikat", href: "/Landing-Page/informasi/verifikasi-sertifikat" },
        { name: "FAQ & Bantuan", href: "/Landing-Page/informasi/faq" },
      ],
    },
    {
      title: "Kontak",
      href: "/Landing-Page/kontak",
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 cursor-pointer">
          <div className="relative h-11 w-11 sm:h-12 sm:w-12">
            <Image
              src="/Logo/Logo2.png"
              alt="Logo LSP Teknologi Terampil"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold leading-tight tracking-tight text-foreground">
              LSP <span className="text-primary">Teknologi Terampil</span>
            </span>
            <span className="text-[11px] font-semibold text-muted-foreground tracking-wider uppercase">
              Lisensi BNSP
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center space-x-2 lg:flex">
          {menuItems.map((item) => (
            <div
              key={item.title}
              className="relative"
              onMouseEnter={() => item.children && setActiveDropdown(item.title)}
              onMouseLeave={() => item.children && setActiveDropdown(null)}
            >
              {item.children ? (
                <button
                  className="flex items-center gap-1.5 px-4 py-2.5 text-base font-semibold text-foreground/80 hover:text-primary transition-colors cursor-pointer rounded-md hover:bg-accent/50"
                  onClick={() =>
                    setActiveDropdown(activeDropdown === item.title ? null : item.title)
                  }
                >
                  {item.title}
                  <ChevronDown
                    className={`h-4.5 w-4.5 transition-transform duration-200 ${
                      activeDropdown === item.title ? "rotate-180 text-primary" : ""
                    }`}
                  />
                </button>
              ) : (
                <Link
                  href={item.href}
                  className="block px-4 py-2.5 text-base font-semibold text-foreground/80 hover:text-primary transition-colors rounded-md hover:bg-accent/50"
                >
                  {item.title}
                </Link>
              )}

              {/* Dropdown Menu Desktop */}
              {item.children && activeDropdown === item.title && (
                <div className="absolute left-0 top-full pt-2 w-64 animate-in fade-in-50 zoom-in-95 duration-150">
                  <div className="rounded-xl border border-border bg-popover/95 p-2 shadow-lg backdrop-blur-md">
                    {item.children.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className="block rounded-lg px-3.5 py-2.5 text-base font-medium text-foreground/90 hover:bg-accent hover:text-primary transition-colors"
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Action Controls */}
        <div className="hidden items-center gap-3 md:flex">
          {/* Switcher Tema */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-10 w-10 cursor-pointer rounded-md text-foreground transition-transform active:scale-95 select-none"
            aria-label="Ganti Tema"
          >
            {mounted && isDarkTheme ? (
              <Moon className="h-5 w-5 text-blue-400" />
            ) : (
              <Sun className="h-5 w-5 text-amber-500" />
            )}
          </Button>

          {/* CTA Utama Pendaftaran */}
          <Link
            href="/pendaftaran"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-5 text-base font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
          >
            Daftar Sertifikasi
          </Link>
        </div>

        {/* Mobile Toggle Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-10 w-10 rounded-md text-foreground"
            aria-label="Ganti Tema"
          >
            {mounted && isDarkTheme ? (
              <Moon className="h-5 w-5 text-blue-400" />
            ) : (
              <Sun className="h-5 w-5 text-amber-500" />
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

      {/* Mobile Accordion Menu */}
      {isOpen && (
        <div className="border-b border-border bg-background px-4 pb-6 pt-3 lg:hidden space-y-2 max-h-[calc(100vh-5rem)] overflow-y-auto">
          {menuItems.map((item) => (
            <div key={item.title} className="border-b border-border/40 pb-2">
              {item.children ? (
                <div>
                  <button
                    onClick={() => toggleMobileAccordion(item.title)}
                    className="flex w-full items-center justify-between py-2.5 text-lg font-semibold text-foreground"
                  >
                    <span>{item.title}</span>
                    <ChevronDown
                      className={`h-5 w-5 transition-transform duration-200 ${
                        mobileExpanded === item.title ? "rotate-180 text-primary" : ""
                      }`}
                    />
                  </button>

                  {mobileExpanded === item.title && (
                    <div className="pl-4 space-y-1 pt-1 pb-1">
                      {item.children.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          onClick={() => setIsOpen(false)}
                          className="block py-2 text-base font-medium text-muted-foreground hover:text-primary transition-colors"
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="block py-2.5 text-lg font-semibold text-foreground hover:text-primary"
                >
                  {item.title}
                </Link>
              )}
            </div>
          ))}

          {/* Action Button Mobile */}
          <div className="pt-4">
            <Link
              href="/pendaftaran"
              onClick={() => setIsOpen(false)}
              className="flex w-full h-11 items-center justify-center rounded-md text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Daftar Sertifikasi
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}