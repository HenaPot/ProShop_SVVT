// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright config for ProShop system (end-to-end) tests.
 *
 * Target: the running app. By default http://localhost:3000 (dev server); set
 * PLAYWRIGHT_BASE_URL to point at the deployed Render URL for testing the live
 * system. Unlike the earlier bookshop.org suite, this app is self-hosted, so
 * there is NO anti-bot challenge and tests run headless.
 */
const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';

export default defineConfig({
  testDir: './tests/e2e/specs',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
  ],
  // Auto-start the dev server locally if one isn't already running.
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: 'npm run dev',
        url: 'http://localhost:3000',
        reuseExistingServer: true,
        timeout: 120000,
      },
});
