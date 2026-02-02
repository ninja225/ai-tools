'use client';

import { toolRegistry } from '@/config/tools';
import { notFound } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { RetroGradient } from '@/components/backgrounds/retro-gradient';
import { FadeIn } from '@/components/animations/fade-in';
import { VariantCard } from '@/components/cards/variant-card';
import { BookOpen, Share2, Image, BookText, Zap, Sparkles, Palette, type LucideIcon } from 'lucide-react';
import { useState, use } from 'react';

const iconMap: Record<string, LucideIcon> = {
  'book-open': BookOpen,
  'share-2': Share2,
  'image': Image,
};

const lucideIconMap: Record<string, LucideIcon> = {
  'book-text': BookText,
  'zap': Zap,
  'sparkles': Sparkles,
  'palette': Palette,
};

interface PageProps {
  params: Promise<{ toolId: string; locale: string }>;
}

export default function ToolPage({ params }: PageProps) {
  const { toolId } = use(params);
  const tool = toolRegistry.getById(toolId);
  const t = useTranslations();
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);

  if (!tool) {
    notFound();
  }

  const IconComponent = iconMap[tool.icon] || BookOpen;

  return (
    <>
      <RetroGradient />
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-6xl mx-auto">
          <FadeIn direction="up" className="mb-12 text-center">
            <div className="inline-flex items-center justify-center mb-6">
            </div>
            <h1 className="text-5xl md:text-6xl font-bold font-display retro-shadow mb-4">
              {tool.name}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {tool.description}
            </p>
          </FadeIn>

          <FadeIn direction="up" className="mb-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold font-display text-center mb-8">
              {t('tools.chooseVariant')}
            </h2>
        </div>
        </FadeIn> 

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {tool.variants.map((variant, index) => {
              const variantLucideIcon = variant.lucideIcon ? lucideIconMap[variant.lucideIcon] : undefined;
              return (
                <FadeIn key={variant.id} delay={index * 0.1} direction="up">
                  <VariantCard
                    name={variant.name}
                    description={variant.description}
                    customIconPath={variant.customIconPath}
                    simpleIcon={variant.icon}
                    lucideIconName={variant.lucideIcon}
                    icon={variantLucideIcon || (!variant.icon && !variant.customIconPath && !variant.lucideIcon ? IconComponent : undefined)}
                    onClick={() => setSelectedVariant(variant.id)}
                  />
                </FadeIn>
              );
            })}
          </div>

          {selectedVariant && (
            <FadeIn direction="up" className="mt-12">
              <div className="bg-card/90 backdrop-blur-md p-8 rounded-2xl border border-white/5">
                <p className="text-center text-muted-foreground">
                  Tool interface for <strong className="text-[var(--accent-brand)]">{tool.variants.find(v => v.id === selectedVariant)?.name}</strong> will be implemented next.
                </p>
              </div>
            </FadeIn>
          )}
        </div>
      </div>
    </>
  );
}
