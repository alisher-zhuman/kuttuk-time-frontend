import { useTranslation } from "react-i18next";

import { type FieldErrors, type UseFormRegister } from "react-hook-form";

import { Input } from "@shared/ui";

import { ADDRESS_MAX_LENGTH } from "../../model/schemas";
import type { VenueFormValues } from "../../model/types";

interface Props {
  register: UseFormRegister<VenueFormValues>;
  errors: FieldErrors<VenueFormValues>;
}

// Where the venue is: the buyer and the gift's recipient see the address and
// «Открыть на карте». Both required - «Сохранить» stays off without them.
export const VenueFormPlace = ({ register, errors }: Props) => {
  const { t } = useTranslation();

  return (
    <>
      <Input
        label={t("venueForm.address")}
        placeholder={t("venueForm.addressPlaceholder")}
        maxLength={ADDRESS_MAX_LENGTH}
        error={errors.address?.message && t(errors.address.message, { max: ADDRESS_MAX_LENGTH })}
        {...register("address")}
      />

      <div className="flex flex-col gap-1">
        <Input
          type="url"
          inputMode="url"
          label={t("venueForm.mapUrl")}
          placeholder="https://2gis.kg/…"
          error={errors.mapUrl?.message && t(errors.mapUrl.message)}
          {...register("mapUrl")}
        />

        <span className="text-xs font-semibold text-(--color-hint) px-1">{t("venueForm.mapUrlHint")}</span>
      </div>
    </>
  );
};
