// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { LanguageProvider } from "@/contexts/LanguageProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Afilas Healthcare - Excellence in Medical Services",
  description:
    "Comprehensive healthcare services including hospital care, diagnostics, and pharmaceuticals",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/Afilas-Icon.png",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1f2e" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className="antialiased">
        <ThemeProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}