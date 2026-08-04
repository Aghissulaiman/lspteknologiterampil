import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MaintenanceModal from "@/components/MaintenanceModal"; // 1. Impor komponen modal

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LSP Teknologi Terampil",
  description: "Lembaga Sertifikasi Profesi Teknologi Terampil",

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* 2. Pasang modal di atas children agar muncul langsung saat aplikasi dibuka */}
        <MaintenanceModal />
        
        {children}
      </body>
    </html>
  );
}