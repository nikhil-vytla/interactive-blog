import numpy as np
import plotly.graph_objects as go
import plotly.express as px
from sklearn.decomposition import PCA
from sklearn.datasets import load_iris
from sklearn.preprocessing import StandardScaler
import pandas as pd

# Load Iris dataset
iris = load_iris()
df = pd.DataFrame(iris.data, columns=iris.feature_names)
df['species'] = iris.target_names[iris.target]

features = iris.feature_names
X = df[features]

# Standardize the data
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Perform PCA
pca = PCA(n_components=2)
components = pca.fit_transform(X_scaled)

# Create a DataFrame for components for easier plotting with Plotly Express
components_df = pd.DataFrame(components, columns=['PC1', 'PC2'])
components_df['species'] = df['species']

# Calculate loadings
loadings = pca.components_.T * np.sqrt(pca.explained_variance_)

# Create scatter plot with Plotly Express
fig = px.scatter(components_df, x='PC1', y='PC2', color='species',
                 title='PCA Biplot of Iris Dataset',
                 labels={'PC1': f'Principal Component 1 ({pca.explained_variance_ratio_[0]*100:.1f}%)',
                         'PC2': f'Principal Component 2 ({pca.explained_variance_ratio_[1]*100:.1f}%)'})

# Add loadings as annotations
for i, feature in enumerate(features):
    fig.add_annotation(
        ax=0, ay=0,
        axref="x", ayref="y",
        x=loadings[i, 0],
        y=loadings[i, 1],
        showarrow=True,
        arrowsize=2,
        arrowhead=2,
        xanchor="right",
        yanchor="top",
        font=dict(color="#000000", size=10)
    )
    fig.add_annotation(
        x=loadings[i, 0],
        y=loadings[i, 1],
        ax=0, ay=0,
        xanchor="center",
        yanchor="bottom",
        text=feature,
        yshift=5,
        font=dict(color="#000000", size=10)
    )

# Adjust layout for biplot
fig.update_layout(
    hovermode='closest',
    xaxis=dict(showgrid=True, zeroline=True, showline=True, linewidth=1, linecolor='black', mirror=True),
    yaxis=dict(showgrid=True, zeroline=True, showline=True, linewidth=1, linecolor='black', mirror=True),
    height=600
)

print(f"Explained variance ratio: {pca.explained_variance_ratio_}")
print(f"Principal components: {pca.components_}")