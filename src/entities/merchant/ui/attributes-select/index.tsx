import { useTranslation } from "react-i18next";

import { NOMINAL_PRESETS, VALIDITY_PRESETS } from "@shared/constants";
import { formatMoney } from "@shared/helpers";
import { ChipSelect } from "@shared/ui";

interface CategoryOption {
  value: number;
  label: string;
}

interface Props {
  categoryOptions: CategoryOption[];
  categories: number[];
  nominals: number[];
  validityMonths: number;
  onCategoriesChange: (categories: number[]) => void;
  onNominalsChange: (nominals: number[]) => void;
  onValidityMonthsChange: (months: number) => void;
  categoriesError?: string | undefined;
  nominalsError?: string | undefined;
  validityError?: string | undefined;
}

// Category/nominal/validity picker for a merchant's sellable attributes.
// Presentational — category options are passed in so it never reaches into
// another entity, which lets both the admin and merchant forms reuse it.
export const MerchantAttributesSelect = ({
  categoryOptions,
  categories,
  nominals,
  validityMonths,
  onCategoriesChange,
  onNominalsChange,
  onValidityMonthsChange,
  categoriesError,
  nominalsError,
  validityError
}: Props) => {
  const { t } = useTranslation();

  const currency = t("certificate.currency");

  return (
    <>
      <ChipSelect
        label={t("merchantAttributes.categories")}
        error={categoriesError}
        items={categoryOptions}
        isSelected={(id) => categories.includes(id)}
        onSelect={(id) =>
          onCategoriesChange(
            categories.includes(id)
              ? categories.filter((item) => item !== id)
              : [...categories, id]
          )
        }
      />

      <ChipSelect
        label={t("merchantAttributes.nominals")}
        error={nominalsError}
        items={NOMINAL_PRESETS.map((nominal) => ({
          value: nominal,
          label: formatMoney(nominal, currency)
        }))}
        isSelected={(nominal) => nominals.includes(nominal)}
        onSelect={(nominal) =>
          onNominalsChange(
            nominals.includes(nominal)
              ? nominals.filter((item) => item !== nominal)
              : [...nominals, nominal].sort((a, b) => a - b)
          )
        }
      />

      <ChipSelect
        label={t("merchantAttributes.validity")}
        error={validityError}
        items={VALIDITY_PRESETS.map((months) => ({
          value: months,
          label: t("merchantAttributes.months", { months })
        }))}
        isSelected={(months) => validityMonths === months}
        onSelect={onValidityMonthsChange}
      />
    </>
  );
};
