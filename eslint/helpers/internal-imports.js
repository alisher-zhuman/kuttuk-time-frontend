export const createSelfLayerImportConfig = (layer) => ({
  files: [`src/${layer}/**/*.{ts,tsx}`],
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: [`@${layer}`, `@${layer}/*`],
            message: `Use relative imports inside ${layer}.`,
          },
        ],
      },
    ],
  },
});

export const createSameLayerImportConfig = (layer) => ({
  files: [`src/${layer}/**/*.{ts,tsx}`],
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: [`@${layer}`, `@${layer}/*`],
            message: `${layer} cannot import ${layer}. Move shared code down a layer or compose it in a higher layer.`,
          },
        ],
      },
    ],
  },
});

export const createBarrelImportConfig = ({ files, layer, pattern, message }) => ({
  files,
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: [`@${layer}/${pattern}`],
            message,
          },
        ],
      },
    ],
  },
});
