# Contributing to Nik's Blog (v2025)

Welcome! This guide will help you contribute to our interactive educational blog about mathematics, statistics, and machine learning.

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **Git** for version control

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd interactive-blog
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Verify Setup

Run the validation command to ensure everything is working:
```bash
npm run validate
```

This runs TypeScript checking, linting, and unit tests.

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory (routes)
├── components/             # Reusable UI components
├── content/               # Content management system
│   ├── articles/          # Article configurations
│   │   ├── statistics/    # Statistics articles
│   │   └── machine-learning/ # ML articles
│   ├── templates/         # Code templates
│   └── formulas/          # Math formulas
├── data/                  # Static data (homepage, etc.)
├── lib/                   # External library configurations
├── types/                 # TypeScript type definitions
└── utils/                 # Utility functions
```

## ✍️ Contributing Content

### Adding a New Article

Articles are defined using a configuration-based system. This approach separates content from code and makes it easy to create consistent, interactive articles.

#### 1. Create Article Configuration

Create a new file in the appropriate category directory:

```typescript
// src/content/articles/statistics/my-new-article.ts
import { ArticleConfig } from '@/types';

export const myNewArticleConfig: ArticleConfig = {
  id: 'my-new-article',
  title: 'My New Article',
  description: 'A brief description of what this article covers',
  category: 'Statistics',
  slug: 'my-new-article',
  publishedAt: '2024-01-15',
  tags: ['statistics', 'interactive', 'beginner'],
  readingTime: 5,
  colorScheme: 'blue',
  sections: [
    {
      type: 'text',
      title: 'Introduction',
      content: '<p>Your article content goes here.</p>'
    },
    // More sections...
  ]
};
```

#### 2. Register the Article

Add your article to the content index:

```typescript
// src/content/index.ts
import { myNewArticleConfig } from './articles/statistics/my-new-article';

export const articleRegistry: ArticleConfig[] = [
  // ... existing articles
  myNewArticleConfig,
];
```

#### 3. Create the Route

Create a page component:

```typescript
// src/app/blog/my-new-article/page.tsx
'use client';

import ArticleTemplate from '@/components/ArticleTemplate';
import { myNewArticleConfig } from '@/content/articles/statistics/my-new-article';

export default function MyNewArticlePage() {
  return <ArticleTemplate config={myNewArticleConfig} />;
}
```

#### 4. Add to Homepage (Optional)

Update the homepage data to feature your article:

```typescript
// src/data/homepage.ts
export const articles = [
  // ... existing articles
  {
    id: "my-new-article",
    title: "My New Article",
    description: "Brief description",
    category: "Statistics",
    href: "/blog/my-new-article",
    colorScheme: "blue"
  }
];
```

### Content Section Types

#### Text Sections
Basic HTML content with optional titles:
```typescript
{
  type: 'text',
  title: 'Section Title',
  content: '<p>Your HTML content here</p>'
}
```

#### Math Sections
LaTeX mathematical expressions using KaTeX:
```typescript
{
  type: 'math',
  title: 'Mathematical Formula',
  mathExpression: 'E = mc^2',
  mathDisplay: true // false for inline math
}
```

#### Alert Sections
Highlighted information boxes:
```typescript
{
  type: 'alert',
  alertType: 'info', // 'info', 'warning', 'error', 'success', 'note', 'correct', 'wrong', 'definition', 'takeaways'
  title: 'Important Note',
  content: '<p>Important information</p>'
}
```

#### Interactive Sections
Code simulations with parameter controls:
```typescript
{
  type: 'interactive',
  title: 'Interactive Simulation',
  codeTemplate: 'scatter_plot', // Reference to code template
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

### Content Validation

Always validate your content before submitting:

```bash
npm run validate
```

You can also create a simple validation script:

```typescript
// validate-my-article.ts
import { validateArticleConfig } from '@/utils/contentValidation';
import { myNewArticleConfig } from './src/content/articles/statistics/my-new-article';

const result = validateArticleConfig(myNewArticleConfig);
if (!result.isValid) {
  console.error('Validation errors:', result.errors);
} else {
  console.log('Article is valid!');
}
```

## 🔧 Technical Contributions

### Code Style

- **TypeScript**: Strongly typed, no `any` types
- **React**: Functional components with hooks
- **Styling**: TailwindCSS utility classes
- **Formatting**: Prettier (runs automatically)

### Component Guidelines

1. **Single Responsibility**: Each component should have one clear purpose
2. **Prop Types**: Always define TypeScript interfaces for props
3. **Error Handling**: Include error boundaries where appropriate
4. **Accessibility**: Follow ARIA guidelines

### Adding Code Templates

Code templates are reusable Python snippets with parameterized values:

```typescript
// src/content/templates/index.ts
export const myTemplate: CodeTemplate = {
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
};
```

### Testing

- **Unit Tests**: Components and utilities
- **E2E Tests**: Critical user journeys
- **Content Validation**: Article configurations

Run tests:
```bash
npm test              # Unit tests
npm run test:e2e      # End-to-end tests
npm run test:all      # All tests
```

## 📝 Writing Guidelines

### Educational Content

1. **Start Simple**: Begin with basic concepts before advanced topics
2. **Use Examples**: Include concrete, relatable examples
3. **Interactive Elements**: Leverage parameters and visualizations
4. **Clear Explanations**: Avoid jargon, define technical terms
5. **Progressive Disclosure**: Layer complexity gradually

### Mathematical Content

1. **KaTeX Syntax**: Use proper LaTeX formatting
2. **Variable Definitions**: Always define mathematical symbols
3. **Step-by-Step**: Break complex derivations into steps
4. **Visual Aids**: Include plots and diagrams when helpful

### Code Examples

1. **Self-Contained**: Code should run independently
2. **Well-Commented**: Explain what the code does
3. **Error Handling**: Handle edge cases gracefully
4. **Performance**: Consider execution time for interactive elements

## 🛠️ Development Workflow

### Branch Strategy

1. **Create feature branch**: `git checkout -b feature/article-name`
2. **Make changes**: Follow the contribution guidelines
3. **Test thoroughly**: Run all validation checks
4. **Submit PR**: Include description and preview screenshots

### Pull Request Guidelines

1. **Clear Title**: Describe what your PR does
2. **Description**: Explain the changes and their purpose
3. **Testing**: Describe how you tested your changes
4. **Screenshots**: Include before/after visuals for UI changes
5. **Validation**: Ensure all checks pass

### Code Review Process

1. **Automated Checks**: TypeScript, ESLint, tests must pass
2. **Content Review**: Educational value and accuracy
3. **Technical Review**: Code quality and performance
4. **Accessibility Review**: ARIA compliance and usability

## 🎯 Content Standards

### Article Quality

- **Educational Value**: Teaches clear concepts
- **Interactivity**: Uses parameters and visualizations effectively
- **Accuracy**: Content is factually correct
- **Clarity**: Writing is clear and well-structured
- **Completeness**: Covers the topic comprehensively

### Technical Quality

- **Performance**: Interactive elements load quickly
- **Accessibility**: Works with screen readers
- **Mobile-Friendly**: Responsive design
- **Browser Compatibility**: Works across modern browsers

## 🆘 Getting Help

### Common Issues

1. **Build Errors**: Check TypeScript types and imports
2. **Content Not Showing**: Verify article registration
3. **Math Not Rendering**: Check KaTeX syntax
4. **Tests Failing**: Run `npm run validate` to identify issues

### Resources

- **Article System Documentation**: See `ARTICLE_SYSTEM.md`
- **Component Documentation**: Inline JSDoc comments
- **Math Syntax**: [KaTeX Documentation](https://katex.org/docs/supported.html)
- **Plotting**: [Plotly.js Documentation](https://plotly.com/javascript/)

### Getting Support

1. **Check existing issues** in the repository
2. **Search documentation** for similar problems  
3. **Create detailed issue** with reproduction steps
4. **Join discussions** for broader questions

## 🏗️ Project Architecture

### Key Technologies

- **Next.js 15**: React framework with App Router
- **TypeScript**: Type safety and better DX
- **TailwindCSS**: Utility-first styling
- **Pyodide**: Python in WebAssembly
- **Plotly.js**: Interactive visualizations
- **KaTeX**: Mathematical notation rendering
- **CodeMirror**: Code editing interface

### Design Patterns

- **Configuration over Code**: Articles defined as data
- **Component Composition**: Reusable, focused components
- **Type Safety**: Comprehensive TypeScript coverage
- **Content Validation**: Automated quality checks

Thank you for contributing to make mathematical and statistical education more interactive and accessible! 🎓