import numpy as np
import plotly.graph_objects as go
from plotly.subplots import make_subplots

# Parameters
n_samples = {n_samples}
n_experiments = {n_experiments}
distribution = "{distribution}"

np.random.seed(42)

# Generate sample means
sample_means = []
for _ in range(n_experiments):
    if distribution == 'uniform':
        sample = np.random.uniform(0, 1, n_samples)
    elif distribution == 'exponential':
        sample = np.random.exponential(1, n_samples)
    else:  # normal
        sample = np.random.normal(0, 1, n_samples)
    
    sample_means.append(np.mean(sample))

sample_means = np.array(sample_means)

# Create subplots
fig = make_subplots(
    rows=2, cols=1,
    subplot_titles=('Population Distribution', 'Sampling Distribution of Means'),
    vertical_spacing=0.15
)

# Plot population distribution
if distribution == 'uniform':
    pop_sample = np.random.uniform(0, 1, 10000)
elif distribution == 'exponential':
    pop_sample = np.random.exponential(1, 10000)
else:
    pop_sample = np.random.normal(0, 1, 10000)

fig.add_trace(go.Histogram(
    x=pop_sample,
    nbinsx=50,
    name='Population',
    opacity=0.7
), row=1, col=1)

# Plot sampling distribution
fig.add_trace(go.Histogram(
    x=sample_means,
    nbinsx=50,
    name='Sample Means',
    opacity=0.7
), row=2, col=1)

fig.update_layout(
    title=f'Central Limit Theorem Demo (n={n_samples})',
    showlegend=True,
    height=600
)

print(f"Population mean: {pop_sample.mean():.3f}")
print(f"Sample means average: {sample_means.mean():.3f}")
print(f"Population std: {pop_sample.std():.3f}")
print(f"Sample means std: {sample_means.std():.3f}")
print(f"Theoretical SEM: {pop_sample.std()/np.sqrt(n_samples):.3f}")