import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/config/site";
import Link from 'next/link';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ['AI tools', 'content creation', 'story generator', 'social media', 'image prompts'],
  authors: [{ name: siteConfig.author }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background`}
      >
        <header className="border-b">
          <div className="container mx-auto px-4 h-16 flex items-center">
            <Link href="/" className="text-xl font-bold"/>
              {siteConfig.name}
            
          </div>
        </header>
        <main>{children}</main>
        <footer className="border-t py-6 mt-16">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
