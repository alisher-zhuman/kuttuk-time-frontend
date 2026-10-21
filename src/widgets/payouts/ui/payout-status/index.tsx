import { useTranslation } from "react-i18next";

import { cn, formatMoney } from "@shared/helpers";

interface Props {
  paidOut: number;
  due: number;
}

// Where a merchant's week stands: fully paid out, not yet, or a top-up due
// (an order landed in the week after it was marked).
export const PayoutStatus = ({ paidOut, due }: Props) => {
  const { t } = useTranslation();

  const currency = t("certificate.currency");

  if (due === 0 && paidOut === 0) return null;

  const [text, tone] =
    due === 0
      ? [t("admin.payouts.paidOut"), "text-(--color-green)"]
      : paidOut === 0
        ? [t("admin.payouts.due", { amount: formatMoney(due, currency) }), "text-(--color-primary)"]
        : [
            t("admin.payouts.partial", {
              paid: formatMoney(paidOut, currency),
              due: formatMoney(due, currency)
            }),
            "text-(--color-amber)"
          ];

  return <span className={cn("text-sm font-bold", tone)}>{text}</span>;
};
