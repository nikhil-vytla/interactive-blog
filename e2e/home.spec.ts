import { test, expect } from '@playwright/test';
import { HomePage } from './utils/page-helpers';

test.describe('Home Page - User Journey', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.verifyHomepageLoaded();
  });

  test('loads successfully with proper structure', async ({ page }) => {
    await homePage.testPageStructure();
    await homePage.testHeroSection();
  });

  test('has functional navigation', async ({ page }) => {
    await homePage.testNavigation();
    await homePage.testTagNavigation();
  });

  test('displays content from data sources', async ({ page }) => {
    // Test that dynamic content loads
    await homePage.testDataDrivenContent({
      articles: 1, // Expect at least 1 article
      sections: 4  // Expect at least 4 main sections
    });
  });

  test('article navigation works', async ({ page }) => {
    await homePage.testArticleNavigation();
  });

  test('is responsive across devices', async ({ page }) => {
    await homePage.testResponsiveDesign();
  });

  test('interactive elements are functional', async ({ page }) => {
    await homePage.testInteractiveElements();
  });

  test('page performance is acceptable', async ({ page }) => {
    await homePage.testPerformance();
  });

  test('complete user journey - homepage to article to tags', async ({ page }) => {
    await homePage.testUserJourney([
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
        }
      },
      {
        action: 'navigate',
        path: '/',
      },
      {
        action: 'click',
        target: 'a[href*="/tags"]:visible',
        verify: async () => {
          await expect(page.url()).toMatch(/\/tags\/?$/);
        }
      }
    ]);
  });
});