export const NOMINAL_PRESETS = [
  // TEMP: 10 som for Finik payment testing — mirrors the backend's temporary
  // VALID_NOMINALS entry; remove both together.
  10,
  500, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000
] as const;
export const VALIDITY_PRESETS = [3, 6, 12, 24] as const;
