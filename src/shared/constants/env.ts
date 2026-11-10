export const API_URL = import.meta.env["VITE_API_URL"] as string;

// A hung connection must end in an error with «Повторить», not an endless
// spinner. Log-in waits longer: it's the first request, and Koyeb wakes the
// sleeping backend for up to ~30 s. An upload sends up to 5 MB.
export const REQUEST_TIMEOUT_MS = 15_000;
export const LOG_IN_TIMEOUT_MS = 45_000;
export const UPLOAD_TIMEOUT_MS = 60_000;
