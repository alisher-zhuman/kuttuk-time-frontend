import { useTranslation } from "react-i18next";

import { type FieldErrors, type UseFormRegister } from "react-hook-form";

import { ActiveToggle, Input, LogoUpload } from "@shared/ui";

import type { VenueFormValues } from "../../model/types";

interface Props {
  register: UseFormRegister<VenueFormValues>;
  errors: FieldErrors<VenueFormValues>;
  logo: string;
  onLogoChange: (url: string) => void;
  onLogoUploadingChange: (isUploading: boolean) => void;
  // Slug and active status are the admin's; the owner's form hides them.
  nameMaxLength: number;
  showSlug: boolean;
  showActiveToggle: boolean;
  isActive: boolean;
  onIsActiveChange: (isActive: boolean) => void;
}

export const VenueFormIdentity = ({
  register,
  errors,
  logo,
  onLogoChange,
  onLogoUploadingChange,
  nameMaxLength,
  showSlug,
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
        onUploadingChange={onLogoUploadingChange}
        error={errors.logo?.message && t(errors.logo.message)}
      />

      <Input
        label={t("venueForm.name")}
        placeholder={t("venueForm.namePlaceholder")}
        maxLength={nameMaxLength}
        error={errors.name?.message && t(errors.name.message, { max: nameMaxLength })}
        {...register("name")}
      />

      {showSlug && (
        <div className="flex flex-col gap-1">
          <Input
            label={t("venueForm.slug")}
            placeholder={t("venueForm.slugPlaceholder")}
            error={errors.slug?.message && t(errors.slug.message)}
            {...register("slug")}
          />

          <span className="text-xs font-semibold text-(--color-hint) px-1">
            {t("venueForm.slugHint")}
          </span>
        </div>
      )}

      {showActiveToggle && (
        <ActiveToggle
          value={isActive}
          onChange={onIsActiveChange}
          labels={{
            title: t("venueForm.status"),
            active: t("admin.venues.active"),
            inactive: t("admin.venues.inactive")
          }}
        />
      )}
    </>
  );
};
