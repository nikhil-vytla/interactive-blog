import numpy as np
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
print(f"Average distance: {distances[0].mean():.3f}")