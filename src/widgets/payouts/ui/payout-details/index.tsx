import { useTranslation } from "react-i18next";

import { useAdminMerchantQuery } from "@entities/merchant";

interface Props {
  merchantId: number;
}

// Where to transfer the money - next to the amount, so the admin doesn't open
// the owner's card mid-payout. From the admin's merchant notes.
export const PayoutDetails = ({ merchantId }: Props) => {
  const { t } = useTranslation();

  const { merchant, isLoading } = useAdminMerchantQuery(String(merchantId));

  if (isLoading) return <span className="h-4 w-40 rounded bg-(--color-chip) animate-pulse" />;

  if (!merchant) return null;

  return (
    <span className="flex flex-col gap-0.5 text-xs">
      <span className="font-bold text-(--color-hint)">{t("merchantForm.payoutDetails")}</span>
      {merchant.payoutDetails ? (
        <span className="font-semibold text-(--color-ink) whitespace-pre-wrap wrap-break-word">
          {merchant.payoutDetails}
        </span>
      ) : (
        <span className="font-semibold text-(--color-amber)">{t("admin.payouts.noDetails")}</span>
      )}
    </span>
  );
};
