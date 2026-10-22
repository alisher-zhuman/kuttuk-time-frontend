import { setupServer } from "msw/node";

// No default handlers: every test answers exactly the requests it expects
// (server.use). With onUnhandledRequest "error" in vitest.setup, a request no
// test answered fails that test instead of passing on someone else's mock.
export const server = setupServer();
