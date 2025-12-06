import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.playwright' });

export default defineConfig({
  testDir: './test',
  fullyParallel: false,
  reporter: 'html',
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: process.env.PLAYWRIGHT_TRACE as any || 'on-first-retry',
    actionTimeout: Number(process.env.PLAYWRIGHT_ACTION_TIMEOUT) || 10000,
    navigationTimeout: Number(process.env.PLAYWRIGHT_NAVIGATION_TIMEOUT) || 30000,
    video: process.env.PLAYWRIGHT_VIDEO as any || 'off',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],
  webServer: {
    command: `npm run dev -- -p ${process.env.PORT || 3000}`,
    url: process.env.BASE_URL || 'http://localhost:3000',
    reuseExistingServer: true,
  },
});
