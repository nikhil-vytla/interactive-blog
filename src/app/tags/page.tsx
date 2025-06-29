import TagsPageClient from './TagsPageClient';

// Metadata for the tags index page
export const metadata = {
  title: 'Browse Articles by Tags - Interactive Blog',
  description: 'Discover educational content organized by topics. Filter articles about mathematics, statistics, and machine learning by tags.',
  keywords: ['tags', 'topics', 'mathematics', 'statistics', 'machine learning', 'interactive learning'],
};

export default function TagsPage() {
  return <TagsPageClient />;
}