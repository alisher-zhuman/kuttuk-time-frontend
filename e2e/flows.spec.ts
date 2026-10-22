import * as fixtures from "../mocks/fixtures";
import { expect, test } from "./support";

const LOGO = "https://res.cloudinary.com/demo/image/upload/v1/logo.png";

const venueDetail = { id: 1, name: "Coffeeroom", description: "Кофейня в центре", logo: LOGO, nominals: [500, 1000], validityMonths: 12 };

const managedVenue = {
  id: 1,
  name: "Coffeeroom",
  description: { ru: "Кофе", kg: "Кофе", en: "Coffee" },
  categories: [1],
  nominals: [500, 1000],
  validityMonths: 12,
  logo: LOGO,
  slug: "coffeeroom",
  isActive: true,
  createdAt: "2026-06-01T00:00:00.000Z"
};

test("a buyer buys a certificate, sees it paid and gifts it", async ({ app, page }) => {
  await app.open("/app/venues/1", {
    routes: ({ path, method }) => {
      if (path === "/venues/1") return [200, venueDetail];
      if (path === "/orders" && method === "POST")
        {return [201, { orderId: fixtures.ORDER_ID, paymentUrl: "https://pay.finik.test/x", expiresAt: fixtures.orders.paid.expiresAt }];}
      if (path === `/orders/${fixtures.ORDER_ID}`) return [200, fixtures.orders.paid];
      if (path === "/certificates/c1/share" && method === "POST") return [200, { preparedMessageId: "pm-1", expiresAt: "2026-10-22T00:00:00.000Z" }];
      return undefined;
    }
  });

  await page.getByRole("button", { name: /1\s000/ }).first().click();
  await expect.poll(async () => (await app.mainButton())?.text).toBe("Купить");
  await app.pressMainButton();

  await expect(page).toHaveURL(new RegExp(`/app/orders/${fixtures.ORDER_ID}`));
  expect(app.sent.find((r) => r.path === "/orders")?.body).toEqual({ venueId: 1, nominal: 1000 });
  // The bank page opens in Telegram's browser.
  expect(await app.calls("web_app_open_link")).toContainEqual(expect.objectContaining({ url: "https://pay.finik.test/x" }));

  await expect(page.getByText("Сертификат готов!")).toBeVisible();
  await expect(page.getByText("0471 8263")).toBeVisible();
  await expect(page.getByRole("img", { name: "Покажите QR на кассе" })).toBeVisible();

  await expect.poll(async () => (await app.mainButton())?.text).toBe("Подарить");
  await app.pressMainButton();

  await expect.poll(() => app.calls("web_app_send_prepared_message")).toEqual([{ id: "pm-1" }]);
});

test("an owner redeems a certificate by its code", async ({ app, page }) => {
  let status: "active" | "used" = "active";

  await app.open("/app/merchant/certificates", {
    role: "merchant",
    routes: ({ path, method }) => {
      if (path === "/merchants/me") return [200, { id: 5, name: "ИП Асанов", isActive: true, venues: [managedVenue] }];
      if (path === "/merchants/me/certificates") return [200, { items: [fixtures.merchantCertificate(status)], nextCursor: null }];
      if (path === "/merchants/me/certificates/04718263") return [200, fixtures.merchantCertificate(status)];
      if (path === "/merchants/me/certificates/04718263/redeem" && method === "POST") {
        status = "used";
        return [200, fixtures.merchantCertificate("used")];
      }
      return undefined;
    }
  });

  await app.answerPopupWith("redeem");
  await page.getByPlaceholder("Введите код сертификата").fill("0471 8263");
  await page.getByRole("button", { name: "Погасить", exact: true }).click();

  await expect(page.getByText("Сертификат погашен")).toBeVisible();
  expect(app.sent.filter((r) => r.path.endsWith("/redeem"))).toHaveLength(1);
  await expect(page.getByPlaceholder("Введите код сертификата")).toHaveValue("");
});

test("an admin marks a merchant's week as paid out", async ({ app, page }) => {
  await app.open("/app/admin/payouts", {
    role: "admin",
    routes: ({ path, method, body }) => {
      if (path === "/admin/payouts" && method === "GET") return [200, fixtures.payoutWeek()];
      if (path === "/admin/payouts" && method === "POST") {
        const { expectedPayout } = body as { expectedPayout: number };
        return [201, { id: "p1", merchantId: 10, from: "2026-10-19", to: "2026-10-25", ordersCount: 3, gross: 30, commission: 3, payout: expectedPayout, paidBy: 4, createdAt: "2026-10-27T04:00:00.000Z" }];
      }
      return undefined;
    }
  });

  await page.getByRole("button", { name: "Отметить выплаченным" }).click();
  const sheet = page.getByRole("dialog");
  await expect(sheet).toContainText("27 сом для Coffeeroom");
  await sheet.getByRole("textbox").fill("Mbank 27.10");
  await sheet.getByRole("button", { name: "Отметить", exact: true }).click();

  await expect.poll(() => app.sent.find((r) => r.path === "/admin/payouts")?.body).toEqual({
    merchantId: 10,
    week: "2026-10-19",
    expectedPayout: 27,
    note: "Mbank 27.10"
  });
  await expect.poll(async () => JSON.stringify(await app.calls("web_app_open_popup"))).toContain("27 сом");
});
