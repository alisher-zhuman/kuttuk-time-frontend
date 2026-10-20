import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const formatMoney = (amount: number, currency: string): string =>
  amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " " + currency;

// Business time is Bishkek (payout weeks, validity, redemption) — show every
// timestamp there, not in the device's zone, so a merchant abroad and the
// payout report see the same day.
const BISHKEK_PARTS = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Bishkek",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23"
});

const bishkekParts = (iso: string) =>
  Object.fromEntries(
    BISHKEK_PARTS.formatToParts(new Date(iso)).map(({ type, value }) => [type, value])
  );

export const formatDate = (iso: string): string => {
  const { day, month, year } = bishkekParts(iso);

  return `${day}.${month}.${year}`;
};

export const formatDateTime = (iso: string): string => {
  const { day, month, year, hour, minute } = bishkekParts(iso);

  return `${day}.${month}.${year}, ${hour}:${minute}`;
};

// Calendar dates the backend sends as "YYYY-MM-DD" (e.g. payout weeks) are
// handled as plain strings in UTC — never through the local zone, which would
// shift the day.
export const formatIsoDate = (date: string): string => {
  const [year, month, day] = date.split("-");

  return `${day}.${month}.${year}`;
};

export const shiftIsoDate = (date: string, days: number): string => {
  const [year, month, day] = date.split("-").map(Number);

  return new Date(Date.UTC(year!, month! - 1, day! + days)).toISOString().slice(0, 10);
};
