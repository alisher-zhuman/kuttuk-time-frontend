import { useTranslation } from "react-i18next";

import { formatMoney } from "@shared/helpers";
import { ChipSelect, FieldLabel } from "@shared/ui";

interface Props {
  nominals: number[];
  selected: number;
  onSelect: (nominal: number) => void;
}

export const NominalList = ({ nominals, selected, onSelect }: Props) => {
  const { t } = useTranslation();

  const currency = t("certificate.currency");

  return (
    <div className="flex flex-col gap-2.5">
      <FieldLabel>{t("merchantDetail.nominal")}</FieldLabel>

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
