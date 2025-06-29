import { ArticleConfig } from '@/types';
import { getArticleReadingTime } from '@/utils/readingTime';

// Import all articles
import { pValuesConfig } from './articles/statistics/p-values';
import { kNearestNeighborsConfig } from './articles/machine-learning/k-nearest-neighbors';

// Article registry
export const articleRegistry: ArticleConfig[] = [
  pValuesConfig,
  kNearestNeighborsConfig,
];

// Content organization helpers
export const getArticleBySlug = (slug: string): ArticleConfig | undefined => {
  return articleRegistry.find(article => article.slug === slug);
};

export const getArticlesByCategory = (category: string): ArticleConfig[] => {
  return articleRegistry.filter(article => 
    article.category.toLowerCase() === category.toLowerCase()
  );
};

export const getArticlesByTag = (tag: string): ArticleConfig[] => {
  return articleRegistry.filter(article => 
    article.tags.some(t => t.toLowerCase() === tag.toLowerCase())
  );
};

export const getAllCategories = (): string[] => {
  return [...new Set(articleRegistry.map(article => article.category))];
};

export const getAllTags = (): string[] => {
  return [...new Set(articleRegistry.flatMap(article => article.tags))];
};

export const getArticleStats = () => {
  return {
    totalArticles: articleRegistry.length,
    categories: getAllCategories(),
    tags: getAllTags(),
    averageReadingTime: Math.round(
      articleRegistry.reduce((sum, article) => sum + getArticleReadingTime(article), 0) / 
      articleRegistry.length
    ),
  };
};

// Content validation
export const validateAllArticles = (): { valid: ArticleConfig[], invalid: { article: ArticleConfig, errors: string[] }[] } => {
  const valid: ArticleConfig[] = [];
  const invalid: { article: ArticleConfig, errors: string[] }[] = [];

  articleRegistry.forEach(article => {
    const errors = validateArticleConfig(article);
    if (errors.length === 0) {
      valid.push(article);
    } else {
      invalid.push({ article, errors });
    }
  });

  return { valid, invalid };
};

function validateArticleConfig(config: ArticleConfig): string[] {
  const errors: string[] = [];

  // Basic validation
  if (!config.id?.trim()) errors.push('Article ID is required');
  if (!config.title?.trim()) errors.push('Article title is required');
  if (!config.slug?.trim()) errors.push('Article slug is required');
  if (!config.category?.trim()) errors.push('Article category is required');
  if (!config.sections?.length) errors.push('Article must have at least one section');

  // Slug uniqueness
  const duplicateSlugs = articleRegistry.filter(a => a.slug === config.slug && a.id !== config.id);
  if (duplicateSlugs.length > 0) {
    errors.push(`Duplicate slug "${config.slug}" found`);
  }

  // Section validation
  config.sections?.forEach((section, index) => {
    if (!section.type) {
      errors.push(`Section ${index + 1}: type is required`);
    }

    switch (section.type) {
      case 'math':
        if (!section.mathExpression) {
          errors.push(`Section ${index + 1}: mathExpression is required for math sections`);
        }
        break;
      case 'alert':
        if (!section.content) {
          errors.push(`Section ${index + 1}: content is required for alert sections`);
        }
        break;
      case 'code':
      case 'interactive':
        if (!section.codeTemplate) {
          errors.push(`Section ${index + 1}: codeTemplate is required for ${section.type} sections`);
        }
        break;
    }
  });

  return errors;
}