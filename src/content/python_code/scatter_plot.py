import numpy as np
import plotly.graph_objects as go

# Parameters
n_points = {n_points}
x_mean = {x_mean}
y_mean = {y_mean}
correlation = {correlation}

# Generate correlated data
np.random.seed(42)
cov_matrix = [[1, correlation], [correlation, 1]]
data = np.random.multivariate_normal([x_mean, y_mean], cov_matrix, n_points)
x, y = data[:, 0], data[:, 1]

# Create scatter plot
fig = go.Figure()
fig.add_trace(go.Scatter(
    x=x, y=y,
    mode='markers',
    marker=dict(size=8, opacity=0.7),
    name='Data Points'
))

fig.update_layout(
    title=f'Scatter Plot (r = {correlation:.2f})',
    xaxis_title='X Variable',
    yaxis_title='Y Variable',
    showlegend=True
)

print(f"Generated {n_points} points with correlation {correlation:.2f}")
print(f"Actual correlation: {np.corrcoef(x, y)[0,1]:.3f}")