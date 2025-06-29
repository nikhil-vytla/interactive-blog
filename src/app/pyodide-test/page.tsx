'use client';

import { useState } from 'react';
import PageLayout from '@/components/PageLayout';
import SimpleCodeEditor from '@/components/SimpleCodeEditor';

// Local type for this test
interface PyodideInstance {
  runPython(code: string): unknown;
  loadPackage(packages: string[]): Promise<void>;
}

export default function PyodideTestPage() {
  const [result, setResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testCode = `# Simple Python test with real execution
x = 2 + 3
y = x * 2
print(f"x = {x}")
print(f"y = {y}")
print("This runs real Python!")

# Test some math
import math
print(f"sqrt(16) = {math.sqrt(16)}")`;

  const handleRun = async (code: string) => {
    setIsLoading(true);
    setResult('Loading Pyodide...');
    
    try {
      // Load Pyodide dynamically
      const windowWithPyodide = window as Window & { loadPyodide?: (config: Record<string, unknown>) => Promise<PyodideInstance> };
      if (!windowWithPyodide.loadPyodide) {
        setResult('Loading Pyodide script...');
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.27.7/full/pyodide.js';
        script.async = true;
        
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      setResult('Initializing Pyodide...');
      const pyodide: PyodideInstance = await windowWithPyodide.loadPyodide!({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.27.7/full/'
      });

      setResult('Running Python code...');
      
      // Capture stdout
      await pyodide.runPython(`
        import sys
        from io import StringIO
        old_stdout = sys.stdout
        sys.stdout = captured_output = StringIO()
      `);

      // Execute user code
      const result = await pyodide.runPython(code);
      
      // Get output
      const output = await pyodide.runPython(`
        output_str = captured_output.getvalue()
        sys.stdout = old_stdout
        output_str
      `);

      setResult(`Success!\n\nOutput:\n${output}\n\nReturn value: ${result !== undefined ? String(result) : 'None'}`);
      
    } catch (error) {
      console.error('Pyodide error:', error);
      setResult(`Error: ${String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLayout
      title="Pyodide Test - Step 2"
      description="This tests real Python execution with Pyodide. The first run will take longer as it downloads Pyodide."
    >
      <SimpleCodeEditor
        initialCode={testCode}
        onRun={handleRun}
        className="mb-6"
      />

      {isLoading && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded">
          <p className="text-blue-700">Executing Python...</p>
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