"use client";

import React, { useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, Sun, Moon, ChevronDown } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

type UserRole = "participant" | "assessor" | "admin_lsp";

type SignedInUser = {
  fullName: string;
  role: UserRole;
};

const PORTAL_LINKS: Record<UserRole, { href: string; label: string }> = {
  participant: { href: "/dashboard", label: "Dashboard Asesi" },
  assessor: { href: "/asesor", label: "Dashboard Asesor" },
  admin_lsp: { href: "/admin", label: "Panel Admin" },
};

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
  const [signedInUser, setSignedInUser] = useState<SignedInUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  const { theme, setTheme, resolvedTheme } = useTheme();
  const mounted = useIsMounted();

  useEffect(() => {
    let active = true;

    fetch("/api/auth/me", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) return null;

        const data = await response.json();
        const user = data?.user;
        const validRoles: UserRole[] = ["participant", "assessor", "admin_lsp"];

        if (
          typeof user?.fullName !== "string" ||
          !validRoles.includes(user.role)
        ) {
          return null;
        }

        return { fullName: user.fullName, role: user.role as UserRole };
      })
      .then((user) => {
        if (active) {
          setSignedInUser(user);
          setAuthChecked(true);
        }
      })
      .catch(() => {
        if (active) {
          setSignedInUser(null);
          setAuthChecked(true);
        }
      });

    return () => {
      active = false;
    };
  }, []);

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
        { name: "Tentang LSP", href: "/profil/tentang" },
        { name: "Struktur Organisasi", href: "/profil/struktur" },
        // { name: "Legalitas & Lisensi", href: "/profil/legalitas" },
      ],
    },
    {
      title: "Skema",
      href: "#",
      children: [
        { name: "Skema Sertifikasi", href: "/skema" },
     
        // { name: "Tempat Uji Kompetensi (TUK)", href: "/skema/tuk" },
        // { name: "Persyaratan Asesi", href: "/skema/persyaratan" },
      ],
    },
    {
      title: "Informasi",
      href: "#",
      children: [
        { name: "Kegiatan", href: "/informasi/kegiatan" },
        { name: "Berita", href: "/informasi/berita" },
        { name: "Cek Pemegang Sertifikat", href: "/informasi/verifikasi-sertifikat" },
      ],
    },
    {
      title: "Kontak",
      href: "/kontak",
    },
  ];

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-md"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          setActiveDropdown(null);
          setIsOpen(false);
        }
      }}
    >
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
              Layanan Sertifikasi Profesi
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
                  type="button"
                  aria-expanded={activeDropdown === item.title}
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
                        onClick={() => setActiveDropdown(null)}
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
            type="button"
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-11 w-11 cursor-pointer rounded-md text-foreground transition-transform active:scale-95 select-none"
            aria-label="Ganti Tema"
            aria-pressed={isDarkTheme}
          >
            {mounted && isDarkTheme ? (
              <Moon className="h-5 w-5 text-blue-400" />
            ) : (
              <Sun className="h-5 w-5 text-amber-500" />
            )}
          </Button>

          {authChecked ? (
            signedInUser ? (
              <div className="flex items-center gap-3">
                <span
                  className="hidden max-w-36 truncate text-sm font-medium text-foreground xl:block"
                  title={signedInUser.fullName}
                >
                  {signedInUser.fullName}
                </span>
                <Link
                  href={PORTAL_LINKS[signedInUser.role].href}
                  className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-5 text-base font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
                >
                  {PORTAL_LINKS[signedInUser.role].label}
                </Link>
              </div>
            ) : (
              <Link
                href="/auth/pendaftaran"
                className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-5 text-base font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
              >
                Daftar Sertifikasi
              </Link>
            )
          ) : (
            <span
              role="status"
              className="inline-flex min-h-11 items-center px-3 text-sm text-muted-foreground"
            >
              Memeriksa akun...
            </span>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-11 w-11 rounded-md text-foreground"
            aria-label="Ganti Tema"
            aria-pressed={isDarkTheme}
          >
            {mounted && isDarkTheme ? (
              <Moon className="h-5 w-5 text-blue-400" />
            ) : (
              <Sun className="h-5 w-5 text-amber-500" />
            )}
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Accordion Menu */}
      <div
        id="mobile-navigation"
        hidden={!isOpen}
        className="border-b border-border bg-background px-4 pb-6 pt-3 lg:hidden space-y-2 max-h-[calc(100vh-5rem)] overflow-y-auto"
      >
        {menuItems.map((item) => (
          <div key={item.title} className="border-b border-border/40 pb-2">
            {item.children ? (
              <div>
                <button
                  type="button"
                  onClick={() => toggleMobileAccordion(item.title)}
                  aria-expanded={mobileExpanded === item.title}
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
                  <div className="space-y-1 pb-1 pl-4 pt-1">
                    {item.children.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        onClick={() => setIsOpen(false)}
                        className="flex min-h-11 items-center text-base font-medium text-muted-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
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

        <div className="pt-4">
          {!authChecked ? (
            <p role="status" className="py-3 text-center text-sm text-muted-foreground">
              Memeriksa akun...
            </p>
          ) : signedInUser ? (
            <div className="space-y-2">
              <p className="text-center text-sm text-muted-foreground">
                Masuk sebagai <span className="font-semibold text-foreground">{signedInUser.fullName}</span>
              </p>
              <Link
                href={PORTAL_LINKS[signedInUser.role].href}
                onClick={() => setIsOpen(false)}
                className="flex min-h-11 w-full items-center justify-center rounded-md bg-primary text-base font-semibold text-primary-foreground hover:bg-primary/90"
              >
                {PORTAL_LINKS[signedInUser.role].label}
              </Link>
            </div>
          ) : (
            <Link
              href="/auth/pendaftaran"
              onClick={() => setIsOpen(false)}
              className="flex min-h-11 w-full items-center justify-center rounded-md bg-primary text-base font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Daftar Sertifikasi
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
