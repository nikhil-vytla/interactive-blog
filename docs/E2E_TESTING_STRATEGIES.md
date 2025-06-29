# E2E Testing Strategies for Copy-Flexible Tests

This document outlines strategies for creating maintainable End-to-End (E2E) tests that are resilient to UI copy changes and focus on user journeys.

## Core Principles

### 1. Test User Journeys, Not Copy

Focus on the user's interaction flow and the system's response, rather than exact text on the page.

```typescript
// ❌ Brittle: Fails when UI text changes
await expect(page.getByText('Welcome to our amazing statistics blog')).toBeVisible();

// ✅ Flexible: Tests user journey
await homePage.testUserJourney([
  { action: 'navigate', path: '/' },
  { action: 'click', target: 'a[href*="/blog/"]' },
  { action: 'verify', check: () => expect(page.url()).toContain('/blog/') }
]);
```

### 2. Use Page Object Models (POMs)

Organize test code using POMs to abstract page interactions and improve reusability and maintainability.

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

Verify the presence and correct arrangement of semantic HTML elements (e.g., `main`, `h1`, `section`) rather than relying on specific text content.

```typescript
await expect(page.locator('main')).toBeVisible();
await expect(page.locator('h1').first()).toBeVisible();
const sections = page.locator('section, [role="region"]');
expect(await sections.count()).toBeGreaterThanOrEqual(3);
```

## Key Strategies

### 1. Selector Strategy Priority

Prioritize robust selectors that are less likely to change:

*   **Semantic roles/attributes**: `page.locator('[role="button"]'), page.locator('button')`
*   **Stable CSS classes or data attributes**: `page.locator('[data-testid="navigation"]'), page.locator('.navigation-main')`
*   **Content-agnostic patterns**: `page.locator('a[href*="/blog/"]:visible'), page.locator('button:has-text("Run"), button:has-text("Execute")')`

❌ Avoid exact text matching for critical elements.

### 2. Flexible Content Testing

Test for content patterns or presence, not exact strings.

```typescript
const codeButtons = page.locator('button:visible');
if (await codeButtons.count() > 0) {
  const buttonText = await codeButtons.first().textContent();
  if (buttonText && /run|execute|play/i.test(buttonText)) {
    await codeButtons.first().click();
  }
}
```

### 3. Responsive Testing

Verify UI responsiveness across different screen sizes.

```typescript
async testResponsiveDesign() {
  const breakpoints = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'desktop', width: 1200, height: 800 }
  ];
  for (const bp of breakpoints) {
    await this.page.setViewportSize(bp);
    await expect(this.page.locator('h1').first()).toBeVisible();
  }
}
```

### 4. Performance Testing

Measure page load times and interaction responsiveness.

```typescript
async testPerformance() {
  const startTime = Date.now();
  await this.waitForPageReady();
  const loadTime = Date.Now() - startTime;
  expect(loadTime).toBeLessThan(10000); // Max 10 seconds
}
```

### 5. Accessibility Testing

Ensure keyboard navigation, proper heading structure, and image alt attributes.

```typescript
async testAccessibility() {
  await this.page.keyboard.press('Tab');
  const headings = this.page.locator('h1, h2, h3');
  expect(await headings.count()).toBeGreaterThanOrEqual(1);
}
```

## E2E Test Categories

Categorize tests by their primary focus:

*   **Navigation Flow Tests**: Verify user journeys through the application.
*   **Interaction Tests**: Validate functionality of interactive elements (e.g., forms, buttons, code editors).
*   **Content Structure Tests**: Ensure core content elements are present and correctly structured.
*   **Performance Tests**: Measure loading and interaction speeds.

## Helper Utilities

Common utility functions to simplify test writing:

*   **Flexible Element Finding**: `findByPattern(page, ['button:has-text("Run")', 'button[data-action="run"]'])`
*   **Content Validation**: `validateMinimumContent(page, { minHeadings: 2, minLinks: 5 })`
*   **Retry Logic**: `waitForDynamicContent(page, '.some-dynamic-element')`

## Configuration for Copy Changes

*   **Environment-Based Testing**: Use `baseURL` in Playwright config to test against different environments.
*   **Data-Driven Test Configuration**: Externalize test data (e.g., expected minimum counts) to make tests adaptable.

## Benefits

*   **Copy-Change Resilient**: Tests don't break when UI text changes.
*   **User-Focused**: Validates actual user workflows.
*   **Maintainable**: Less brittle tests, easier to update.
*   **Comprehensive**: Covers functionality, accessibility, performance, and responsiveness.
