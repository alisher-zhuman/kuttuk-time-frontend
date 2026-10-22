// The API origin tests run against (vitest.config env) — for MSW handlers:
// http.get(api("/venues"), …).
export const API = "http://api.test/api";

export const api = (path: string) => `${API}${path}`;
