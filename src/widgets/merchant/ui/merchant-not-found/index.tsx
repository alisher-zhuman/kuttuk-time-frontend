import { useTranslation } from "react-i18next";

import { Store } from "lucide-react";

export const MerchantNotFound = () => {
  const { t } = useTranslation();

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3 text-(--color-hint)">
      <span className="size-16 rounded-2xl bg-(--color-chip) flex items-center justify-center">
        <Store size={32} strokeWidth={1.5} />
      </span>

      <p className="text-sm font-semibold">{t("merchantDetail.notFound")}</p>
    </div>
  );
};
