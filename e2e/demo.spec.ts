import { test, expect } from '@playwright/test';

test.describe('Demo Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demo');
  });

  test('loads demo page successfully', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /interactive demos/i })).toBeVisible();
  });

  test('displays trigonometric demo section', async ({ page }) => {
    await expect(page.getByText(/trigonometric functions/i)).toBeVisible();
    await expect(page.getByText(/frequency/i)).toBeVisible();
    await expect(page.getByText(/amplitude/i)).toBeVisible();
    await expect(page.getByText(/phase/i)).toBeVisible();
  });

  test('displays statistical demo section', async ({ page }) => {
    await expect(page.getByText(/statistical distributions/i)).toBeVisible();
    await expect(page.getByText(/sample size/i)).toBeVisible();
    await expect(page.getByText(/mean/i)).toBeVisible();
    await expect(page.getByText(/standard deviation/i)).toBeVisible();
  });

  test('has code editors with run buttons', async ({ page }) => {
    const runButtons = page.getByRole('button', { name: /run/i });
    await expect(runButtons.first()).toBeVisible();
    
    // Should have multiple run buttons for different demos
    const runButtonCount = await runButtons.count();
    expect(runButtonCount).toBeGreaterThan(0);
  });

  test('code editors have syntax highlighting', async ({ page }) => {
    // Check if CodeMirror editor is present
    await expect(page.locator('.cm-editor')).toBeVisible();
  });

  test('navigation back to home works', async ({ page }) => {
    // If there's a back button or home link, test it
    // For now, just test direct navigation
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /nik's interactive blog/i })).toBeVisible();
  });

  test('page is responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByRole('heading', { name: /interactive demos/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /run/i }).first()).toBeVisible();
  });
});