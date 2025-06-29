'use client';

import { useState } from 'react';
import PageLayout from '@/components/PageLayout';
import { InlineMath, DisplayMath } from '@/components/MathRenderer';
import PlotlyCodeEditor from '@/components/PlotlyCodeEditor';
import { AlertVariants } from '@/components/Alert';
import { getParametersEditableRanges } from '@/utils/editableRanges';

export default function KNearestNeighborsPost() {
  const [k, setK] = useState(5);
  const [dataPoints, setDataPoints] = useState(50);
  const [testPoint, setTestPoint] = useState([0.5, 0.5]);

  const interactiveCode = `import numpy as np
import plotly.graph_objects as go
from plotly.subplots import make_subplots
from sklearn.datasets import make_classification
from sklearn.neighbors import KNeighborsClassifier
import plotly.express as px

# Parameters
k = ${k}
n_samples = ${dataPoints}
test_x, test_y = ${testPoint[0]}, ${testPoint[1]}

# Generate sample data
np.random.seed(42)
X, y = make_classification(
    n_samples=n_samples,
    n_features=2,
    n_redundant=0,
    n_informative=2,
    n_clusters_per_class=1,
    random_state=42
)

# Normalize features to [0,1] range
X_min, X_max = X.min(axis=0), X.max(axis=0)
X_normalized = (X - X_min) / (X_max - X_min)

# Create and fit KNN classifier
knn = KNeighborsClassifier(n_neighbors=k)
knn.fit(X_normalized, y)

# Test point
test_point = np.array([[test_x, test_y]])
prediction = knn.predict(test_point)[0]
probabilities = knn.predict_proba(test_point)[0]

# Find k nearest neighbors
distances, indices = knn.kneighbors(test_point)
nearest_neighbors = X_normalized[indices[0]]
neighbor_classes = y[indices[0]]

# Create visualization
fig = make_subplots(
    rows=1, cols=2,
    subplot_titles=('Dataset with Decision Boundary', 'K-Nearest Neighbors'),
    horizontal_spacing=0.15
)

# Plot 1: Full dataset with decision boundary
# Create mesh for decision boundary
h = 0.02
x_min, x_max = -0.1, 1.1
y_min, y_max = -0.1, 1.1
xx, yy = np.meshgrid(np.arange(x_min, x_max, h),
                     np.arange(y_min, y_max, h))

# Predict on mesh
mesh_points = np.c_[xx.ravel(), yy.ravel()]
Z = knn.predict(mesh_points)
Z = Z.reshape(xx.shape)

# Add decision boundary
fig.add_trace(
    go.Contour(
        x=np.arange(x_min, x_max, h),
        y=np.arange(y_min, y_max, h),
        z=Z,
        showscale=False,
        opacity=0.3,
        line=dict(width=0),
        hoverinfo='skip'
    ),
    row=1, col=1
)

# Add training data points
colors = ['red', 'blue']
class_names = ['Class 0', 'Class 1']

for class_idx in [0, 1]:
    mask = y == class_idx
    fig.add_trace(
        go.Scatter(
            x=X_normalized[mask, 0],
            y=X_normalized[mask, 1],
            mode='markers',
            name=class_names[class_idx],
            marker=dict(
                color=colors[class_idx],
                size=8,
                opacity=0.7,
                line=dict(width=1, color='white')
            ),
            showlegend=True
        ),
        row=1, col=1
    )

# Add test point
fig.add_trace(
    go.Scatter(
        x=[test_x],
        y=[test_y],
        mode='markers',
        name=f'Test Point (Pred: {prediction})',
        marker=dict(
            color='black',
            size=15,
            symbol='star',
            line=dict(width=2, color='white')
        ),
        showlegend=True
    ),
    row=1, col=1
)

# Plot 2: Focus on k nearest neighbors
# Add all training points (smaller, faded)
for class_idx in [0, 1]:
    mask = y == class_idx
    fig.add_trace(
        go.Scatter(
            x=X_normalized[mask, 0],
            y=X_normalized[mask, 1],
            mode='markers',
            name=f'{class_names[class_idx]} (All)',
            marker=dict(
                color=colors[class_idx],
                size=6,
                opacity=0.3,
                line=dict(width=1, color='white')
            ),
            showlegend=False
        ),
        row=1, col=2
    )

# Highlight k nearest neighbors
for i, neighbor_class in enumerate(neighbor_classes):
    fig.add_trace(
        go.Scatter(
            x=[nearest_neighbors[i, 0]],
            y=[nearest_neighbors[i, 1]],
            mode='markers',
            name=f'Neighbor {i+1}',
            marker=dict(
                color=colors[neighbor_class],
                size=12,
                opacity=0.9,
                line=dict(width=3, color='black')
            ),
            showlegend=False
        ),
        row=1, col=2
    )
    
    # Add distance lines
    fig.add_trace(
        go.Scatter(
            x=[test_x, nearest_neighbors[i, 0]],
            y=[test_y, nearest_neighbors[i, 1]],
            mode='lines',
            line=dict(color='gray', width=2, dash='dash'),
            opacity=0.5,
            showlegend=False,
            hoverinfo='skip'
        ),
        row=1, col=2
    )

# Add test point to second plot
fig.add_trace(
    go.Scatter(
        x=[test_x],
        y=[test_y],
        mode='markers',
        name='Test Point',
        marker=dict(
            color='black',
            size=15,
            symbol='star',
            line=dict(width=2, color='white')
        ),
        showlegend=False
    ),
    row=1, col=2
)

# Update layout
fig.update_layout(
    title=f'K-Nearest Neighbors Classification (k={k})',
    height=500,
    showlegend=True,
    legend=dict(x=1.05, y=1)
)

# Update axes
fig.update_xaxes(title_text="Feature 1", showgrid=True, gridcolor='lightgray')
fig.update_yaxes(title_text="Feature 2", showgrid=True, gridcolor='lightgray')

# Print results
vote_counts = np.bincount(neighbor_classes)
print(f"Classification Results:")
print(f"Test point: ({test_x:.3f}, {test_y:.3f})")
print(f"Predicted class: {prediction}")
print(f"Class probabilities: {probabilities}")
print(f"Nearest neighbor votes: Class 0: {vote_counts[0] if len(vote_counts) > 0 else 0}, Class 1: {vote_counts[1] if len(vote_counts) > 1 else 0}")
print(f"Average distance to neighbors: {distances[0].mean():.3f}")`;

  const getEditableRanges = () => getParametersEditableRanges(interactiveCode);

  return (
    <PageLayout
      title="Understanding k-Nearest Neighbors"
      description="Learn how the k-Nearest Neighbors algorithm works through interactive visualizations and examples"
      showHomeButton={true}
    >
      <article className="prose max-w-none">
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-foreground">What is k-Nearest Neighbors?</h2>
          <AlertVariants.Definition title="k-Nearest Neighbors (kNN)">
            <p>
              A simple, non-parametric algorithm that classifies data points based on the class of their <InlineMath>k</InlineMath> nearest neighbors in the feature space. It uses the principle that similar data points 
              tend to have similar labels.
            </p>
          </AlertVariants.Definition>
          
          <p className="mb-4">
            kNN works by finding the <InlineMath>k</InlineMath> closest data points to a query point and 
            assigning the most common class among these neighbors. The distance is typically measured using 
            Euclidean distance in the feature space.
          </p>

          <p className="mb-6">
            For a test point <InlineMath>{`x_{\\text{test}}`}</InlineMath> and training points <InlineMath>{`\\{x_1, x_2, ..., x_n\\}`}</InlineMath>, 
            the algorithm:
          </p>

          <DisplayMath>
            {`\\text{prediction} = \\arg\\max_{c} \\sum_{i \\in N_k(x_{\\text{test}})} \\mathbf{1}[y_i = c]`}
          </DisplayMath>

          <p className="mb-4">
            Where <InlineMath>{`N_k(x_{\\text{test}})`}</InlineMath> represents the set of <InlineMath>k</InlineMath> nearest neighbors to the test point.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-foreground">Interactive kNN Visualization</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Number of Neighbors (<InlineMath>k</InlineMath>)</label>
                <input
                  type="range"
                  min="1"
                  max="15"
                  value={k}
                  onChange={(e) => setK(Number(e.target.value))}
                  className="w-full"
                />
                <span className="text-sm text-muted">{k}</span>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Number of Data Points</label>
                <input
                  type="range"
                  min="20"
                  max="100"
                  step="10"
                  value={dataPoints}
                  onChange={(e) => setDataPoints(Number(e.target.value))}
                  className="w-full"
                />
                <span className="text-sm text-muted">{dataPoints}</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Test Point <InlineMath>X</InlineMath></label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={testPoint[0]}
                  onChange={(e) => setTestPoint([Number(e.target.value), testPoint[1]])}
                  className="w-full"
                />
                <span className="text-sm text-muted">{testPoint[0]}</span>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Test Point <InlineMath>Y</InlineMath></label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={testPoint[1]}
                  onChange={(e) => setTestPoint([testPoint[0], Number(e.target.value)])}
                  className="w-full"
                />
                <span className="text-sm text-muted">{testPoint[1]}</span>
              </div>
            </div>
          </div>
          
          <PlotlyCodeEditor
            initialCode={interactiveCode}
            editableRanges={getEditableRanges()}
            plotHeight="600px"
          />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-foreground">Key Concepts</h2>
          
          <div className="space-y-6">
            <AlertVariants.Info title="Choosing k">
              <ul className="space-y-2">
                <li><strong>Small <InlineMath>k</InlineMath> (e.g., <InlineMath>k=1</InlineMath>):</strong> More sensitive to noise, can lead to overfitting</li>
                <li><strong>Large <InlineMath>k</InlineMath>:</strong> Smoother decision boundaries, but may lose local patterns</li>
                <li><strong>Odd <InlineMath>k</InlineMath>:</strong> Helps avoid ties in binary classification</li>
                <li><strong>Rule of thumb:</strong> <InlineMath>{`k \\approx \\sqrt{n}`}</InlineMath>, where <InlineMath>n</InlineMath> is the number of training samples</li>
              </ul>
            </AlertVariants.Info>
            
            <AlertVariants.Note title="Distance Metrics">
              <p className="mb-2">KNN can use different distance metrics:</p>
              <ul className="space-y-2">
                <li><strong>Euclidean:</strong> <InlineMath>{`d = \\sqrt{\\sum_{i=1}^p (x_i - y_i)^2}`}</InlineMath></li>
                <li><strong>Manhattan:</strong> <InlineMath>{`d = \\sum_{i=1}^p |x_i - y_i|`}</InlineMath></li>
                <li><strong>Minkowski:</strong> <InlineMath>{`d = (\\sum_{i=1}^p |x_i - y_i|^q)^{1/q}`}</InlineMath></li>
              </ul>
            </AlertVariants.Note>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-foreground">Advantages and Disadvantages</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <AlertVariants.Correct title="Advantages">
              <ul className="space-y-2">
                <li>→ Simple to understand and implement</li>
                <li>→ No assumptions about data distribution</li>
                <li>→ Works well with small datasets</li>
                <li>→ Can be used for both classification and regression</li>
                <li>→ Naturally handles multi-class problems</li>
              </ul>
            </AlertVariants.Correct>
            
            <AlertVariants.Warning title="Disadvantages">
              <ul className="space-y-2">
                <li>→ Computationally expensive for large datasets</li>
                <li>→ Sensitive to irrelevant features (curse of dimensionality)</li>
                <li>→ Sensitive to scale of features</li>
                <li>→ No model to interpret</li>
                <li>→ Memory intensive (stores all training data)</li>
              </ul>
            </AlertVariants.Warning>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-foreground">Common Misconceptions</h2>
          
          <div className="space-y-6">
            <AlertVariants.Wrong title="Larger k is always better">
              <p>
                While larger k values create smoother decision boundaries and reduce overfitting, 
                they can also lead to underfitting by oversimplifying the decision boundary and 
                missing important local patterns in the data.
              </p>
            </AlertVariants.Wrong>
            
            <AlertVariants.Wrong title="KNN doesn&apos;t need feature scaling">
              <p>
                KNN is highly sensitive to the scale of features because it relies on distance calculations. 
                Features with larger scales will dominate the distance metric, making feature normalization 
                or standardization essential.
              </p>
            </AlertVariants.Wrong>
            
            <AlertVariants.Correct title="KNN is a lazy learning algorithm">
              <p>
                KNN doesn&apos;t build an explicit model during training. Instead, it stores all training data 
                and makes predictions by computing distances at query time, which is why it&apos;s called &quot;lazy&quot; 
                or &quot;instance-based&quot; learning.
              </p>
            </AlertVariants.Correct>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-foreground">Mathematical Foundation</h2>
          
          <div className="space-y-6">
            <AlertVariants.Definition title="Distance Calculation">
              <p className="mb-4">
                For two points <InlineMath>x = (x_1, x_2, ..., x_p)</InlineMath> and <InlineMath>y = (y_1, y_2, ..., y_p)</InlineMath> in <InlineMath>p</InlineMath>-dimensional space, the Euclidean distance is:
              </p>
              <DisplayMath>
                {`d(x, y) = \\sqrt{\\sum_{i=1}^{p} (x_i - y_i)^2}`}
              </DisplayMath>
            </AlertVariants.Definition>
            
            <AlertVariants.Definition title="Classification Rule">
              <p className="mb-4">
                Given <InlineMath>k</InlineMath> nearest neighbors, the predicted class is determined by majority vote:
              </p>
              <DisplayMath>
                {`\\hat{y} = \\arg\\max_{c \\in \\mathcal{C}} \\sum_{i=1}^{k} \\mathbf{1}[y^{(i)} = c]`}
              </DisplayMath>
              <p className="mt-2">
                Where <InlineMath>{`\\mathbf{1}[y^{(i)} = c]`}</InlineMath> is an indicator function that equals <InlineMath>1</InlineMath> if the <InlineMath>i</InlineMath>-th neighbor belongs to class <InlineMath>c</InlineMath>, and <InlineMath>0</InlineMath> otherwise.
              </p>
            </AlertVariants.Definition>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-foreground">Key Takeaways</h2>
          
          <AlertVariants.Takeaways>
            <ul className="space-y-2">
              <li>→ KNN is intuitive: &quot;Tell me who your neighbors are, and I&apos;ll tell you who you are&quot;</li>
              <li>→ The choice of k is crucial and should be validated using cross-validation</li>
              <li>→ Feature scaling is essential for good performance</li>
              <li>→ Consider computational complexity for large datasets</li>
              <li>→ Works well for datasets where local similarity is meaningful</li>
              <li>→ Can provide probability estimates based on neighbor class proportions</li>
            </ul>
          </AlertVariants.Takeaways>
        </section>
      </article>
    </PageLayout>
  );
}