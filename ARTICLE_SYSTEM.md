# Article Configuration System

This document explains how to create interactive blog posts using the article configuration system.

## Overview

The system uses JSON-like configuration files to define article structure and content. This approach ensures consistency, reusability, and separation of content from presentation.

## Quick Start

1.  **Create Article Configuration**: Define your article's content and metadata in a TypeScript file (e.g., `my-article.ts`) within `src/content/articles/your-category/`.

    ```typescript
    // src/content/articles/machine-learning/my-article.ts
    import { ArticleConfig } from '@/types';

    export const myArticleConfig: ArticleConfig = {
      id: 'my-article',
      title: 'My Interactive Article',
      description: 'A sample article using the new system',
      category: 'Machine Learning',
      slug: 'my-article',
      publishedAt: '2024-01-15',
      tags: ['machine-learning', 'interactive'],
      colorScheme: 'green', // 'blue', 'green', 'purple', 'red', 'yellow'
      sections: [
        // Define your content sections here
      ]
    };
    ```

2.  **Create Page Component**: Create a Next.js page (e.g., `page.tsx`) in `src/app/blog/my-article/` that uses the `ArticleTemplate` component with your article configuration.

    ```typescript
    // src/app/blog/my-article/page.tsx
    'use client';

    import ArticleTemplate from '@/components/ArticleTemplate';
    import { myArticleConfig } from '@/content/articles/machine-learning/my-article'; // Adjust path

    export default function MyArticlePage() {
      return <ArticleTemplate config={myArticleConfig} />;
    }
    ```

3.  **Register Article**: Add your article configuration to `src/content/index.ts` to make it discoverable by the application.

    ```typescript
    // src/content/index.ts
    import { kNearestNeighborsConfig } from './articles/machine-learning/k-nearest-neighbors';
    import { pValuesConfig } from './articles/statistics/p-values';
    import { myArticleConfig } from './articles/machine-learning/my-article'; // Your new article

    export const articleRegistry = [
      kNearestNeighborsConfig,
      pValuesConfig,
      myArticleConfig, // Add your article here
    ];
    // ... other exports
    ```

## Content Section Types

Articles are composed of various sections:

*   **Text**: Formatted text content.
    ```typescript
    { type: 'text', title?: string, content: '<p>HTML content</p>' }
    ```
*   **Math**: Render mathematical expressions using KaTeX.
    ```typescript
    { type: 'math', mathExpression: 'E = mc^2', mathDisplay?: boolean } // mathDisplay: true for block, false for inline
    ```
*   **Alert**: Styled alert boxes for important information.
    ```typescript
    { type: 'alert', alertType: 'info', title?: string, content: '<p>Alert message</p>' }
    // alertType: 'info', 'warning', 'error', 'success', 'note', 'correct', 'wrong', 'definition', 'takeaways'
    ```
*   **Interactive**: Embed interactive Python code with parameters and Plotly visualizations.
    ```typescript
    {
      type: 'interactive',
      title?: string,
      codeTemplate: 'scatter_plot', // ID of a code template
      parameters: [ /* Parameter definitions */ ]
    }
    ```

## Interactive Parameters

Interactive sections use parameters to control the Python code. Supported types:

*   **`range`**: Slider for numerical input.
    ```typescript
    { name: 'k', label: 'Number of Neighbors (k)', type: 'range', defaultValue: 5, min: 1, max: 20, step: 1 }
    ```
*   **`number`**: Numeric input field.
    ```typescript
    { name: 'mean', label: 'Mean (μ)', type: 'number', defaultValue: 0, min: -5, max: 5, step: 0.1 }
    ```
*   **`select`**: Dropdown for predefined options.
    ```typescript
    { name: 'distribution', label: 'Distribution', type: 'select', defaultValue: 'normal', options: [{ label: 'Normal', value: 'normal' }] }
    ```
*   **`checkbox`**: Boolean toggle.
    ```typescript
    { name: 'show_legend', label: 'Show Legend', type: 'checkbox', defaultValue: true }
    ```
*   **`text`**: Single-line text input.
    ```typescript
    { name: 'title', label: 'Plot Title', type: 'text', defaultValue: 'My Plot' }
    ```
*   **`array`**: Comma-separated string parsed into an array.
    ```typescript
    { name: 'data', label: 'Data Points', type: 'array', defaultValue: [1,2,3] }
    ```

## Code Templates

Code templates are reusable Python snippets defined in `src/content/templates/index.ts`. They are executed client-side using Pyodide.

### Available Templates:

*   `scatter_plot`
*   `histogram`
*   `hypothesis_test`
*   `knn_classifier`
*   `central_limit_theorem`

## Troubleshooting

*   **Parameter not updating**: Check if the parameter `name` in your article config matches the placeholder in the `codeTemplate` (e.g., `{param_name}`).
*   **Math not rendering**: Verify KaTeX syntax.
*   **Code not executing**: Check browser console for Pyodide errors. Ensure all required Python libraries are listed in the template's `libraries` array.

## Future Enhancements

*   Visual article editor
*   Markdown content support
*   Dynamic template loading
