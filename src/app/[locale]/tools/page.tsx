'use client';

import { toolRegistry } from '@/config/tools';
import { useTranslations } from 'next-intl';
import { RetroGradient } from '@/components/backgrounds/retro-gradient';
import { FadeIn } from '@/components/animations/fade-in';
import { ToolCard } from '@/components/cards/tool-card';
import { BookOpen, Share2, Image, type LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  'book-open': BookOpen,
  'share-2': Share2,
  'image': Image,
};

export default function ToolsPage() {
  const t = useTranslations();
  const tools = toolRegistry.getAll();

  return (
    <>
      <RetroGradient />
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-6xl mx-auto">
          <FadeIn direction="up" className="mb-16 text-center">
            <h1 className="text-5xl md:text-6xl font-bold font-display retro-shadow mb-4">
              {t('tools.title')}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('tools.subtitle')}
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map((tool, index) => {
              const IconComponent = iconMap[tool.icon] || BookOpen;
              return (
                <FadeIn key={tool.id} delay={index * 0.1} direction="up" className="block">
                  <ToolCard
                    title={tool.name}
                    description={tool.description}
                    icon={IconComponent}
                    href={`/tools/${tool.id}`}
                    category={tool.category}
                    variantCount={tool.variants.length}
                    variantText={t('tools.seeMore')}
                  />
                </FadeIn>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
