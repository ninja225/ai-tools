import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Space_Grotesk, Inter } from 'next/font/google';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ThemeProvider } from '@/components/theme-provider';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageToggle } from '@/components/language-toggle';
import { siteConfig } from '@/config/site';
import '../globals.css';

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
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

const locales = ['en', 'ru', 'ar'];

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale)) {
    notFound();
  }

  // Fetch messages for the current locale
  const messages = await getMessages();

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <body className={`${spaceGrotesk.variable} ${inter.variable} antialiased min-h-screen bg-background font-sans`}>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <header className="border-b">
              <div className="px-6 h-16 flex items-center justify-between">
                <Link href={`/${locale}`} className="text-2xl font-bold font-display retro-shadow">
                  {siteConfig.name}
                </Link>
                <div className="flex items-center gap-2">
                  <LanguageToggle />
                  <ThemeToggle />
                </div>
              </div>
            </header>
            <main>{children}</main>
            <footer className="border-t py-6 mt-16">
              <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
              </div>
            </footer>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
