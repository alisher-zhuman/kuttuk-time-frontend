import { act, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@tests";
import { describe, expect, it, vi } from "vitest";

import { useWebMainButtonStore } from "@shared/store";

import { WebMainButton } from "./index";

describe("the website's main button", () => {
  it("draws the screen's action and runs it; nothing without one", async () => {
    const onClick = vi.fn();
    renderWithProviders(<WebMainButton />);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();

    act(() => useWebMainButtonStore.getState().setButton({ text: "Купить", onClick, disabled: false, loading: false }));
    await userEvent.click(screen.getByRole("button", { name: "Купить" }));

    expect(onClick).toHaveBeenCalledOnce();
  });

  it("is off while loading", () => {
    renderWithProviders(<WebMainButton />);

    act(() => useWebMainButtonStore.getState().setButton({ text: "Купить", onClick: () => {}, disabled: false, loading: true }));

    expect(screen.getByRole("button", { name: "Купить" })).toBeDisabled();
  });
});
