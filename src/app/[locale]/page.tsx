import Link from 'next/link';
import { BookOpen, Share2, Image } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations();

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">
            {t('home.title')}
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            {t('home.subtitle')}
          </p>
          <Link
            href="./tools"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-8 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            {t('home.exploreTools')}
          </Link>
        </div>

        {/* Featured Tools */}
        <div className="grid md:grid-cols-3 gap-6">
          <Link
            href="./tools/story-creator"
            className="group p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow"
          >
            <BookOpen className="w-12 h-12 mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">{t('toolNames.storyCreator')}</h3>
            <p className="text-muted-foreground">
              {t('toolDescriptions.storyCreator')}
            </p>
          </Link>

          <Link
            href="./tools/social-media-post"
            className="group p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow"
          >
            <Share2 className="w-12 h-12 mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">{t('toolNames.socialMediaPost')}</h3>
            <p className="text-muted-foreground">
              {t('toolDescriptions.socialMediaPost')}
            </p>
          </Link>

          <Link
            href="./tools/image-prompt"
            className="group p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow"
          >
            <Image className="w-12 h-12 mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">{t('toolNames.imagePrompt')}</h3>
            <p className="text-muted-foreground">
              {t('toolDescriptions.imagePrompt')}
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
