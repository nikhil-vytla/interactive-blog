import { ArticleConfig } from '@/types';

export const pcaConfig: ArticleConfig = {
  id: 'principal-component-analysis',
  title: 'Understanding Principal Component Analysis (PCA)',
  description: '🐧 "Kowalski, analysis!"',
  category: 'Dimensionality Reduction',
  slug: 'principal-component-analysis',
  publishedAt: '2025-06-29',
  tags: ['machine-learning', 'dimensionality-reduction', 'unsupervised-learning', 'pca'],
  colorScheme: 'purple',
  sections: [
    {
      type: 'alert',
      alertType: 'definition',
      title: 'Principal Component Analysis (PCA)',
      content: `
        <p>A statistical procedure that uses an orthogonal transformation to convert a set of observations of possibly correlated variables into a set of values of linearly uncorrelated variables called principal components.</p>
      `
    },
    {
      type: 'text',
      content: `
        <p>PCA is widely used for dimensionality reduction, feature extraction, and data visualization. It works by identifying the directions (principal components) along which the variance in the data is maximal.</p>
        <p>The first principal component accounts for the largest possible variance in the data, and each succeeding component in turn has the highest variance possible under the constraint that it is orthogonal to the preceding components.</p>
      `
    },
    {
      type: 'math',
      title: 'Covariance Matrix',
      content: `
        <p>PCA begins by calculating the covariance matrix of the data, which describes how much two variables change together.</p>
      `,
      mathDisplay: true,
      mathExpression: '\\Sigma = \\frac{1}{n-1} \\sum_{i=1}^{n} (x_i - \\bar{x})(x_i - \\bar{x})^T'
    },
    {
      type: 'text',
      content: `
        <p>Where <em>Σ</em> is the covariance matrix, <em>xᵢ</em> is an observation, and <em>x̄</em> is the mean of the observations.</p>
      `
    },
    {
      type: 'math',
      title: 'Eigenvectors and Eigenvalues',
      content: `
        <p>The principal components are derived from the eigenvectors of the covariance matrix, and the amount of variance explained by each component is given by its corresponding eigenvalue.</p>
      `,
      mathDisplay: true,
      mathExpression: '\\Sigma v = \\lambda v'
    },
    {
      type: 'text',
      content: `
        <p>Here, <em>v</em> represents the eigenvectors (principal components) and <em>λ</em> represents the eigenvalues (variance explained).</p>
      `
    },
    {
      type: 'interactive',
      title: 'Interactive PCA Visualization',
      codeTemplate: 'pca_visualization',
      parameters: [
      ]
    },
    {
      type: 'alert',
      alertType: 'correct',
      title: 'Advantages of PCA',
      content: `
        <ul>
          <li>→ Reduces dimensionality, combating the curse of dimensionality.</li>
          <li>→ Improves model performance by removing noise and redundant features.</li>
          <li>→ Facilitates data visualization in lower dimensions.</li>
          <li>→ Can speed up machine learning algorithms.</li>
        </ul>
      `
    },
    {
      type: 'alert',
      alertType: 'warning',
      title: 'Disadvantages of PCA',
      content: `
        <ul>
          <li>→ Loss of interpretability: Principal components are linear combinations of original features.</li>
          <li>→ Information loss: Some variance is discarded, potentially losing important details.</li>
          <li>→ Sensitive to scaling: PCA is affected by the scale of features.</li>
          <li>→ Assumes linearity: PCA works best when relationships between variables are linear.</li>
        </ul>
      `
    },
    {
      type: 'alert',
      alertType: 'takeaways',
      title: 'Key Takeaways',
      content: `
        <ul>
          <li>→ PCA transforms data into a new coordinate system based on variance.</li>
          <li>→ Principal components are orthogonal and ordered by explained variance.</li>
          <li>→ Useful for dimensionality reduction, visualization, and noise reduction.</li>
          <li>→ Requires feature scaling and can lead to loss of interpretability.</li>
        </ul>
      `
    }
  ]
};
