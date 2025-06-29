import { execSync } from 'child_process';
import path from 'path';

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
 * Get word count for a specific article file
 * @param articleId - The article identifier
 * @returns Word count from the actual file
 */
function getArticleWordCount(articleId: string): number {
    const filePath = path.join(process.cwd(), 'src', 'app', 'blog', articleId, 'page.tsx');
    const output = execSync(`wc -w "${filePath}"`, { encoding: 'utf8' });
    const wordCount = parseInt(output.trim().split(/\s+/)[0]);
    return wordCount;
}

/**
 * Get reading time for a specific article
 * @param articleId - The article identifier
 * @returns Formatted reading time string
 */
export function getArticleReadingTime(articleId: string): string {
  const wordCount = getArticleWordCount(articleId);
  const minutes = calculateReadingTime(wordCount);
  return formatReadingTime(minutes);
} 