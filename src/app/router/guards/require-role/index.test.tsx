import { createMemoryRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useAppModeStore, useAuthStore } from "@shared/store";

// The app's i18n, ru.
import "@tests";

import { RequireRole } from "./index";

const open = () =>
  render(
    <RouterProvider
      router={createMemoryRouter(
        [{ element: <RequireRole role="merchant" />, children: [{ path: "/app/merchant", element: <p>Касса</p> }] }],
        { initialEntries: ["/app/merchant"] }
      )}
    />
  );

describe("the cabinet on the website", () => {
  it("an owner on the website gets a way to the Mini App, not the cabinet", () => {
    useAppModeStore.setState({ mode: "web" });
    useAuthStore.setState({ role: "merchant" });
    open();

    expect(screen.getByText("Кабинет владельца работает в Telegram")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Открыть в Telegram" })).toBeInTheDocument();
    expect(screen.queryByText("Касса")).not.toBeInTheDocument();
  });

  it("in the Mini App the owner gets the cabinet", () => {
    useAuthStore.setState({ role: "merchant" });
    open();

    expect(screen.getByText("Касса")).toBeInTheDocument();
  });
});
