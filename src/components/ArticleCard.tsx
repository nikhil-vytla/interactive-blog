import Link from 'next/link';
import Button from '@/components/Button';
import { getArticleReadingTime } from '@/utils/readingTime';

interface ArticleCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  href: string;
  colorScheme: 'blue' | 'green' | 'purple' | 'red' | 'yellow';
}

const colorSchemes = {
  blue: {
    cardBg: 'bg-blue-50 dark:bg-blue-950/50',
    cardBorder: 'border-blue-200 dark:border-blue-800',
    categoryBg: 'bg-blue-100 dark:bg-blue-900',
    categoryText: 'text-blue-800 dark:text-blue-200',
    titleText: 'text-blue-900 dark:text-blue-100',
    descriptionText: 'text-blue-800 dark:text-blue-200',
    readingTimeText: 'text-blue-700 dark:text-blue-300',
  },
  green: {
    cardBg: 'bg-green-50 dark:bg-green-950/50',
    cardBorder: 'border-green-200 dark:border-green-800',
    categoryBg: 'bg-green-100 dark:bg-green-900',
    categoryText: 'text-green-800 dark:text-green-200',
    titleText: 'text-green-900 dark:text-green-100',
    descriptionText: 'text-green-800 dark:text-green-200',
    readingTimeText: 'text-green-700 dark:text-green-300',
  },
  purple: {
    cardBg: 'bg-purple-50 dark:bg-purple-950/50',
    cardBorder: 'border-purple-200 dark:border-purple-800',
    categoryBg: 'bg-purple-100 dark:bg-purple-900',
    categoryText: 'text-purple-800 dark:text-purple-200',
    titleText: 'text-purple-900 dark:text-purple-100',
    descriptionText: 'text-purple-800 dark:text-purple-200',
    readingTimeText: 'text-purple-700 dark:text-purple-300',
  },
  red: {
    cardBg: 'bg-red-50 dark:bg-red-950/50',
    cardBorder: 'border-red-200 dark:border-red-800',
    categoryBg: 'bg-red-100 dark:bg-red-900',
    categoryText: 'text-red-800 dark:text-red-200',
    titleText: 'text-red-900 dark:text-red-100',
    descriptionText: 'text-red-800 dark:text-red-200',
    readingTimeText: 'text-red-700 dark:text-red-300',
  },
  yellow: {
    cardBg: 'bg-yellow-50 dark:bg-yellow-950/50',
    cardBorder: 'border-yellow-200 dark:border-yellow-800',
    categoryBg: 'bg-yellow-100 dark:bg-yellow-900',
    categoryText: 'text-yellow-800 dark:text-yellow-200',
    titleText: 'text-yellow-900 dark:text-yellow-100',
    descriptionText: 'text-yellow-800 dark:text-yellow-200',
    readingTimeText: 'text-yellow-700 dark:text-yellow-300',
  },
};

export default function ArticleCard({ 
  id, 
  title, 
  description, 
  category, 
  href, 
  colorScheme 
}: ArticleCardProps) {
  const colors = colorSchemes[colorScheme];
  
  return (
    <article className={`${colors.cardBg} border ${colors.cardBorder} rounded-lg p-6 hover:shadow-lg transition-shadow`}>
      <div className="mb-4">
        <span className={`inline-block px-3 py-1 ${colors.categoryBg} ${colors.categoryText} text-sm font-medium rounded-full`}>
          {category}
        </span>
      </div>
      <h3 className={`text-xl font-semibold mb-3 ${colors.titleText}`}>
        {title}
      </h3>
      <p className={`${colors.descriptionText} mb-6`}>
        {description}
      </p>
      <div className="flex items-center justify-between">
        <Link href={href}>
          <Button variant="secondary" size="sm">
            Read Article →
          </Button>
        </Link>
        <span className={`text-sm ${colors.readingTimeText}`}>
          {getArticleReadingTime(id)}
        </span>
      </div>
    </article>
  );
} 