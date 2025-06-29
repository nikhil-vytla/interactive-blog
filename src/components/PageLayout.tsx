'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PageLayoutProps } from '@/types';

/**
 * Layout component for consistent page structure across the application.
 * Provides navigation, header, and footer sections with responsive design.
 * 
 * @param props - The component props
 * @returns The rendered page layout
 * 
 * @example
 * ```tsx
 * <PageLayout 
 *   title="Demo Page" 
 *   description="Interactive demonstrations"
 *   showHomeButton={true}
 * >
 *   <div>Your page content here</div>
 * </PageLayout>
 * ```
 */
export default function PageLayout({
  children,
  title,
  description,
  showHomeButton = true,
  showTopNavigation = true,
  className = ''
}: PageLayoutProps) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <div className={`max-w-6xl mx-auto px-6 py-12 ${className}`}>
      {/* Top Navigation */}
      {showTopNavigation && !isHomePage && (
        <nav className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-accent hover:text-accent/80 transition-colors font-medium"
          >
            ← Back to Home
          </Link>
        </nav>
      )}

      {/* Page Header */}
      {(title || description) && (
        <header className="mb-12">
          {title && <h1 className="text-4xl font-bold mb-4">{title}</h1>}
          {description && (
            <p className="text-muted text-lg leading-relaxed">{description}</p>
          )}
        </header>
      )}

      {/* Main Content */}
      <main>
        {children}
      </main>

      {/* Bottom Navigation */}
      {showHomeButton && !isHomePage && (
        <footer className="text-center pt-8 border-t border-border mt-12">
          <Link 
            href="/" 
            className="inline-block px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors font-medium"
          >
            ← Back to Home
          </Link>
        </footer>
      )}
    </div>
  );
} 