import { ArticleConfig } from '@/types';

/**
 * Simplified reading time utilities following KISS principle
 * Removed complex shell command execution
 */

/**
 * Calculate estimated reading time based on word count
 * @param wordCount - Total number of words in the content
 * @param wordsPerMinute - Average reading speed (default: 200 for technical content)
 * @returns Estimated reading time in minutes
 */
export function calculateReadingTime(wordCount: number, wordsPerMinute: number = 200): number {
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * Format reading time for display
 * @param minutes - Reading time in minutes
 * @returns Formatted string like "~5 min read"
 */
export function formatReadingTime(minutes: number): string {
  return `~${minutes} min read`;
}

/**
 * Calculate word count from text content
 * @param text - The text content to count words in
 * @returns Number of words
 */
export function getWordCount(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

/**
 * Calculate reading time from text content
 * @param content - The text content
 * @param wordsPerMinute - Average reading speed (default: 200)
 * @returns Estimated reading time in minutes
 */
export function getReadingTimeFromContent(content: string, wordsPerMinute: number = 200): number {
  const wordCount = getWordCount(content);
  return calculateReadingTime(wordCount, wordsPerMinute);
}

/**
 * Calculate reading time from article configuration
 * @param article - The article configuration
 * @returns Estimated reading time in minutes
 */
export function getArticleReadingTime(article: ArticleConfig): number {
  let totalWords = 0;
  
  // Count words from title and description
  totalWords += getWordCount(article.title);
  totalWords += getWordCount(article.description);
  
  // Count words from all sections
  article.sections.forEach(section => {
    if (section.content) {
      // Strip HTML tags for word counting
      const textContent = section.content.replace(/<[^>]*>/g, ' ');
      totalWords += getWordCount(textContent);
    }
    if (section.title) {
      totalWords += getWordCount(section.title);
    }
    // Add some words for interactive sections (code, math, etc.)
    if (section.type === 'interactive' || section.type === 'code') {
      totalWords += 50; // Estimate for code/interactive content
    }
  });
  
  return calculateReadingTime(totalWords);
}

// Removed getFormattedReadingTime to avoid circular dependency
// Components should use getArticleReadingTime directly with the article object 