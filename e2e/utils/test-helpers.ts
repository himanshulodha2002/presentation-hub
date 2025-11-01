import { Page, expect } from '@playwright/test';

/**
 * Common test utilities for E2E tests
 */

export class TestHelpers {
  constructor(public readonly page: Page) {}

  /**
   * Wait for navigation to complete
   */
  async waitForNavigation() {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Take a screenshot with a descriptive name
   */
  async takeScreenshot(name: string) {
    await this.page.screenshot({ path: `test-results/${name}.png`, fullPage: true });
  }

  /**
   * Wait for an element to be visible
   */
  async waitForElement(selector: string, timeout = 10000) {
    await this.page.waitForSelector(selector, { state: 'visible', timeout });
  }

  /**
   * Check if user is on sign-in page
   */
  async isOnSignInPage(): Promise<boolean> {
    const url = this.page.url();
    return url.includes('/sign-in');
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const url = this.page.url();
    return !url.includes('/sign-in') && !url.includes('/sign-up');
  }

  /**
   * Wait for API response
   */
  async waitForApiResponse(urlPattern: string | RegExp) {
    return await this.page.waitForResponse(
      (response) => {
        const url = response.url();
        if (typeof urlPattern === 'string') {
          return url.includes(urlPattern);
        }
        return urlPattern.test(url);
      },
      { timeout: 30000 }
    );
  }

  /**
   * Fill form field with proper waiting
   */
  async fillField(selector: string, value: string) {
    await this.page.waitForSelector(selector);
    await this.page.fill(selector, value);
  }

  /**
   * Click element with proper waiting
   */
  async clickElement(selector: string) {
    await this.page.waitForSelector(selector);
    await this.page.click(selector);
  }

  /**
   * Get text content of element
   */
  async getTextContent(selector: string): Promise<string> {
    const element = await this.page.waitForSelector(selector);
    return (await element?.textContent()) || '';
  }

  /**
   * Check if element exists
   */
  async elementExists(selector: string): Promise<boolean> {
    try {
      await this.page.waitForSelector(selector, { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if element is visible
   */
  async isElementVisible(selector: string): Promise<boolean> {
    try {
      const element = await this.page.waitForSelector(selector, { timeout: 5000 });
      return (await element?.isVisible()) || false;
    } catch {
      return false;
    }
  }
}
