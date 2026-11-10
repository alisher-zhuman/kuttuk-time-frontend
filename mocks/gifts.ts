import { http, HttpResponse } from "msw";

import { api } from "./api";
import { claimedCertificate, gift, GIFT_TOKEN } from "./fixtures";

type GiftState = Parameters<typeof gift>[0];
type GiftStatus = Parameters<typeof gift>[1];

interface Options {
  token?: string;
  // What GET /gifts/:token finds; "missing" - unknown or replaced link (404).
  preview?: { state: GiftState; status?: GiftStatus } | "missing";
  // What POST …/claim answers: the certificate, a 409 error, or 404.
  claim?: "ok" | "own" | "already_claimed" | "already_used" | "expired" | "missing";
  // GET after a failed claim - the link as it is now.
  afterClaim?: { state: GiftState; status?: GiftStatus } | "missing";
}

// /api/gifts/* (../backend src/certificates/gifts.controller.ts). Returns the
// handlers and a counter of claims.
export const giftHandlers = ({ token = GIFT_TOKEN, preview = { state: "available" }, claim = "ok", afterClaim }: Options = {}) => {
  const calls = { claims: 0 };

  const answer = (found: Options["preview"]) =>
    found === "missing" || found === undefined
      ? HttpResponse.json({ message: "Gift not found", error: "Not Found", statusCode: 404 }, { status: 404 })
      : HttpResponse.json(gift(found.state, found.status));

  const handlers = [
    http.get(api(`/gifts/${token}`), () => answer(calls.claims > 0 && afterClaim ? afterClaim : preview)),
    http.post(api(`/gifts/${token}/claim`), () => {
      calls.claims += 1;

      if (claim === "ok") return HttpResponse.json(claimedCertificate);

      if (claim === "missing") {
        return HttpResponse.json({ message: "Gift not found", error: "Not Found", statusCode: 404 }, { status: 404 });
      }

      return HttpResponse.json({ message: "Conflict", error: claim }, { status: 409 });
    })
  ];

  return { handlers, calls };
};
