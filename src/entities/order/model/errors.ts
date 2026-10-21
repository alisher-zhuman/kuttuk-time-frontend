import { isAxiosError } from "axios";

// 401 never reaches here: api.ts re-logs in, or shows SessionExpiredPage.
export const getOrderErrorKey = (error: unknown): string => {
  if (!isAxiosError(error)) {
    return "errors.generic";
  }

  if (!error.response) {
    return "orders.errors.network";
  }

  switch (error.response.status) {
    // Merchant deactivated or nominal no longer offered — the page is stale.
    case 400:
      return "orders.errors.unavailable";
    case 404:
      return "orders.errors.notFound";
    // Per-user limit (user:<id>) that resets within a minute — the message
    // just asks to wait, it doesn't blame the user.
    case 429:
      return "orders.errors.tooManyRequests";
    // Finik failed; the backend expired the order and no payment URL was
    // issued, so nothing could have been charged.
    case 502:
      return "orders.errors.paymentProvider";
    default:
      return "errors.generic";
  }
};

// GET /admin/orders?search= that is neither a certificate code nor an order id.
export const isAdminOrderSearchError = (error: unknown) =>
  isAxiosError(error) && error.response?.status === 400;
