import { ArticleConfig } from '@/types';

export const kNearestNeighborsConfig: ArticleConfig = {
  id: 'k-nearest-neighbors',
  title: 'k-Nearest Neighbors (kNN)',
  description: '🫂 Like a good neighbor, "kNN Farm" (™️) is there.',
  category: 'Machine Learning',
  slug: 'k-nearest-neighbors',
  publishedAt: '2025-06-28',
  tags: ['machine-learning', 'classification', 'supervised-learning', 'knn'],
  colorScheme: 'green',
  sections: [
    {
      type: 'alert',
      alertType: 'definition',
      title: 'k-Nearest Neighbors (kNN)',
      content: `
        <p>A simple, non-parametric algorithm that classifies data points based on the class of their <em>k</em> nearest neighbors in the feature space. It uses the principle that similar data points tend to have similar labels.</p>
      `
    },
    {
      type: 'text',
      content: `
        <p>kNN works by finding the <em>k</em> closest data points to a query point and assigning the most common class among these neighbors. The distance is typically measured using Euclidean distance in the feature space.</p>
        
        <p>For a test point <em>x<sub>test</sub></em> and training points {<em>x<sub>1</sub>, x<sub>2</sub>, ..., x<sub>n</sub></em>}, the algorithm follows a simple process.</p>
      `
    },
    {
      type: 'math',
      mathDisplay: true,
      mathExpression: '\\text{prediction} = \\arg\\max_{c} \\sum_{i \\in N_k(x_{\\text{test}})} \\mathbf{1}[y_i = c]'
    },
    {
      type: 'text',
      content: `
        <p>Where <em>N<sub>k</sub>(x<sub>test</sub>)</em> represents the set of <em>k</em> nearest neighbors to the test point.</p>
      `
    },
    {
      type: 'interactive',
      title: 'Interactive kNN Visualization',
      codeTemplate: 'knn_classifier',
      parameters: [
        {
          name: 'k',
          label: 'Number of Neighbors (k)',
          type: 'range',
          defaultValue: 5,
          min: 1,
          max: 15,
          step: 1,
          description: 'Number of nearest neighbors to consider'
        },
        {
          name: 'n_samples',
          label: 'Number of Data Points',
          type: 'range',
          defaultValue: 80,
          min: 50,
          max: 150,
          step: 10,
          description: 'Total number of training samples'
        },
        {
          name: 'test_x',
          label: 'Test Point X',
          type: 'range',
          defaultValue: 0.5,
          min: 0,
          max: 1,
          step: 0.1,
          description: 'X coordinate of test point'
        },
        {
          name: 'test_y',
          label: 'Test Point Y',
          type: 'range',
          defaultValue: 0.5,
          min: 0,
          max: 1,
          step: 0.1,
          description: 'Y coordinate of test point'
        }
      ]
    },
    {
      type: 'text',
      title: 'Key Concepts',
      content: `
        <p>Understanding kNN requires grasping several important concepts about how the algorithm makes decisions.</p>
      `
    },
    {
      type: 'alert',
      alertType: 'info',
      title: 'Choosing k',
      content: `
        <ul>
          <li><strong>Small k (e.g., k=1):</strong> More sensitive to noise, can lead to overfitting</li>
          <li><strong>Large k:</strong> Smoother decision boundaries, but may lose local patterns</li>
          <li><strong>Odd k:</strong> Helps avoid ties in binary classification</li>
          <li><strong>Rule of thumb:</strong> k ≈ √n, where n is the number of training samples</li>
        </ul>
      `
    },
    {
      type: 'alert',
      alertType: 'note',
      title: 'Distance Metrics',
      content: `
        <p>kNN can use different distance metrics:</p>
        <ul>
          <li><strong>Euclidean:</strong> Standard straight-line distance</li>
          <li><strong>Manhattan:</strong> Sum of absolute differences</li>
          <li><strong>Minkowski:</strong> Generalized distance metric</li>
        </ul>
      `
    },
    {
      type: 'math',
      title: 'Distance Formulas',
      content: `
        <p>Euclidean Distance:</p>
      `,
      mathDisplay: true,
      mathExpression: 'd = \\sqrt{\\sum_{i=1}^p (x_i - y_i)^2}'
    },
    {
      type: 'text',
      title: 'Advantages and Disadvantages',
      content: `
        <p>Like any algorithm, kNN has both strengths and weaknesses that make it suitable for certain types of problems.</p>
      `
    },
    {
      type: 'alert',
      alertType: 'correct',
      title: 'Advantages',
      content: `
        <ul>
          <li>→ Simple to understand and implement</li>
          <li>→ No assumptions about data distribution</li>
          <li>→ Works well with small datasets</li>
          <li>→ Can be used for both classification and regression</li>
          <li>→ Naturally handles multi-class problems</li>
        </ul>
      `
    },
    {
      type: 'alert',
      alertType: 'warning',
      title: 'Disadvantages',
      content: `
        <ul>
          <li>→ Computationally expensive for large datasets</li>
          <li>→ Sensitive to irrelevant features (curse of dimensionality)</li>
          <li>→ Sensitive to scale of features</li>
          <li>→ No model to interpret</li>
          <li>→ Memory intensive (stores all training data)</li>
        </ul>
      `
    },
    {
      type: 'alert',
      alertType: 'wrong',
      title: 'Common Misconception: Larger k is always better',
      content: `
        <p>While larger k values create smoother decision boundaries and reduce overfitting, they can also lead to underfitting by oversimplifying the decision boundary and missing important local patterns in the data.</p>
      `
    },
    {
      type: 'alert',
      alertType: 'takeaways',
      title: 'Key Takeaways',
      content: `
        <ul>
          <li>→ kNN is intuitive: "Tell me who your neighbors are, and I'll tell you who you are"</li>
          <li>→ The choice of k is crucial and should be validated using cross-validation</li>
          <li>→ Feature scaling is essential for good performance</li>
          <li>→ Consider computational complexity for large datasets</li>
          <li>→ Works well for datasets where local similarity is meaningful</li>
          <li>→ Can provide probability estimates based on neighbor class proportions</li>
        </ul>
      `
    }
  ]
};