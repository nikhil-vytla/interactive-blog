'use client';

import PageLayout from '@/components/PageLayout';
import PlotlyCodeEditor from '@/components/PlotlyCodeEditor';

export default function InteractivePlotTestPage() {

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



  return (
    <PageLayout
      title="Interactive Plot Test - Plotly Integration"
      description="This tests interactive Plotly plots. You can zoom, pan, hover, and interact with the plot! Try changing the parameters and see the plot update dynamically."
    >
      <PlotlyCodeEditor
        initialCode={testCode}
        editableRanges={getEditableRanges()}
        className="mb-6"
        plotHeight="400px"
      />
    </PageLayout>
  );
}