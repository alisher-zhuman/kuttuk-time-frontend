import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";
import {
  createSameLayerImportConfig,
  createSelfLayerImportConfig,
  createBarrelImportConfig,
} from "./eslint/helpers/internal-imports.js";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommendedTypeChecked,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-var": "error",
      "prefer-const": "error",

      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      "@typescript-eslint/consistent-type-exports": [
        "error",
        { fixMixedExportsWithInlineTypeSpecifier: true },
      ],
      "@typescript-eslint/no-floating-promises": "off",
      "@typescript-eslint/no-misused-promises": [
        "error",
        { checksVoidReturn: { attributes: false } },
      ],

      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            ["^react(?:/.*|$)", "^react-dom(?:/.*|$)", "^react-router(?:/.*|$)"],
            ["^i18next(?:/.*|$)", "^react-i18next$"],
            ["^@hookform/resolvers(?:/.*|$)", "^react-hook-form$", "^zod$"],
            [
              "^(?!react|react-dom|react-router|i18next|react-i18next|@hookform|react-hook-form|zod|@(?:app|pages|widgets|features|entities|shared)(?:/|$))@?\\w",
            ],
            ["^@app(?:/.*|$)"],
            ["^@pages(?:/.*|$)"],
            ["^@widgets(?:/.*|$)"],
            ["^@features(?:/.*|$)"],
            ["^@entities(?:/.*|$)"],
            ["^@shared(?:/.*|$)"],
            ["^\\u0000"],
            ["^/"],
            ["^\\."],
          ],
        },
      ],
      "simple-import-sort/exports": "error",
    },
  },
  createSelfLayerImportConfig("shared"),
  createSelfLayerImportConfig("app"),
  createSameLayerImportConfig("entities"),
  createSameLayerImportConfig("features"),
  createSameLayerImportConfig("widgets"),
  createSameLayerImportConfig("pages"),
  createBarrelImportConfig({
    files: ["src/app/**/*.{ts,tsx}"],
    layer: "widgets",
    pattern: "*/*",
    message: "Use widget barrel exports.",
  }),
  createBarrelImportConfig({
    files: ["src/**/*.{ts,tsx}"],
    layer: "features",
    pattern: "*/*",
    message: "Use feature barrel exports.",
  }),
  {
    files: ["src/features/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@entities/*/ui/*", "@entities/*/hooks/*"],
              message: "Use entity barrel exports.",
            },
          ],
        },
      ],
    },
  },
]);
