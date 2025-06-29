'use client';

import { ArticleConfig } from '@/types';
import ArticleCard from './ArticleCard';

interface ArticleListProps {
  articles: ArticleConfig[];
  emptyMessage?: string;
  className?: string;
}

export default function ArticleList({ 
  articles, 
  emptyMessage = "No articles found.",
  className = "" 
}: ArticleListProps) {
  if (articles.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-gray-400 text-6xl mb-4">📚</div>
        <h3 className="text-xl font-semibold text-foreground mb-2">No Articles Found</h3>
        <p className="text-muted">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`grid md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {articles.map((article) => (
        <ArticleCard
          key={article.id}
          article={article}
        />
      ))}
    </div>
  );
}