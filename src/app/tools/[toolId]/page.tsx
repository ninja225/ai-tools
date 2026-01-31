import { toolRegistry } from '@/config/tools';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface PageProps {
  params: Promise<{ toolId: string }>;
}

export default async function ToolPage({ params }: PageProps) {
  const { toolId } = await params;
  const tool = toolRegistry.getById(toolId);

  if (!tool) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link
            href="/tools"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tools
          </Link>
          <h1 className="text-4xl font-bold">{tool.name}</h1>
          <p className="text-muted-foreground mt-2">{tool.description}</p>
        </div>

        <div className="bg-muted/50 p-6 rounded-lg">
          <p className="text-center text-muted-foreground">
            Tool interface will be implemented next. This tool has {tool.variants.length} variants available.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            {tool.variants.map((variant) => (
              <span
                key={variant.id}
                className="px-3 py-1 rounded-full bg-card border text-sm"
              >
                {variant.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
