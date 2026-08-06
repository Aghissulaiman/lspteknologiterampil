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

const emptySubscribe = () => () => {};
function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

// Data simulasi item pencarian
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

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const mounted = useIsMounted();
  const router = useRouter();

  // State Search & Focus
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Simulasi login status
  const isLoggedIn = true;

  const activeTheme = mounted ? (resolvedTheme || theme) : "light";
  const isDarkTheme = activeTheme === "dark";

  // Klik di luar area search untuk melepaskan fokus & menutup dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
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
        const offsetPosition = elementPosition - navHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }
    setIsOpen(false);
    setIsProfileOpen(false);
    setIsSearchFocused(false);
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

  const navLinks = [
    { name: "Tentang", href: "/Home/program", type: "page" },
    { name: "Alur Pembelajaran", href: "#learning-path", type: "scroll" },
    { name: "Materi", href: "/Home/materi", type: "page" },
    { name: "Proyek Akhir", href: "/Home/proyek", type: "page" },
    { name: "Kegiatan", href: "/Home/kegiatan", type: "page" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">
        
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
        <div className={`hidden sm:flex items-center transition-all duration-500 ease-in-out flex-1 ${
          isSearchFocused ? "justify-start gap-6 ml-4" : "justify-center gap-6 mx-auto"
        }`}>
          
          {/* Search Bar - Awalnya di tengah, saat diklik memanjang & bergeser */}
          <div 
            ref={searchRef} 
            className={`relative transition-all duration-500 ease-in-out ${
              isSearchFocused 
                ? "flex-1 max-w-xl lg:max-w-2xl" 
                : "w-44 md:w-56 lg:w-64"
            }`}
          >
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="Cari materi, modul, program..."
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

          {/* Navigasi - Otomatis terdorong ke kanan saat Search diklik & memanjang */}
          <div className={`hidden lg:flex items-center space-x-4 lg:space-x-6 transition-all duration-500 ${
            isSearchFocused ? "ml-auto" : ""
          }`}>
            {navLinks.map((link) => {
              const isScroll = link.type === "scroll";
              const href = link.href;
              
              return isScroll ? (
                <a
                  key={link.name}
                  href={href}
                  onClick={(e) => handleNavClick(e, href)}
                  className="text-xs lg:text-sm font-medium text-muted-foreground transition-colors hover:text-primary whitespace-nowrap"
                >
                  {link.name}
                </a>
              ) : (
                <Link
                  key={link.name}
                  href={href}
                  className="text-xs lg:text-sm font-medium text-muted-foreground transition-colors hover:text-primary whitespace-nowrap"
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

        </div>

        {/* Right Side: Action Buttons & User Menu */}
        <div className="hidden items-center gap-2 lg:gap-3 sm:flex shrink-0 z-10">
          
          {/* Tombol Theme Switcher */}
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
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
              </Button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-background shadow-lg py-1 z-50">
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-sm font-medium text-foreground">John Doe</p>
                    <p className="text-xs text-muted-foreground">john@email.com</p>
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
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <LogOut className="h-4 w-4" />
                    Keluar
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/Masuk"
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
        <div className="bg-background/95 backdrop-blur-md px-4 pt-2 pb-6 sm:hidden space-y-4 border-b border-border">
          
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

          <div className="space-y-1">
            {navLinks.map((link) => {
              const isScroll = link.type === "scroll";
              const href = link.href;
              
              return isScroll ? (
                <a
                  key={link.name}
                  href={href}
                  onClick={(e) => handleNavClick(e, href)}
                  className="block py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  {link.name}
                </a>
              ) : (
                <Link
                  key={link.name}
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className="block py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="border-t border-border pt-3 space-y-2">
            {isLoggedIn ? (
              <>
                <div className="flex items-center gap-3 py-2">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">John Doe</p>
                    <p className="text-xs text-muted-foreground">john@email.com</p>
                  </div>
                </div>
                <Link
                  href="/profile"
                  className="flex items-center gap-2 py-2 text-sm text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="h-4 w-4" />
                  Profil Saya
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center gap-2 py-2 text-sm text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Settings className="h-4 w-4" />
                  Pengaturan
                </Link>
                <button
                  className="flex items-center gap-2 py-2 text-sm text-red-600 hover:text-red-700 transition-colors w-full"
                  onClick={() => setIsOpen(false)}
                >
                  <LogOut className="h-4 w-4" />
                  Keluar
                </button>
              </>
            ) : (
              <Link
                href="/Masuk"
                onClick={() => setIsOpen(false)}
                className="flex w-full h-9 items-center justify-center rounded-md text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
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