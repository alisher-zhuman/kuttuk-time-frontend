import { fileURLToPath } from "node:url";
import { defineConfig, mergeConfig } from "vitest/config";

import viteConfig from "./vite.config.ts";

// The app's aliases and plugins come from vite.config - one source of truth.
export default mergeConfig(
  viteConfig,
  defineConfig({
    resolve: {
      alias: {
        // Outside src on purpose: steiger treats every folder there as an FSD layer.
        "@tests": fileURLToPath(new URL("./test-utils", import.meta.url)),
        "@mocks": fileURLToPath(new URL("./mocks", import.meta.url))
      }
    },
    // The legal texts' sync test reads the backend's originals when the backend
    // sits next to this repo (src/shared/legal/legal.test.ts) - that folder only.
    server: {
      fs: { allow: [".", "../backend/docs/legal"] }
    },
    test: {
      environment: "jsdom",
      // The page's origin = the API's in tests: MSW 3 intercepts at the socket,
      // so jsdom's own CORS check runs, and a mocked response from another
      // origin (no CORS headers) would fail as a network error
      // (github.com/mswjs/msw/issues/2803 - the maintainer's recommended fix).
      environmentOptions: { jsdom: { url: "http://api.test/" } },
      // Colocated unit / component tests only; e2e/ is Playwright's.
      include: ["src/**/*.test.{ts,tsx}"],
      setupFiles: ["./vitest.setup.ts"],
      // A fake origin: nothing is ever fetched from it - MSW fails any request
      // a test doesn't answer.
      env: { VITE_API_URL: "http://api.test/api" },
      // describe / it / expect are imported explicitly.
      globals: false,
      restoreMocks: true,
      css: false,
      coverage: {
        provider: "v8",
        include: ["src/**/*.{ts,tsx}"],
        exclude: ["src/**/*.test.{ts,tsx}", "src/**/index.ts", "src/app/**", "src/shared/locales/**"],
        reporter: ["text", "html"]
      }
    }
  })
);
