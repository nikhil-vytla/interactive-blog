'use client';

import { useRef, useEffect } from 'react';
import CodeEditor from './CodeEditor';
import { usePlotlyExecution } from '@/lib/pyodide-plotly';
import { EditableRange } from '@/types';
import { ErrorBoundary } from './ErrorBoundary';

/**
 * Props for the PlotlyCodeEditor component
 */
interface PlotlyCodeEditorProps {
  /** Initial Python code to display in the editor */
  initialCode: string;
  /** Array of character ranges that should be read-only */
  editableRanges: EditableRange[];
  /** Additional CSS classes for the editor container */
  className?: string;
  /** Height of the plot container (default: '500px') */
  plotHeight?: string;
  /** Additional CSS classes for the plot container */
  plotClassName?: string;
}

/**
 * Interactive code editor component specifically designed for Plotly visualizations.
 * Allows users to edit specific portions of Python code and execute it to generate plots.
 * 
 * Features:
 * - Selective code editing with read-only regions
 * - Real-time Python execution using Pyodide
 * - Interactive Plotly chart generation
 * - Error handling and loading states
 * 
 * @param props - The component props
 * @returns The rendered code editor with plot output
 * 
 * @example
 * ```tsx
 * <PlotlyCodeEditor
 *   initialCode={pythonCode}
 *   editableRanges={[{ from: 100, to: 200 }]}
 *   plotHeight="400px"
 * />
 * ```
 */
export default function PlotlyCodeEditor({
  initialCode,
  editableRanges,
  className = '',
  plotHeight = '500px',
  plotClassName = ''
}: PlotlyCodeEditorProps) {
  const plotRef = useRef<HTMLDivElement>(null);
  const { isLoading, result, error, executeCode } = usePlotlyExecution();

  // Add resize observer to handle dynamic resizing
  useEffect(() => {
    if (!plotRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      const windowWithPlotly = window as unknown as { Plotly?: { Plots?: { resize: (element: HTMLElement) => void } } };
      if (plotRef.current && windowWithPlotly.Plotly?.Plots?.resize) {
        try {
          windowWithPlotly.Plotly.Plots.resize(plotRef.current);
        } catch {
          // Ignore resize errors for non-plotly elements
        }
      }
    });

    resizeObserver.observe(plotRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const handleRun = async (code: string) => {
    await executeCode(code, plotRef);
  };

  return (
    <ErrorBoundary 
      onError={(error, errorInfo) => {
        if (process.env.NODE_ENV === 'development') {
          console.group('🚨 PlotlyCodeEditor Error');
          console.error('Error:', error);
          console.error('Error Info:', errorInfo);
          console.groupEnd();
        }
      }}
    >
      <div className="space-y-4">
        <CodeEditor
          initialCode={initialCode}
          readOnlyRanges={editableRanges}
          onRun={handleRun}
          className={className}
        />
        
        {isLoading && (
          <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded">
            <p className="text-blue-700 dark:text-blue-300">{result}</p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded">
            <h4 className="text-red-800 dark:text-red-300 font-semibold mb-2">Error:</h4>
            <pre className="text-red-700 dark:text-red-300 text-sm whitespace-pre-wrap">{error}</pre>
          </div>
        )}

        {result && !isLoading && !error && (
          <div className="p-4 bg-code-bg border border-code-border rounded">
            <h4 className="font-semibold mb-2 text-foreground">Output:</h4>
            <pre className="text-sm whitespace-pre-wrap text-foreground">{result}</pre>
          </div>
        )}

        <div className="p-4 bg-background border border-border rounded">
          <h4 className="font-semibold mb-4">Interactive Plot:</h4>
          <div 
            ref={plotRef} 
            className={`w-full border border-border rounded ${plotClassName}`}
            style={{ 
              minHeight: plotHeight,
              height: plotHeight,
              resize: 'vertical',
              overflow: 'auto'
            }}
          />
          <p className="text-sm text-muted mt-2">
            💡 Try: hover over elements, zoom with mouse wheel, pan by dragging, use toolbar buttons
          </p>
        </div>
      </div>
    </ErrorBoundary>
  );
} 