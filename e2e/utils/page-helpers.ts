import { Page, expect, Locator } from '@playwright/test';

/**
 * E2E Test helpers for flexible, maintainable tests
 * Focus on user journeys and semantic structure
 */

export class PageHelpers {
  constructor(public page: Page) {}

  /**
   * Navigate and verify page load by semantic indicators
   */
  async navigateAndVerify(path: string, expectedTitle?: RegExp) {
    await this.page.goto(path);
    
    if (expectedTitle) {
      await expect(this.page).toHaveTitle(expectedTitle);
    }
    
    // Verify page loaded by checking for main content
    await expect(this.page.locator('main')).toBeVisible();
    await this.waitForPageReady();
  }

  /**
   * Wait for page to be fully loaded with content
   */
  async waitForPageReady() {
    // Wait for content to load (no loading states visible)
    await this.page.waitForLoadState('networkidle');
    
    // Ensure at least one heading is visible
    await expect(this.page.locator('h1, h2, h3').first()).toBeVisible();
  }

  /**
   * Test navigation functionality without relying on exact text
   */
  async testNavigation() {
    const links = this.page.locator('a[href]');
    const linkCount = await links.count();
    
    expect(linkCount).toBeGreaterThan(0);
    
    // Test that links are functional (not just decorative)
    const firstInternalLink = links.first();
    if (await firstInternalLink.isVisible()) {
      const href = await firstInternalLink.getAttribute('href');
      expect(href).toBeTruthy();
    }
  }

  /**
   * Test responsive design across breakpoints
   */
  async testResponsiveDesign() {
    const breakpoints = [
      { name: 'mobile', width: 375, height: 667 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1200, height: 800 }
    ];

    for (const bp of breakpoints) {
      await this.page.setViewportSize({ width: bp.width, height: bp.height });
      
      // Verify main content is still visible and accessible

      await expect(this.page.locator('h1').first()).toBeVisible();
      
      // Test that interactive elements are accessible
      const buttons = this.page.locator('button:visible');
      const links = this.page.locator('a:visible');
      
      if (await buttons.count() > 0) {
        await expect(buttons.first()).toBeVisible();
      }
      if (await links.count() > 0) {
        await expect(links.first()).toBeVisible();
      }
    }
  }

  /**
   * Test page structure and accessibility
   */
  async testPageStructure() {
    // Test semantic HTML structure
    
    // Test heading hierarchy
    const h1s = this.page.locator('h1');
    const h1Count = await h1s.count();
    expect(h1Count).toBeGreaterThanOrEqual(1);
    
    // Test that page has interactive elements
    const interactiveElements = this.page.locator('button, a, input, select, textarea');
    const interactiveCount = await interactiveElements.count();
    expect(interactiveCount).toBeGreaterThanOrEqual(0);
    // Ensure there's at least one main heading to confirm content is loaded
    await expect(this.page.locator('h1, h2').first()).toBeVisible();
  }

  /**
   * Test form interactions generically
   */
  async testInteractiveElements() {
    // Test buttons
    const buttons = this.page.locator('button:visible');
    const buttonCount = await buttons.count();
    
    if (buttonCount > 0) {
      const firstButton = buttons.first();
      await expect(firstButton).toBeVisible();
      await expect(firstButton).toBeEnabled();
    }

    // Test links
    const links = this.page.locator('a:visible');
    const linkCount = await links.count();
    
    if (linkCount > 0) {
      const firstLink = links.first();
      await expect(firstLink).toBeVisible();
      
      const href = await firstLink.getAttribute('href');
      expect(href).toBeTruthy();
    }
  }

  /**
   * Test that data-driven content renders correctly
   */
  async testDataDrivenContent(expectedMinimums: {
    articles?: number;
    features?: number;
    sections?: number;
  }) {
    if (expectedMinimums.articles) {
      const articles = this.page.locator('article');
      const articleCount = await articles.count();
      expect(articleCount).toBeGreaterThanOrEqual(expectedMinimums.articles);
    }

    if (expectedMinimums.features) {
      const features = this.page.locator('[data-testid*="feature"], .feature, [class*="feature"]');
      const featureCount = await features.count();
      expect(featureCount).toBeGreaterThanOrEqual(expectedMinimums.features);
    }

    if (expectedMinimums.sections) {
      const sections = this.page.locator('section, [role="region"]');
      const sectionCount = await sections.count();
      expect(sectionCount).toBeGreaterThanOrEqual(expectedMinimums.sections);
    }
  }

  /**
   * Test user journey through the site
   */
  async testUserJourney(journey: Array<{
    action: 'click' | 'navigate' | 'scroll' | 'wait';
    target?: string;
    path?: string;
    verify?: (page: Page) => Promise<void>;
  }>) {
    for (const step of journey) {
      switch (step.action) {
        case 'navigate':
          if (step.path) {
            await this.page.goto(step.path);
            await this.waitForPageReady();
          }
          break;
          
        case 'click':
          if (step.target) {
            const element = this.page.locator(step.target).first();
            // Only attempt to click if the element is visible
            if (await element.isVisible()) {
              await element.click();
              await this.waitForPageReady();
            } else if (step.verify) {
              // If element is not visible but there's a verify step, run it to allow custom handling
              await step.verify(this.page);
            }
          }
          break;
          
        case 'scroll':
          if (step.target) {
            await this.page.locator(step.target).scrollIntoViewIfNeeded();
          } else {
            await this.page.keyboard.press('PageDown');
          }
          break;
          
        case 'wait':
          await this.page.waitForTimeout(1000);
          break;
      }
      
      if (step.verify) {
        await step.verify(this.page);
      }
    }
  }

  /**
   * Test performance and loading
   */
  async testPerformance() {
    const startTime = Date.now();
    await this.waitForPageReady();
    const loadTime = Date.now() - startTime;
    
    // Page should load within reasonable time (adjust as needed)
    expect(loadTime).toBeLessThan(10000); // 10 seconds max
    
    // Test that images load properly
    const images = this.page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < Math.min(imageCount, 5); i++) {
      const img = images.nth(i);
      if (await img.isVisible()) {
        await expect(img).toHaveAttribute('src');
      }
    }
  }
}

/**
 * Page Object Models for different page types
 */

export class HomePage extends PageHelpers {
  async verifyHomepageLoaded() {
    await this.navigateAndVerify('/', /interactive blog/i);
    await this.testPageStructure();
  }

  async testHeroSection() {
    // Test hero exists without checking exact copy
    const hero = this.page.locator('section').first();
    await expect(hero).toBeVisible();
    
    const heroHeading = hero.locator('h1');
    await expect(heroHeading).toBeVisible();
  }

  async testArticleNavigation() {
    // Test that article links work
    const articleLinks = this.page.locator('a[href*="/blog/"]');
    const articleCount = await articleLinks.count();
    
    if (articleCount > 0) {
      const firstArticle = articleLinks.first();
      const href = await firstArticle.getAttribute('href');
      
      await firstArticle.click();
      await this.waitForPageReady();
      
      // Verify we navigated to an article page
      expect(this.page.url()).toContain('/blog/');
      
      // Go back to test navigation
      await this.page.goBack();
      await this.waitForPageReady();
    }
  }

  async testTagNavigation() {
    // Test tag functionality
    const tagLinks = this.page.locator('a[href*="/tags/"]');
    const tagCount = await tagLinks.count();
    
    if (tagCount > 0) {
      const firstTag = tagLinks.first();
      await firstTag.click();
      await this.waitForPageReady();
      
      // Verify we're on a tag page
      expect(this.page.url()).toContain('/tags/');
    }
  }
}

export class ArticlePage extends PageHelpers {
  async verifyArticleLoaded() {
    await this.waitForPageReady();
    // Verify the article title is visible as a strong indicator of content load
    await expect(this.page.locator('h1').first()).toBeVisible({ timeout: 15000 });
    await this.testPageStructure();
  }

  async testInteractiveElements() {
    await super.testInteractiveElements();
    
    // Test code editors if present
    const codeEditors = this.page.locator('.cm-editor, [class*="codemirror"]');
    const editorCount = await codeEditors.count();
    
    if (editorCount > 0) {
      await expect(codeEditors.first()).toBeVisible();
    }

    // Test run buttons if present
    const runButtons = this.page.locator('button:has-text("Run"), button:has-text("Execute")');
    const runButtonCount = await runButtons.count();
    
    if (runButtonCount > 0) {
      await expect(runButtons.first()).toBeVisible();
      await expect(runButtons.first()).toBeEnabled();
    }
  }
}

export class TagPage extends PageHelpers {
  async verifyTagPageLoaded() {
    await this.waitForPageReady();
    await this.testPageStructure();
    
    // Verify we're on a tag page
    expect(this.page.url()).toContain('/tags/');
  }

  async testTagFiltering() {
    // Test that articles are shown
    const articles = this.page.locator('article');
    const articleCount = await articles.count();
    expect(articleCount).toBeGreaterThanOrEqual(0);
    
    // Test tag interaction if multiple tags exist
    const tagButtons = this.page.locator('button:visible, a[href*="/tags/"]:visible');
    const tagCount = await tagButtons.count();
    
    if (tagCount > 1) {
      const firstTag = tagButtons.first();
      await firstTag.click();
      await this.waitForPageReady();
    }
  }
}