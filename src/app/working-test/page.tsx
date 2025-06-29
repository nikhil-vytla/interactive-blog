'use client';

import { useState } from 'react';
import PageLayout from '@/components/PageLayout';
import SimpleCodeEditor from '@/components/SimpleCodeEditor';

export default function WorkingTestPage() {
  const [result, setResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testCode = `# Simple Python test
x = 2 + 3
y = x * 2
print(f"x = {x}")
print(f"y = {y}")
print("This is a working test!")`;

  const handleRun = async (code: string) => {
    setIsLoading(true);
    setResult('');
    
    try {
      // For now, just simulate execution without Pyodide
      setResult(`Code executed:\n${code}\n\nOutput:\nx = 5\ny = 10\nThis is a working test!`);
      
      // TODO: Replace with actual Pyodide execution
      // const execResult = await executePythonCode(code);
      // setResult(JSON.stringify(execResult, null, 2));
    } catch (error) {
      setResult(`Error: ${String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLayout
      title="Working Test - Step 1"
      description="This tests the basic code editor functionality without read-only regions or Pyodide."
    >
      <SimpleCodeEditor
        initialCode={testCode}
        onRun={handleRun}
        className="mb-6"
      />

      {isLoading && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded">
          <p className="text-blue-700">Executing...</p>
        </div>
      )}

      {result && (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded">
          <h3 className="font-semibold mb-2">Result:</h3>
          <pre className="text-sm whitespace-pre-wrap">{result}</pre>
        </div>
      )}
    </PageLayout>
  );
}