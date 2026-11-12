import { type TFunction } from "i18next";

export interface FaqItem {
  question: string;
  answer: string;
}

// faq.q1 / faq.a1 … in the locales; one list for the app's page, the
// pre-rendered one and its FAQPage structured data.
const COUNT = 6;

export const getFaqItems = (t: TFunction): FaqItem[] =>
  Array.from({ length: COUNT }, (_, index) => ({
    question: t(`faq.q${index + 1}`),
    answer: t(`faq.a${index + 1}`)
  }));
