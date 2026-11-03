import { defineConfig, devices } from "@playwright/test";

const externalBaseURL = process.env.PLAYWRIGHT_BASE_URL;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  workers: 2,
  timeout: externalBaseURL ? 60000 : 30000,
  use: { baseURL: externalBaseURL || "http://127.0.0.1:3002", trace: "retain-on-failure" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 1000 } } },
    { name: "mobile", use: { ...devices["iPhone 13"], defaultBrowserType: "chromium" } },
  ],
  webServer: externalBaseURL ? undefined : { command: "npm run dev", url: "http://127.0.0.1:3002", reuseExistingServer: true },
});
