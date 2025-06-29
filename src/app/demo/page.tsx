'use client';

import PageLayout from '@/components/PageLayout';
import PlotlyCodeEditor from '@/components/PlotlyCodeEditor';
import { DisplayMath, InlineMath } from '@/components/MathRenderer';

export default function DemoPage() {


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
    horizontal_spacing=0.15
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
    <PageLayout
      title="Interactive Demos"
      description="Explore mathematical concepts through interactive Python code. Edit the highlighted sections and run the code to see immediate results."
    >
      <div className="space-y-16">
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
            
            <PlotlyCodeEditor
              initialCode={sinWaveCode}
              editableRanges={getSinWaveEditableRanges()}
              className="mb-4"
            />
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
            
            <PlotlyCodeEditor
              initialCode={statisticsCode}
              editableRanges={getStatisticsEditableRanges()}
              className="mb-4"
            />
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
      </div>
    </PageLayout>
  );
}