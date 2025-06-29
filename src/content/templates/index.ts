import { CodeTemplate } from '@/types';

export const codeTemplates: CodeTemplate[] = [
  // Visualization Templates
  {
    id: 'scatter_plot',
    name: 'Scatter Plot',
    description: 'Basic scatter plot with customizable data',
    category: 'visualization',
    libraries: ['plotly', 'numpy'],
    parameters: [
      {
        name: 'n_points',
        label: 'Number of Points',
        type: 'range',
        defaultValue: 50,
        min: 10,
        max: 200,
        step: 10
      },
      {
        name: 'x_mean',
        label: 'X Mean',
        type: 'number',
        defaultValue: 0,
        min: -5,
        max: 5,
        step: 0.1
      },
      {
        name: 'y_mean',
        label: 'Y Mean',
        type: 'number',
        defaultValue: 0,
        min: -5,
        max: 5,
        step: 0.1
      },
      {
        name: 'correlation',
        label: 'Correlation',
        type: 'range',
        defaultValue: 0.5,
        min: -1,
        max: 1,
        step: 0.1
      }
    ],
    code: `import numpy as np
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
print(f"Actual correlation: {np.corrcoef(x, y)[0,1]:.3f}")`
  },

  {
    id: 'histogram',
    name: 'Histogram',
    description: 'Distribution visualization with customizable parameters',
    category: 'visualization',
    libraries: ['plotly', 'numpy'],
    parameters: [
      {
        name: 'n_samples',
        label: 'Sample Size',
        type: 'range',
        defaultValue: 1000,
        min: 100,
        max: 5000,
        step: 100
      },
      {
        name: 'mean',
        label: 'Mean (μ)',
        type: 'number',
        defaultValue: 0,
        min: -5,
        max: 5,
        step: 0.1
      },
      {
        name: 'std',
        label: 'Standard Deviation (σ)',
        type: 'number',
        defaultValue: 1,
        min: 0.1,
        max: 3,
        step: 0.1
      },
      {
        name: 'bins',
        label: 'Number of Bins',
        type: 'range',
        defaultValue: 30,
        min: 10,
        max: 100,
        step: 5
      }
    ],
    code: `import numpy as np
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
print(f"Sample std: {np.std(data, ddof=1):.3f}")`
  },

  // Statistics Templates
  {
    id: 'hypothesis_test',
    name: 'One-Sample t-Test',
    description: 'Hypothesis testing with visualization',
    category: 'statistics',
    libraries: ['numpy', 'scipy', 'plotly'],
    parameters: [
      {
        name: 'sample_size',
        label: 'Sample Size',
        type: 'range',
        defaultValue: 30,
        min: 10,
        max: 100,
        step: 5
      },
      {
        name: 'true_mean',
        label: 'True Population Mean',
        type: 'number',
        defaultValue: 100,
        min: 90,
        max: 110,
        step: 1
      },
      {
        name: 'null_mean',
        label: 'Null Hypothesis Mean',
        type: 'number',
        defaultValue: 100,
        min: 90,
        max: 110,
        step: 1
      },
      {
        name: 'alpha',
        label: 'Significance Level (α)',
        type: 'select',
        defaultValue: 0.05,
        options: [
          { label: '0.01', value: 0.01 },
          { label: '0.05', value: 0.05 },
          { label: '0.10', value: 0.10 }
        ]
      }
    ],
    code: `import numpy as np
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
print(f"Reject H₀: {abs(t_stat) > critical_value}")`
  },

  // Machine Learning Templates
  {
    id: 'knn_classifier',
    name: 'k-NN Classifier',
    description: 'k-Nearest Neighbors with decision boundary',
    category: 'ml',
    libraries: ['numpy', 'sklearn', 'plotly'],
    parameters: [
      {
        name: 'k',
        label: 'Number of Neighbors (k)',
        type: 'range',
        defaultValue: 5,
        min: 1,
        max: 20,
        step: 1
      },
      {
        name: 'n_samples',
        label: 'Number of Samples',
        type: 'range',
        defaultValue: 100,
        min: 50,
        max: 200,
        step: 10
      },
      {
        name: 'test_x',
        label: 'Test Point X',
        type: 'range',
        defaultValue: 0.5,
        min: 0,
        max: 1,
        step: 0.1
      },
      {
        name: 'test_y',
        label: 'Test Point Y',
        type: 'range',
        defaultValue: 0.5,
        min: 0,
        max: 1,
        step: 0.1
      }
    ],
    code: `import numpy as np
import plotly.graph_objects as go
from sklearn.datasets import make_classification
from sklearn.neighbors import KNeighborsClassifier

# Parameters
k = {k}
n_samples = {n_samples}
test_x, test_y = {test_x}, {test_y}

# Generate data
np.random.seed(42)
X, y = make_classification(
    n_samples=n_samples, n_features=2, n_redundant=0,
    n_informative=2, n_clusters_per_class=1, random_state=42
)

# Normalize to [0,1]
X = (X - X.min(axis=0)) / (X.max(axis=0) - X.min(axis=0))

# Fit k-NN
knn = KNeighborsClassifier(n_neighbors=k)
knn.fit(X, y)

# Create meshgrid for decision boundary
x_min, x_max = X[:, 0].min() - 0.1, X[:, 0].max() + 0.1
y_min, y_max = X[:, 1].min() - 0.1, X[:, 1].max() + 0.1
xx, yy = np.meshgrid(np.linspace(x_min, x_max, 100),
                     np.linspace(y_min, y_max, 100))

# Predict class for each point in meshgrid
Z = knn.predict(np.c_[xx.ravel(), yy.ravel()])
Z = Z.reshape(xx.shape)

# Test point prediction
test_point = np.array([[test_x, test_y]])
prediction = knn.predict(test_point)[0]
probabilities = knn.predict_proba(test_point)[0]

# Find nearest neighbors
distances, indices = knn.kneighbors(test_point)
neighbors = X[indices[0]]
neighbor_classes = y[indices[0]]

# Create visualization
fig = go.Figure()

# Plot decision boundary
fig.add_trace(go.Contour(
    x=xx[0, :],
    y=yy[:, 0],
    z=Z,
    showscale=False,
    colorscale=[[0, 'rgba(255,0,0,0.1)'], [1, 'rgba(0,0,255,0.1)']],
    opacity=0.5,
    name='Decision Boundary'
))

# Plot data points
colors = ['red', 'blue']
for class_val in [0, 1]:
    mask = y == class_val
    fig.add_trace(go.Scatter(
        x=X[mask, 0], y=X[mask, 1],
        mode='markers',
        name=f'Class {class_val}',
        marker=dict(color=colors[class_val], size=8, opacity=0.7)
    ))

# Highlight nearest neighbors
fig.add_trace(go.Scatter(
    x=neighbors[:, 0], y=neighbors[:, 1],
    mode='markers',
    name='Nearest Neighbors',
    marker=dict(color='black', size=12, symbol='circle-open', line=dict(width=3))
))

# Test point
fig.add_trace(go.Scatter(
    x=[test_x], y=[test_y],
    mode='markers',
    name=f'Test Point (Pred: {prediction})',
    marker=dict(color='green', size=15, symbol='star')
))

fig.update_layout(
    title=f'k-NN Classification (k={k})',
    xaxis_title='Feature 1',
    yaxis_title='Feature 2',
    showlegend=True
)

print(f"Prediction: Class {prediction}")
print(f"Probabilities: {probabilities}")
print(f"Neighbor classes: {neighbor_classes}")
print(f"Average distance: {distances[0].mean():.3f}")`
  },

  // Simulation Templates
  {
    id: 'central_limit_theorem',
    name: 'Central Limit Theorem Demo',
    description: 'Demonstrate CLT with various distributions',
    category: 'simulation',
    libraries: ['numpy', 'plotly'],
    parameters: [
      {
        name: 'n_samples',
        label: 'Sample Size',
        type: 'range',
        defaultValue: 30,
        min: 5,
        max: 100,
        step: 5
      },
      {
        name: 'n_experiments',
        label: 'Number of Experiments',
        type: 'range',
        defaultValue: 1000,
        min: 100,
        max: 5000,
        step: 100
      },
      {
        name: 'distribution',
        label: 'Population Distribution',
        type: 'select',
        defaultValue: 'uniform',
        options: [
          { label: 'Uniform', value: 'uniform' },
          { label: 'Exponential', value: 'exponential' },
          { label: 'Normal', value: 'normal' }
        ]
      }
    ],
    code: `import numpy as np
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
print(f"Theoretical SEM: {pop_sample.std()/np.sqrt(n_samples):.3f}")`
  }
];

// Helper functions
export const getTemplatesByCategory = (category: string): CodeTemplate[] => {
  return codeTemplates.filter(template => template.category === category);
};

export const getTemplateById = (id: string): CodeTemplate | undefined => {
  return codeTemplates.find(template => template.id === id);
};

export const getAllTemplateCategories = (): string[] => {
  return [...new Set(codeTemplates.map(template => template.category))];
};

// Template processing function
export const processTemplate = (template: CodeTemplate, parameterValues: Record<string, unknown>): string => {
  let processedCode = template.code;
  
  template.parameters.forEach(param => {
    const value = parameterValues[param.name] ?? param.defaultValue;
    const placeholder = `{${param.name}}`;
    
    // Handle different types of parameter values
    let replacementValue: string;
    if (param.type === 'text') {
      replacementValue = `"${value}"`;
    } else if (param.type === 'array') {
      replacementValue = JSON.stringify(value);
    } else {
      replacementValue = String(value);
    }
    
    processedCode = processedCode.replace(new RegExp(placeholder, 'g'), replacementValue);
  });
  
  return processedCode;
};