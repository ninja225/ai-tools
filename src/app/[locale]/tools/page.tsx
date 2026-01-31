import { toolRegistry } from '@/config/tools';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function ToolsPage() {
  const t = useTranslations();
  const tools = toolRegistry.getAll();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link
            href="../"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('tools.backToHome')}
          </Link>
          <h1 className="text-4xl font-bold">{t('tools.title')}</h1>
          <p className="text-muted-foreground mt-2">
            {t('tools.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <Link
              key={tool.id}
              href={`/tools/${tool.id}`}
              className="group p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow"
            >
              <div className="mb-4">
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                  {tool.category}
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{tool.name}</h3>
              <p className="text-muted-foreground text-sm mb-4">
                {tool.description}
              </p>
              <div className="text-xs text-muted-foreground">
                {t('tools.variantsAvailable', { count: tool.variants.length })}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
