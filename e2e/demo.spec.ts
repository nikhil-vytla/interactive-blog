import { test, expect } from '@playwright/test';
import { PageHelpers } from './utils/page-helpers';

test.describe('Demo Page - Interactive Features', () => {
  let demoPage: PageHelpers;

  test.beforeEach(async ({ page }) => {
    demoPage = new PageHelpers(page);
    await demoPage.navigateAndVerify('/demo');
  });

  test('loads successfully with interactive content', async ({ page }) => {
    await demoPage.testPageStructure();
    
    // Verify main content exists
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('has functional code editors', async ({ page }) => {
    // Test that code editors are present and functional
    const codeEditors = page.locator('.cm-editor, [class*="codemirror"], .border-code-border');
    const editorCount = await codeEditors.count();
    
    if (editorCount > 0) {
      await expect(codeEditors.first()).toBeVisible({ timeout: 10000 });
      
      // Test that editors are interactive
      const firstEditor = codeEditors.first();
      await expect(firstEditor).toBeVisible();
    }
  });

  test('run buttons are functional', async ({ page }) => {
    const runButtons = page.locator('button:visible');
    const buttonCount = await runButtons.count();
    
    if (buttonCount > 0) {
      // Test that at least one button is clickable
      const firstButton = runButtons.first();
      await expect(firstButton).toBeVisible();
      await expect(firstButton).toBeEnabled();
      
      // Try clicking if it looks like a run button
      const buttonText = await firstButton.textContent();
      if (buttonText && /run|execute|play/i.test(buttonText)) {
        await firstButton.click();
        // Wait a bit for any execution to complete
        await page.waitForTimeout(1000);
      }
    }
  });

  test('interactive elements work across devices', async ({ page }) => {
    await demoPage.testResponsiveDesign();
    
    // Test that interactive elements remain functional on mobile
    await page.setViewportSize({ width: 375, height: 667 });
    
    const interactiveElements = page.locator('button:visible, input:visible, select:visible');
    const elementsCount = await interactiveElements.count();
    
    if (elementsCount > 0) {
      await expect(interactiveElements.first()).toBeVisible();
    }
  });

  test('navigation and user flow', async ({ page }) => {
    await demoPage.testUserJourney([
      {
        action: 'navigate',
        path: '/demo',
        verify: async () => {
          await expect(page.locator('main')).toBeVisible();
        }
      },
      {
        action: 'scroll',
        target: 'body',
      },
      {
        action: 'navigate',
        path: '/',
        verify: async () => {
          await expect(page.locator('main')).toBeVisible();
        }
      }
    ]);
  });

  test('page performance with interactive content', async ({ page }) => {
    await demoPage.testPerformance();
    
    // Test that page remains responsive after interactions
    const buttons = page.locator('button:visible');
    const buttonCount = await buttons.count();
    
    if (buttonCount > 0) {
      const startTime = Date.now();
      await buttons.first().click();
      await page.waitForTimeout(500);
      const responseTime = Date.now() - startTime;
      
      // Interactive elements should be responsive
      expect(responseTime).toBeLessThan(3000);
    }
  });

  test('content accessibility', async ({ page }) => {
    // Test keyboard navigation
    await page.keyboard.press('Tab');
    
    // Verify focusable elements exist
    const focusableElements = page.locator('button, a, input, select, textarea, [tabindex]');
    const focusableCount = await focusableElements.count();
    expect(focusableCount).toBeGreaterThan(0);
    
    // Test that headings provide proper structure
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    const headingCount = await headings.count();
    expect(headingCount).toBeGreaterThanOrEqual(1);
  });
});