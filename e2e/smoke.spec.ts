import { test, expect } from '@playwright/test';

/**
 * Basic smoke tests to verify the application is running
 */

test.describe('Application Smoke Tests', () => {
  test('homepage loads successfully', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check that we get some response (either sign-in page or dashboard if logged in)
    const title = await page.title();
    expect(title).toBeTruthy();
    
    // Check that the page loaded without errors
    const url = page.url();
    expect(url).toMatch(/localhost:3000/);
  });

  test('sign-in page is accessible', async ({ page }) => {
    await page.goto('/sign-in');
    
    // Wait for Clerk sign-in component to load
    await page.waitForLoadState('networkidle');
    
    // Check that we're on the sign-in page
    const url = page.url();
    expect(url).toContain('sign-in');
  });

  test('sign-up page is accessible', async ({ page }) => {
    await page.goto('/sign-up');
    
    // Wait for Clerk sign-up component to load
    await page.waitForLoadState('networkidle');
    
    // Check that we're on the sign-up page
    const url = page.url();
    expect(url).toContain('sign-up');
  });

  test('API routes are responsive', async ({ page, request }) => {
    // Test a simple API endpoint if available
    const response = await request.get('/api/test-pptx');
    
    // We expect either a success or an auth error, but the endpoint should respond
    expect([200, 401, 403, 500]).toContain(response.status());
  });

  test('application has correct meta tags', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check for viewport meta tag (important for responsive design)
    const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
    expect(viewport).toBeTruthy();
  });
});
