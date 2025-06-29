# Testing Strategies for Flexible UI Tests

This document outlines strategies to make your tests more resilient to copy changes while maintaining reliability.

## 1. Test Structure Over Content

Instead of testing exact text, focus on semantic structure:

```typescript
// ❌ Brittle - fails when copy changes
expect(screen.getByText('Welcome to our amazing blog about statistics')).toBeInTheDocument()

// ✅ Flexible - tests structure
const heroHeadings = screen.getAllByRole('heading', { level: 1 })
expect(heroHeadings.length).toBeGreaterThanOrEqual(1)
```

## 2. Data-Driven Testing

Test against your data sources instead of hardcoded expectations:

```typescript
// ✅ Tests dynamic content from data
features.forEach(feature => {
  expect(screen.getByRole('heading', { 
    name: new RegExp(feature.title, 'i'), 
    level: 3 
  })).toBeInTheDocument()
})

callToAction.buttons.forEach(button => {
  const link = screen.getByRole('link', { name: new RegExp(button.text, 'i') })
  expect(link).toHaveAttribute('href', button.href)
})
```

## 3. Semantic Role Testing

Focus on accessibility roles and user interactions:

```typescript
// ✅ Tests functionality over copy
expect(screen.getAllByRole('button').length).toBeGreaterThan(2)
expect(screen.getAllByRole('link').length).toBeGreaterThan(5)
expect(screen.getByRole('navigation')).toBeInTheDocument()
```

## 4. Flexible Text Matching

Use partial matches and regex patterns:

```typescript
// ✅ Flexible text matching
expect(screen.getByText(/statistics.*concepts/i)).toBeInTheDocument()

// ✅ Key word matching
expect(screen.getByText(new RegExp(
  ['python', 'code', 'browser'].join('.*'), 'i'
))).toBeInTheDocument()
```

## 5. Layout and Visual Structure

Test CSS classes and layout without content coupling:

```typescript
// ✅ Tests responsive design
const grids = container.querySelectorAll('.grid')
expect(grids.length).toBeGreaterThan(0)

const responsiveGrid = container.querySelector('[class*="md:grid-cols"]')
expect(responsiveGrid).toBeInTheDocument()
```

## 6. Component Count Testing

Test for expected number of components:

```typescript
// ✅ Tests that all articles render
const articles = screen.getAllByRole('article')
expect(articles.length).toBe(articleRegistry.length)

// ✅ Tests minimum required sections
const sections = screen.getAllByRole('heading', { level: 2 })
expect(sections.length).toBeGreaterThanOrEqual(4)
```

## 7. User Journey Testing

Test user interactions and navigation:

```typescript
// ✅ Tests navigation functionality
const tagLinks = screen.getAllByRole('link', { name: /tags/i })
expect(tagLinks.length).toBeGreaterThanOrEqual(1)

// ✅ Tests interactive elements
const interactiveElements = [
  ...screen.getAllByRole('button'),
  ...screen.getAllByRole('link')
]
expect(interactiveElements.length).toBeGreaterThan(5)
```

## 8. Test Utilities for Reusability

Create helper functions for common patterns:

```typescript
// Flexible text matcher
export function createFlexibleTextMatcher(keywords: string[]) {
  return new RegExp(keywords.join('.*'), 'i');
}

// Data consistency testing
export function testDataConsistency<T>(
  screen: any,
  data: T[],
  extractor: (item: T) => { text: string; role?: string }
) {
  data.forEach(item => {
    const { text, role = 'text' } = extractor(item);
    expect(screen.getByText(new RegExp(text, 'i'))).toBeInTheDocument();
  });
}
```

## 9. Test IDs for Critical Elements

For elements that frequently change copy but need reliable testing:

```typescript
// In component
<button data-testid="cta-primary">
  {dynamicButtonText}
</button>

// In test
expect(screen.getByTestId('cta-primary')).toBeInTheDocument()
```

## 10. Configuration-Based Testing

Create test configurations that mirror your content structure:

```typescript
const expectedSections = [
  { type: 'hero', minHeadings: 1 },
  { type: 'articles', minItems: 1 },
  { type: 'features', minItems: 4 },
  { type: 'cta', minButtons: 2 }
];

expectedSections.forEach(section => {
  // Test each section exists with expected content
});
```

## Benefits

1. **Resilient to Copy Changes**: Tests won't break when you update text
2. **Faster Development**: Less test maintenance when iterating on copy
3. **Better Coverage**: Tests focus on functionality and structure
4. **Accessibility Focus**: Using semantic roles improves accessibility
5. **Data Consistency**: Ensures UI matches your data sources

## When to Use Exact Text

Still use exact text matching for:
- Error messages (need to be precise)
- Critical user prompts
- Legal/compliance text
- Brand names and specific terminology

## Example Migration

```typescript
// Before: Brittle test
it('renders welcome message', () => {
  expect(screen.getByText('Welcome to Interactive Learning Platform')).toBeInTheDocument()
})

// After: Flexible test
it('renders hero section', () => {
  const heroSection = screen.getByRole('heading', { level: 1 })
  expect(heroSection).toBeInTheDocument()
  expect(heroSection.textContent).toMatch(/interactive.*learning/i)
})
```

This approach makes your tests more maintainable while still ensuring your UI works correctly.