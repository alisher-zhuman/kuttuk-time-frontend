import { useTranslation } from "react-i18next";

import { type FieldErrors, type UseFormRegister } from "react-hook-form";

import { Input, LogoUpload } from "@shared/ui";

import type { MerchantFormValues } from "../../model/types";
import { ActiveToggle } from "../active-toggle";

interface Props {
  register: UseFormRegister<MerchantFormValues>;
  errors: FieldErrors<MerchantFormValues>;
  logo: string;
  onLogoChange: (url: string) => void;
  // Slug and active status are the admin's; the owner's form hides them.
  showAdminFields: boolean;
  showActiveToggle: boolean;
  isActive: boolean;
  onIsActiveChange: (isActive: boolean) => void;
}

export const MerchantFormIdentity = ({
  register,
  errors,
  logo,
  onLogoChange,
  showAdminFields,
  showActiveToggle,
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
        label={t("merchantForm.name")}
        placeholder={t("merchantForm.namePlaceholder")}
        error={errors.name?.message && t(errors.name.message)}
        {...register("name")}
      />

      {showAdminFields && (
        <div className="flex flex-col gap-1">
        <Input
          label={t("merchantForm.slug")}
          placeholder={t("merchantForm.slugPlaceholder")}
          error={errors.slug?.message && t(errors.slug.message)}
          {...register("slug")}
        />

        <span className="text-xs font-semibold text-(--color-hint) px-1">
          {t("merchantForm.slugHint")}
        </span>
        </div>
      )}

      {showActiveToggle && <ActiveToggle value={isActive} onChange={onIsActiveChange} />}
    </>
  );
};
