/**
 * Reusable button component with consistent styling and variants
 */

import { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'card';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ColorScheme = 'blue' | 'green' | 'purple' | 'red' | 'yellow';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant */
  variant?: ButtonVariant;
  /** Size variant */
  size?: ButtonSize;
  /** Content to display inside the button */
  children: ReactNode;
  /** Whether the button is in a loading state */
  loading?: boolean;
  /** Icon to display before the text */
  icon?: ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Color scheme for ghost variant */
  colorScheme?: ColorScheme;
}

/**
 * Reusable button component with consistent styling across the application
 * 
 * @example
 * ```tsx
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   Run Code
 * </Button>
 * 
 * <Button variant="danger" loading={isDeleting}>
 *   Delete
 * </Button>
 * ```
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  loading = false,
  icon,
  className = '',
  disabled,
  colorScheme = 'blue',
  ...props
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'bg-accent text-white hover:bg-accent/90 focus:ring-accent/50',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    ghost: 'bg-transparent text-accent hover:bg-accent/10 focus:ring-accent/50 border border-transparent hover:border-accent/20',
    card: `bg-${colorScheme}-100 dark:bg-${colorScheme}-900 text-${colorScheme}-800 dark:text-${colorScheme}-200 hover:bg-${colorScheme}-200 dark:hover:bg-${colorScheme}-800 focus:ring-${colorScheme}-500`,
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
  };

  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const isDisabled = disabled || loading;

  return (
    <button
      {...props}
      disabled={isDisabled}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
    >
      {/* Loading Spinner */}
      {loading && (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
      )}
      
      {/* Icon */}
      {icon && !loading && (
        <span className="mr-2">{icon}</span>
      )}
      
      {/* Button Text */}
      <span>{children}</span>
    </button>
  );
}

/**
 * Specialized run button for code execution
 */
export function RunButton({ 
  isRunning = false, 
  onClick,
  disabled,
  ...props 
}: {
  isRunning?: boolean;
  onClick?: () => void;
  disabled?: boolean;
} & Omit<ButtonProps, 'children' | 'loading' | 'variant'>) {
  return (
    <Button
      variant="primary"
      size="sm"
      loading={isRunning}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {isRunning ? 'Running...' : 'Run'}
    </Button>
  );
}

/**
 * Navigation button for page links
 */
export function NavButton({ 
  children, 
  href,
  ...props 
}: ButtonProps & { href?: string }) {
  const buttonProps = {
    variant: 'primary' as const,
    size: 'lg' as const,
    className: 'no-underline',
    ...props
  };

  if (href) {
    return (
      <a href={href} className="inline-block">
        <Button {...buttonProps}>{children}</Button>
      </a>
    );
  }

  return <Button {...buttonProps}>{children}</Button>;
}