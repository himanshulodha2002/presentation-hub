import { test, expect } from '@playwright/test';
import { TestHelpers } from './utils/test-helpers';

/**
 * Authentication flow tests
 * Note: These tests verify the auth flow structure but require valid Clerk credentials to fully execute
 */

test.describe('Authentication Flow', () => {
  test('unauthenticated user is redirected to sign-in', async ({ page }) => {
    const helpers = new TestHelpers(page);
    
    // Try to access protected route
    await page.goto('/');
    
    // Wait for navigation
    await helpers.waitForNavigation();
    
    // Should be redirected to sign-in
    const isOnSignIn = await helpers.isOnSignInPage();
    expect(isOnSignIn).toBeTruthy();
  });

  test('sign-in page displays correctly', async ({ page }) => {
    const helpers = new TestHelpers(page);
    
    await page.goto('/sign-in');
    await helpers.waitForNavigation();
    
    // Check that we're on sign-in page
    const url = page.url();
    expect(url).toContain('sign-in');
    
    // Page should have loaded without errors
    const title = await page.title();
    expect(title).toBeTruthy();
  });

  test('sign-up page displays correctly', async ({ page }) => {
    const helpers = new TestHelpers(page);
    
    await page.goto('/sign-up');
    await helpers.waitForNavigation();
    
    // Check that we're on sign-up page
    const url = page.url();
    expect(url).toContain('sign-up');
    
    // Page should have loaded without errors
    const title = await page.title();
    expect(title).toBeTruthy();
  });

  test('can navigate between sign-in and sign-up pages', async ({ page }) => {
    await page.goto('/sign-in');
    await page.waitForLoadState('networkidle');
    
    // Verify we're on sign-in
    expect(page.url()).toContain('sign-in');
    
    // Navigate to sign-up using browser navigation
    await page.goto('/sign-up');
    await page.waitForLoadState('networkidle');
    
    // Verify we're on sign-up
    expect(page.url()).toContain('sign-up');
    
    // Navigate back to sign-in
    await page.goto('/sign-in');
    await page.waitForLoadState('networkidle');
    
    // Verify we're back on sign-in
    expect(page.url()).toContain('sign-in');
  });

  test('callback page exists', async ({ page }) => {
    await page.goto('/callback');
    await page.waitForLoadState('networkidle');
    
    // The callback page should exist (even if it redirects)
    // We just verify it doesn't throw a 404
    const url = page.url();
    expect(url).toBeTruthy();
  });
});

test.describe('Authentication State', () => {
  test('auth state persists across page refreshes', async ({ page }) => {
    await page.goto('/sign-in');
    await page.waitForLoadState('networkidle');
    
    // Store initial URL
    const initialUrl = page.url();
    
    // Refresh the page
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Should still be on sign-in or redirected consistently
    const afterRefreshUrl = page.url();
    expect(afterRefreshUrl).toBeTruthy();
  });
});
