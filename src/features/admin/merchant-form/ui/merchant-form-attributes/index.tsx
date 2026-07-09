import { useTranslation } from "react-i18next";

import { useCategoriesQuery } from "@entities/category";

import { NOMINAL_PRESETS, VALIDITY_PRESETS } from "@shared/constants";
import { formatMoney } from "@shared/helpers";
import { ChipSelect } from "@shared/ui";

interface Props {
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

export const MerchantFormAttributes = ({
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

  const { categories: categoryOptions } = useCategoriesQuery();

  const currency = t("certificate.currency");

  // Legacy merchants may hold values outside the presets — render them too,
  // otherwise there is no chip to deselect and the form can never become valid.
  const nominalOptions = [...new Set([...NOMINAL_PRESETS, ...nominals])].sort(
    (a, b) => a - b
  );
  const validityOptions = [...new Set([...VALIDITY_PRESETS, validityMonths])].sort(
    (a, b) => a - b
  );

  return (
    <>
      <ChipSelect
        label={t("admin.merchants.form.categories")}
        error={categoriesError}
        items={categoryOptions.map((category) => ({
          value: category.id,
          label: category.name
        }))}
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
        label={t("admin.merchants.form.nominals")}
        error={nominalsError}
        items={nominalOptions.map((nominal) => ({
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
        label={t("admin.merchants.form.validity")}
        error={validityError}
        items={validityOptions.map((months) => ({
          value: months,
          label: t("admin.merchants.form.months", { months })
        }))}
        isSelected={(months) => validityMonths === months}
        onSelect={onValidityMonthsChange}
      />
    </>
  );
};
