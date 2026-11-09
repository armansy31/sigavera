import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3120',
    trace: 'off',
  },
  webServer: {
    command: 'node node_modules/next/dist/bin/next start -p 3120',
    url: 'http://localhost:3120',
    reuseExistingServer: false,
    timeout: 60000,
  },
  projects: [
    {
      name: 'msedge',
      use: {
        ...devices['Desktop Edge'],
        channel: 'msedge',
      },
    },
  ],
});
