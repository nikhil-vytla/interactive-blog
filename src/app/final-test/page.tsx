'use client';

import PageLayout from '@/components/PageLayout';
import PlotlyCodeEditor from '@/components/PlotlyCodeEditor';

export default function FinalTestPage() {
  const testCode = `# Read-only: Import libraries
import numpy as np
import plotly.graph_objects as go

# === EDITABLE REGION START ===
# You can edit these parameters:
frequency = 2.0
amplitude = 1.0
phase = 0.0
# === EDITABLE REGION END ===

# Read-only: Generate the sine wave
x = np.linspace(0, 4*np.pi, 1000)
y = amplitude * np.sin(frequency * x + phase)

# Read-only: Create the interactive plot
fig = go.Figure()
fig.add_trace(go.Scatter(
    x=x, 
    y=y, 
    mode='lines',
    name=f'y = {amplitude}sin({frequency}x + {phase})',
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
print(f"  Phase: {phase}")
print(f"  Data points: {len(x)}")
print(f"  Y range: [{min(y):.2f}, {max(y):.2f}]")`;

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
    
    return [{ from: contentStart, to: contentEnd }];
  };

  return (
    <PageLayout
      title="Final Test: Interactive Sine Wave Generator"
      description="This demonstrates the integration of ReadOnlyCodeEditor with Pyodide execution and interactive Plotly plotting."
    >
      <div className="space-y-6">
        <PlotlyCodeEditor
          initialCode={testCode}
          editableRanges={getEditableRanges()}
        />
        
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">About This Test</h3>
          <p className="text-gray-700">
            Try changing the frequency, amplitude, or phase to see how they affect the interactive sine wave!
          </p>
          <p className="text-gray-600 text-sm mt-2">
            The first run will take longer as it downloads the required Python packages.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}