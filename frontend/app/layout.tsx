import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { IBM_Plex_Mono, IBM_Plex_Sans, Rajdhani } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import logo from "../logo.png";

export const metadata: Metadata = {
  title: "NEBORI",
  description: "Mockup video platform with social graph focus"
};

const headingFont = Rajdhani({
  subsets: ["latin", "latin-ext"],
  weight: ["600", "700"],
  variable: "--font-heading"
});

const bodyFont = IBM_Plex_Sans({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
  variable: "--font-body"
});

const monoFont = IBM_Plex_Mono({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500"],
  variable: "--font-mono"
});

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="uk">
      <body className={`${headingFont.variable} ${bodyFont.variable} ${monoFont.variable} flex min-h-screen flex-col`}>
        <Header />
        <main className="mx-auto w-full max-w-[1720px] flex-1 px-4 py-6 xl:px-6">{children}</main>
        <footer className="border-t border-[rgba(255,255,255,0.08)] bg-[rgba(11,15,24,0.88)]">
          <div className="mx-auto grid w-full max-w-[1720px] grid-cols-1 items-center gap-2 px-4 py-3 text-center sm:grid-cols-3 sm:text-left xl:px-6">
            <div className="flex items-center justify-center sm:justify-start">
              <Link href="/" className="inline-flex items-center">
                <Image src={logo} alt="NEBORI" className="h-7 w-auto object-contain" />
              </Link>
            </div>
            <p className="text-sm text-nebori-muted">Платформа для відео, спільнот і каналів.</p>
            <p className="text-sm text-nebori-muted sm:text-right">© 2026 Nebori</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
