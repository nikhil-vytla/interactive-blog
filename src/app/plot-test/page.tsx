'use client';

import PageLayout from '@/components/PageLayout';
import PlotlyCodeEditor from '@/components/PlotlyCodeEditor';

export default function PlotTestPage() {
  const testCode = `# Test interactive Plotly visualization
import numpy as np
import plotly.graph_objects as go

# === EDITABLE REGION START ===
# You can edit these parameters:
n_points = 100
wave_type = 'sine'  # 'sine' or 'cosine'
# === EDITABLE REGION END ===

# Create data based on wave type
x = np.linspace(0, 2*np.pi, n_points)
if wave_type == 'cosine':
    y = np.cos(x)
    title = f'Interactive Cosine Wave ({n_points} points)'
else:
    y = np.sin(x)
    title = f'Interactive Sine Wave ({n_points} points)'

# Create interactive plot
fig = go.Figure()
fig.add_trace(go.Scatter(
    x=x, 
    y=y, 
    mode='lines+markers',
    name=f'{wave_type.capitalize()} wave',
    line=dict(width=3, color='blue'),
    marker=dict(size=4, color='red')
))

fig.update_layout(
    title=title,
    xaxis_title='x (radians)',
    yaxis_title='y',
    hovermode='x unified',
    template='plotly_white',
    showlegend=True,
    height=400
)

# Add grid and zero lines
fig.update_xaxes(showgrid=True, gridwidth=1, gridcolor='lightgray', zeroline=True)
fig.update_yaxes(showgrid=True, gridwidth=1, gridcolor='lightgray', zeroline=True)

print(f"Created interactive {wave_type} wave plot!")
print(f"Number of data points: {n_points}")
print(f"X range: [0, 2π] ≈ [0, {2*np.pi:.2f}]")
print(f"Y range: [{min(y):.2f}, {max(y):.2f}]")`;

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
      title="Plot Test: Interactive Plotly Visualization"
      description="This demonstrates interactive Plotly plotting with Pyodide. Try changing the number of points or switching between sine and cosine waves!"
    >
      <div className="space-y-6">
        <PlotlyCodeEditor
          initialCode={testCode}
          editableRanges={getEditableRanges()}
        />
        
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">About This Test</h3>
          <p className="text-gray-700">
            Experiment with different parameters to see how they affect the interactive visualization!
          </p>
          <p className="text-gray-600 text-sm mt-2">
            The first run will take longer as it downloads the required Python packages.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}