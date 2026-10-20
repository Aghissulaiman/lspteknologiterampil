import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import MaintenanceModal from "@/components/MaintenanceModal";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = localFont({
  src: "./fonts/geist-latin.woff2",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/geist-mono-latin.woff2",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lspteknologiterampil.id"),
  title: "LSP Teknologi Terampil",
  description: "Lembaga Sertifikasi Profesi Teknologi Terampil",
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/favicon.ico" },
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
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          themes={["light", "dark", "orange"]}
        >
          <MaintenanceModal />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
