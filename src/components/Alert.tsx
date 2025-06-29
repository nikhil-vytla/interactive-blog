'use client';

import { ReactNode } from 'react';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error' | 'note';

interface AlertProps {
  variant: AlertVariant;
  title?: string;
  children: ReactNode;
  className?: string;
}

const alertStyles = {
  info: {
    container: 'bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded-lg',
    title: 'text-blue-900 dark:text-blue-100 font-semibold',
    content: 'text-blue-800 dark:text-blue-200',
    icon: '💡'
  },
  success: {
    container: 'bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-800 rounded-lg',
    title: 'text-green-900 dark:text-green-100 font-semibold',
    content: 'text-green-800 dark:text-green-200',
    icon: '✅'
  },
  warning: {
    container: 'bg-yellow-50 dark:bg-yellow-950/50 border border-yellow-200 dark:border-yellow-800 rounded-lg',
    title: 'text-yellow-900 dark:text-yellow-100 font-semibold',
    content: 'text-yellow-800 dark:text-yellow-200',
    icon: '⚠️'
  },
  error: {
    container: 'bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg',
    title: 'text-red-900 dark:text-red-100 font-semibold',
    content: 'text-red-800 dark:text-red-200',
    icon: '❌'
  },
  note: {
    container: 'bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg',
    title: 'text-gray-900 dark:text-gray-100 font-semibold',
    content: 'text-gray-800 dark:text-gray-200',
    icon: '📝'
  }
};

/**
 * Reusable alert component for displaying different types of notifications
 * 
 * @param variant - The visual style variant (info, success, warning, error, note)
 * @param title - Optional title text
 * @param children - Content of the alert
 * @param className - Additional CSS classes
 */
export function Alert({ variant, title, children, className = '' }: AlertProps) {
  const styles = alertStyles[variant];
  
  return (
    <div className={`p-6 ${styles.container} ${className}`}>
      <div className="flex items-start gap-3">
        <span className="text-xl leading-none mt-0.5 flex-shrink-0" aria-hidden="true">
          {styles.icon}
        </span>
        <div className="flex-1 min-w-0">
          {title && (
            <h3 className={`mb-2 text-lg leading-tight ${styles.title}`}>
              {title}
            </h3>
          )}
          <div className={`leading-relaxed ${styles.content}`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Pre-configured alert variants for common use cases
 */
export const AlertVariants = {
  /** For incorrect statements or misconceptions */
  Wrong: ({ title, children, className }: Omit<AlertProps, 'variant'>) => (
    <Alert variant="error" title={title || 'Incorrect'} className={className}>
      {children}
    </Alert>
  ),
  
  /** For correct statements or proper explanations */
  Correct: ({ title, children, className }: Omit<AlertProps, 'variant'>) => (
    <Alert variant="success" title={title || 'Correct'} className={className}>
      {children}
    </Alert>
  ),
  
  /** For informational content and definitions */
  Info: ({ title, children, className }: Omit<AlertProps, 'variant'>) => (
    <Alert variant="info" title={title || 'Information'} className={className}>
      {children}
    </Alert>
  ),
  
  /** For important warnings or cautions */
  Warning: ({ title, children, className }: Omit<AlertProps, 'variant'>) => (
    <Alert variant="warning" title={title || 'Important'} className={className}>
      {children}
    </Alert>
  ),
  
  /** For general notes and observations */
  Note: ({ title, children, className }: Omit<AlertProps, 'variant'>) => (
    <Alert variant="note" title={title || 'Note'} className={className}>
      {children}
    </Alert>
  ),
  
  /** For displaying calculation or simulation results */
  Results: ({ title, children, className }: Omit<AlertProps, 'variant'>) => (
    <Alert variant="note" title={title || 'Results'} className={className}>
      {children}
    </Alert>
  ),
  
  /** For key takeaways and summaries */
  Takeaways: ({ title, children, className }: Omit<AlertProps, 'variant'>) => (
    <Alert variant="info" title={title || 'Key Takeaways'} className={className}>
      {children}
    </Alert>
  ),
  
  /** For mathematical definitions and formal statements */
  Definition: ({ title, children, className }: Omit<AlertProps, 'variant'>) => (
    <Alert variant="info" title={title || 'Definition'} className={className}>
      {children}
    </Alert>
  )
};