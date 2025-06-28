'use client';

import { useState } from 'react';
import SimpleCodeEditor from '@/components/SimpleCodeEditor';

// Local type for this test
interface PyodideInstance {
  runPython(code: string): unknown;
  loadPackage(packages: string[]): Promise<void>;
}

export default function PlotTestPage() {
  const [result, setResult] = useState<string>('');
  const [plotImage, setPlotImage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testCode = `# Test matplotlib plotting
import numpy as np
import matplotlib.pyplot as plt

# Create simple sine wave
x = np.linspace(0, 2*np.pi, 100)
y = np.sin(x)

plt.figure(figsize=(8, 4))
plt.plot(x, y, 'b-', linewidth=2)
plt.title('Simple Sine Wave')
plt.xlabel('x')
plt.ylabel('sin(x)')
plt.grid(True, alpha=0.3)
plt.show()

print("Plot created successfully!")`;

  const handleRun = async (code: string) => {
    setIsLoading(true);
    setResult('Loading Pyodide...');
    setPlotImage('');
    
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

      setResult('Loading Python packages...');
      await pyodide.loadPackage(['numpy', 'matplotlib']);

      setResult('Setting up matplotlib...');
      // Set up matplotlib for web
      await pyodide.runPython(`
        import matplotlib
        matplotlib.use('Agg')  # Use non-interactive backend
        import matplotlib.pyplot as plt
        import numpy as np
        
        # Helper function to capture plot output
        import io
        import base64
        
        def capture_plot():
            buf = io.BytesIO()
            plt.savefig(buf, format='png', dpi=100, bbox_inches='tight')
            buf.seek(0)
            img_b64 = base64.b64encode(buf.read()).decode('utf-8')
            buf.close()
            plt.close()  # Clear the current figure
            return img_b64
        
        # Store plot data
        _plot_data = None
        
        # Override plt.show to capture plots
        original_show = plt.show
        def custom_show(*args, **kwargs):
            global _plot_data
            _plot_data = capture_plot()
            return None
        plt.show = custom_show
      `);

      setResult('Running Python code...');
      
      // Capture stdout
      await pyodide.runPython(`
        import sys
        from io import StringIO
        old_stdout = sys.stdout
        sys.stdout = captured_output = StringIO()
        _plot_data = None  # Reset plot data
      `);

      // Execute user code
      const codeResult = await pyodide.runPython(code);
      
      // Get output and plot
      const output = await pyodide.runPython(`
        output_str = captured_output.getvalue()
        sys.stdout = old_stdout
        output_str
      `);

      const plotData = await pyodide.runPython(`_plot_data`);

      setResult(`Success!\n\nOutput:\n${output}\n\nReturn value: ${codeResult !== undefined ? String(codeResult) : 'None'}`);
      
      if (plotData && typeof plotData === 'string') {
        setPlotImage(plotData);
      }
      
    } catch (error) {
      console.error('Pyodide error:', error);
      setResult(`Error: ${String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-8">Plot Test - Step 3</h1>
      
      <p className="mb-4 text-muted">
        This tests matplotlib plotting with Pyodide. The first run will take longer as it downloads numpy and matplotlib.
      </p>

      <SimpleCodeEditor
        initialCode={testCode}
        onRun={handleRun}
        className="mb-6"
      />

      {isLoading && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded mb-4">
          <p className="text-blue-700">Executing Python...</p>
        </div>
      )}

      {result && (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded mb-4">
          <h3 className="font-semibold mb-2">Result:</h3>
          <pre className="text-sm whitespace-pre-wrap">{result}</pre>
        </div>
      )}

      {plotImage && (
        <div className="p-4 bg-white border border-gray-200 rounded">
          <h3 className="font-semibold mb-2">Plot Output:</h3>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={`data:image/png;base64,${plotImage}`}
            alt="Generated plot"
            className="max-w-full h-auto border rounded"
          />
        </div>
      )}
    </div>
  );
}