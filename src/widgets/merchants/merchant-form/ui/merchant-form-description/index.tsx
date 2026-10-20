import { useTranslation } from "react-i18next";

import { type FieldErrors, type UseFormRegister } from "react-hook-form";

import { Textarea } from "@shared/ui";

import type { MerchantFormValues } from "../../model/types";

interface Props {
  register: UseFormRegister<MerchantFormValues>;
  errors: FieldErrors<MerchantFormValues>;
}

export const MerchantFormDescription = ({ register, errors }: Props) => {
  const { t } = useTranslation();

  return (
    <>
      <Textarea
        label={t("merchantForm.descriptionRu")}
        placeholder={t("merchantForm.descriptionPlaceholder")}
        error={errors.descriptionRu?.message && t(errors.descriptionRu.message)}
        {...register("descriptionRu")}
      />

      <Textarea
        label={t("merchantForm.descriptionKg")}
        placeholder={t("merchantForm.descriptionPlaceholder")}
        error={errors.descriptionKg?.message && t(errors.descriptionKg.message)}
        {...register("descriptionKg")}
      />

      <Textarea
        label={t("merchantForm.descriptionEn")}
        placeholder={t("merchantForm.descriptionPlaceholder")}
        error={errors.descriptionEn?.message && t(errors.descriptionEn.message)}
        {...register("descriptionEn")}
      />
    </>
  );
};
