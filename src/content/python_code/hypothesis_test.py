import numpy as np
import plotly.graph_objects as go
from scipy import stats

# Parameters
sample_size = {sample_size}
true_mean = {true_mean}
null_mean = {null_mean}
alpha = {alpha}

# Generate sample data
np.random.seed(42)
sample = np.random.normal(true_mean, 10, sample_size)

# Perform t-test
t_stat, p_value = stats.ttest_1samp(sample, null_mean)
critical_value = stats.t.ppf(1 - alpha/2, sample_size - 1)

# Create visualization
x = np.linspace(-4, 4, 1000)
y = stats.t.pdf(x, sample_size - 1)

fig = go.Figure()

# Plot t-distribution
fig.add_trace(go.Scatter(
    x=x, y=y,
    mode='lines',
    name='t-distribution',
    line=dict(color='blue')
))

# Shade critical regions
critical_x = x[np.abs(x) >= critical_value]
critical_y = stats.t.pdf(critical_x, sample_size - 1)
fig.add_trace(go.Scatter(
    x=critical_x, y=critical_y,
    mode='lines',
    fill='tozeroy',
    name=f'Critical Region (α={alpha})',
    line=dict(color='red'),
    fillcolor='rgba(255,0,0,0.3)'
))

# Mark observed t-statistic
fig.add_vline(x=t_stat, line_dash="dash", line_color="green", 
              annotation_text=f"t = {t_stat:.3f}")

fig.update_layout(
    title=f't-Test: H₀: μ = {null_mean}',
    xaxis_title='t-value',
    yaxis_title='Density',
    showlegend=True
)

print(f"Sample mean: {np.mean(sample):.3f}")
print(f"t-statistic: {t_stat:.3f}")
print(f"p-value: {p_value:.3f}")
print(f"Critical value: ±{critical_value:.3f}")
print(f"Reject H₀: {abs(t_stat) > critical_value}")