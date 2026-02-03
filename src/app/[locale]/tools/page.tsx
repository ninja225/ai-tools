'use client';

import { useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toolRegistry } from '@/config/tools';
import { useTranslations } from 'next-intl';
import { RetroGradient } from '@/components/backgrounds/retro-gradient';
import { FadeIn } from '@/components/animations/fade-in';
import { ToolCard } from '@/components/cards/tool-card';
import { CategoryFilter, type ToolCategory } from '@/components/tools/category-filter';
import { EmptyState } from '@/components/tools/empty-state';
import { BookOpen, Share2, Image, type LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  'book-open': BookOpen,
  'share-2': Share2,
  'image': Image,
};

export default function ToolsPage() {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tools = toolRegistry.getAll();
  
  // Get category from URL or default to 'all'
  const categoryParam = searchParams.get('category') as ToolCategory | null;
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>(categoryParam || 'all');

  // Filter tools based on selected category
  const filteredTools = useMemo(() => {
    if (selectedCategory === 'all') {
      return tools;
    }
    return tools.filter(tool => tool.category === selectedCategory);
  }, [tools, selectedCategory]);

  // Calculate tool counts per category
  const categoryCounts = useMemo(() => {
    return {
      all: tools.length,
      content: tools.filter(t => t.category === 'content').length,
      social: tools.filter(t => t.category === 'social').length,
      analysis: tools.filter(t => t.category === 'analysis').length,
    };
  }, [tools]);

  // Handle category change
  const handleCategoryChange = (category: ToolCategory) => {
    setSelectedCategory(category);
    
    // Update URL with category parameter
    const params = new URLSearchParams(searchParams.toString());
    if (category === 'all') {
      params.delete('category');
    } else {
      params.set('category', category);
    }
    
    const newUrl = params.toString() ? `/tools?${params.toString()}` : '/tools';
    router.replace(newUrl, { scroll: false });
  };

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

          {/* Category Filter */}
          <CategoryFilter
            selected={selectedCategory}
            onCategoryChange={handleCategoryChange}
            counts={categoryCounts}
          />

          {/* Tools Grid or Empty State */}
          {filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTools.map((tool, index) => {
                const IconComponent = iconMap[tool.icon] || BookOpen;
                return (
                  <FadeIn 
                    key={tool.id} 
                    delay={index * 0.1} 
                    direction="up" 
                    className="block"
                  >
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
          ) : (
            <EmptyState 
              category={selectedCategory !== 'all' ? selectedCategory : undefined}
            />
          )}
        </div>
      </div>
    </>
  );
}
