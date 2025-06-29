'use client';

import { getArticlesByTag, getAllTags } from '@/content';
import PageLayout from '@/components/PageLayout';
import ArticleList from '@/components/ArticleList';
import Tag from '@/components/Tag';
import Link from 'next/link';
import Button from '@/components/Button';

interface TagPageClientProps {
  tag: string;
}

export default function TagPageClient({ tag }: TagPageClientProps) {
  const decodedTag = decodeURIComponent(tag);
  
  // Get articles for this tag
  const taggedArticles = getArticlesByTag(decodedTag);
  
  // Get related tags (tags that appear with this tag)
  const relatedTags = Array.from(
    new Set(
      taggedArticles
        .flatMap(article => article.tags)
        .filter(t => t !== decodedTag)
    )
  ).slice(0, 8); // Limit to 8 related tags

  // Get all tags for "explore more" section
  const allTags = getAllTags().filter(t => t !== decodedTag).slice(0, 10);

  if (taggedArticles.length === 0) {
    return (
      <PageLayout
        title={`Tag: ${decodedTag}`}
        description={`No articles found for tag "${decodedTag}"`}
        showHomeButton={true}
      >
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🏷️</div>
          <h1 className="text-3xl font-bold mb-4 text-foreground">
            Tag: &quot;{decodedTag}&quot;
          </h1>
          <p className="text-xl text-muted mb-8">
            No articles found with this tag.
          </p>
          <div className="space-y-4">
            <Link href="/tags">
              <Button>Browse All Tags</Button>
            </Link>
            <div className="flex flex-wrap gap-2 justify-center">
              {allTags.map(availableTag => (
                <Tag
                  key={availableTag}
                  tag={availableTag}
                  href={`/tags/${encodeURIComponent(availableTag)}`}
                  variant="interactive"
                />
              ))}
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title={`Articles tagged "${decodedTag}"`}
      description={`Explore ${taggedArticles.length} article${taggedArticles.length !== 1 ? 's' : ''} about ${decodedTag}`}
      showHomeButton={true}
    >
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mb-4">
            <Tag tag={decodedTag} size="lg" variant="selected" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-foreground">
            Articles about &quot;{decodedTag}&quot;
          </h1>
          <p className="text-xl text-muted">
            {taggedArticles.length} article{taggedArticles.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-4 text-sm text-muted">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span>›</span>
          <Link href="/tags" className="hover:text-foreground transition-colors">
            Tags
          </Link>
          <span>›</span>
          <span className="text-foreground">{decodedTag}</span>
        </div>

        {/* Articles */}
        <ArticleList articles={taggedArticles} />

        {/* Related Tags */}
        {relatedTags.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-foreground">
              Related Tags
            </h2>
            <div className="flex flex-wrap gap-2">
              {relatedTags.map(relatedTag => (
                <Tag
                  key={relatedTag}
                  tag={relatedTag}
                  href={`/tags/${encodeURIComponent(relatedTag)}`}
                  variant="interactive"
                />
              ))}
            </div>
          </div>
        )}

        {/* Explore More */}
        <div className="text-center pt-8 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-foreground">
            Explore More Topics
          </h3>
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {allTags.map(otherTag => (
              <Tag
                key={otherTag}
                tag={otherTag}
                href={`/tags/${encodeURIComponent(otherTag)}`}
                variant="interactive"
                size="sm"
              />
            ))}
          </div>
          <Link href="/tags">
            <Button variant="ghost">
              View All Tags →
            </Button>
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}