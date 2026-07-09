import { useTranslation } from "react-i18next";

import { formatMoney } from "@shared/helpers";
import { ChipSelect } from "@shared/ui";

interface Props {
  nominals: number[];
  selected: number;
  onSelect: (nominal: number) => void;
}

export const NominalList = ({ nominals, selected, onSelect }: Props) => {
  const { t } = useTranslation();

  const currency = t("certificate.currency");

  return (
    <div>
      <p className="text-xs font-bold text-(--color-hint) tracking-widest px-1 pb-2.5">
        {t("merchantDetail.nominal")}
      </p>

      <ChipSelect
        size="md"
        items={nominals.map((nominal) => ({
          value: nominal,
          label: formatMoney(nominal, currency)
        }))}
        isSelected={(nominal) => nominal === selected}
        onSelect={onSelect}
      />
    </div>
  );
};
