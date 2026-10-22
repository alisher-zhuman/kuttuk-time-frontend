import { api, fixtures, server } from "@mocks";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@tests";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import { PayoutReport } from "./index";

// GET answers the current due; POST records it unless a sale landed meanwhile.
const answer = ({ changeOnce = false } = {}) => {
  const state = { due: 27, sent: [] as unknown[] };

  server.use(
    http.get(api("/admin/payouts"), () => HttpResponse.json(fixtures.payoutWeek(state.due))),
    http.post(api("/admin/payouts"), async ({ request }) => {
      const body = (await request.json()) as { expectedPayout: number };
      state.sent.push(body);

      if (changeOnce) {
        changeOnce = false;
        state.due = 36;

        return HttpResponse.json(fixtures.conflicts.amountChanged, { status: 409 });
      }

      return HttpResponse.json({
        id: "p1",
        merchantId: 10,
        from: "2026-10-19",
        to: "2026-10-25",
        ordersCount: 4,
        gross: 40,
        commission: 4,
        payout: body.expectedPayout,
        paidBy: 4,
        createdAt: "2026-10-27T04:00:00.000Z"
      });
    })
  );

  return state;
};

const openSheet = async () => {
  await userEvent.click(await screen.findByRole("button", { name: "Отметить выплаченным" }));

  return screen.findByRole("dialog");
};

describe("marking a payout", () => {
  it("sends the amount the admin saw as expectedPayout", async () => {
    const state = answer();
    renderWithProviders(<PayoutReport />);

    const sheet = await openSheet();
    expect(within(sheet).getByText(/27 сом/)).toBeInTheDocument();
    await userEvent.click(within(sheet).getByRole("button", { name: "Отметить" }));

    await waitFor(() => expect(state.sent).toEqual([{ merchantId: 10, week: "2026-10-19", expectedPayout: 27 }]));
  });

  it("on 409 amount_changed keeps the sheet open with the new amount, then sends it", async () => {
    const state = answer({ changeOnce: true });
    renderWithProviders(<PayoutReport />);

    const sheet = await openSheet();
    await userEvent.click(within(sheet).getByRole("button", { name: "Отметить" }));

    await waitFor(() =>
      expect(window.__telegram.last("web_app_open_popup")?.["message"]).toContain("Сумма изменилась")
    );
    // Same sheet, refetched amount.
    expect(await within(screen.getByRole("dialog")).findByText(/36 сом/)).toBeInTheDocument();

    await userEvent.click(within(screen.getByRole("dialog")).getByRole("button", { name: "Отметить" }));

    await waitFor(() => expect(state.sent).toHaveLength(2));
    expect(state.sent[1]).toMatchObject({ expectedPayout: 36 });
  });

  it("sends nothing on «Отмена»", async () => {
    const state = answer();
    renderWithProviders(<PayoutReport />);

    const sheet = await openSheet();
    await userEvent.click(within(sheet).getByRole("button", { name: "Отмена" }));

    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(state.sent).toEqual([]);
  });
});
