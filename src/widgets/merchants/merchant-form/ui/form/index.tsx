import { useTranslation } from "react-i18next";

import { useMainButton } from "@shared/hooks";
import { ActiveToggle, Input, Textarea } from "@shared/ui";

import { useMerchantForm } from "../../hooks/useMerchantForm";
import { NOTE_MAX_LENGTH } from "../../model/schemas";
import type { MerchantFormVariant } from "../../model/types";
import { MerchantFormTelegramId } from "../telegram-id-field";

interface Props {
  variant: MerchantFormVariant;
  // Opened to fill in the payout details - the cursor goes there. Saving goes
  // back to where it came from (payouts).
  focusPayoutDetails?: boolean;
}

export const MerchantForm = ({ variant, focusPayoutDetails = false }: Props) => {
  const { t } = useTranslation();

  const isCreate = variant.kind === "create";

  const { register, errors, isPending, isDirty, isActive, setIsActive, submit } =
    useMerchantForm(variant);

  useMainButton({
    text: t(isCreate ? "merchantForm.create" : "merchantForm.save"),
    onClick: () => void submit(),
    loading: isPending,
    hidden: !isCreate && !isDirty
  });

  return (
    <div className="flex flex-col gap-4 mt-3.5 pb-5">
      <h1 className="text-xl font-extrabold tracking-tight text-(--color-ink) leading-tight">
        {t(isCreate ? "merchantForm.title" : "merchantForm.editTitle")}
      </h1>

      <Input
        label={t("merchantForm.name")}
        placeholder={t("merchantForm.namePlaceholder")}
        error={errors.name?.message && t(errors.name.message)}
        {...register("name")}
      />

      <MerchantFormTelegramId register={register} errors={errors} />

      <Textarea
        label={t("merchantForm.payoutDetails")}
        placeholder={t("merchantForm.payoutDetailsPlaceholder")}
        autoFocus={focusPayoutDetails}
        maxLength={NOTE_MAX_LENGTH}
        error={errors.payoutDetails?.message && t(errors.payoutDetails.message, { max: NOTE_MAX_LENGTH })}
        {...register("payoutDetails")}
      />

      <Textarea
        label={t("merchantForm.contact")}
        placeholder={t("merchantForm.contactPlaceholder")}
        maxLength={NOTE_MAX_LENGTH}
        error={errors.contact?.message && t(errors.contact.message, { max: NOTE_MAX_LENGTH })}
        {...register("contact")}
      />

      {!isCreate && (
        <ActiveToggle
          value={isActive}
          onChange={setIsActive}
          labels={{
            title: t("merchantForm.status"),
            active: t("admin.venues.active"),
            inactive: t("admin.venues.inactive")
          }}
        />
      )}
    </div>
  );
};
