"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { resolvedTheme, setTheme } = useTheme();

    const navLinks = [
        { name: "Tentang", href: "/program", type: "scroll" },
        { name: "Alur Pembelajaran", href: "#learning-path", type: "scroll" },
        { name: "Materi", href: "/materi", type: "page" },
        { name: "Proyek Akhir", href: "/proyek", type: "page" },
        { name: "Kegiatan", href: "/kegiatan", type: "page" },
    ];

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-md">
            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-3">
                    <Image
                        src="/Logo/Logo2.png"
                        alt="Logo"
                        width={70}
                        height={70}
                        className="object-contain"
                    />
                    <div>
                        <h1 className="text-lg font-bold">
                            LSP <span className="text-primary">Teknologi Terampil</span>
                        </h1>
                    </div>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((item) => (
                        <a
                            key={item.name}
                            href={item.href}
                            className="text-sm font-medium text-muted-foreground transition-all duration-300 hover:text-orange-500"
                        >
                            {item.name}
                        </a>
                    ))}
                </div>

                {/* Right */}
                <div className="hidden md:flex items-center gap-3">

                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                            setTheme(resolvedTheme === "dark" ? "light" : "dark")
                        }
                        className="h-10 w-10 cursor-pointer rounded-md border border-border bg-background transition-all hover:bg-accent hover:text-accent-foreground"
                    >
                        {resolvedTheme === "dark" ? (
                            <Moon className="h-4 w-4 text-blue-400 transition-transform duration-300 hover:rotate-12" />
                        ) : (
                            <Sun className="h-4 w-4 text-orange-500 transition-transform duration-300 hover:rotate-45" />
                        )}
                    </Button>

                    {/* <Button className="bg-primary hover:bg-orange-500 cursor-pointer">
                        Daftar Sekarang
                    </Button> */}
                </div>

                {/* Mobile */}
                <div className="flex items-center gap-2 md:hidden">

                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                            setTheme(resolvedTheme === "dark" ? "light" : "dark")
                        }
                        className="h-9 w-9"
                    >
                        {resolvedTheme === "dark" ? (
                            <Moon className="h-4 w-4 text-blue-400" />
                        ) : (
                            <Sun className="h-4 w-4 text-orange-500" />
                        )}
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </Button>

                </div>

            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-4">

                    {navLinks.map((item) => (
                        <a
                            key={item.name}
                            href={item.href}
                            className="block text-sm font-medium hover:text-orange-500"
                            onClick={() => setIsOpen(false)}
                        >
                            {item.name}
                        </a>
                    ))}

                    <Button className="w-full bg-primary hover:bg-orange-500">
                        Daftar Sekarang
                    </Button>

                </div>
            )}
        </nav>
    );
}