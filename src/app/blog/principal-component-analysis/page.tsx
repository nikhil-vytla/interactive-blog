'use client';

import ArticleTemplate from '@/components/ArticleTemplate';
import { pcaConfig } from '@/content/articles/machine-learning/pca';

export default function PCAPage() {
  return <ArticleTemplate config={pcaConfig} />;
}
