import { useMemo, useState } from "react";

import { useTranslation } from "react-i18next";

import { useCategoriesQuery } from "@entities/category";
import { VenueAttributesSelect, type VenueOptions } from "@entities/venue";

import { useMainButton } from "@shared/hooks";

import { useVenueForm } from "../../hooks/useVenueForm";
import type { VenueFormVariant } from "../../model/types";
import { VenueFormDescription } from "../description";
import { VenueFormIdentity } from "../identity";
import { VenueFormOwnerSelect } from "../owner-select";

interface Props {
  options: VenueOptions;
  variant: VenueFormVariant;
}

export const VenueForm = ({ options, variant }: Props) => {
  const [isLogoUploading, setIsLogoUploading] = useState(false);

  const { t } = useTranslation();

  const isCreate = variant.kind === "create";
  const isAdmin = variant.kind !== "own";

  const { categories: categoryOptions } = useCategoriesQuery();

  const categoryIds = useMemo(
    () => categoryOptions.map((category) => category.id),
    [categoryOptions]
  );

  const {
    register,
    errors,
    isPending,
    isDirty,
    logo,
    merchantId,
    categories,
    nominals,
    validityMonths,
    isActive,
    setLogo,
    setMerchantId,
    setCategories,
    setNominals,
    setValidityMonths,
    setIsActive,
    submit
  } = useVenueForm(options, variant, categoryIds);


  useMainButton({
    text: t(isCreate ? "venueForm.create" : "venueForm.save"),
    onClick: () => {
      if (!isLogoUploading) void submit();
    },
    loading: isPending,
    disabled: isLogoUploading,
    hidden: !isCreate && !isDirty
  });

  return (
    <div className="flex flex-col gap-4 mt-3.5 pb-5">
      <h1 className="text-xl font-extrabold tracking-tight text-(--color-ink) leading-tight">
        {t(isCreate ? "venueForm.title" : "venueForm.editTitle")}
      </h1>

      <VenueFormIdentity
        nameMaxLength={options.nameMaxLength}
        register={register}
        errors={errors}
        logo={logo}
        onLogoChange={setLogo}
        onLogoUploadingChange={setIsLogoUploading}
        showSlug={isAdmin}
        showActiveToggle={variant.kind === "edit"}
        isActive={isActive}
        onIsActiveChange={setIsActive}
      />

      {isAdmin && (
        <VenueFormOwnerSelect
          value={merchantId}
          onChange={setMerchantId}
          error={errors.merchantId?.message && t(errors.merchantId.message)}
        />
      )}

      <VenueFormDescription register={register} errors={errors} />

      <VenueAttributesSelect
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
    </div>
  );
};
