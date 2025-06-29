'use client';

import Link from 'next/link';

interface TagProps {
  tag: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'interactive' | 'selected';
  showCount?: boolean;
  count?: number;
  href?: string;
  onClick?: () => void;
  className?: string;
}

export default function Tag({ 
  tag, 
  size = 'md', 
  variant = 'default',
  showCount = false,
  count,
  href,
  onClick,
  className = "" 
}: TagProps) {
  const baseClasses = "inline-flex items-center font-medium rounded-full transition-colors";
  
  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base"
  };

  const variantClasses = {
    default: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300",
    interactive: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer",
    selected: "bg-accent text-white"
  };

  const classes = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;

  const content = (
    <>
      {tag}
      {showCount && count !== undefined && (
        <span className="ml-1 text-xs opacity-75">
          ({count})
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button onClick={onClick} className={classes}>
        {content}
      </button>
    );
  }

  return (
    <span className={classes}>
      {content}
    </span>
  );
}