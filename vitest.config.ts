import { fileURLToPath } from "node:url";
import { defineConfig, mergeConfig } from "vitest/config";

import viteConfig from "./vite.config";

// The app's aliases and plugins come from vite.config — one source of truth.
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
    test: {
      environment: "jsdom",
      // Colocated unit / component tests only; e2e/ is Playwright's.
      include: ["src/**/*.test.{ts,tsx}"],
      setupFiles: ["./vitest.setup.ts"],
      // A fake origin: nothing is ever fetched from it — MSW fails any request
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
