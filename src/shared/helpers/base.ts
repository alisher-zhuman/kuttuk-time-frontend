import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const formatMoney = (amount: number, currency: string): string =>
  amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " " + currency;
