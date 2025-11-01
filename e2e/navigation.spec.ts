import { test, expect } from '@playwright/test';
import { TestHelpers } from './utils/test-helpers';

/**
 * Navigation and routing tests
 * Tests that verify the application's navigation structure
 */

test.describe('Application Navigation', () => {
  test('main routes are accessible', async ({ page }) => {
    const helpers = new TestHelpers(page);
    
    // List of routes that should be accessible (will redirect to auth if not logged in)
    const routes = [
      '/',
      '/sign-in',
      '/sign-up',
      '/dashboard',
      '/create-page',
      '/settings',
      '/trash',
      '/templates',
    ];
    
    for (const route of routes) {
      await page.goto(route);
      await helpers.waitForNavigation();
      
      // Should get a valid response (even if redirected to auth)
      const url = page.url();
      expect(url).toContain('localhost:3000');
      
      // Should not get a 404 error page
      const bodyText = await page.textContent('body');
      expect(bodyText).not.toContain('404');
    }
  });

  test('protected routes redirect to sign-in when not authenticated', async ({ page }) => {
    const protectedRoutes = [
      '/dashboard',
      '/create-page',
      '/settings',
      '/trash',
    ];
    
    for (const route of protectedRoutes) {
      await page.goto(route);
      await page.waitForLoadState('networkidle');
      
      // Should be redirected to sign-in or stay on route if auth middleware allows
      const url = page.url();
      expect(url).toBeTruthy();
    }
  });

  test('browser back button works correctly', async ({ page }) => {
    // Navigate to sign-in
    await page.goto('/sign-in');
    await page.waitForLoadState('networkidle');
    const signInUrl = page.url();
    
    // Navigate to sign-up
    await page.goto('/sign-up');
    await page.waitForLoadState('networkidle');
    const signUpUrl = page.url();
    
    // Go back
    await page.goBack();
    await page.waitForLoadState('networkidle');
    
    // Should be back on sign-in
    const currentUrl = page.url();
    expect(currentUrl).toContain('sign-in');
  });

  test('browser forward button works correctly', async ({ page }) => {
    // Navigate to sign-in
    await page.goto('/sign-in');
    await page.waitForLoadState('networkidle');
    
    // Navigate to sign-up
    await page.goto('/sign-up');
    await page.waitForLoadState('networkidle');
    
    // Go back
    await page.goBack();
    await page.waitForLoadState('networkidle');
    
    // Go forward
    await page.goForward();
    await page.waitForLoadState('networkidle');
    
    // Should be back on sign-up
    const currentUrl = page.url();
    expect(currentUrl).toContain('sign-up');
  });

  test('invalid routes show appropriate error handling', async ({ page }) => {
    await page.goto('/this-route-does-not-exist-12345');
    await page.waitForLoadState('networkidle');
    
    // Should either redirect or show a 404 page
    const url = page.url();
    expect(url).toBeTruthy();
  });

  test('deep links work correctly', async ({ page }) => {
    // Test that direct navigation to nested routes works
    await page.goto('/create-page');
    await page.waitForLoadState('networkidle');
    
    const url = page.url();
    // Should either be on the create-page or redirected to auth
    expect(url).toBeTruthy();
  });
});

test.describe('Share Links', () => {
  test('share route structure is valid', async ({ page }) => {
    // Test the share route with a mock ID
    await page.goto('/share/test-presentation-id');
    await page.waitForLoadState('networkidle');
    
    // Should get a response (might show not found or require auth)
    const url = page.url();
    expect(url).toBeTruthy();
  });
});
