'use client';

import { BookOpen, Share2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FadeIn } from '@/components/animations/fade-in';
import { RetroGradient } from '@/components/backgrounds/retro-gradient';
import { AnimatedButton } from '@/components/ui/animated-button';
import Link from 'next/link';
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

        {/* Featured Tools Section */}
        <div className="mb-12">
          <FadeIn direction="up" className="mb-8 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">Featured Tools</h2>
            <p className="text-lg text-neutral-400">Start creating with our most popular tools</p>
          </FadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <FadeIn delay={0.1} direction="up" className="block">
              <Link
                href="./tools/story-creator"
                className="group relative drop-shadow-xl w-full h-[380px] overflow-hidden rounded-2xl bg-gradient-to-br from-[#3d3c3d] to-[#2a2a2a] block transition-all duration-300 hover:drop-shadow-2xl hover:scale-[1.02]"
              >
                <div className="absolute flex flex-col items-start text-left text-white z-[1] rounded-2xl inset-[2px] bg-card/90 backdrop-blur-md p-6 border border-white/5">
                  {/* Grain overlay */}
                  <div 
                    className="absolute inset-0 opacity-[0.08] rounded-2xl pointer-events-none"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                    }}
                  />
                  <div className="relative z-10 flex flex-col h-full justify-between">
                    {/* Top section: Category + Icon */}
                    <div className="flex-shrink-0">
                      <div className="mb-4">
                        <span className="inline-block rounded-full bg-[var(--accent-brand)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--accent-brand)]">
                          Content Creation
                        </span>
                      </div>
                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--accent-brand)]/20 to-[var(--accent-brand)]/5 ring-1 ring-[var(--accent-brand)]/30">
                        <BookOpen className="h-10 w-10 text-[var(--accent-brand)]" />
                      </div>
                    </div>
                    
                    {/* Content section */}
                    <div className="flex-1 flex flex-col justify-center">
                      <h3 className="mb-3 text-2xl font-bold tracking-tight text-white">
                        {t('toolNames.storyCreator')}
                      </h3>
                      <p className="text-base leading-relaxed text-neutral-300">
                        {t('toolDescriptions.storyCreator')}
                      </p>
                    </div>
                    
                    {/* Call to action */}
                    <div className="flex-shrink-0 flex items-center text-[var(--accent-brand)] transition-transform duration-300 group-hover:translate-x-2">
                      <span className="mr-2 text-base font-semibold">Try it now</span>
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="absolute w-64 h-56 bg-[var(--accent-brand)] blur-[90px] -left-1/2 -top-1/2 opacity-20 group-hover:opacity-40 transition-all duration-500"></div>
              </Link>
            </FadeIn>

            <FadeIn delay={0.2} direction="up" className="block">
              <Link
                href="./tools/post-creator"
                className="group relative drop-shadow-xl w-full h-[380px] overflow-hidden rounded-2xl bg-gradient-to-br from-[#3d3c3d] to-[#2a2a2a] block transition-all duration-300 hover:drop-shadow-2xl hover:scale-[1.02]"
              >
                <div className="absolute flex flex-col items-start text-left text-white z-[1] rounded-2xl inset-[2px] bg-card/90 backdrop-blur-md p-6 border border-white/5">
                  {/* Grain overlay */}
                  <div 
                    className="absolute inset-0 opacity-[0.08] rounded-2xl pointer-events-none"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                    }}
                  />
                  <div className="relative z-10 flex flex-col h-full justify-between">
                    {/* Top section: Category + Icon */}
                    <div className="flex-shrink-0">
                      <div className="mb-4">
                        <span className="inline-block rounded-full bg-[var(--accent-brand)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--accent-brand)]">
                          Social Media
                        </span>
                      </div>
                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--accent-brand)]/20 to-[var(--accent-brand)]/5 ring-1 ring-[var(--accent-brand)]/30">
                        <Share2 className="h-10 w-10 text-[var(--accent-brand)]" />
                      </div>
                    </div>
                    
                    {/* Content section */}
                    <div className="flex-1 flex flex-col justify-center">
                      <h3 className="mb-3 text-2xl font-bold tracking-tight text-white">
                        {t('toolNames.socialMediaPost')}
                      </h3>
                      <p className="text-base leading-relaxed text-neutral-300">
                        {t('toolDescriptions.socialMediaPost')}
                      </p>
                    </div>
                    
                    {/* Call to action */}
                    <div className="flex-shrink-0 flex items-center text-[var(--accent-brand)] transition-transform duration-300 group-hover:translate-x-2">
                      <span className="mr-2 text-base font-semibold">Try it now</span>
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="absolute w-64 h-56 bg-[var(--accent-brand)] blur-[90px] -left-1/2 -top-1/2 opacity-20 group-hover:opacity-40 transition-all duration-500"></div>
              </Link>
            </FadeIn>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
