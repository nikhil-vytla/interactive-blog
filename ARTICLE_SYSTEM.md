# Article Configuration System

This document explains how to use the new article configuration system to create interactive blog posts quickly and consistently.

## Overview

The article system is built around JSON configuration files that define the structure and content of blog posts. This approach provides:

- **Consistency**: All articles follow the same structure
- **Reusability**: Common components and templates can be shared
- **Maintainability**: Content is separated from presentation logic
- **Extensibility**: Easy to add new content types and features

## Quick Start

1. Create an article configuration file in `src/data/articles/`
2. Create a page component that uses `ArticleTemplate`
3. Add the route to your Next.js app directory

### Example Article Configuration

```typescript
import { ArticleConfig } from '@/types';

export const myArticleConfig: ArticleConfig = {
  id: 'my-article',
  title: 'My Interactive Article',
  description: 'A sample article using the new system',
  category: 'Statistics',
  slug: 'my-article',
  publishedAt: '2024-01-15',
  tags: ['statistics', 'interactive'],
  colorScheme: 'blue',
  sections: [
    {
      type: 'text',
      title: 'Introduction',
      content: '<p>This is a sample article section.</p>'
    },
    {
      type: 'interactive',
      title: 'Interactive Visualization',
      codeTemplate: 'scatter_plot',
      parameters: [
        {
          name: 'n_points',
          label: 'Number of Points',
          type: 'range',
          defaultValue: 50,
          min: 10,
          max: 100
        }
      ]
    }
  ]
};
```

### Page Component

```typescript
'use client';

import ArticleTemplate from '@/components/ArticleTemplate';
import { myArticleConfig } from '@/data/articles/myArticle';

export default function MyArticlePage() {
  return <ArticleTemplate config={myArticleConfig} />;
}
```

## Content Section Types

### 1. Text Sections

Display formatted text content with optional titles.

```typescript
{
  type: 'text',
  title: 'Section Title',
  content: '<p>HTML content goes here</p>'
}
```

### 2. Math Sections

Render mathematical expressions using KaTeX.

```typescript
{
  type: 'math',
  title: 'Mathematical Formula',
  mathExpression: 'E = mc^2',
  mathDisplay: true // false for inline math
}
```

### 3. Alert Sections

Highlight important information with styled alert boxes.

```typescript
{
  type: 'alert',
  alertType: 'info', // 'info', 'warning', 'error', 'success', 'note', 'correct', 'wrong', 'definition', 'takeaways'
  title: 'Important Note',
  content: '<p>This is important information</p>'
}
```

### 4. Code Sections

Display code editors with syntax highlighting.

```typescript
{
  type: 'code',
  title: 'Code Example',
  codeTemplate: 'print("Hello, World!")',
  editableRanges: [{ from: 0, to: 10 }]
}
```

### 5. Interactive Sections

Create interactive visualizations using code templates and parameters.

```typescript
{
  type: 'interactive',
  title: 'Interactive Simulation',
  codeTemplate: 'scatter_plot', // Reference to code template ID
  parameters: [
    {
      name: 'n_points',
      label: 'Number of Points',
      type: 'range',
      defaultValue: 50,
      min: 10,
      max: 100
    }
  ]
}
```

## Parameter Types

### Range Parameters

```typescript
{
  name: 'value',
  label: 'Value',
  type: 'range',
  defaultValue: 50,
  min: 0,
  max: 100,
  step: 1
}
```

### Number Parameters

```typescript
{
  name: 'precision',
  label: 'Precision',
  type: 'number',
  defaultValue: 2,
  min: 0,
  max: 10
}
```

### Select Parameters

```typescript
{
  name: 'distribution',
  label: 'Distribution Type',
  type: 'select',
  defaultValue: 'normal',
  options: [
    { label: 'Normal', value: 'normal' },
    { label: 'Uniform', value: 'uniform' }
  ]
}
```

### Checkbox Parameters

```typescript
{
  name: 'show_legend',
  label: 'Show Legend',
  type: 'checkbox',
  defaultValue: true
}
```

## Code Templates

Code templates are reusable Python code snippets with parameterized values. They're defined in `src/data/codeTemplates.ts`.

### Available Templates

- `scatter_plot`: Basic scatter plot with correlation
- `histogram`: Distribution visualization
- `hypothesis_test`: One-sample t-test
- `knn_classifier`: k-NN classification
- `central_limit_theorem`: CLT demonstration

### Creating Custom Templates

```typescript
{
  id: 'my_template',
  name: 'My Custom Template',
  description: 'A custom visualization template',
  category: 'visualization',
  libraries: ['numpy', 'plotly'],
  parameters: [
    {
      name: 'sample_size',
      label: 'Sample Size',
      type: 'range',
      defaultValue: 100,
      min: 10,
      max: 1000
    }
  ],
  code: `
import numpy as np
import plotly.graph_objects as go

# Parameters
n = {sample_size}

# Your code here
data = np.random.normal(0, 1, n)
fig = go.Figure(data=go.Histogram(x=data))
fig.show()
  `
}
```

## Math Formula Library

The system includes a library of common mathematical formulas in `src/data/mathFormulas.ts`.

### Using Formulas

```typescript
import { getFormulaById } from '@/data/mathFormulas';

const formula = getFormulaById('normal_distribution');
// Use formula.expression in your math sections
```

### Available Formulas

- Statistics: mean, variance, standard deviation, normal distribution, z-score
- Machine Learning: euclidean distance, kNN classification, linear regression
- Probability: Bayes' theorem, conditional probability

## Best Practices

### 1. Content Organization

- Keep article configurations in `src/data/articles/`
- Use descriptive filenames and export names
- Group related articles by topic

### 2. Parameter Design

- Use descriptive labels and help text
- Set reasonable min/max values
- Provide good default values
- Consider the user experience

### 3. Code Templates

- Make templates focused and reusable
- Include clear comments
- Handle edge cases gracefully
- Print useful information for users

### 4. Math Expressions

- Use clear variable names
- Include variable descriptions
- Test expressions in KaTeX
- Consider both inline and display modes

## Adding New Articles

1. **Create the configuration file**:
   ```bash
   touch src/data/articles/myNewArticle.ts
   ```

2. **Define the article structure**:
   ```typescript
   export const myNewArticleConfig: ArticleConfig = {
     // Configuration here
   };
   ```

3. **Create the page component**:
   ```bash
   mkdir -p src/app/blog/my-new-article
   touch src/app/blog/my-new-article/page.tsx
   ```

4. **Add to homepage data** (optional):
   ```typescript
   // In src/data/homepage.ts
   export const articles = [
     // ... existing articles
     {
       id: "my-new-article",
       title: "My New Article",
       description: "Description here",
       category: "Category",
       href: "/blog/my-new-article",
       colorScheme: "blue"
     }
   ];
   ```

## Migration Guide

To convert existing articles to the new system:

1. Extract content sections from JSX
2. Convert to configuration format
3. Replace custom components with standard sections
4. Move interactive parameters to parameter definitions
5. Test thoroughly

## Troubleshooting

### Common Issues

1. **Parameter not updating**: Check parameter name matches template placeholder
2. **Math not rendering**: Verify KaTeX syntax
3. **Code not executing**: Ensure all required libraries are included
4. **Template not found**: Check template ID and import

### Debugging Tips

- Use browser developer tools to check console errors
- Validate article configuration with `validateArticleConfig()`
- Test templates individually before integration
- Check parameter value types match expected format

## Future Enhancements

Planned improvements to the article system:

- [ ] Visual article editor
- [ ] Markdown content support
- [ ] Dynamic template loading
- [ ] Article versioning
- [ ] Content management interface
- [ ] Export to different formats