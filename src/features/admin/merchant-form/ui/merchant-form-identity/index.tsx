import { useTranslation } from "react-i18next";

import { type FieldErrors, type UseFormRegister } from "react-hook-form";

import { Input } from "@shared/ui";

import type { MerchantFormValues } from "../../model/types";
import { ActiveToggle } from "../active-toggle";
import { LogoUpload } from "../logo-upload";

interface Props {
  register: UseFormRegister<MerchantFormValues>;
  errors: FieldErrors<MerchantFormValues>;
  logo: string;
  onLogoChange: (url: string) => void;
  isEdit: boolean;
  isActive: boolean;
  onIsActiveChange: (isActive: boolean) => void;
}

export const MerchantFormIdentity = ({
  register,
  errors,
  logo,
  onLogoChange,
  isEdit,
  isActive,
  onIsActiveChange
}: Props) => {
  const { t } = useTranslation();

  return (
    <>
      <LogoUpload
        value={logo}
        onChange={onLogoChange}
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

      {isEdit && <ActiveToggle value={isActive} onChange={onIsActiveChange} />}
    </>
  );
};
