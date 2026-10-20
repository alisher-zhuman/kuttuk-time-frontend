import { useTranslation } from "react-i18next";

import { useCategoriesQuery } from "@entities/category";
import { MerchantAttributesSelect, type MerchantOptions } from "@entities/merchant";

import { useMainButton } from "@shared/hooks";

import { useMerchantForm } from "../../hooks/useMerchantForm";
import type { MerchantFormVariant } from "../../model/types";
import { MerchantFormContact } from "../merchant-form-contact";
import { MerchantFormDescription } from "../merchant-form-description";
import { MerchantFormIdentity } from "../merchant-form-identity";

interface Props {
  options: MerchantOptions;
  variant: MerchantFormVariant;
}

const TITLE_KEYS = {
  create: "merchantForm.title",
  edit: "merchantForm.editTitle",
  own: "merchantForm.ownEditTitle"
} as const;

export const MerchantForm = ({ options, variant }: Props) => {
  const { t } = useTranslation();

  const isCreate = variant.kind === "create";
  const isAdmin = variant.kind !== "own";

  const {
    register,
    errors,
    isPending,
    isDirty,
    logo,
    categories,
    nominals,
    validityMonths,
    isActive,
    setLogo,
    setCategories,
    setNominals,
    setValidityMonths,
    setIsActive,
    submit
  } = useMerchantForm(options, variant);

  const { categories: categoryOptions } = useCategoriesQuery();

  useMainButton({
    text: t(isCreate ? "merchantForm.create" : "merchantForm.save"),
    onClick: () => void submit(),
    loading: isPending,
    hidden: !isCreate && !isDirty
  });

  return (
    <div className="flex flex-col gap-4 mt-3.5 pb-5">
      <h1 className="text-xl font-extrabold tracking-tight text-(--color-ink) leading-tight">
        {t(TITLE_KEYS[variant.kind])}
      </h1>

      <MerchantFormIdentity
        register={register}
        errors={errors}
        logo={logo}
        onLogoChange={setLogo}
        showAdminFields={isAdmin}
        showActiveToggle={variant.kind === "edit"}
        isActive={isActive}
        onIsActiveChange={setIsActive}
      />

      <MerchantFormDescription register={register} errors={errors} />

      <MerchantAttributesSelect
        options={options}
        categoryOptions={categoryOptions.map((category) => ({
          value: category.id,
          label: category.name
        }))}
        categories={categories}
        nominals={nominals}
        validityMonths={validityMonths}
        onCategoriesChange={setCategories}
        onNominalsChange={setNominals}
        onValidityMonthsChange={setValidityMonths}
        categoriesError={errors.categories?.message && t(errors.categories.message)}
        nominalsError={errors.nominals?.message && t(errors.nominals.message)}
        validityError={
          errors.validityMonths?.message && t(errors.validityMonths.message)
        }
      />

      {isAdmin && <MerchantFormContact register={register} errors={errors} />}
    </div>
  );
};
