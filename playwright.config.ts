import { defineConfig, devices } from "@playwright/test";

// End-to-end on mocks only: there is no test stand, and logging in needs a
// Telegram signature. A production build points at a fake API origin, every
// request to it is answered by page.route (e2e/support.ts), and the Telegram
// client is a stub — nothing reaches prod or Telegram.
const PORT = 4180;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env["CI"]),
  retries: 0,
  reporter: process.env["CI"] ? [["github"], ["list"]] : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    ...devices["Pixel 7"],
    trace: "retain-on-failure",
    // Locally, an already-downloaded Chromium can stand in for Playwright's
    // own (CI installs that one).
    ...(process.env["PW_CHROMIUM_PATH"] && {
      launchOptions: { executablePath: process.env["PW_CHROMIUM_PATH"] }
    })
  },
  projects: [{ name: "chromium", use: { browserName: "chromium" } }],
  webServer: {
    command: `vite build --outDir dist-e2e --emptyOutDir && vite preview --outDir dist-e2e --port ${PORT} --strictPort`,
    env: { VITE_API_URL: "http://api.test/api" },
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env["CI"],
    timeout: 120_000
  }
});
