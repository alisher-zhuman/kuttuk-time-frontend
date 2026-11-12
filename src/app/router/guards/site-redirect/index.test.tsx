import { waitFor } from "@testing-library/react";
import { renderWithProviders } from "@tests";
import { describe, expect, it } from "vitest";

import { useAppModeStore } from "@shared/store";

import { SiteRedirect } from "./index";

describe("the website on an old /app/... address", () => {
  it("moves to the public one, keeping the language and the rest of the query", async () => {
    useAppModeStore.setState({ mode: "web" });
    const { router } = renderWithProviders(<SiteRedirect />, { route: "/app/about?lang=kg", language: "kg" });

    await waitFor(() => expect(router.state.location.pathname).toBe("/about"));
    expect(router.state.location.search).toBe("?lang=kg");
  });
});
