import { useTranslation } from "react-i18next";

import { type FieldErrors, type UseFormRegister } from "react-hook-form";

import { Textarea } from "@shared/ui";

import type { VenueFormValues } from "../../model/types";

interface Props {
  register: UseFormRegister<VenueFormValues>;
  errors: FieldErrors<VenueFormValues>;
}

export const VenueFormDescription = ({ register, errors }: Props) => {
  const { t } = useTranslation();

  return (
    <>
      <Textarea
        label={t("venueForm.descriptionRu")}
        placeholder={t("venueForm.descriptionPlaceholder")}
        error={errors.descriptionRu?.message && t(errors.descriptionRu.message)}
        {...register("descriptionRu")}
      />

      <Textarea
        label={t("venueForm.descriptionKg")}
        placeholder={t("venueForm.descriptionPlaceholder")}
        error={errors.descriptionKg?.message && t(errors.descriptionKg.message)}
        {...register("descriptionKg")}
      />

      <Textarea
        label={t("venueForm.descriptionEn")}
        placeholder={t("venueForm.descriptionPlaceholder")}
        error={errors.descriptionEn?.message && t(errors.descriptionEn.message)}
        {...register("descriptionEn")}
      />
    </>
  );
};
