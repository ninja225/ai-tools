'use client';

import Link from 'next/link';
import { BookOpen, Share2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FadeIn } from '@/components/animations/fade-in';
import { RetroGradient } from '@/components/backgrounds/retro-gradient';
import { AnimatedButton } from '@/components/ui/animated-button';

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
          <AnimatedButton href="./tools" text={t('home.exploreTools')} />
        </FadeIn>

        {/* Featured Tools */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <FadeIn delay={0.1} direction="up" className="block">
            <Link
              href="./tools/story-creator"
              className="group relative drop-shadow-xl w-full h-[320px] overflow-hidden rounded-2xl bg-gradient-to-br from-[#3d3c3d] to-[#2a2a2a] block transition-all duration-300 hover:drop-shadow-2xl"
            >
              <div className="absolute flex flex-col items-center justify-center text-center text-white z-[1] rounded-2xl inset-[2px] bg-card/90 backdrop-blur-md p-8 border border-white/5">
                {/* Grain overlay */}
                <div 
                  className="absolute inset-0 opacity-[0.08] rounded-2xl pointer-events-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                  }}
                />
                <div className="relative z-10 flex flex-col items-center w-full h-full justify-between py-4">
                  <div className="flex-shrink-0">
                    <BookOpen className="w-16 h-16 text-[var(--accent-brand)] drop-shadow-[0_0_8px_rgba(247,184,7,0.5)]" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 flex flex-col justify-center items-center gap-3 max-w-full px-2">
                    <h3 className="text-2xl font-bold font-display text-white tracking-tight">{t('toolNames.storyCreator')}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 max-w-[90%]">
                      {t('toolDescriptions.storyCreator')}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-xs font-medium text-[var(--accent-brand)] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Learn More →
                  </div>
                </div>
              </div>
              <div className="absolute w-64 h-56 bg-[var(--accent-brand)] blur-[90px] -left-1/2 -top-1/2 opacity-20 group-hover:opacity-40 transition-all duration-500"></div>
            </Link>
          </FadeIn>

          <FadeIn delay={0.2} direction="up" className="block">
            <Link
              href="./tools/post-creator"
              className="group relative drop-shadow-xl w-full h-[320px] overflow-hidden rounded-2xl bg-gradient-to-br from-[#3d3c3d] to-[#2a2a2a] block transition-all duration-300 hover:drop-shadow-2xl"
            >
              <div className="absolute flex flex-col items-center justify-center text-center text-white z-[1] rounded-2xl inset-[2px] bg-card/90 backdrop-blur-md p-8 border border-white/5">
                {/* Grain overlay */}
                <div 
                  className="absolute inset-0 opacity-[0.08] rounded-2xl pointer-events-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                  }}
                />
                <div className="relative z-10 flex flex-col items-center w-full h-full justify-between py-4">
                  <div className="flex-shrink-0">
                    <Share2 className="w-16 h-16 text-[var(--accent-brand)] drop-shadow-[0_0_8px_rgba(247,184,7,0.5)]" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 flex flex-col justify-center items-center gap-3 max-w-full px-2">
                    <h3 className="text-2xl font-bold font-display text-white tracking-tight">{t('toolNames.socialMediaPost')}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 max-w-[90%]">
                      {t('toolDescriptions.socialMediaPost')}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-xs font-medium text-[var(--accent-brand)] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Learn More →
                  </div>
                </div>
              </div>
              <div className="absolute w-64 h-56 bg-[var(--accent-brand)] blur-[90px] -left-1/2 -top-1/2 opacity-20 group-hover:opacity-40 transition-all duration-500"></div>
            </Link>
          </FadeIn>
        </div>
      </div>
      </div>
    </>
  );
}
