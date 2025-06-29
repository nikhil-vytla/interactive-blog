import { test, expect } from '@playwright/test';
import { TagPage } from './utils/page-helpers';

test.describe('Tag System - Content Discovery', () => {
  let tagPage: TagPage;

  test.beforeEach(async ({ page }) => {
    tagPage = new TagPage(page);
  });

  test('tags index page loads with proper structure', async ({ page }) => {
    await tagPage.navigateAndVerify('/tags');
    await tagPage.testPageStructure();
    
    // Verify we're on the tags page
    expect(page.url()).toContain('/tags');
  });

  test('displays available tags', async ({ page }) => {
    await tagPage.navigateAndVerify('/tags');
    
    // Test that tags are displayed (without checking specific tags)
    const tagElements = page.locator('a[href*="/tags/"], button[class*="tag"], [class*="tag"]');
    const tagCount = await tagElements.count();
    
    // Should have at least some tags
    expect(tagCount).toBeGreaterThan(0);
  });

  test('tag navigation works correctly', async ({ page }) => {
    await tagPage.navigateAndVerify('/tags');
    
    // Find and click a tag link
    const tagLinks = page.locator('a[href*="/tags/"]:not([href="/tags"])');
    const linkCount = await tagLinks.count();
    
    if (linkCount > 0) {
      const firstTag = tagLinks.first();
      await firstTag.click();
      await tagPage.waitForPageReady();
      
      // Verify we navigated to a specific tag page
      expect(page.url()).toMatch(/\/tags\/[^\/]+$/);
      
      // Verify tag page structure
      await tagPage.verifyTagPageLoaded();
    }
  });

  test('individual tag pages show relevant content', async ({ page }) => {
    // Navigate to tags index first
    await tagPage.navigateAndVerify('/tags');
    
    const tagLinks = page.locator('a[href*="/tags/"]:not([href="/tags"])');
    const linkCount = await tagLinks.count();
    
    if (linkCount > 0) {
      // Visit first tag page
      await tagLinks.first().click();
      await tagPage.waitForPageReady();
      
      await tagPage.testTagFiltering();
      await tagPage.testPageStructure();
      
      // Test navigation back
      const backLinks = page.locator('a[href="/tags"], a[href="/"]');
      const backLinkCount = await backLinks.count();
      
      if (backLinkCount > 0) {
        await backLinks.first().click();
        await tagPage.waitForPageReady();
      }
    }
  });

  test('tag filtering functionality', async ({ page }) => {
    await tagPage.navigateAndVerify('/tags');
    
    // Test interactive tag filtering
    await tagPage.testUserJourney([
      {
        action: 'navigate',
        path: '/tags',
        verify: async () => {
          await expect(page.locator('main')).toBeVisible();
        }
      },
      {
        action: 'click',
        target: 'a[href*="/tags/"]:not([href="/tags"]):visible',
        verify: async () => {
          await expect(page.url()).toMatch(/\/tags\/[^\/]+/);
        }
      }
    ]);
  });

  test('responsive design on tag pages', async ({ page }) => {
    await tagPage.navigateAndVerify('/tags');
    await tagPage.testResponsiveDesign();
    
    // Test specific tag page responsiveness
    const tagLinks = page.locator('a[href*="/tags/"]:not([href="/tags"])');
    const linkCount = await tagLinks.count();
    
    if (linkCount > 0) {
      await tagLinks.first().click();
      await tagPage.waitForPageReady();
      await tagPage.testResponsiveDesign();
    }
  });

  test('accessibility of tag interface', async ({ page }) => {
    await tagPage.navigateAndVerify('/tags');
    
    // Test keyboard navigation
    await page.keyboard.press('Tab');
    
    // Verify tags are accessible via keyboard
    const focusableElements = page.locator('a, button, [tabindex]:not([tabindex="-1"])');
    const focusableCount = await focusableElements.count();
    expect(focusableCount).toBeGreaterThan(0);
    
    // Test that tag links have proper attributes
    const tagLinks = page.locator('a[href*="/tags/"]');
    const tagLinkCount = await tagLinks.count();
    
    if (tagLinkCount > 0) {
      const firstTagLink = tagLinks.first();
      const href = await firstTagLink.getAttribute('href');
      expect(href).toBeTruthy();
      expect(href).toContain('/tags/');
    }
  });

  test('performance with many tags', async ({ page }) => {
    await tagPage.navigateAndVerify('/tags');
    await tagPage.testPerformance();
    
    // Test that page remains responsive with tag interactions
    const tagElements = page.locator('a[href*="/tags/"], button');
    const elementCount = await tagElements.count();
    
    if (elementCount > 0) {
      // Test multiple tag interactions
      for (let i = 0; i < Math.min(3, elementCount); i++) {
        const element = tagElements.nth(i);
        if (await element.isVisible()) {
          const startTime = Date.now();
          
          // Check if it's a link or button and handle appropriately
          const tagName = await element.evaluate(el => el.tagName.toLowerCase());
          
          if (tagName === 'a') {
            const href = await element.getAttribute('href');
            if (href && href !== '/tags') {
              await element.click();
              await tagPage.waitForPageReady();
              
              const loadTime = Date.now() - startTime;
              expect(loadTime).toBeLessThan(5000);
              
              // Go back for next iteration
              await page.goBack();
              await tagPage.waitForPageReady();
            }
          }
        }
      }
    }
  });
});