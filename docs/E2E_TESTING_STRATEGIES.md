# E2E Testing Strategies for Copy-Flexible Tests

This document outlines strategies for creating maintainable E2E tests that focus on user journeys and functionality rather than specific copy.

## Core Principles

### 1. Test User Journeys, Not Copy
```typescript
// ❌ Brittle - fails when copy changes
await expect(page.getByText('Welcome to our amazing statistics blog')).toBeVisible();

// ✅ Flexible - tests user journey
await homePage.testUserJourney([
  { action: 'navigate', path: '/' },
  { action: 'click', target: 'a[href*="/blog/"]' },
  { action: 'verify', check: () => expect(page.url()).toContain('/blog/') }
]);
```

### 2. Use Page Object Models
```typescript
export class HomePage extends PageHelpers {
  async testArticleNavigation() {
    const articleLinks = this.page.locator('a[href*="/blog/"]');
    if (await articleLinks.count() > 0) {
      await articleLinks.first().click();
      await this.waitForPageReady();
      expect(this.page.url()).toContain('/blog/');
    }
  }
}
```

### 3. Focus on Semantic Structure
```typescript
// Test structure, not content
await expect(page.locator('main')).toBeVisible();
await expect(page.locator('h1').first()).toBeVisible();

const sections = page.locator('section, [role="region"]');
expect(await sections.count()).toBeGreaterThanOrEqual(3);
```

## Key Strategies

### 1. Selector Strategy Priority

```typescript
// Priority order for selectors:
// 1. Semantic roles and attributes
page.locator('[role="button"]')
page.locator('button')
page.locator('a[href*="/specific-path/"]')

// 2. Stable CSS classes or data attributes
page.locator('[data-testid="navigation"]')
page.locator('.navigation-main')

// 3. Content-agnostic patterns
page.locator('a[href*="/blog/"]:visible')
page.locator('button:has-text("Run"), button:has-text("Execute")')

// ❌ Avoid exact text matching
page.locator('text="Click here to read our amazing blog post"')
```

### 2. Flexible Content Testing

```typescript
// Test for content patterns, not exact text
const codeButtons = page.locator('button:visible');
const buttonCount = await codeButtons.count();

if (buttonCount > 0) {
  const buttonText = await codeButtons.first().textContent();
  if (buttonText && /run|execute|play/i.test(buttonText)) {
    // Test functionality
    await codeButtons.first().click();
  }
}
```

### 3. Responsive Testing

```typescript
async testResponsiveDesign() {
  const breakpoints = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1200, height: 800 }
  ];

  for (const bp of breakpoints) {
    await this.page.setViewportSize(bp);
    await expect(this.page.locator('main')).toBeVisible();
    await expect(this.page.locator('h1').first()).toBeVisible();
  }
}
```

### 4. Performance Testing

```typescript
async testPerformance() {
  const startTime = Date.now();
  await this.waitForPageReady();
  const loadTime = Date.now() - startTime;
  
  expect(loadTime).toBeLessThan(10000); // 10 seconds max
  
  // Test interaction performance
  const buttons = this.page.locator('button:visible');
  if (await buttons.count() > 0) {
    const interactionStart = Date.now();
    await buttons.first().click();
    await this.page.waitForTimeout(500);
    const responseTime = Date.now() - interactionStart;
    expect(responseTime).toBeLessThan(3000);
  }
}
```

### 5. Accessibility Testing

```typescript
async testAccessibility() {
  // Test keyboard navigation
  await this.page.keyboard.press('Tab');
  
  // Test heading structure
  const headings = this.page.locator('h1, h2, h3, h4, h5, h6');
  expect(await headings.count()).toBeGreaterThanOrEqual(1);
  
  // Test focusable elements
  const focusable = this.page.locator('button, a, input, select, textarea, [tabindex]');
  expect(await focusable.count()).toBeGreaterThan(0);
  
  // Test image alt attributes
  const images = this.page.locator('img');
  for (let i = 0; i < await images.count(); i++) {
    const alt = await images.nth(i).getAttribute('alt');
    expect(alt).not.toBeNull(); // Can be empty for decorative images
  }
}
```

## E2E Test Categories

### 1. Navigation Flow Tests
```typescript
test('complete user journey - discovery to reading', async ({ page }) => {
  await homePage.testUserJourney([
    { action: 'navigate', path: '/' },
    { action: 'click', target: 'a[href*="/blog/"]' },
    { action: 'scroll', target: 'main' },
    { action: 'click', target: 'a[href*="/tags/"]' },
    { action: 'navigate', path: '/' }
  ]);
});
```

### 2. Interaction Tests
```typescript
test('interactive content functionality', async ({ page }) => {
  await page.goto('/demo');
  
  // Test code execution
  const runButtons = page.locator('button:visible');
  if (await runButtons.count() > 0) {
    await runButtons.first().click();
    await page.waitForTimeout(2000);
  }
  
  // Test parameter controls
  const inputs = page.locator('input:visible, select:visible');
  if (await inputs.count() > 0) {
    await inputs.first().fill('10');
  }
});
```

### 3. Content Structure Tests
```typescript
test('content loads with proper structure', async ({ page }) => {
  await page.goto('/');
  
  // Test minimum content requirements
  await expect(page.locator('main')).toBeVisible();
  
  const articles = page.locator('article');
  expect(await articles.count()).toBeGreaterThan(0);
  
  const headings = page.locator('h1, h2, h3');
  expect(await headings.count()).toBeGreaterThanOrEqual(3);
});
```

### 4. Performance Tests
```typescript
test('page loads and responds quickly', async ({ page }) => {
  const startTime = Date.now();
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  const loadTime = Date.now() - startTime;
  
  expect(loadTime).toBeLessThan(5000);
  
  // Test that subsequent navigation is fast
  const links = page.locator('a[href*="/blog/"]:visible');
  if (await links.count() > 0) {
    const navStart = Date.now();
    await links.first().click();
    await page.waitForLoadState('networkidle');
    const navTime = Date.now() - navStart;
    expect(navTime).toBeLessThan(3000);
  }
});
```

## Helper Utilities

### 1. Flexible Element Finding
```typescript
export async function findByPattern(page: Page, patterns: string[]) {
  for (const pattern of patterns) {
    const elements = page.locator(pattern);
    if (await elements.count() > 0) {
      return elements.first();
    }
  }
  throw new Error(`No elements found for patterns: ${patterns.join(', ')}`);
}

// Usage
const runButton = await findByPattern(page, [
  'button:has-text("Run")',
  'button:has-text("Execute")',
  'button[data-action="run"]',
  'button.run-code'
]);
```

### 2. Content Validation
```typescript
export async function validateMinimumContent(page: Page, requirements: {
  minHeadings?: number;
  minLinks?: number;
  minButtons?: number;
  minSections?: number;
}) {
  if (requirements.minHeadings) {
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    expect(await headings.count()).toBeGreaterThanOrEqual(requirements.minHeadings);
  }
  
  if (requirements.minLinks) {
    const links = page.locator('a[href]');
    expect(await links.count()).toBeGreaterThanOrEqual(requirements.minLinks);
  }
  
  // ... other validations
}
```

### 3. Retry Logic for Dynamic Content
```typescript
export async function waitForDynamicContent(page: Page, selector: string, timeout = 10000) {
  await page.waitForFunction(
    (sel) => {
      const elements = document.querySelectorAll(sel);
      return elements.length > 0 && Array.from(elements).some(el => el.textContent?.trim());
    },
    selector,
    { timeout }
  );
}
```

## Configuration for Copy Changes

### 1. Environment-Based Testing
```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    // Test against production-like content
    baseURL: process.env.E2E_BASE_URL || 'http://localhost:3000',
  },
  
  projects: [
    {
      name: 'content-structure',
      testMatch: '**/structure.spec.ts',
    },
    {
      name: 'user-journeys', 
      testMatch: '**/journeys.spec.ts',
    },
    {
      name: 'performance',
      testMatch: '**/performance.spec.ts',
    }
  ]
});
```

### 2. Data-Driven Test Configuration
```typescript
// e2e/config/test-data.ts
export const testConfig = {
  homePage: {
    minSections: 4,
    minArticles: 1,
    minTags: 3,
  },
  articlePage: {
    minHeadings: 2,
    hasCodeEditor: true,
    hasInteractiveElements: true,
  },
  performance: {
    maxLoadTime: 5000,
    maxInteractionTime: 2000,
  }
};
```

## Benefits of This Approach

1. **Copy-Change Resilient**: Tests don't break when marketing copy changes
2. **User-Focused**: Tests actual user workflows and experiences  
3. **Maintainable**: Less brittle tests that focus on functionality
4. **Comprehensive**: Covers accessibility, performance, and responsive design
5. **Scalable**: Page Object Models make it easy to add new tests

## Migration Strategy

### Phase 1: Add Helper Classes
1. Create `PageHelpers` base class
2. Create page-specific classes (`HomePage`, `ArticlePage`, etc.)
3. Add utility functions for common patterns

### Phase 2: Update Existing Tests
1. Replace exact text matching with pattern matching
2. Focus on user journeys instead of element presence
3. Add responsive and accessibility testing

### Phase 3: Expand Coverage
1. Add performance testing
2. Add cross-browser testing
3. Add error scenario testing

This approach makes your E2E tests much more resilient to content changes while providing better coverage of actual user experiences.