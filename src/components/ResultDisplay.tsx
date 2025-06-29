/**
 * Unified component for displaying execution results, errors, and loading states
 */

interface ResultDisplayProps {
  /** The execution result/output to display */
  result?: string;
  /** Error message to display */
  error?: string;
  /** Whether the execution is currently in progress */
  isLoading?: boolean;
  /** Custom title for the result section */
  title?: string;
  /** Additional CSS classes */
  className?: string;
  /** Whether to show a loading spinner */
  showSpinner?: boolean;
}

/**
 * Displays execution results with consistent styling and loading states
 * 
 * @example
 * ```tsx
 * <ResultDisplay 
 *   result={output}
 *   error={errorMessage}
 *   isLoading={executing}
 *   title="Python Output"
 * />
 * ```
 */
export default function ResultDisplay({
  result,
  error,
  isLoading,
  title = "Result",
  className = "",
  showSpinner = true
}: ResultDisplayProps) {
  // Don't render anything if no content to show
  if (!result && !error && !isLoading) {
    return null;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Loading State */}
      {isLoading && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded">
          <div className="flex items-center space-x-2">
            {showSpinner && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            )}
            <p className="text-blue-700">
              {typeof result === 'string' && result ? result : 'Executing...'}
            </p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="p-4 bg-red-50 border border-red-200 rounded">
          <div className="flex items-start space-x-2">
            <svg
              className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <div className="flex-1">
              <h4 className="text-red-800 font-semibold mb-2">Error</h4>
              <pre className="text-red-700 text-sm whitespace-pre-wrap break-words">
                {error}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Success State */}
      {result && !error && !isLoading && (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded">
          <div className="flex items-start space-x-2">
            <svg
              className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <div className="flex-1">
              <h4 className="font-semibold mb-2 text-gray-800">{title}</h4>
              <pre className="text-sm whitespace-pre-wrap break-words text-gray-700">
                {result}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}