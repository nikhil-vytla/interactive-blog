import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  showHomeButton?: boolean;
  showTopNavigation?: boolean;
  className?: string;
}

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