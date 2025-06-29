import { MathFormula } from '@/types';

export const mathFormulas: MathFormula[] = [
  // Statistics
  {
    id: 'mean',
    name: 'Sample Mean',
    description: 'Average value of a dataset',
    expression: '\\bar{x} = \\frac{1}{n} \\sum_{i=1}^{n} x_i',
    variables: [
      { symbol: '\\bar{x}', description: 'Sample mean' },
      { symbol: 'n', description: 'Number of observations' },
      { symbol: 'x_i', description: 'Individual observation' }
    ],
    category: 'statistics'
  },
  {
    id: 'variance',
    name: 'Sample Variance',
    description: 'Measure of data spread',
    expression: 's^2 = \\frac{1}{n-1} \\sum_{i=1}^{n} (x_i - \\bar{x})^2',
    variables: [
      { symbol: 's^2', description: 'Sample variance' },
      { symbol: '\\bar{x}', description: 'Sample mean' },
      { symbol: 'n', description: 'Number of observations' }
    ],
    category: 'statistics'
  },
  {
    id: 'standard_deviation',
    name: 'Standard Deviation',
    description: 'Square root of variance',
    expression: 's = \\sqrt{s^2} = \\sqrt{\\frac{1}{n-1} \\sum_{i=1}^{n} (x_i - \\bar{x})^2}',
    variables: [
      { symbol: 's', description: 'Sample standard deviation' },
      { symbol: 's^2', description: 'Sample variance' }
    ],
    category: 'statistics'
  },
  {
    id: 'normal_distribution',
    name: 'Normal Distribution PDF',
    description: 'Probability density function of normal distribution',
    expression: 'f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}} e^{-\\frac{1}{2}\\left(\\frac{x-\\mu}{\\sigma}\\right)^2}',
    variables: [
      { symbol: '\\mu', description: 'Population mean' },
      { symbol: '\\sigma', description: 'Population standard deviation' },
      { symbol: 'x', description: 'Random variable' }
    ],
    category: 'statistics'
  },
  {
    id: 'z_score',
    name: 'Z-Score',
    description: 'Standardized score',
    expression: 'z = \\frac{x - \\mu}{\\sigma}',
    variables: [
      { symbol: 'z', description: 'Z-score (standardized value)' },
      { symbol: 'x', description: 'Observed value' },
      { symbol: '\\mu', description: 'Population mean' },
      { symbol: '\\sigma', description: 'Population standard deviation' }
    ],
    category: 'statistics'
  },
  {
    id: 'confidence_interval',
    name: 'Confidence Interval for Mean',
    description: 'Range of plausible values for population mean',
    expression: '\\bar{x} \\pm t_{\\alpha/2, n-1} \\cdot \\frac{s}{\\sqrt{n}}',
    variables: [
      { symbol: '\\bar{x}', description: 'Sample mean' },
      { symbol: 't_{\\alpha/2, n-1}', description: 'Critical t-value' },
      { symbol: 's', description: 'Sample standard deviation' },
      { symbol: 'n', description: 'Sample size' }
    ],
    category: 'statistics'
  },

  // Machine Learning
  {
    id: 'euclidean_distance',
    name: 'Euclidean Distance',
    description: 'Distance between two points in Euclidean space',
    expression: 'd(x, y) = \\sqrt{\\sum_{i=1}^{p} (x_i - y_i)^2}',
    variables: [
      { symbol: 'd(x, y)', description: 'Distance between points x and y' },
      { symbol: 'p', description: 'Number of dimensions' },
      { symbol: 'x_i, y_i', description: 'Coordinates of points' }
    ],
    category: 'machine_learning'
  },
  {
    id: 'manhattan_distance',
    name: 'Manhattan Distance',
    description: 'Sum of absolute differences',
    expression: 'd(x, y) = \\sum_{i=1}^{p} |x_i - y_i|',
    variables: [
      { symbol: 'd(x, y)', description: 'Manhattan distance' },
      { symbol: 'p', description: 'Number of dimensions' }
    ],
    category: 'machine_learning'
  },
  {
    id: 'knn_classification',
    name: 'k-NN Classification',
    description: 'Classification by majority vote',
    expression: '\\hat{y} = \\arg\\max_{c \\in \\mathcal{C}} \\sum_{i=1}^{k} \\mathbf{1}[y^{(i)} = c]',
    variables: [
      { symbol: '\\hat{y}', description: 'Predicted class' },
      { symbol: 'c', description: 'Class label' },
      { symbol: 'k', description: 'Number of neighbors' },
      { symbol: '\\mathbf{1}[\\cdot]', description: 'Indicator function' }
    ],
    category: 'machine_learning'
  },
  {
    id: 'linear_regression',
    name: 'Linear Regression',
    description: 'Linear relationship between variables',
    expression: 'y = \\beta_0 + \\beta_1 x + \\epsilon',
    variables: [
      { symbol: 'y', description: 'Dependent variable' },
      { symbol: '\\beta_0', description: 'Intercept' },
      { symbol: '\\beta_1', description: 'Slope coefficient' },
      { symbol: 'x', description: 'Independent variable' },
      { symbol: '\\epsilon', description: 'Error term' }
    ],
    category: 'machine_learning'
  },
  {
    id: 'mse',
    name: 'Mean Squared Error',
    description: 'Average of squared differences',
    expression: 'MSE = \\frac{1}{n} \\sum_{i=1}^{n} (y_i - \\hat{y}_i)^2',
    variables: [
      { symbol: 'y_i', description: 'Actual value' },
      { symbol: '\\hat{y}_i', description: 'Predicted value' },
      { symbol: 'n', description: 'Number of observations' }
    ],
    category: 'machine_learning'
  },

  // Probability
  {
    id: 'bayes_theorem',
    name: 'Bayes\' Theorem',
    description: 'Conditional probability relationship',
    expression: 'P(A|B) = \\frac{P(B|A) \\cdot P(A)}{P(B)}',
    variables: [
      { symbol: 'P(A|B)', description: 'Posterior probability' },
      { symbol: 'P(B|A)', description: 'Likelihood' },
      { symbol: 'P(A)', description: 'Prior probability' },
      { symbol: 'P(B)', description: 'Evidence' }
    ],
    category: 'probability'
  },
  {
    id: 'conditional_probability',
    name: 'Conditional Probability',
    description: 'Probability of A given B',
    expression: 'P(A|B) = \\frac{P(A \\cap B)}{P(B)}',
    variables: [
      { symbol: 'P(A|B)', description: 'Conditional probability' },
      { symbol: 'P(A \\cap B)', description: 'Joint probability' },
      { symbol: 'P(B)', description: 'Probability of B' }
    ],
    category: 'probability'
  }
];

// Helper functions for formula retrieval
export const getFormulasByCategory = (category: string): MathFormula[] => {
  return mathFormulas.filter(formula => formula.category === category);
};

export const getFormulaById = (id: string): MathFormula | undefined => {
  return mathFormulas.find(formula => formula.id === id);
};

export const getAllCategories = (): string[] => {
  return [...new Set(mathFormulas.map(formula => formula.category))];
};

// Common formula builders
export const buildSummation = (
  expression: string, 
  variable: string = 'i', 
  start: string = '1', 
  end: string = 'n'
): string => {
  return `\\sum_{${variable}=${start}}^{${end}} ${expression}`;
};

export const buildFraction = (numerator: string, denominator: string): string => {
  return `\\frac{${numerator}}{${denominator}`;
};

export const buildSquareRoot = (expression: string): string => {
  return `\\sqrt{${expression}}`;
};

export const buildExponential = (base: string, exponent: string): string => {
  return `${base}^{${exponent}}`;
};

export const buildSubscript = (base: string, subscript: string): string => {
  return `${base}_{${subscript}}`;
};

export const buildBar = (variable: string): string => {
  return `\\bar{${variable}}`;
};

export const buildHat = (variable: string): string => {
  return `\\hat{${variable}}`;
};