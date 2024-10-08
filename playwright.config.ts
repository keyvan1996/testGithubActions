import { defineConfig, devices } from '@playwright/test';
import { getEnvConfig } from '@utils/exportEnvironmentVariables';
import dotenv from 'dotenv';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
dotenv.config({ path: '.env' });

const viewportConfig = {
  viewport: {
    width: 500,
    height: 800,
  },
  isMobile: true, // Add isMobile here
};

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './src/tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    actionTimeout: 10000,
    navigationTimeout: 10000,
    headless: true,
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'Test',
      use: {
        ...devices['Desktop Chrome'], // Always keep Desktop Chrome
        ...(getEnvConfig().IS_RUNNING_ON_MOBILE ? viewportConfig : {}), // Add viewport and isMobile conditionally
      },
    },
    {
      name: 'Prod',
      use: {
        ...devices['Desktop Chrome'], // Always keep Desktop Chrome
        ...(getEnvConfig().IS_RUNNING_ON_MOBILE ? viewportConfig : {}), // Add viewport and isMobile conditionally
      },
    },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
