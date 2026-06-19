import fsd from "@feature-sliced/steiger-plugin";
import { defineConfig } from "steiger";

export default defineConfig([
  ...fsd.configs.recommended,
  {
    rules: {
      "fsd/segments-by-purpose": "off",
      "fsd/insignificant-slice": "off",
      "fsd/inconsistent-naming": "off",
      "fsd/repetitive-naming": "off",
      "fsd/excessive-slicing": "off",
    },
  },
  {
    files: ["./src/pages/**"],
    rules: {
      "fsd/no-segmentless-slices": "off",
    },
  },
]);
