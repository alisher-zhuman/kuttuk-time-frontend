import { api, fixtures, server } from "@mocks";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@tests";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import { PayoutDueList } from "./index";

const answer = ({
  due = fixtures.payoutDue,
  details = "Mbank 0555 123 456, Асанов А."
}: { due?: typeof fixtures.payoutDue; details?: string | null } = {}) => {
  const state = { sent: [] as unknown[] };

  server.use(
    http.get(api("/admin/payouts/due"), () => HttpResponse.json(due)),
    http.get(api("/admin/merchants/10"), () => HttpResponse.json(fixtures.adminMerchant({ payoutDetails: details }))),
    http.post(api("/admin/payouts"), async ({ request }) => {
      state.sent.push(await request.json());

      return HttpResponse.json({ merchantId: 10, from: "2026-10-12", to: "2026-10-18", payout: 27, ownerNotified: true });
    })
  );

  return state;
};

describe("«Все долги»", () => {
  it("lists every unpaid week with the total and the owner's payout details", async () => {
    answer();
    renderWithProviders(<PayoutDueList />);

    expect(await screen.findAllByText("54 сом")).toHaveLength(2); // the total and the merchant
    expect(screen.getByText("12.10-18.10.2026")).toBeInTheDocument();
    expect(screen.getByText("19.10-25.10.2026")).toBeInTheDocument();
    expect(await screen.findByText("Mbank 0555 123 456, Асанов А.")).toBeInTheDocument();
  });

  it("no payout details: «Указать реквизиты» opens the owner's form on that field", async () => {
    answer({ details: null });
    const { router } = renderWithProviders(<PayoutDueList />);

    expect(await screen.findByText("Реквизиты не указаны")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Указать реквизиты" }));

    expect(`${router.state.location.pathname}${router.state.location.search}`).toBe(
      "/app/admin/merchant-edit/10?focus=payoutDetails"
    );
  });

  it("marks one week: POST with that week's `from` and the amount on screen", async () => {
    const state = answer();
    renderWithProviders(<PayoutDueList />);

    const [first] = await screen.findAllByRole("button", { name: "Отметить" });
    await userEvent.click(first!);

    const sheet = await screen.findByRole("dialog");
    await userEvent.click(within(sheet).getByRole("button", { name: "Отметить" }));

    await waitFor(() => expect(state.sent).toEqual([{ merchantId: 10, week: "2026-10-12", expectedPayout: 27 }]));
  });

  it("opens a week in the weekly report", async () => {
    answer();
    const { router } = renderWithProviders(<PayoutDueList />);

    await userEvent.click(await screen.findByRole("button", { name: /19\.10-25\.10\.2026/ }));

    expect(router.state.location.search).toBe("?week=2026-10-19");
  });

  it("nothing owed", async () => {
    answer({ due: { merchants: [], total: 0 } });
    renderWithProviders(<PayoutDueList />);

    expect(await screen.findByText("Долгов нет - всё выплачено")).toBeInTheDocument();
  });
});
