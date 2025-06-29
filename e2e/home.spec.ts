import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('has correct title and heading', async ({ page }) => {
    await expect(page).toHaveTitle(/Nik's Interactive Blog/);
    await expect(page.getByRole('heading', { name: /nik's interactive blog/i })).toBeVisible();
  });

  test('displays main description', async ({ page }) => {
    await expect(page.getByText(/explore mathematical concepts through interactive code/i)).toBeVisible();
  });

  test('demo button navigates to demo page', async ({ page }) => {
    const demoLink = page.getByRole('link', { name: /try interactive demos/i });
    await expect(demoLink).toBeVisible();
    
    await demoLink.click();
    await page.waitForURL('/demo');
    await expect(page.getByRole('heading', { name: /interactive demos/i })).toBeVisible();
  });

  test('displays all feature sections', async ({ page }) => {
    const features = [
      'Client-Side Python',
      'Selective Editing',
      'Mathematical Rendering',
      'Interactive Visualizations'
    ];

    for (const feature of features) {
      await expect(page.getByRole('heading', { name: new RegExp(feature, 'i') })).toBeVisible();
    }
  });

  test('has responsive design', async ({ page }) => {
    // Test desktop view
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(page.locator('.grid.md\\:grid-cols-2')).toBeVisible();

    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByRole('heading', { name: /nik's interactive blog/i })).toBeVisible();
  });
});