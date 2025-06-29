'use client';

import ArticleTemplate from '@/components/ArticleTemplate';
import { kNearestNeighborsConfig } from '@/content/articles/machine-learning/k-nearest-neighbors';

export default function KNearestNeighborsV2Page() {
  return <ArticleTemplate config={kNearestNeighborsConfig} />;
}