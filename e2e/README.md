# End-to-End Testing with Playwright

This directory contains end-to-end tests for the PowerPoint-like UI features implemented in the Presentation Hub editor.

## Setup

### Install Playwright browsers:
```bash
npm run playwright:install
```

Or manually:
```bash
npx playwright install chromium --with-deps
```

## Running Tests

### Run all tests (headless):
```bash
npm run test:e2e
```

### Run tests with UI mode (recommended for development):
```bash
npm run test:e2e:ui
```

### Run tests in headed mode (see browser):
```bash
npm run test:e2e:headed
```

### Debug tests:
```bash
npm run test:e2e:debug
```

### Run specific test file:
```bash
npx playwright test e2e/powerpoint-features.spec.ts
```

### Run specific test:
```bash
npx playwright test -g "should display formatting toolbar"
```

## Test Coverage

The `powerpoint-features.spec.ts` file includes comprehensive tests for:

### 1. Formatting Toolbar
- Font family and size selectors
- Undo/Redo buttons
- Text formatting (Bold, Italic, Underline)
- Alignment buttons (Left, Center, Right)
- List buttons

### 2. Status Bar
- Slide counter display
- Zoom controls
- Zoom slider functionality
- Zoom range limits (25%-200%)

### 3. Quick Access Toolbar
- Insert buttons visibility
- Quick insert functionality

### 4. Compact Navbar
- Navigation bar size validation
- Home, Notes, Transitions, Present buttons
- Compact design (≤80px height)

### 5. Enhanced Slide Thumbnails
- Slide number badges
- Active slide highlighting
- Hover effects
- Click navigation

### 6. Keyboard Shortcuts
- Arrow key navigation (Up/Down)
- Ctrl+D for duplicate
- Delete key for removing slides

### 7. Context Menu
- Right-click menu display
- Duplicate, Delete, Copy options

### 8. Slide Notes Panel
- Toggle visibility
- Text input functionality
- Per-slide notes

### 9. Transition Selector
- Transition panel opening
- Available transition effects
- Duration slider

### 10. Presentation Overview
- Overview panel opening
- Grid layout (2 columns)
- Click-to-navigate functionality

### 11. Zoom Functionality
- Zoom in/out buttons
- Zoom slider
- Zoom limits enforcement

### 12. Visual Consistency
- Theme color consistency
- Layout on window resize
- Responsive design

### 13. Accessibility
- ARIA labels
- Keyboard navigation
- Tooltips

## Important Notes

### Authentication
These tests assume you have a way to bypass or handle authentication. You may need to:
1. Set up test user credentials in environment variables
2. Mock authentication for testing
3. Use Playwright's `storageState` to persist login sessions

### Test Data
The tests are designed to be flexible and use conditional checks to handle:
- Missing elements (test won't fail if element doesn't exist)
- Different page states
- Varying authentication setups

### Updating Tests
When the UI changes:
1. Update selectors in the test file
2. Adjust timeout values if needed
3. Update expected behaviors

### Best Practices
- Keep tests independent (each test should work on its own)
- Use meaningful test descriptions
- Add `await page.waitForTimeout()` when needed for animations
- Use conditional checks for optional elements

## Troubleshooting

### Tests timing out
- Increase timeouts in the test or config
- Check if the dev server is running
- Verify elements are actually visible on the page

### Elements not found
- Verify selectors match the actual HTML
- Check if elements are hidden or not rendered yet
- Add appropriate wait conditions

### Authentication issues
- Set up test authentication flow
- Use `storageState` to reuse login sessions
- Consider mocking authentication for tests

## CI/CD Integration

To run tests in CI:
```yaml
- name: Install dependencies
  run: npm ci
  
- name: Install Playwright browsers
  run: npx playwright install --with-deps chromium
  
- name: Run E2E tests
  run: npm run test:e2e
  
- name: Upload test results
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report/
```

## Viewing Test Reports

After running tests, view the HTML report:
```bash
npx playwright show-report
```

## Additional Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright Test API](https://playwright.dev/docs/api/class-test)
- [Best Practices](https://playwright.dev/docs/best-practices)
