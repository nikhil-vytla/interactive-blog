'use client';

import { ErrorBoundary } from './ErrorBoundary';

/**
 * Client-side error boundary wrapper for use in server components
 * This allows us to wrap client components with error handling
 */
export default function ClientErrorBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // Log error in development
        if (process.env.NODE_ENV === 'development') {
          console.group('🚨 Error Boundary Caught Error');
          console.error('Error:', error);
          console.error('Error Info:', errorInfo);
          console.groupEnd();
        }
      }}
    >
      {children}
    </ErrorBoundary>
  );
}