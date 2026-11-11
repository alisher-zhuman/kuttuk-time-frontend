import * as fixtures from "../mocks/fixtures";
import { expect, test } from "./support";

const LOGO = "https://res.cloudinary.com/demo/image/upload/v1/logo.png";

const venueDetail = { id: 1, name: "Coffeeroom", description: "Кофейня в центре", logo: LOGO, nominals: [500, 1000], validityMonths: 12, address: "ул. Киевская 95", mapUrl: "https://2gis.kg/bishkek/firm/70000001234567" };

const managedVenue = {
  id: 1,
  name: "Coffeeroom",
  description: { ru: "Кофе", kg: "Кофе", en: "Coffee" },
  categories: [1],
  nominals: [500, 1000],
  validityMonths: 12,
  address: "ул. Киевская 95",
  mapUrl: "https://2gis.kg/bishkek/firm/70000001234567",
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
    routes: ({ path, method, body, query }) => {
      // Without ?week= - the current week; the screen opens on the previous one.
      if (path === "/admin/payouts" && method === "GET") {
        return [200, query.has("week") ? fixtures.payoutWeek() : { ...fixtures.payoutWeek(0), from: "2026-10-26", to: "2026-11-01", merchants: [] }];
      }
      if (path === "/admin/merchants/10") return [200, fixtures.adminMerchant()];
      if (path === "/admin/payouts" && method === "POST") {
        const { expectedPayout } = body as { expectedPayout: number };
        return [201, { id: "p1", merchantId: 10, from: "2026-10-19", to: "2026-10-25", ordersCount: 3, gross: 30, commission: 3, payout: expectedPayout, paidBy: 4, createdAt: "2026-10-27T04:00:00.000Z", ownerNotified: true }];
      }
      return undefined;
    }
  });

  await page.getByRole("button", { name: "Отметить выплаченным" }).click();
  const sheet = page.getByRole("dialog");
  await expect(sheet).toContainText("27 сом для Coffeeroom");
  await expect(sheet).toContainText("Mbank 0555 123 456");
  await sheet.getByRole("textbox").fill("Mbank 27.10");
  await sheet.getByRole("button", { name: "Отметить", exact: true }).click();

  await expect.poll(() => app.sent.find((r) => r.path === "/admin/payouts")?.body).toEqual({
    merchantId: 10,
    week: "2026-10-19",
    expectedPayout: 27,
    note: "Mbank 27.10"
  });
  await expect.poll(async () => JSON.stringify(await app.calls("web_app_open_popup"))).toContain("Владелец получил сообщение");
});

test("the Monday reminder's button opens «Все долги» for an admin", async ({ app, page }) => {
  await app.open("/", {
    role: "admin",
    startParam: "admin_payouts",
    routes: ({ path }) => {
      if (path === "/admin/payouts/due") return [200, fixtures.payoutDue];
      if (path === "/admin/merchants/10") return [200, fixtures.adminMerchant()];
      return undefined;
    }
  });

  await expect(page).toHaveURL(/\/app\/admin\/payouts\?view=due/);
  await expect(page.getByText("12.10-18.10.2026")).toBeVisible();
  await expect(page.getByText("Mbank 0555 123 456, Асанов А.")).toBeVisible();
});

test("a friend opens the gift link, claims it and finds it in «Мои сертификаты»", async ({ app, page }) => {
  let claimed = false;

  await app.open("/", {
    startParam: `gift_${fixtures.GIFT_TOKEN}`,
    routes: ({ path, method }) => {
      if (path === `/gifts/${fixtures.GIFT_TOKEN}`) return [200, fixtures.gift(claimed ? "received" : "available")];
      if (path === `/gifts/${fixtures.GIFT_TOKEN}/claim` && method === "POST") {
        claimed = true;
        return [200, fixtures.claimedCertificate];
      }
      if (path === "/certificates/my") return [200, claimed ? [fixtures.claimedCertificate] : []];
      return undefined;
    }
  });

  await expect(page).toHaveURL(new RegExp(`/app/gifts/${fixtures.GIFT_TOKEN}`));
  await expect(page.getByText("Вам подарок")).toBeVisible();
  await expect.poll(async () => (await app.mainButton())?.text).toBe("Забрать подарок");
  await app.pressMainButton();

  // The certificate is the friend's now: its code and QR for the counter.
  await expect(page).toHaveURL(/\/app\/certificates\/c7/);
  await expect(page.getByText("7777 8888")).toBeVisible();
  await expect(page.getByRole("img", { name: "Покажите QR на кассе" })).toBeVisible();
  expect(app.sent).toContainEqual(expect.objectContaining({ method: "POST", path: `/gifts/${fixtures.GIFT_TOKEN}/claim` }));

  await page.goto(`/app/profile${new URL(page.url()).hash}`);
  await expect(page.getByText("7777 8888")).toBeVisible();
});

test("the giver sees the claimed certificate as «Подарен», without its code or QR", async ({ app, page }) => {
  await app.open("/app/profile", {
    routes: ({ path }) => {
      if (path === "/certificates/my") return [200, [fixtures.giftedCertificate("active")]];
      return undefined;
    }
  });

  await expect(page.getByText("Подарен 10.11.2026")).toBeVisible();
  await expect(page.getByText("5555 6666")).toHaveCount(0);
  await expect(page.getByRole("img", { name: "Покажите QR на кассе" })).toHaveCount(0);
});

test.describe("the website", () => {
  // Outside Telegram the language comes from the browser.
  test.use({ locale: "ru-RU" });

  test("the website: Finik's return /orders/<id> opens directly - a guest, no Telegram", async ({ app, page }) => {
  await app.open(`/orders/${fixtures.ORDER_ID}`, {
    web: true,
    routes: ({ path }) => {
      if (path === `/orders/${fixtures.ORDER_ID}`) return [200, fixtures.orders.paid];
      if (path === "/venues/1") return [200, venueDetail];
      return undefined;
    }
  });

  await expect(page.getByText("Сертификат готов!")).toBeVisible();
  await expect(page.getByText("0471 8263")).toBeVisible();
  // The guest is offered to keep it with Telegram; the action is a plain button.
  await expect(page.getByText(/Войдите через Telegram/)).toBeVisible();
  await expect(page.getByRole("button", { name: "Подарить" })).toBeVisible();
  // The website's footer: who runs it, how payment works.
  await expect(page.getByText("Оплата через Finik")).toBeVisible();
});

  test("the website: a gift link /gift/<token> opens directly and claims as a guest", async ({ app, page }) => {
  let claimed = false;

  await app.open(`/gift/${fixtures.GIFT_TOKEN}`, {
    web: true,
    routes: ({ path, method }) => {
      if (path === `/gifts/${fixtures.GIFT_TOKEN}`) return [200, fixtures.gift(claimed ? "received" : "available")];
      if (path === `/gifts/${fixtures.GIFT_TOKEN}/claim` && method === "POST") {
        claimed = true;
        return [200, fixtures.claimedCertificate];
      }
      if (path === "/certificates/my") return [200, claimed ? [fixtures.claimedCertificate] : []];
      return undefined;
    }
  });

  await expect(page.getByText("Вам подарок")).toBeVisible();
  await page.getByRole("button", { name: "Забрать подарок" }).click();

  await expect(page).toHaveURL(/\/app\/certificates\/c7/);
  await expect(page.getByText("7777 8888")).toBeVisible();
});
});
