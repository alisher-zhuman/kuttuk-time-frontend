import { useTranslation } from "react-i18next";

import { cn, formatDate } from "@shared/helpers";

import type { AdminMerchant } from "../../model/types";

interface Props {
  owner: AdminMerchant["owner"];
}

// Is the owner connected: did they ever open the app, and does the bot reach
// them (sale and payout notices). Nothing about the bot until it tried.
export const MerchantOwnerStatus = ({ owner }: Props) => {
  const { t } = useTranslation();

  return (
    <span className="flex flex-wrap gap-x-2 text-xs font-semibold">
      <span className={cn(owner.lastSeenAt ? "text-(--color-hint)" : "text-(--color-amber)")}>
        {owner.lastSeenAt
          ? t("admin.merchants.owner.lastSeen", { date: formatDate(owner.lastSeenAt) })
          : t("admin.merchants.owner.neverSeen")}
      </span>

      {owner.botReachable !== null && (
        <span className={cn(owner.botReachable ? "text-(--color-hint)" : "text-(--color-accent)")}>
          {t(owner.botReachable ? "admin.merchants.owner.botReachable" : "admin.merchants.owner.botUnreachable")}
        </span>
      )}
    </span>
  );
};
