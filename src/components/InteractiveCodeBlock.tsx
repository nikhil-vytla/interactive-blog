'use client';

import { useState, useCallback } from 'react';
import CodeEditor from './CodeEditor';
import { executePythonCode, ExecutionResult } from '@/lib/pyodide';

interface InteractiveCodeBlockProps {
  template: string;
  editableRanges: { from: number; to: number }[];
  title?: string;
  description?: string;
}

export default function InteractiveCodeBlock({
  template,
  editableRanges,
  title,
  description
}: InteractiveCodeBlockProps) {
  const [, setCode] = useState(template);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const handleCodeChange = useCallback((newCode: string) => {
    setCode(newCode);
  }, []);

  const handleRun = useCallback(async (codeToRun: string) => {
    setIsExecuting(true);
    setResult(null);
    
    try {
      const executionResult = await executePythonCode(codeToRun);
      setResult(executionResult);
    } catch (error) {
      setResult({
        success: false,
        error: `Execution failed: ${String(error)}`
      });
    } finally {
      setIsExecuting(false);
    }
  }, []);

  return (
    <div className="space-y-4">
      {title && (
        <div>
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          {description && (
            <p className="text-muted text-sm mb-4">{description}</p>
          )}
        </div>
      )}
      
      <CodeEditor
        initialCode={template}
        readOnlyRanges={editableRanges.length > 0 ? 
          // Convert editable ranges to read-only ranges (everything except editable)
          getReadOnlyRanges(template, editableRanges) : 
          []
        }
        onChange={handleCodeChange}
        onRun={handleRun}
        className="mb-4"
      />

      {isExecuting && (
        <div className="flex items-center space-x-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-blue-700 text-sm">Executing Python code...</span>
        </div>
      )}

      {result && (
        <div className="space-y-4">
          {result.success ? (
            <div className="space-y-4">
              {result.output && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-2">Output:</h4>
                  <pre className="text-sm text-green-700 whitespace-pre-wrap font-mono">
                    {result.output}
                  </pre>
                </div>
              )}
              
              {result.plots && result.plots.length > 0 && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Plots:</h4>
                  <div className="space-y-2">
                    {result.plots.map((plot, index) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={index}
                        src={`data:image/png;base64,${plot}`}
                        alt={`Plot ${index + 1}`}
                        className="max-w-full h-auto rounded border"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-semibold text-red-800 mb-2">Error:</h4>
              <pre className="text-sm text-red-700 whitespace-pre-wrap font-mono">
                {result.error}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function getReadOnlyRanges(
  template: string, 
  editableRanges: { from: number; to: number }[]
): { from: number; to: number }[] {
  const readOnlyRanges: { from: number; to: number }[] = [];
  const templateLength = template.length;
  
  // Sort editable ranges by start position
  const sortedEditableRanges = [...editableRanges].sort((a, b) => a.from - b.from);
  
  let currentPos = 0;
  
  for (const editableRange of sortedEditableRanges) {
    // Add read-only range before this editable range
    if (currentPos < editableRange.from) {
      readOnlyRanges.push({
        from: currentPos,
        to: editableRange.from
      });
    }
    
    // Update current position to end of editable range
    currentPos = Math.max(currentPos, editableRange.to);
  }
  
  // Add final read-only range if there's content after the last editable range
  if (currentPos < templateLength) {
    readOnlyRanges.push({
      from: currentPos,
      to: templateLength
    });
  }
  
  return readOnlyRanges;
}