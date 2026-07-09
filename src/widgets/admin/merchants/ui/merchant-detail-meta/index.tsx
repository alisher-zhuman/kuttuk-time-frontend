import { useTranslation } from "react-i18next";

import { formatDate } from "@shared/helpers";

interface Props {
  validityMonths: number;
  merchantTelegramId: number;
  createdAt: string;
}

export const MerchantDetailMeta = ({
  validityMonths,
  merchantTelegramId,
  createdAt
}: Props) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-4">
      <div>
        <p className="text-xs font-bold text-(--color-hint) tracking-widest px-1 pb-1">
          {t("admin.merchants.detail.validity")}
        </p>
        <p className="text-sm font-bold text-(--color-ink) px-1">
          {t("admin.merchants.detail.validityValue", { months: validityMonths })}
        </p>
      </div>

      <div>
        <p className="text-xs font-bold text-(--color-hint) tracking-widest px-1 pb-1">
          {t("admin.merchants.detail.telegramId")}
        </p>
        <p className="text-sm font-bold text-(--color-ink) px-1">{merchantTelegramId}</p>
      </div>

      <div>
        <p className="text-xs font-bold text-(--color-hint) tracking-widest px-1 pb-1">
          {t("admin.merchants.detail.createdAt")}
        </p>
        <p className="text-sm font-bold text-(--color-ink) px-1">
          {formatDate(createdAt)}
        </p>
      </div>
    </div>
  );
};
