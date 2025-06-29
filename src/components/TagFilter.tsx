'use client';

import { useState, useMemo } from 'react';
import { ArticleConfig } from '@/types';
import Tag from './Tag';

interface TagFilterProps {
  articles: ArticleConfig[];
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  showCounts?: boolean;
  maxTags?: number;
  className?: string;
}

export default function TagFilter({
  articles,
  selectedTags,
  onTagsChange,
  showCounts = true,
  maxTags,
  className = ""
}: TagFilterProps) {
  const [showAll, setShowAll] = useState(false);

  // Get all available tags with their counts
  const tagStats = useMemo(() => {
    const tagCounts: Record<string, number> = {};
    
    articles.forEach(article => {
      article.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    return Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
  }, [articles]);

  const displayedTags = useMemo(() => {
    if (showAll || !maxTags) {
      return tagStats;
    }
    return tagStats.slice(0, maxTags);
  }, [tagStats, showAll, maxTags]);

  const handleTagClick = (tag: string) => {
    if (selectedTags.includes(tag)) {
      // Remove tag
      onTagsChange(selectedTags.filter(t => t !== tag));
    } else {
      // Add tag
      onTagsChange([...selectedTags, tag]);
    }
  };

  const handleClearAll = () => {
    onTagsChange([]);
  };

  if (tagStats.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Filter by Tags</h3>
        {selectedTags.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-sm text-muted hover:text-foreground transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {displayedTags.map(({ tag, count }) => (
          <Tag
            key={tag}
            tag={tag}
            variant={selectedTags.includes(tag) ? 'selected' : 'interactive'}
            showCount={showCounts}
            count={count}
            onClick={() => handleTagClick(tag)}
          />
        ))}
      </div>

      {maxTags && tagStats.length > maxTags && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-sm text-accent hover:text-accent/80 transition-colors"
        >
          {showAll ? 'Show less' : `Show ${tagStats.length - maxTags} more tags`}
        </button>
      )}

      {selectedTags.length > 0 && (
        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-muted mb-2">Active filters:</p>
          <div className="flex flex-wrap gap-2">
            {selectedTags.map(tag => (
              <Tag
                key={tag}
                tag={tag}
                variant="selected"
                size="sm"
                onClick={() => handleTagClick(tag)}
                className="cursor-pointer hover:opacity-80"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}