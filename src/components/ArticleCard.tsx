'use client';

import Link from 'next/link';
import { ArticleConfig } from '@/types';
import Tag from './Tag';
import Button from './Button';
import { getArticleReadingTime, formatReadingTime } from '@/utils/readingTime';

interface ArticleCardProps {
  article: ArticleConfig;
  showTags?: boolean;
  className?: string;
}

const colorSchemes = {
  blue: {
    cardBg: 'bg-blue-50 dark:bg-blue-950/50',
    cardBorder: 'border-blue-200 dark:border-blue-800',
    categoryBg: 'bg-blue-100 dark:bg-blue-900',
    categoryText: 'text-blue-800 dark:text-blue-200',
    titleText: 'text-blue-900 dark:text-blue-100',
    descriptionText: 'text-blue-800 dark:text-blue-200',
    readingTimeText: 'text-blue-700 dark:text-blue-300',
  },
  green: {
    cardBg: 'bg-green-50 dark:bg-green-950/50',
    cardBorder: 'border-green-200 dark:border-green-800',
    categoryBg: 'bg-green-100 dark:bg-green-900',
    categoryText: 'text-green-800 dark:text-green-200',
    titleText: 'text-green-900 dark:text-green-100',
    descriptionText: 'text-green-800 dark:text-green-200',
    readingTimeText: 'text-green-700 dark:text-green-300',
  },
  purple: {
    cardBg: 'bg-purple-50 dark:bg-purple-950/50',
    cardBorder: 'border-purple-200 dark:border-purple-800',
    categoryBg: 'bg-purple-100 dark:bg-purple-900',
    categoryText: 'text-purple-800 dark:text-purple-200',
    titleText: 'text-purple-900 dark:text-purple-100',
    descriptionText: 'text-purple-800 dark:text-purple-200',
    readingTimeText: 'text-purple-700 dark:text-purple-300',
  },
  red: {
    cardBg: 'bg-red-50 dark:bg-red-950/50',
    cardBorder: 'border-red-200 dark:border-red-800',
    categoryBg: 'bg-red-100 dark:bg-red-900',
    categoryText: 'text-red-800 dark:text-red-200',
    titleText: 'text-red-900 dark:text-red-100',
    descriptionText: 'text-red-800 dark:text-red-200',
    readingTimeText: 'text-red-700 dark:text-red-300',
  },
  yellow: {
    cardBg: 'bg-yellow-50 dark:bg-yellow-950/50',
    cardBorder: 'border-yellow-200 dark:border-yellow-800',
    categoryBg: 'bg-yellow-100 dark:bg-yellow-900',
    categoryText: 'text-yellow-800 dark:text-yellow-200',
    titleText: 'text-yellow-900 dark:text-yellow-100',
    descriptionText: 'text-yellow-800 dark:text-yellow-200',
    readingTimeText: 'text-yellow-700 dark:text-yellow-300',
  },
};

export default function ArticleCard({ 
  article, 
  showTags = true,
  className = "" 
}: ArticleCardProps) {
  const colors = colorSchemes[article.colorScheme || 'blue'];
  
  return (
    <article className={`${colors.cardBg} border ${colors.cardBorder} rounded-lg p-6 hover:shadow-lg transition-shadow ${className} flex flex-col`}>
      <div className="flex-grow">
      <div className="mb-4">
        <span className={`inline-block px-3 py-1 ${colors.categoryBg} ${colors.categoryText} text-sm font-medium rounded-full`}>
          {article.category}
        </span>
      </div>
      <h3 className={`text-xl font-semibold mb-3 ${colors.titleText}`}>
        {article.title}
      </h3>
      <p className={`${colors.descriptionText} mb-6 line-clamp-3`}>
        {article.description}
      </p>
      {showTags && article.tags && article.tags.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {article.tags.slice(0, 3).map(tag => (
              <Tag
                key={tag}
                tag={tag}
                size="sm"
                href={`/tags/${encodeURIComponent(tag)}`}
                className="hover:opacity-80"
              />
            ))}
            {article.tags.length > 3 && (
              <span className="text-xs text-muted">
                +{article.tags.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}
      </div>
      <div className="flex items-center justify-between mt-auto">
        <Link href={`/blog/${article.slug}`}>
          <Button variant="card" size="sm" colorScheme={article.colorScheme || 'blue'}>
            Read Article →
          </Button>
        </Link>
        <span className={`text-sm ${colors.readingTimeText}`}>
          {formatReadingTime(getArticleReadingTime(article))}
        </span>
      </div>
    </article>
  );
}
