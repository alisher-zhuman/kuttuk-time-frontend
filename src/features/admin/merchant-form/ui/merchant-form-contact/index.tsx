import { useTranslation } from "react-i18next";

import { type FieldErrors, type UseFormRegister } from "react-hook-form";

import { Input } from "@shared/ui";

import type { MerchantFormValues } from "../../model/types";

interface Props {
  register: UseFormRegister<MerchantFormValues>;
  errors: FieldErrors<MerchantFormValues>;
}

export const MerchantFormContact = ({ register, errors }: Props) => {
  const { t } = useTranslation();

  return (
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
  );
};
