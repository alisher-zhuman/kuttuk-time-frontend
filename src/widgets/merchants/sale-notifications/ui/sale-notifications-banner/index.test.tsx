import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@tests";
import { describe, expect, it } from "vitest";

import { SaleNotificationsBanner } from "./index";

describe("the cabinet's «Включите уведомления о продажах»", () => {
  it("stays after a refusal", async () => {
    window.__telegram.replies.writeAccess = "cancelled";
    renderWithProviders(<SaleNotificationsBanner />);

    await userEvent.click(screen.getByRole("button", { name: "Включить" }));

    await waitFor(() =>
      expect(window.__telegram.calls.some((call) => call.name === "web_app_request_write_access")).toBe(true)
    );
    expect(screen.getByText("Включите уведомления о продажах")).toBeInTheDocument();
  });

  // Last: a grant is remembered for the session (initData doesn't change).
  it("asks Telegram and goes away once allowed", async () => {
    window.__telegram.replies.writeAccess = "allowed";
    renderWithProviders(<SaleNotificationsBanner />);

    await userEvent.click(screen.getByRole("button", { name: "Включить" }));

    await waitFor(() => expect(screen.queryByText("Включите уведомления о продажах")).not.toBeInTheDocument());
  });
});
