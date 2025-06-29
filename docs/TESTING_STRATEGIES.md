# UI Testing Strategies

This document outlines strategies for writing robust and maintainable UI tests, resilient to frequent content changes.

## Core Principles

### 1. Test Behavior, Not Exact Copy

Focus on how the UI behaves and responds to user interactions, rather than asserting on exact text strings. This makes tests resilient to copy updates.

```typescript
// ❌ Brittle: Fails when UI text changes
expect(screen.getByText('Welcome to our amazing blog')).toBeInTheDocument();

// ✅ Flexible: Tests semantic structure and behavior
expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
expect(screen.getByRole('heading', { level: 1 }).textContent).toMatch(/welcome/i);
```

### 2. Leverage Semantic HTML & Accessibility Roles

Prioritize selectors based on semantic HTML elements and ARIA roles. These are more stable than CSS classes or text content.

```typescript
// ✅ Prefer semantic roles
expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
expect(screen.getByRole('navigation')).toBeInTheDocument();

// ❌ Avoid fragile selectors
expect(screen.getByTestId('submit-btn')).toBeInTheDocument(); // Use sparingly for critical elements
```

### 3. Data-Driven Testing

When testing components that render dynamic content, drive your tests directly from the data source.

```typescript
// ✅ Tests dynamic content from data
import { features } from '@/data/homepage'; // Example data source

features.forEach(feature => {
  expect(screen.getByRole('heading', { name: new RegExp(feature.title, 'i'), level: 3 })).toBeInTheDocument();
});
```

### 4. Flexible Assertions

Use regular expressions or partial matches for text content when exact strings are not critical.

```typescript
// ✅ Flexible text matching
expect(screen.getByText(/statistics.*concepts/i)).toBeInTheDocument();

// ✅ Key word matching
expect(screen.getByText(new RegExp(['python', 'code', 'browser'].join('.*'), 'i'))).toBeInTheDocument();
```

### 5. Test Layout & Visual Structure

Verify the correct application of CSS classes and responsive behavior without coupling to specific content.

```typescript
// ✅ Tests responsive grid layout
const grids = container.querySelectorAll('.grid');
expect(grids.length).toBeGreaterThan(0);
expect(container.querySelector('[class*="md:grid-cols"]')).toBeInTheDocument();
```

### 6. Component Count Verification

Assert on the expected number of components or sections to ensure all dynamic content is rendered.

```typescript
// ✅ Tests that all articles render
import { articleRegistry } from '@/content'; // Example data source

const articles = screen.getAllByRole('article');
expect(articles.length).toBe(articleRegistry.length);

// ✅ Tests minimum required sections
const sections = screen.getAllByRole('heading', { level: 2 });
expect(sections.length).toBeGreaterThanOrEqual(4);
```

## Benefits

*   **Resilience**: Tests are less prone to breaking from minor UI changes.
*   **Maintainability**: Reduced effort in updating tests when content or styling evolves.
*   **User-Centric**: Focuses on the actual user experience and functionality.
*   **Accessibility**: Encourages the use of semantic HTML and ARIA roles.

## When to Use Exact Text

Exact text matching is appropriate for:

*   Error messages
*   Critical user prompts (e.g., confirmation dialogs)
*   Legal or compliance text
*   Brand names and specific terminology
