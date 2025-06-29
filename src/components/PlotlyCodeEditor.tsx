'use client';

import { useRef } from 'react';
import ReadOnlyCodeEditor from './ReadOnlyCodeEditor';
import { usePlotlyExecution } from '@/lib/pyodide-plotly';

interface ReadOnlyRange {
  from: number;
  to: number;
}

interface PlotlyCodeEditorProps {
  initialCode: string;
  editableRanges: ReadOnlyRange[];
  className?: string;
  plotHeight?: string;
  plotClassName?: string;
}

export default function PlotlyCodeEditor({
  initialCode,
  editableRanges,
  className = '',
  plotHeight = '500px',
  plotClassName = ''
}: PlotlyCodeEditorProps) {
  const plotRef = useRef<HTMLDivElement>(null);
  const { isLoading, result, error, executeCode } = usePlotlyExecution();

  const handleRun = async (code: string) => {
    await executeCode(code, plotRef);
  };

  return (
    <div className="space-y-4">
      <ReadOnlyCodeEditor
        initialCode={initialCode}
        editableRanges={editableRanges}
        onRun={handleRun}
        className={className}
      />
      
      {isLoading && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded">
          <p className="text-blue-700">{result}</p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded">
          <h4 className="text-red-800 font-semibold mb-2">Error:</h4>
          <pre className="text-red-700 text-sm whitespace-pre-wrap">{error}</pre>
        </div>
      )}

      {result && !isLoading && !error && (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded">
          <h4 className="font-semibold mb-2">Output:</h4>
          <pre className="text-sm whitespace-pre-wrap">{result}</pre>
        </div>
      )}

      <div className="p-4 bg-white border border-gray-200 rounded">
        <h4 className="font-semibold mb-4">Interactive Plot:</h4>
        <div 
          ref={plotRef} 
          className={`w-full border rounded ${plotClassName}`}
          style={{ minHeight: plotHeight }}
        />
        <p className="text-sm text-muted mt-2">
          💡 Try: hover over elements, zoom with mouse wheel, pan by dragging, use toolbar buttons
        </p>
      </div>
    </div>
  );
} 