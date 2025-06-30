import numpy as np
import plotly.graph_objects as go

# Parameters
n_samples = {n_samples}
mean = {mean}
std = {std}
bins = {bins}

# Generate normal distribution
np.random.seed(42)
data = np.random.normal(mean, std, n_samples)

# Create histogram
fig = go.Figure()
fig.add_trace(go.Histogram(
    x=data,
    nbinsx=bins,
    name='Data',
    opacity=0.7
))

# Add theoretical normal curve
x_theory = np.linspace(data.min(), data.max(), 100)
y_theory = (1/(std * np.sqrt(2 * np.pi))) * np.exp(-0.5 * ((x_theory - mean) / std) ** 2)
y_theory = y_theory * len(data) * (data.max() - data.min()) / bins

fig.add_trace(go.Scatter(
    x=x_theory, y=y_theory,
    mode='lines',
    name='Theoretical Normal',
    line=dict(color='red', width=2)
))

fig.update_layout(
    title=f'Normal Distribution (μ={mean}, σ={std})',
    xaxis_title='Value',
    yaxis_title='Frequency',
    showlegend=True
)

print(f"Sample mean: {np.mean(data):.3f}")
print(f"Sample std: {np.std(data, ddof=1):.3f}")