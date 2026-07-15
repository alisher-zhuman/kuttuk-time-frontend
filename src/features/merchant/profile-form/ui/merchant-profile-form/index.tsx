import { useTranslation } from "react-i18next";

import { useCategoriesQuery } from "@entities/category";
import { MerchantAttributesSelect } from "@entities/merchant";

import { useMainButton } from "@shared/hooks";
import { Input, LogoUpload, Textarea } from "@shared/ui";

import { useMerchantProfileForm } from "../../hooks/useMerchantProfileForm";

export const MerchantProfileForm = () => {
  const { t } = useTranslation();

  const { categories: categoryOptions } = useCategoriesQuery();

  const {
    register,
    errors,
    isPending,
    isDirty,
    logo,
    categories,
    nominals,
    validityMonths,
    setLogo,
    setCategories,
    setNominals,
    setValidityMonths,
    submit
  } = useMerchantProfileForm();

  useMainButton({
    text: t("merchant.form.save"),
    onClick: () => void submit(),
    loading: isPending,
    hidden: !isDirty
  });

  return (
    <div className="flex flex-col gap-4 mt-3.5 pb-5">
      <h1 className="text-xl font-extrabold tracking-tight text-(--color-ink) leading-tight">
        {t("merchant.form.editTitle")}
      </h1>

      <LogoUpload
        value={logo}
        onChange={setLogo}
        error={errors.logo?.message && t(errors.logo.message)}
      />

      <Input
        label={t("merchant.form.name")}
        placeholder={t("merchant.form.namePlaceholder")}
        error={errors.name?.message && t(errors.name.message)}
        {...register("name")}
      />

      <Textarea
        label={t("merchant.form.descriptionRu")}
        placeholder={t("merchant.form.descriptionPlaceholder")}
        error={errors.descriptionRu?.message && t(errors.descriptionRu.message)}
        {...register("descriptionRu")}
      />

      <Textarea
        label={t("merchant.form.descriptionKg")}
        placeholder={t("merchant.form.descriptionPlaceholder")}
        error={errors.descriptionKg?.message && t(errors.descriptionKg.message)}
        {...register("descriptionKg")}
      />

      <Textarea
        label={t("merchant.form.descriptionEn")}
        placeholder={t("merchant.form.descriptionPlaceholder")}
        error={errors.descriptionEn?.message && t(errors.descriptionEn.message)}
        {...register("descriptionEn")}
      />

      <MerchantAttributesSelect
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
