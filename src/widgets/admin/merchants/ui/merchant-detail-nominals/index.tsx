import { useTranslation } from "react-i18next";

import { formatMoney } from "@shared/helpers";

interface Props {
  nominals: number[];
}

export const MerchantDetailNominals = ({ nominals }: Props) => {
  const { t } = useTranslation();

  return (
    <div>
      <p className="text-xs font-bold text-(--color-hint) tracking-widest px-1 pb-2.5">
        {t("admin.merchants.detail.nominals")}
      </p>

      <div className="flex flex-wrap gap-2">
        {nominals.map((nominal) => (
          <span
            key={nominal}
            className="px-3 py-1.5 rounded-full text-sm font-bold bg-(--color-chip) text-(--color-chip-ink) border border-(--color-line)"
          >
            {formatMoney(nominal, t("certificate.currency"))}
          </span>
        ))}
      </div>
    </div>
  );
};
