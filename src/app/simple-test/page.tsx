'use client';

import { useState } from 'react';
import PageLayout from '@/components/PageLayout';
import { executePythonCode } from '@/lib/pyodide';

export default function SimpleTestPage() {
  const [result, setResult] = useState<{success: boolean; output?: string; error?: string; plots?: string[]} | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runSimpleCode = async () => {
    setIsLoading(true);
    try {
      // Very simple test first
      const code = `
x = 2 + 3
print(f"Result: {x}")
print("Hello from Python!")
`;
      
      const execResult = await executePythonCode(code);
      setResult(execResult);
      console.log('Execution result:', execResult);
    } catch (error) {
      console.error('Error:', error);
      setResult({ success: false, error: String(error) });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLayout
      title="Simple Plot Test"
      description="Basic Python execution test with simple calculations and output."
    >
      <button 
        onClick={runSimpleCode}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? 'Running...' : 'Run Simple Plot Test'}
      </button>

      {result && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Result:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
            {JSON.stringify(result, null, 2)}
          </pre>
          
          {result.plots && result.plots.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Plots:</h3>
              {result.plots.map((plot: string, index: number) => (
                <div key={index} className="mb-4">
                  <p>Plot {index + 1}:</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={`data:image/png;base64,${plot}`}
                    alt={`Plot ${index + 1}`}
                    className="border"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </PageLayout>
  );
}