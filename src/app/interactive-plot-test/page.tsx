'use client';

import { useState, useRef } from 'react';
import ReadOnlyCodeEditor from '@/components/ReadOnlyCodeEditor';

// Local type for Pyodide
interface PyodideInstance {
  runPython(code: string): unknown;
  runPythonAsync?(code: string): Promise<unknown>;
  loadPackage(packages: string[]): Promise<void>;
}

export default function InteractivePlotTestPage() {
  const [result, setResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const plotRef = useRef<HTMLDivElement>(null);

  const testCode = `# Interactive plotting with Plotly
import numpy as np
import plotly.graph_objects as go
import plotly.express as px

# === EDITABLE REGION START ===
# Interactive parameters
frequency = 2.0
amplitude = 1.0
phase = 0.0
num_points = 1000
# === EDITABLE REGION END ===

# Generate data
x = np.linspace(0, 4*np.pi, num_points)
y = amplitude * np.sin(frequency * x + phase)

# Create interactive plot
fig = go.Figure()
fig.add_trace(go.Scatter(
    x=x, 
    y=y, 
    mode='lines',
    name=f'sin({frequency}x + {phase})',
    line=dict(width=3)
))

fig.update_layout(
    title=f'Interactive Sine Wave: y = {amplitude}sin({frequency}x + {phase})',
    xaxis_title='x',
    yaxis_title='y',
    hovermode='x unified',
    template='plotly_white',
    showlegend=True
)

# Add grid
fig.update_xaxes(showgrid=True, gridwidth=1, gridcolor='lightgray')
fig.update_yaxes(showgrid=True, gridwidth=1, gridcolor='lightgray')

# Convert to JSON for web display
fig_json = fig.to_json()
print("Interactive plot created!")
print(f"Data points: {len(x)}")
print(f"Y range: [{min(y):.2f}, {max(y):.2f}]")`;

  // Calculate editable ranges
  const getEditableRanges = () => {
    const startMarker = '# === EDITABLE REGION START ===';
    const endMarker = '# === EDITABLE REGION END ===';
    const startIndex = testCode.indexOf(startMarker);
    const endIndex = testCode.indexOf(endMarker);
    
    if (startIndex === -1 || endIndex === -1) return [];
    
    const contentStart = testCode.indexOf('\n', startIndex) + 1;
    const contentEnd = endIndex;
    
    return [{ from: contentStart, to: contentEnd }];
  };

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

      setResult('Loading Python packages...');
      await pyodide.loadPackage(['numpy', 'micropip']);
      
      setResult('Installing Plotly via micropip...');
      await pyodide.runPythonAsync!(`
        import micropip
        await micropip.install('plotly')
      `);

      setResult('Running Python code...');
      
      // Capture stdout
      await pyodide.runPython(`
        import sys
        from io import StringIO
        old_stdout = sys.stdout
        sys.stdout = captured_output = StringIO()
      `);

      // Execute user code
      await pyodide.runPython(code);
      
      // Get output and plot data
      const output = await pyodide.runPython(`
        output_str = captured_output.getvalue()
        sys.stdout = old_stdout
        output_str
      `);

      // Get the plot JSON
      const plotJson = await pyodide.runPython(`fig_json`);

      setResult(`Success!\n\nOutput:\n${output}`);
      
      // Render the interactive plot
      if (plotJson && plotRef.current) {
        // Load Plotly dynamically
        const script = document.createElement('script');
        script.src = 'https://cdn.plot.ly/plotly-2.35.2.min.js';
        
        if (!document.querySelector('script[src*="plotly"]')) {
          document.head.appendChild(script);
          await new Promise((resolve) => {
            script.onload = resolve;
          });
        }

        const plotData = JSON.parse(plotJson as string);
        
        // Clear previous plot
        plotRef.current.innerHTML = '';
        
        // Create new interactive plot using global Plotly
        const windowWithPlotly = window as unknown as { Plotly?: { newPlot: (...args: unknown[]) => Promise<unknown> } };
        const Plotly = windowWithPlotly.Plotly;
        if (Plotly) {
          await Plotly.newPlot(plotRef.current, plotData.data, plotData.layout, {
            responsive: true,
            displayModeBar: true,
            modeBarButtonsToRemove: ['pan2d', 'lasso2d'],
          });
        }
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
      <h1 className="text-2xl font-bold mb-8">Interactive Plot Test - Plotly Integration</h1>
      
      <p className="mb-4 text-muted">
        This tests interactive Plotly plots. You can zoom, pan, hover, and interact with the plot!
        Try changing the parameters and see the plot update dynamically.
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
          <h3 className="font-semibold mb-2">Output:</h3>
          <pre className="text-sm whitespace-pre-wrap">{result}</pre>
        </div>
      )}

      <div className="p-4 bg-white border border-gray-200 rounded">
        <h3 className="font-semibold mb-4">Interactive Plot:</h3>
        <div 
          ref={plotRef} 
          className="w-full h-96 border rounded"
          style={{ minHeight: '400px' }}
        />
        <p className="text-sm text-muted mt-2">
          💡 Try: hover over the line, zoom with mouse wheel, pan by dragging, use toolbar buttons
        </p>
      </div>
    </div>
  );
}