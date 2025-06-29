'use client';

import { useState, useMemo } from 'react';
import { articleRegistry } from '@/content';
import PageLayout from '@/components/PageLayout';
import TagFilter from '@/components/TagFilter';
import ArticleList from '@/components/ArticleList';


export default function TagsPageClient() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  

  // Filter articles based on selected tags
  const filteredArticles = useMemo(() => {
    if (selectedTags.length === 0) {
      return articleRegistry;
    }

    return articleRegistry.filter(article =>
      selectedTags.some(tag => article.tags.includes(tag))
    );
  }, [selectedTags]);

  return (
    <PageLayout
      title="Browse Articles by Tags"
      description="Discover articles by topics and themes that interest you"
      showHomeButton={true}
    >
      <div className="space-y-8">
        

        

        {/* Filter Controls */}
        <TagFilter
          articles={articleRegistry}
          selectedTags={selectedTags}
          onTagsChange={setSelectedTags}
          showCounts={true}
          maxTags={10}
        />

        {/* Results */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-foreground">
              {selectedTags.length === 0 ? 'All Articles' : 'Filtered Articles'}
            </h2>
            <span className="text-muted">
              {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''} found
            </span>
          </div>

          <ArticleList
            articles={filteredArticles}
            emptyMessage={
              selectedTags.length > 0
                ? `No articles found with the selected tags: ${selectedTags.join(', ')}`
                : "No articles available."
            }
          />
        </div>
      </div>
    </PageLayout>
  );
}