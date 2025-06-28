'use client';

import { useState } from 'react';
import ReadOnlyCodeEditor from '@/components/ReadOnlyCodeEditor';

// Local type for this test
interface PyodideInstance {
  runPython(code: string): unknown;
  loadPackage(packages: string[]): Promise<void>;
}

export default function FinalTestPage() {
  const [result, setResult] = useState<string>('');
  const [plotImage, setPlotImage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testCode = `# Read-only: Import libraries
import numpy as np
import matplotlib.pyplot as plt

# === EDITABLE REGION START ===
# You can edit these parameters:
frequency = 2.0
amplitude = 1.0
phase = 0.0
# === EDITABLE REGION END ===

# Read-only: Generate the sine wave
x = np.linspace(0, 4*np.pi, 1000)
y = amplitude * np.sin(frequency * x + phase)

# Read-only: Create the plot
plt.figure(figsize=(10, 6))
plt.plot(x, y, 'b-', linewidth=2)
plt.title(f'Sine Wave: y = {amplitude}sin({frequency}x + {phase})')
plt.xlabel('x')
plt.ylabel('y')
plt.grid(True, alpha=0.3)
plt.axhline(y=0, color='k', linewidth=0.5)
plt.axvline(x=0, color='k', linewidth=0.5)
plt.show()

print(f"Generated sine wave with:")
print(f"  Frequency: {frequency}")
print(f"  Amplitude: {amplitude}")
print(f"  Phase: {phase}")`;

  // Calculate editable ranges
  const getEditableRanges = () => {
    const startMarker = '# === EDITABLE REGION START ===';
    const endMarker = '# === EDITABLE REGION END ===';
    const startIndex = testCode.indexOf(startMarker);
    const endIndex = testCode.indexOf(endMarker);
    
    if (startIndex === -1 || endIndex === -1) return [];
    
    // Find the actual editable content between markers
    const contentStart = testCode.indexOf('\n', startIndex) + 1;
    const contentEnd = endIndex;
    
    console.log('Editable range calculation:');
    console.log('Start marker at:', startIndex);
    console.log('End marker at:', endIndex);
    console.log('Content from:', contentStart, 'to:', contentEnd);
    console.log('Editable content:', JSON.stringify(testCode.substring(contentStart, contentEnd)));
    
    return [{ from: contentStart, to: contentEnd }];
  };

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
      // Set up matplotlib for web (same as plot-test)
      await pyodide.runPython(`
        import matplotlib
        matplotlib.use('Agg')
        import matplotlib.pyplot as plt
        import numpy as np
        import io
        import base64
        
        def capture_plot():
            buf = io.BytesIO()
            plt.savefig(buf, format='png', dpi=100, bbox_inches='tight')
            buf.seek(0)
            img_b64 = base64.b64encode(buf.read()).decode('utf-8')
            buf.close()
            plt.close()
            return img_b64
        
        _plot_data = None
        
        original_show = plt.show
        def custom_show(*args, **kwargs):
            global _plot_data
            _plot_data = capture_plot()
            return None
        plt.show = custom_show
      `);

      setResult('Running Python code...');
      
      // Capture stdout and execute
      await pyodide.runPython(`
        import sys
        from io import StringIO
        old_stdout = sys.stdout
        sys.stdout = captured_output = StringIO()
        _plot_data = None
      `);

      const codeResult = await pyodide.runPython(code);
      
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
      console.error('Error:', error);
      setResult(`Error: ${String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-8">Final Test - Everything Working!</h1>
      
      <p className="mb-4 text-muted">
        This combines all features: read-only regions (grayed out), editable parameters, 
        Pyodide execution, and matplotlib plotting. Try changing the frequency, amplitude, or phase!
      </p>

      <ReadOnlyCodeEditor
        initialCode={testCode}
        editableRanges={getEditableRanges()}
        onRun={handleRun}
        className="mb-6"
      />

      {isLoading && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded mb-4">
          <p className="text-blue-700">{result}</p>
        </div>
      )}

      {result && !isLoading && (
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