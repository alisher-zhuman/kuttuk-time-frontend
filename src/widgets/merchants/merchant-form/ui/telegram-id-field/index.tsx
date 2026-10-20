import { useTranslation } from "react-i18next";

import { type FieldErrors, type UseFormRegister } from "react-hook-form";

import { Input } from "@shared/ui";

import type { MerchantFormValues } from "../../model/types";

interface Props {
  register: UseFormRegister<MerchantFormValues>;
  errors: FieldErrors<MerchantFormValues>;
}

export const MerchantFormTelegramId = ({ register, errors }: Props) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-1">
      <Input
        type="number"
        inputMode="numeric"
        label={t("merchantForm.telegramId")}
        placeholder={t("merchantForm.telegramIdPlaceholder")}
        error={errors.telegramId?.message && t(errors.telegramId.message)}
        {...register("telegramId")}
      />

      <span className="text-xs font-semibold text-(--color-hint) px-1">
        {t("merchantForm.telegramIdHint")}
      </span>
    </div>
  );
};
