import { fixtures } from "@mocks";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@tests";
import { describe, expect, it } from "vitest";

import { type AdminOrderDetail } from "@entities/order";

import { OrderDetail } from "./index";

const ID = "a1b2c3d4-1111-4111-8111-111111111111";
const detail = (raw: unknown) => raw as AdminOrderDetail;
const noop = () => {};

describe("the admin's order card", () => {
  it("shows the order number support is told", () => {
    renderWithProviders(
      <OrderDetail order={detail(fixtures.adminOrderDetail(ID))} onOpenVenue={noop} onOpenMerchant={noop} onOpenBuyerOrders={noop} />
    );

    expect(screen.getByText("№A1B2C3D4")).toBeInTheDocument();
  });

  it("an expired order Finik never created a payment for says so", () => {
    renderWithProviders(
      <OrderDetail order={detail(fixtures.adminOrderDetail(ID, "expired", false))} onOpenVenue={noop} onOpenMerchant={noop} onOpenBuyerOrders={noop} />
    );

    expect(screen.getByText("Финик не создал платёж")).toBeInTheDocument();
  });

  it("needs_review: the resolve commands, copied on a tap", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <OrderDetail order={detail(fixtures.adminOrderDetail(ID, "needs_review"))} onOpenVenue={noop} onOpenMerchant={noop} onOpenBuyerOrders={noop} />
    );

    await user.click(screen.getByRole("button", { name: /Выдать сертификат/ }));

    expect(await navigator.clipboard.readText()).toBe(`npm run orders:resolve-review -- --order ${ID} --issue`);
  });

  it("the buyer's ID opens their orders", async () => {
    let opened = false;
    renderWithProviders(
      <OrderDetail
        order={detail(fixtures.adminOrderDetail(ID))}
        onOpenVenue={noop}
        onOpenMerchant={noop}
        onOpenBuyerOrders={() => (opened = true)}
      />
    );

    await userEvent.click(screen.getByRole("button", { name: /ID 42/ }));
    expect(opened).toBe(true);
  });
});
