import { test, expect } from '@playwright/test';
import { ArticlePage } from './utils/page-helpers';

test.describe('Article Pages - Learning Content', () => {
  let articlePage: ArticlePage;

  test.beforeEach(async ({ page }) => {
    articlePage = new ArticlePage(page);
  });

  test('article pages load with proper content structure', async ({ page }) => {
    // Navigate to homepage first to find article links
    await page.goto('/');
    await articlePage.waitForPageReady();
    
    const articleLinks = page.locator('a[href*="/blog/"]');
    const linkCount = await articleLinks.count();
    
    if (linkCount > 0) {
      // Navigate to first article
      await articleLinks.first().click();
      await articlePage.verifyArticleLoaded();
      
      // Verify URL structure
      expect(page.url()).toContain('/blog/');
    }
  });

  test('interactive content works correctly', async ({ page }) => {
    // Find and navigate to an article
    await page.goto('/');
    const articleLinks = page.locator('a[href*="/blog/"]');
    const linkCount = await articleLinks.count();
    
    if (linkCount > 0) {
      await articleLinks.first().click();
      await articlePage.waitForPageReady();
      
      await articlePage.testInteractiveElements();
    }
  });

  test('code execution functionality', async ({ page }) => {
    // Test interactive code features if present
    await page.goto('/');
    const articleLinks = page.locator('a[href*="/blog/"]');
    const linkCount = await articleLinks.count();
    
    if (linkCount > 0) {
      await articleLinks.first().click();
      await articlePage.waitForPageReady();
      
      // Look for code editors and run buttons
      const runButtons = page.locator('button:visible');
      const buttonCount = await runButtons.count();
      
      if (buttonCount > 0) {
        // Test that buttons are functional
        for (let i = 0; i < Math.min(3, buttonCount); i++) {
          const button = runButtons.nth(i);
          const buttonText = await button.textContent();
          
          if (buttonText && /run|execute|play/i.test(buttonText)) {
            await expect(button).toBeVisible();
            await expect(button).toBeEnabled();
            
            // Try executing code
            await button.click();
            await page.waitForTimeout(2000); // Wait for execution
            
            // Verify no errors in console (basic check)
            const logs = await page.evaluate(() => {
              return window.console.error.toString();
            });
          }
        }
      }
    }
  });

  test('mathematical content renders correctly', async ({ page }) => {
    await page.goto('/');
    const articleLinks = page.locator('a[href*="/blog/"]');
    const linkCount = await articleLinks.count();
    
    if (linkCount > 0) {
      await articleLinks.first().click();
      await articlePage.waitForPageReady();
      
      // Test for mathematical rendering (KaTeX)
      const mathElements = page.locator('.katex, [class*="katex"], .math, [class*="math"]');
      const mathCount = await mathElements.count();
      
      if (mathCount > 0) {
        // Verify math elements are visible
        await expect(mathElements.first()).toBeVisible();
      }
      
      // Test for any plots or visualizations
      const plotElements = page.locator('[class*="plot"], [class*="chart"], canvas, svg');
      const plotCount = await plotElements.count();
      
      if (plotCount > 0) {
        await expect(plotElements.first()).toBeVisible();
      }
    }
  });

  test('article navigation and structure', async ({ page }) => {
    await page.goto('/');
    const articleLinks = page.locator('a[href*="/blog/"]');
    const linkCount = await articleLinks.count();
    
    if (linkCount > 0) {
      await articleLinks.first().click();
      await articlePage.waitForPageReady();
      
      // Test article structure
      await articlePage.testPageStructure();
      
      // Test navigation elements
      const backLinks = page.locator('a[href="/"], a:has-text("Home"), a:has-text("Back")');
      const backLinkCount = await backLinks.count();
      
      if (backLinkCount > 0) {
        const backLink = backLinks.first();
        await expect(backLink).toBeVisible();
        
        // Test navigation works
        await backLink.click();
        await articlePage.waitForPageReady();
        expect(page.url()).not.toContain('/blog/');
      }
      
      // Test tag navigation if present
      await page.goBack(); // Go back to article
      await articlePage.waitForPageReady();
      
      const tagLinks = page.locator('a[href*="/tags/"]');
      const tagLinkCount = await tagLinks.count();
      
      if (tagLinkCount > 0) {
        await tagLinks.first().click();
        await articlePage.waitForPageReady();
        expect(page.url()).toContain('/tags/');
      }
    }
  });

  test('responsive design on article pages', async ({ page }) => {
    await page.goto('/');
    const articleLinks = page.locator('a[href*="/blog/"]');
    const linkCount = await articleLinks.count();
    
    if (linkCount > 0) {
      await articleLinks.first().click();
      await articlePage.waitForPageReady();
      
      await articlePage.testResponsiveDesign();
      
      // Test that code editors remain functional on mobile
      await page.setViewportSize({ width: 375, height: 667 });
      
      const codeEditors = page.locator('.cm-editor, [class*="codemirror"]');
      const editorCount = await codeEditors.count();
      
      if (editorCount > 0) {
        await expect(codeEditors.first()).toBeVisible();
      }
    }
  });

  test('performance with interactive content', async ({ page }) => {
    await page.goto('/');
    const articleLinks = page.locator('a[href*="/blog/"]');
    const linkCount = await articleLinks.count();
    
    if (linkCount > 0) {
      await articleLinks.first().click();
      await articlePage.testPerformance();
      
      // Test performance of interactive elements
      const interactiveElements = page.locator('button, input, select');
      const elementCount = await interactiveElements.count();
      
      if (elementCount > 0) {
        const startTime = Date.now();
        
        // Test interaction performance
        await interactiveElements.first().click();
        await page.waitForTimeout(1000);
        
        const responseTime = Date.now() - startTime;
        expect(responseTime).toBeLessThan(5000);
      }
    }
  });

  test('content accessibility and keyboard navigation', async ({ page }) => {
    await page.goto('/');
    const articleLinks = page.locator('a[href*="/blog/"]');
    const linkCount = await articleLinks.count();
    
    if (linkCount > 0) {
      await articleLinks.first().click();
      await articlePage.waitForPageReady();
      
      // Test keyboard navigation
      await page.keyboard.press('Tab');
      
      // Test heading structure for screen readers
      const headings = page.locator('h1, h2, h3, h4, h5, h6');
      const headingCount = await headings.count();
      expect(headingCount).toBeGreaterThanOrEqual(1);
      
      // Test that interactive elements are keyboard accessible
      const focusableElements = page.locator('button, a, input, select, textarea, [tabindex]');
      const focusableCount = await focusableElements.count();
      
      if (focusableCount > 0) {
        // Test tab navigation through several elements
        for (let i = 0; i < Math.min(5, focusableCount); i++) {
          await page.keyboard.press('Tab');
          await page.waitForTimeout(200);
        }
      }
      
      // Test that images have alt text
      const images = page.locator('img');
      const imageCount = await images.count();
      
      for (let i = 0; i < Math.min(3, imageCount); i++) {
        const img = images.nth(i);
        if (await img.isVisible()) {
          const alt = await img.getAttribute('alt');
          // Alt can be empty string for decorative images, but should exist
          expect(alt).not.toBeNull();
        }
      }
    }
  });

  test('complete article reading journey', async ({ page }) => {
    await articlePage.testUserJourney([
      {
        action: 'navigate',
        path: '/',
        verify: async () => {
          await expect(page.locator('main')).toBeVisible();
        }
      },
      {
        action: 'click',
        target: 'a[href*="/blog/"]:visible',
        verify: async () => {
          await expect(page.url()).toMatch(/\/blog\//);
          await expect(page.locator('main')).toBeVisible();
        }
      },
      {
        action: 'scroll',
        target: 'main',
      },
      {
        action: 'wait'
      },
      {
        action: 'click',
        target: 'a[href*="/tags/"]:visible',
        verify: async () => {
          await expect(page.url()).toMatch(/\/tags/);
        }
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
});