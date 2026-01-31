'use client';

import Link from 'next/link';
import { BookOpen, Share2, Image as ImageIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FadeIn } from '@/components/animations/fade-in';
import { RetroGradient } from '@/components/backgrounds/retro-gradient';

export default function HomePage() {
  const t = useTranslations();

  return (
    <>
      <RetroGradient />
      <div className="container mx-auto px-4 py-16 relative z-10">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <FadeIn direction="up" className="text-center mb-20">
          <h1 className="text-7xl md:text-8xl font-bold mb-6 font-display retro-shadow">
            {t('home.title')}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            {t('home.subtitle')}
          </p>
          <Link
            href="./tools"
            className="inline-flex items-center justify-center rounded-lg text-base font-semibold h-12 px-10 bg-[var(--accent-brand)] text-black hover:brightness-110 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {t('home.exploreTools')}
          </Link>
        </FadeIn>

        {/* Featured Tools */}
        <div className="grid md:grid-cols-3 gap-8">
          <FadeIn delay={0.1} direction="up" className="block">
            <Link
              href="./tools/story-creator"
              className="block p-8 rounded-xl border bg-card hover:shadow-xl transition-all duration-300 hover:border-[var(--accent-brand)]/50"
            >
              <BookOpen className="w-14 h-14 mb-4 text-[var(--accent-brand)]" />
              <h3 className="text-xl font-semibold mb-3 font-display">{t('toolNames.storyCreator')}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t('toolDescriptions.storyCreator')}
              </p>
            </Link>
          </FadeIn>

          <FadeIn delay={0.2} direction="up" className="block">
            <Link
              href="./tools/social-media-post"
              className="block p-8 rounded-xl border bg-card hover:shadow-xl transition-all duration-300 hover:border-[var(--accent-brand)]/50"
            >
              <Share2 className="w-14 h-14 mb-4 text-[var(--accent-brand)]" />
              <h3 className="text-xl font-semibold mb-3 font-display">{t('toolNames.socialMediaPost')}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t('toolDescriptions.socialMediaPost')}
              </p>
            </Link>
          </FadeIn>

          <FadeIn delay={0.3} direction="up" className="block">
            <Link
              href="./tools/image-prompt"
              className="block p-8 rounded-xl border bg-card hover:shadow-xl transition-all duration-300 hover:border-[var(--accent-brand)]/50"
            >
              <ImageIcon className="w-14 h-14 mb-4 text-[var(--accent-brand)]" />
              <h3 className="text-xl font-semibold mb-3 font-display">{t('toolNames.imagePrompt')}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t('toolDescriptions.imagePrompt')}
              </p>
            </Link>
          </FadeIn>
        </div>
      </div>
      </div>
    </>
  );
}
