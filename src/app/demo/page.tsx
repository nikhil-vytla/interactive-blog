'use client';

import ReadOnlyCodeEditor from '@/components/ReadOnlyCodeEditor';
import { DisplayMath, InlineMath } from '@/components/MathRenderer';
import { useState, useRef } from 'react';

// Local type for Pyodide
interface PyodideInstance {
  runPython(code: string): unknown;
  runPythonAsync?(code: string): Promise<unknown>;
  loadPackage(packages: string[]): Promise<void>;
}

export default function DemoPage() {
  const [sineResult, setSineResult] = useState<string>('');
  const [sineLoading, setSineLoading] = useState(false);
  const sinePlotRef = useRef<HTMLDivElement>(null);
  
  const [statsResult, setStatsResult] = useState<string>('');
  const [statsLoading, setStatsLoading] = useState(false);
  const statsPlotRef = useRef<HTMLDivElement>(null);

  // Shared Pyodide execution function
  const executePython = async (
    code: string,
    setResult: (result: string) => void,
    plotRef: React.RefObject<HTMLDivElement | null>,
    setLoading: (loading: boolean) => void
  ) => {
    setLoading(true);
    setResult('Loading Pyodide...');
    
    try {
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
      
      await pyodide.runPython(`
        import sys
        from io import StringIO
        old_stdout = sys.stdout
        sys.stdout = captured_output = StringIO()
        fig_json = None
      `);

      await pyodide.runPython(code);
      
      const output = await pyodide.runPython(`
        output_str = captured_output.getvalue()
        sys.stdout = old_stdout
        output_str
      `);

      const plotJson = await pyodide.runPython(`
        import json
        fig_dict = fig.to_dict() if 'fig' in locals() else None
        json.dumps(fig_dict) if fig_dict else None
      `);

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
      setLoading(false);
    }
  };
  const sinWaveCode = `import numpy as np
import plotly.graph_objects as go

# === EDITABLE REGION START ===
frequency = 2.0
amplitude = 1.0 
phase = 0.0
# === EDITABLE REGION END ===

x = np.linspace(0, 4*np.pi, 1000)
y = amplitude * np.sin(frequency * x + phase)

# Create interactive plot
fig = go.Figure()
fig.add_trace(go.Scatter(
    x=x, 
    y=y, 
    mode='lines',
    name=f'sin({frequency}x + {phase})',
    line=dict(width=3, color='blue')
))

fig.update_layout(
    title=f'Interactive Sine Wave: y = {amplitude}sin({frequency}x + {phase})',
    xaxis_title='x',
    yaxis_title='y',
    hovermode='x unified',
    template='plotly_white',
    showlegend=True,
    height=500
)

# Add grid and zero lines
fig.update_xaxes(showgrid=True, gridwidth=1, gridcolor='lightgray', zeroline=True)
fig.update_yaxes(showgrid=True, gridwidth=1, gridcolor='lightgray', zeroline=True)

print(f"Generated interactive sine wave with:")
print(f"  Frequency: {frequency}")
print(f"  Amplitude: {amplitude}")
print(f"  Phase: {phase}")`;

  const statisticsCode = `import numpy as np
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import plotly.express as px

# === EDITABLE REGION START ===
sample_size = 1000
mean = 0
std_dev = 1
# === EDITABLE REGION END ===

# Generate random data
np.random.seed(42)
data = np.random.normal(mean, std_dev, sample_size)

# Create subplots
fig = make_subplots(
    rows=1, cols=2, 
    subplot_titles=(f'Normal Distribution (n={sample_size}, μ={mean}, σ={std_dev})', 'Q-Q Plot'),
    horizontal_spacing=0.1
)

# Histogram
fig.add_trace(
    go.Histogram(
        x=data, 
        nbinsx=30, 
        histnorm='probability density',
        name='Sample Data',
        marker_color='skyblue',
        marker_line_color='black',
        marker_line_width=1,
        opacity=0.7
    ), 
    row=1, col=1
)

# Theoretical curve overlay
x_theory = np.linspace(data.min(), data.max(), 100)
y_theory = (1/(std_dev * np.sqrt(2 * np.pi))) * np.exp(-0.5 * ((x_theory - mean)/std_dev)**2)
fig.add_trace(
    go.Scatter(
        x=x_theory, 
        y=y_theory, 
        mode='lines',
        name='Theoretical',
        line=dict(color='red', width=3)
    ), 
    row=1, col=1
)

# Q-Q Plot
sorted_data = np.sort(data)
theoretical_quantiles = np.random.normal(0, 1, len(sorted_data))
theoretical_quantiles = np.sort(theoretical_quantiles)

fig.add_trace(
    go.Scatter(
        x=theoretical_quantiles, 
        y=sorted_data,
        mode='markers',
        name='Q-Q Points',
        marker=dict(color='blue', size=4),
        showlegend=False
    ), 
    row=1, col=2
)

# Q-Q reference line
qq_min, qq_max = min(theoretical_quantiles.min(), sorted_data.min()), max(theoretical_quantiles.max(), sorted_data.max())
fig.add_trace(
    go.Scatter(
        x=[qq_min, qq_max], 
        y=[qq_min, qq_max],
        mode='lines',
        name='Perfect Normal',
        line=dict(color='red', dash='dash'),
        showlegend=False
    ), 
    row=1, col=2
)

# Update layout
fig.update_layout(
    title_text="Statistical Distribution Analysis",
    showlegend=True,
    height=500,
    template='plotly_white'
)

fig.update_xaxes(title_text="Value", row=1, col=1, showgrid=True)
fig.update_yaxes(title_text="Density", row=1, col=1, showgrid=True)
fig.update_xaxes(title_text="Theoretical Quantiles", row=1, col=2, showgrid=True)
fig.update_yaxes(title_text="Sample Quantiles", row=1, col=2, showgrid=True)

print(f"Sample Statistics:")
print(f"Mean: {np.mean(data):.3f}")
print(f"Std Dev: {np.std(data, ddof=1):.3f}")
print(f"Min: {np.min(data):.3f}")
print(f"Max: {np.max(data):.3f}")`;

  // Calculate editable ranges for the code blocks
  const getSinWaveEditableRanges = () => {
    const startMarker = '# === EDITABLE REGION START ===';
    const endMarker = '# === EDITABLE REGION END ===';
    const startIndex = sinWaveCode.indexOf(startMarker);
    const endIndex = sinWaveCode.indexOf(endMarker);
    
    if (startIndex === -1 || endIndex === -1) return [];
    
    // Find the actual editable content between markers
    const contentStart = sinWaveCode.indexOf('\n', startIndex) + 1;
    const contentEnd = endIndex;
    
    return [{ from: contentStart, to: contentEnd }];
  };

  const getStatisticsEditableRanges = () => {
    const startMarker = '# === EDITABLE REGION START ===';
    const endMarker = '# === EDITABLE REGION END ===';
    const startIndex = statisticsCode.indexOf(startMarker);
    const endIndex = statisticsCode.indexOf(endMarker);
    
    if (startIndex === -1 || endIndex === -1) return [];
    
    // Find the actual editable content between markers
    const contentStart = statisticsCode.indexOf('\n', startIndex) + 1;
    const contentEnd = endIndex;
    
    return [{ from: contentStart, to: contentEnd }];
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Interactive Demos</h1>
        <p className="text-muted text-lg leading-relaxed">
          Explore mathematical concepts through interactive Python code. 
          Edit the highlighted sections and run the code to see immediate results.
        </p>
      </header>

      <main className="space-y-16">
        <section>
          <h2 className="text-3xl font-semibold mb-6">Trigonometric Functions</h2>
          
          <div className="mb-8 prose max-w-none">
            <p className="text-lg mb-4">
              The sine function is fundamental in mathematics and physics. It can be expressed as:
            </p>
            
            <DisplayMath>
              {`y = A \\sin(\\omega x + \\phi)`}
            </DisplayMath>
            
            <p className="mt-4">
              Where <InlineMath>A</InlineMath> is the amplitude, <InlineMath>{'\\omega'}</InlineMath> is the frequency, 
              and <InlineMath>{'\\phi'}</InlineMath> is the phase shift. Try modifying these parameters below:
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Interactive Sine Wave Generator</h3>
              <p className="text-muted text-sm mb-4">Modify the frequency, amplitude, and phase parameters to see how they affect the sine wave.</p>
            </div>
            
            <ReadOnlyCodeEditor
              initialCode={sinWaveCode}
              editableRanges={getSinWaveEditableRanges()}
              onRun={(code) => executePython(code, setSineResult, sinePlotRef, setSineLoading)}
              className="mb-4"
            />

            {sineLoading && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                <p className="text-blue-700">{sineResult}</p>
              </div>
            )}

            {sineResult && !sineLoading && (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded">
                <h4 className="font-semibold mb-2">Output:</h4>
                <pre className="text-sm whitespace-pre-wrap">{sineResult}</pre>
              </div>
            )}

            <div className="p-4 bg-white border border-gray-200 rounded">
              <h4 className="font-semibold mb-4">Interactive Plot:</h4>
              <div 
                ref={sinePlotRef} 
                className="w-full h-96 border rounded"
                style={{ minHeight: '500px' }}
              />
              <p className="text-sm text-muted mt-2">
                💡 Try: hover over the line, zoom with mouse wheel, pan by dragging, use toolbar buttons
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-6">Statistical Distributions</h2>
          
          <div className="mb-8 prose max-w-none">
            <p className="text-lg mb-4">
              The normal distribution is characterized by its probability density function:
            </p>
            
            <DisplayMath>
              {`f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}} e^{-\\frac{1}{2}\\left(\\frac{x-\\mu}{\\sigma}\\right)^2}`}
            </DisplayMath>
            
            <p className="mt-4">
              Where <InlineMath>{'\\mu'}</InlineMath> is the mean and <InlineMath>{'\\sigma'}</InlineMath> is the standard deviation. 
              Experiment with different parameters:
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Statistical Distribution Explorer</h3>
              <p className="text-muted text-sm mb-4">Adjust the sample size, mean, and standard deviation to explore how they affect the distribution.</p>
            </div>
            
            <ReadOnlyCodeEditor
              initialCode={statisticsCode}
              editableRanges={getStatisticsEditableRanges()}
              onRun={(code) => executePython(code, setStatsResult, statsPlotRef, setStatsLoading)}
              className="mb-4"
            />

            {statsLoading && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                <p className="text-blue-700">{statsResult}</p>
              </div>
            )}

            {statsResult && !statsLoading && (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded">
                <h4 className="font-semibold mb-2">Output:</h4>
                <pre className="text-sm whitespace-pre-wrap">{statsResult}</pre>
              </div>
            )}

            <div className="p-4 bg-white border border-gray-200 rounded">
              <h4 className="font-semibold mb-4">Interactive Plot:</h4>
              <div 
                ref={statsPlotRef} 
                className="w-full h-96 border rounded"
                style={{ minHeight: '500px' }}
              />
              <p className="text-sm text-muted mt-2">
                💡 Try: hover over data points, zoom into specific regions, toggle traces on/off
              </p>
            </div>
          </div>
        </section>

        <section className="bg-code-bg border border-code-border rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2 text-accent">Client-Side Execution</h3>
              <p className="text-muted text-sm">
                Python code runs entirely in your browser using Pyodide (WebAssembly). 
                No server required - everything happens locally for instant results.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-accent">Selective Editing</h3>
              <p className="text-muted text-sm">
                Only highlighted regions can be edited. This focuses learning on key 
                concepts while maintaining working code structure.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-accent">Mathematical Rendering</h3>
              <p className="text-muted text-sm">
                LaTeX equations are rendered beautifully using KaTeX, allowing complex 
                mathematical expressions to be displayed alongside code.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-accent">Interactive Visualizations</h3>
              <p className="text-muted text-sm">
                Plotly creates fully interactive plots with zoom, pan, hover, and more. 
                Modify parameters and explore data dynamically in real-time.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}