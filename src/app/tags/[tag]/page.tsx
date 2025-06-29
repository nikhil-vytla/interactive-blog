import { getArticlesByTag, getAllTags } from '@/content';
import TagPageClient from './TagPageClient';

interface TagPageProps {
  params: Promise<{ tag: string }>;
}

// Generate static params for all available tags
export async function generateStaticParams() {
  const allTags = getAllTags();
  
  return allTags.map((tag) => ({
    tag: encodeURIComponent(tag),
  }));
}

// Generate metadata for each tag page
export async function generateMetadata({ params }: TagPageProps) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const taggedArticles = getArticlesByTag(decodedTag);
  
  return {
    title: `Articles tagged "${decodedTag}" - Interactive Blog`,
    description: `Explore ${taggedArticles.length} article${taggedArticles.length !== 1 ? 's' : ''} about ${decodedTag}. Learn mathematics, statistics, and machine learning through interactive content.`,
    keywords: [decodedTag, 'interactive learning', 'mathematics', 'statistics', 'machine learning'],
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  
  return <TagPageClient tag={tag} />;
}