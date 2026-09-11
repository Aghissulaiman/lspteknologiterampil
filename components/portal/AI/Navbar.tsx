"use client";

import React, { useState, useRef, useEffect, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Menu, X, Sun, Moon, Bell, User, LogOut, Settings, 
  ChevronDown, Search, ArrowRight, BookOpen, Layers 
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";

const emptySubscribe = () => () => {};
function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

const searchableItems = [
  { title: "Tentang Program", href: "/program", category: "Halaman", type: "page" },
  { title: "Alur Pembelajaran", href: "#learning-path", category: "Section", type: "scroll" },
  { title: "Materi Kelas", href: "/materi", category: "Halaman", type: "page" },
  { title: "Proyek Akhir", href: "/proyek", category: "Halaman", type: "page" },
  { title: "Kegiatan & Webinar", href: "/kegiatan", category: "Halaman", type: "page" },
  { title: "Fundamental AI & Etika", href: "/materi#fundamental", category: "Modul", type: "page" },
  { title: "Prompt Engineering ChatGPT", href: "/materi#prompt", category: "Modul", type: "page" },
  { title: "AI Productivity & Tools", href: "/materi#productivity", category: "Modul", type: "page" },
];

// Nav links dipisah: prioritas utama vs sekunder
const primaryNavLinks = [
  { name: "Dashboard", href: "/home/dashboard", type: "page" },
  { name: "Jadwal", href: "/home/jadwal", type: "page" },
  { name: "Materi", href: "/home/materi", type: "page" },
];

const secondaryNavLinks = [
  { name: "Pendaftaran", href: "/home/pendaftaran", type: "page" },
  { name: "Sertifikat Saya", href: "/home/sertifikat", type: "page" },
  { name: "Program AI", href: "/home/program", type: "page" },
  { name: "Proyek Akhir", href: "/home/proyek", type: "page" },
];

const allNavLinks = [...primaryNavLinks, ...secondaryNavLinks];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const mounted = useIsMounted();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);

  const isLoggedIn = auth.isAuthenticated();
  const currentUser = auth.getStoredUser();
  const displayName = currentUser?.profile?.nama_lengkap || currentUser?.email || "Pengguna";
  const displayEmail = currentUser?.email || "";

  const handleLogout = () => {
    auth.logout();
    setIsProfileOpen(false);
    router.push("/auth/masuk");
    router.refresh();
  };

  const activeTheme = mounted ? (resolvedTheme || theme) : "light";
  const isDarkTheme = activeTheme === "dark";

  // Klik di luar untuk menutup dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setIsMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredResults = searchQuery.trim() === "" 
    ? [] 
    : searchableItems.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      );

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

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href && href.startsWith("#")) {
      e.preventDefault();
      const targetId = href.replace("#", "");
      const element = document.getElementById(targetId);
      if (element) {
        const navHeight = 80;
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({ top: elementPosition - navHeight, behavior: "smooth" });
      }
    }
    setIsOpen(false);
    setIsProfileOpen(false);
    setIsSearchFocused(false);
    setIsMoreOpen(false);
  };

  const handleSearchResultSelect = (item: typeof searchableItems[0]) => {
    setIsSearchFocused(false);
    setSearchQuery("");
    if (item.type === "scroll" && item.href.startsWith("#")) {
      const targetId = item.href.replace("#", "");
      const element = document.getElementById(targetId);
      if (element) {
        const navHeight = 80;
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({ top: elementPosition - navHeight, behavior: "smooth" });
      }
    } else {
      router.push(item.href);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        
        {/* Left Side: Brand Logo & Title */}
        <Link href="/" className="flex items-center gap-3 shrink-0 cursor-pointer z-10">
          <div className="relative h-11 w-11 sm:h-12 sm:w-12 shrink-0">
            <Image 
              src="/Logo/Logo2.png" 
              alt="Logo LSP Teknologi Terampil"
              fill
              className="object-contain"
              priority
            />
          </div>
          
          <div 
            className={`flex flex-col transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap ${
              isSearchFocused 
                ? "max-w-0 opacity-0 pointer-events-none -mr-3" 
                : "max-w-[200px] opacity-100"
            }`}
          >
            <span className="text-base font-bold leading-tight tracking-tight text-foreground">
              LSP <span className="text-primary">Teknologi Terampil</span>
            </span>
          </div>
        </Link>

        {/* Center Container: Search Bar & Navigation Menu */}
        {/* Muncul dari md ke atas, dengan gap yang lebih lega */}
        <div className={`hidden md:flex items-center transition-all duration-500 ease-in-out flex-1 min-w-0 ${
          isSearchFocused ? "justify-start gap-4" : "justify-center gap-4"
        }`}>
          
          {/* Search Bar */}
          <div 
            ref={searchRef} 
            className={`relative transition-all duration-500 ease-in-out ${
              isSearchFocused 
                ? "flex-1 max-w-xl" 
                : "w-48 lg:w-64 xl:w-72"
            }`}
          >
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="Cari materi, modul..."
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 text-xs lg:text-sm rounded-full border border-input bg-muted/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-background transition-all shadow-sm"
              />
            </div>

            {/* Dropdown Live Search */}
            {isSearchFocused && searchQuery.trim().length > 0 && (
              <div className="absolute top-12 left-0 w-full rounded-xl border border-border bg-background shadow-2xl py-2 z-50 overflow-hidden animate-in fade-in-50 slide-in-from-top-2">
                <div className="px-3.5 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Hasil Pencarian ({filteredResults.length})
                </div>
                
                {filteredResults.length > 0 ? (
                  <div className="max-h-64 overflow-y-auto">
                    {filteredResults.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearchResultSelect(item)}
                        className="w-full flex items-center justify-between px-4 py-2.5 text-left text-xs lg:text-sm text-foreground hover:bg-accent transition-colors group"
                      >
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          {item.category === "Modul" ? (
                            <BookOpen className="h-4 w-4 text-primary shrink-0" />
                          ) : (
                            <Layers className="h-4 w-4 text-muted-foreground shrink-0" />
                          )}
                          <span className="truncate font-medium group-hover:text-primary transition-colors">
                            {item.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                            {item.category}
                          </span>
                          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-6 text-center text-xs text-muted-foreground">
                    Tidak ditemukan hasil untuk &quot;{searchQuery}&quot;
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigasi Desktop - hanya muncul di lg ke atas */}
          <div className={`hidden lg:flex items-center gap-1 xl:gap-2 transition-all duration-500 ${
            isSearchFocused ? "ml-auto" : ""
          }`}>
            {/* Primary Links */}
            {primaryNavLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-2.5 xl:px-3 py-2 text-xs xl:text-sm font-medium text-muted-foreground transition-colors hover:text-primary whitespace-nowrap rounded-md hover:bg-accent/50"
              >
                {link.name}
              </Link>
            ))}

            {/* "More" Dropdown untuk secondary links */}
            <div ref={moreRef} className="relative">
              <button
                onClick={() => setIsMoreOpen(!isMoreOpen)}
                className="flex items-center gap-1 px-2.5 xl:px-3 py-2 text-xs xl:text-sm font-medium text-muted-foreground transition-colors hover:text-primary whitespace-nowrap rounded-md hover:bg-accent/50"
              >
                Lainnya
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${isMoreOpen ? 'rotate-180' : ''}`} />
              </button>

              {isMoreOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl border border-border bg-background shadow-lg py-1 z-50 animate-in fade-in-50 slide-in-from-top-2">
                  {secondaryNavLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsMoreOpen(false)}
                      className="block px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right Side: Action Buttons & User Menu */}
        <div className="hidden items-center gap-2 lg:gap-2.5 sm:flex shrink-0 z-10">
          
          {/* Theme Switcher */}
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

          {/* Notifikasi */}
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 cursor-pointer rounded-md border border-input bg-background text-foreground transition-colors hover:bg-accent relative"
            aria-label="Notifikasi"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-red-500 text-[8px] font-bold text-white flex items-center justify-center">
              3
            </span>
          </Button>

          {/* Profile Dropdown */}
          {isLoggedIn ? (
            <div className="relative">
              <Button
                variant="ghost"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 px-2.5 py-2 h-9 rounded-md hover:bg-accent transition-colors"
              >
                <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <span className="hidden text-xs font-medium text-foreground xl:block max-w-24 truncate">{displayName}</span>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
              </Button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-background shadow-lg py-1 z-50">
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-sm font-medium text-foreground">{displayName}</p>
                    <p className="text-xs text-muted-foreground">{displayEmail}</p>
                  </div>
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    Profil Saya
                  </Link>
                  <Link
                    href="/settings"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <Settings className="h-4 w-4" />
                    Pengaturan
                  </Link>
                  <button
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    Keluar
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/auth/masuk"
              className="inline-flex h-9 items-center justify-center rounded-md px-5 text-xs font-semibold shadow-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Masuk
            </Link>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <div className="flex items-center gap-2 sm:hidden">
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
            className="relative h-9 w-9"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isOpen && (
        <div className="bg-background/95 backdrop-blur-md px-4 pt-2 pb-6 sm:hidden space-y-4 border-b border-border max-h-[calc(100vh-5rem)] overflow-y-auto">
          
          <div className="relative w-full pt-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Cari..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-4 text-xs rounded-lg border border-input bg-muted/50 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {searchQuery.trim().length > 0 && (
              <div className="mt-2 rounded-lg border border-border bg-card p-2 space-y-1">
                {filteredResults.length > 0 ? (
                  filteredResults.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSearchResultSelect(item)}
                      className="w-full text-left px-3 py-2 text-xs text-foreground hover:bg-accent rounded-md flex justify-between items-center"
                    >
                      <span>{item.title}</span>
                      <span className="text-[10px] text-primary bg-primary/10 px-1.5 py-0.5 rounded">{item.category}</span>
                    </button>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground p-2 text-center">Tidak ditemukan</p>
                )}
              </div>
            )}
          </div>

          {/* Semua nav links di mobile */}
          <div className="space-y-1">
            {allNavLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block py-2.5 px-3 text-sm font-medium text-foreground hover:text-primary hover:bg-accent/50 rounded-md transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="border-t border-border pt-3 space-y-2">
            {isLoggedIn ? (
              <>
                <div className="flex items-center gap-3 py-2">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{displayName}</p>
                    <p className="text-xs text-muted-foreground truncate">{displayEmail}</p>
                  </div>
                </div>
                <Link
                  href="/profile"
                  className="flex items-center gap-2 py-2.5 px-3 text-sm text-foreground hover:text-primary hover:bg-accent/50 rounded-md transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="h-4 w-4" />
                  Profil Saya
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center gap-2 py-2.5 px-3 text-sm text-foreground hover:text-primary hover:bg-accent/50 rounded-md transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Settings className="h-4 w-4" />
                  Pengaturan
                </Link>
                <button
                  className="flex items-center gap-2 py-2.5 px-3 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-colors w-full"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Keluar
                </button>
              </>
            ) : (
              <Link
                href="/auth/masuk"
                onClick={() => setIsOpen(false)}
                className="flex w-full h-10 items-center justify-center rounded-md text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Masuk
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}