import { useTranslation } from "react-i18next";

import { useMainButton } from "@shared/hooks";
import { Input, Textarea } from "@shared/ui";

import { useMerchantForm } from "../../hooks/useMerchantForm";
import { CategorySelect } from "../category-select";
import { LogoUpload } from "../logo-upload";
import { NominalSelect } from "../nominal-select";
import { ValiditySelect } from "../validity-select";

export const MerchantForm = () => {
  const { t } = useTranslation();

  const {
    register,
    errors,
    isPending,
    logo,
    categories,
    nominals,
    validityMonths,
    setLogo,
    setCategories,
    setNominals,
    setValidityMonths,
    submit
  } = useMerchantForm();

  useMainButton({
    text: t("admin.merchants.form.create"),
    onClick: () => void submit(),
    loading: isPending
  });

  return (
    <div className="flex flex-col gap-4 mt-3.5 pb-5">
      <h1 className="text-xl font-extrabold tracking-tight text-(--color-ink) leading-tight">
        {t("admin.merchants.form.title")}
      </h1>

      <LogoUpload
        value={logo}
        onChange={setLogo}
        error={errors.logo?.message && t(errors.logo.message)}
      />

      <Input
        label={t("admin.merchants.form.name")}
        placeholder={t("admin.merchants.form.namePlaceholder")}
        error={errors.name?.message && t(errors.name.message)}
        {...register("name")}
      />

      <div className="flex flex-col gap-1">
        <Input
          label={t("admin.merchants.form.slug")}
          placeholder={t("admin.merchants.form.slugPlaceholder")}
          error={errors.slug?.message && t(errors.slug.message)}
          {...register("slug")}
        />

        <span className="text-xs font-semibold text-(--color-hint) px-1">
          {t("admin.merchants.form.slugHint")}
        </span>
      </div>

      <Textarea
        label={t("admin.merchants.form.descriptionRu")}
        placeholder={t("admin.merchants.form.descriptionPlaceholder")}
        error={errors.descriptionRu?.message && t(errors.descriptionRu.message)}
        {...register("descriptionRu")}
      />

      <Textarea
        label={t("admin.merchants.form.descriptionKg")}
        placeholder={t("admin.merchants.form.descriptionPlaceholder")}
        error={errors.descriptionKg?.message && t(errors.descriptionKg.message)}
        {...register("descriptionKg")}
      />

      <Textarea
        label={t("admin.merchants.form.descriptionEn")}
        placeholder={t("admin.merchants.form.descriptionPlaceholder")}
        error={errors.descriptionEn?.message && t(errors.descriptionEn.message)}
        {...register("descriptionEn")}
      />

      <CategorySelect
        value={categories}
        onChange={setCategories}
        error={errors.categories?.message && t(errors.categories.message)}
      />

      <NominalSelect
        value={nominals}
        onChange={setNominals}
        error={errors.nominals?.message && t(errors.nominals.message)}
      />

      <ValiditySelect
        value={validityMonths}
        onChange={setValidityMonths}
        error={errors.validityMonths?.message && t(errors.validityMonths.message)}
      />

      <div className="flex flex-col gap-1">
        <Input
          type="number"
          inputMode="numeric"
          label={t("admin.merchants.form.telegramId")}
          placeholder={t("admin.merchants.form.telegramIdPlaceholder")}
          error={
            errors.merchantTelegramId?.message && t(errors.merchantTelegramId.message)
          }
          {...register("merchantTelegramId")}
        />

        <span className="text-xs font-semibold text-(--color-hint) px-1">
          {t("admin.merchants.form.telegramIdHint")}
        </span>
      </div>
    </div>
  );
};
