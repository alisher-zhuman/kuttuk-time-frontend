import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const formatMoney = (amount: number, currency: string): string =>
  amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " " + currency;

export const formatDate = (iso: string): string => {
  const date = new Date(iso);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");

  return `${day}.${month}.${date.getFullYear()}`;
};
