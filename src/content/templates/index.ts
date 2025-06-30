import { CodeTemplate } from '@/types';

import scatterPlotCode from '../python_code/scatter_plot.py?raw';
import histogramCode from '../python_code/histogram.py?raw';
import hypothesisTestCode from '../python_code/hypothesis_test.py?raw';
import knnClassifierCode from '../python_code/knn_classifier.py?raw';
import centralLimitTheoremCode from '../python_code/central_limit_theorem.py?raw';
import pcaVisualizationCode from '../python_code/pca_visualization.py?raw';

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
    code: scatterPlotCode
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
    code: histogramCode
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
    code: hypothesisTestCode
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
    code: knnClassifierCode
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
    code: centralLimitTheoremCode
  },
  {
    id: 'pca_visualization',
    name: 'Principal Component Analysis Visualization',
    description: 'Visualize PCA on a 2D dataset, showing principal components and explained variance.',
    category: 'ml',
    libraries: ['numpy', 'pandas', 'sklearn', 'plotly'],
    parameters: [
    ],
    code: pcaVisualizationCode
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