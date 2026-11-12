import { api, fixtures, server } from "@mocks";
import { act, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@tests";
import { http, HttpResponse } from "msw/http";
import { afterEach, describe, expect, it, vi } from "vitest";

import { type Certificate } from "@entities/certificate";

import { useAppModeStore, useWebMainButtonStore } from "@shared/store";

import { CertificateDetail } from "./index";

const certificate = fixtures.myCertificates[0] as unknown as Certificate;
const LINK = "https://kuttuk-time.vercel.app/gift/aB3_dE6-gH9iJ2kL5mN8oP";

const giftLink = () => {
  const calls = { count: 0 };
  server.use(
    http.post(api(`/certificates/${certificate.id}/gift-link`), () => {
      calls.count += 1;
      return HttpResponse.json({ url: LINK });
    })
  );
  return calls;
};

const pressGift = async () => {
  await waitFor(() => expect(useWebMainButtonStore.getState().button?.text).toBe("Подарить"));
  act(() => useWebMainButtonStore.getState().button?.onClick());
};

afterEach(() => {
  vi.unstubAllGlobals();
  Reflect.deleteProperty(navigator, "share");
});

describe("«Подарить» on the website", () => {
  it("makes a gift link and opens the phone's share menu with the buyer's words", async () => {
    const calls = giftLink();
    const share = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "share", { value: share, configurable: true });
    useAppModeStore.setState({ mode: "web" });
    renderWithProviders(<CertificateDetail certificate={certificate} />);

    await pressGift();

    await waitFor(() => expect(share).toHaveBeenCalledOnce());
    expect(share).toHaveBeenCalledWith({
      title: "KuttukTime",
      text: "🎁 Тебе подарок - сертификат в Coffeeroom на 1 000 сом",
      url: LINK
    });
    expect(calls.count).toBe(1);
    // Never the Telegram card on the website.
    expect(window.__telegram.calls.some((call) => call.name === "web_app_send_prepared_message")).toBe(false);
  });

  it("no share menu: the link is copied and the buyer is told", async () => {
    // A clipboard for jsdom.
    userEvent.setup();
    giftLink();
    const alert = vi.fn();
    vi.stubGlobal("alert", alert);
    useAppModeStore.setState({ mode: "web" });
    renderWithProviders(<CertificateDetail certificate={certificate} />);

    await pressGift();

    await waitFor(() => expect(alert).toHaveBeenCalledWith("Ссылка скопирована - отправьте её другу"));
    expect(await navigator.clipboard.readText()).toContain(LINK);
  });
});
