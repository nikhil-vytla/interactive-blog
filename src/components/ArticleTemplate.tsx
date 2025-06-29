'use client';

import { ArticleConfig } from '@/types';
import PageLayout from './PageLayout';
import ContentSection from './ContentSection';
import Tag from './Tag';
import { getArticleReadingTime, formatReadingTime } from '@/utils/readingTime';

interface ArticleTemplateProps {
  config: ArticleConfig;
  className?: string;
}

const colorSchemes = {
  blue: {
    categoryBg: 'bg-blue-100 dark:bg-blue-900',
    categoryText: 'text-blue-800 dark:text-blue-200',
  },
  green: {
    categoryBg: 'bg-green-100 dark:bg-green-900',
    categoryText: 'text-green-800 dark:text-green-200',
  },
  purple: {
    categoryBg: 'bg-purple-100 dark:bg-purple-900',
    categoryText: 'text-purple-800 dark:text-purple-200',
  },
  red: {
    categoryBg: 'bg-red-100 dark:bg-red-900',
    categoryText: 'text-red-800 dark:text-red-200',
  },
  yellow: {
    categoryBg: 'bg-yellow-100 dark:bg-yellow-900',
    categoryText: 'text-yellow-800 dark:text-yellow-200',
  },
};

export default function ArticleTemplate({ config, className = "" }: ArticleTemplateProps) {
  const colors = colorSchemes[config.colorScheme || 'blue'];

  return (
    <PageLayout
      title={config.title}
      description={config.description}
      showHomeButton={true}
      className={className}
    >
      <article className="prose max-w-none">
        {/* Article Header */}
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <span className={`px-3 py-1 text-sm font-medium ${colors.categoryBg} ${colors.categoryText} rounded-full`}>
              {config.category}
            </span>
            <span className="text-sm text-muted">
              {formatReadingTime(getArticleReadingTime(config))}
            </span>
          </div>
          
          {config.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {config.tags.map((tag) => (
                <Tag
                  key={tag}
                  tag={tag}
                  size="sm"
                  href={`/tags/${encodeURIComponent(tag)}`}
                  variant="interactive"
                />
              ))}
            </div>
          )}
        </header>

        {/* Article Content */}
        <div className="space-y-8">
          {config.sections.map((section, index) => (
            <ContentSection
              key={index}
              section={section}
            />
          ))}
        </div>

        {/* Article Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-muted">
            Published on {new Date(config.publishedAt + 'T00:00:00').toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </footer>
      </article>
    </PageLayout>
  );
}