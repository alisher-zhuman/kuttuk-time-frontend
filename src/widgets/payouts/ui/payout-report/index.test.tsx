import { api, fixtures, server } from "@mocks";
import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@tests";
import { http, HttpResponse } from "msw/http";
import { describe, expect, it } from "vitest";

import { PayoutReport } from "./index";

// GET answers the current due; POST records it unless a sale landed meanwhile.
const answer = ({ changeOnce = false } = {}) => {
  const state = { due: 27, sent: [] as unknown[], weeks: [] as (string | null)[], notified: true };

  server.use(
    // Without ?week= the backend answers the current week; the screen opens
    // on the previous one (19.10-25.10), which is the one to pay for.
    http.get(api("/admin/payouts"), ({ request }) => {
      state.weeks.push(new URL(request.url).searchParams.get("week"));

      return HttpResponse.json(
        new URL(request.url).searchParams.has("week")
          ? fixtures.payoutWeek(state.due)
          : { ...fixtures.payoutWeek(0), from: "2026-10-26", to: "2026-11-01", merchants: [] }
      );
    }),
    http.get(api("/admin/merchants/10"), () => HttpResponse.json(fixtures.adminMerchant())),
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
        createdAt: "2026-10-27T04:00:00.000Z",
        ownerNotified: state.notified
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
    // The sheet closes when its slide-out ends - jsdom has no transitions, and
    // on a slow runner the sheet is already shown, so end it by hand.
    fireEvent.transitionEnd(sheet, { propertyName: "transform" });

    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(state.sent).toEqual([]);
  });

  it("opens on the previous week - the one to pay for", async () => {
    const state = answer();
    renderWithProviders(<PayoutReport />);

    expect(await screen.findByText("19.10-25.10.2026")).toBeInTheDocument();
    expect(state.weeks).toContain("2026-10-19");
  });

  it("shows the owner's payout details in the confirmation", async () => {
    answer();
    renderWithProviders(<PayoutReport />);

    const sheet = await openSheet();

    expect(await within(sheet).findByText("Mbank 0555 123 456, Асанов А.")).toBeInTheDocument();
  });

  it.each([
    [true, "Владелец получил сообщение"],
    [false, "Сообщение не дошло - напишите владельцу сами"]
  ])("ownerNotified %s → says whether the owner got the message", async (notified, text) => {
    const state = answer();
    state.notified = notified;
    renderWithProviders(<PayoutReport />);

    const sheet = await openSheet();
    await userEvent.click(within(sheet).getByRole("button", { name: "Отметить" }));

    await waitFor(() => expect(String(window.__telegram.last("web_app_open_popup")?.["message"])).toContain(text));
  });
});
