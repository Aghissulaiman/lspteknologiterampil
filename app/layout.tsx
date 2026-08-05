import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
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
  metadataBase: new URL("https://lspteknologiterampil.id"),
  title: "LSP Teknologi Terampil",
  description: "Lembaga Sertifikasi Profesi Teknologi Terampil",
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/favicon.ico" }
    ],
    shortcut: "/icon.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "LSP Teknologi Terampil",
    description: "Lembaga Sertifikasi Profesi Teknologi Terampil",
    url: "https://lspteknologiterampil.id",
    siteName: "LSP Teknologi Terampil",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "Logo LSP Teknologi Terampil",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "LSP Teknologi Terampil",
    description: "Lembaga Sertifikasi Profesi Teknologi Terampil",
    images: ["/icon.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <MaintenanceModal />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
