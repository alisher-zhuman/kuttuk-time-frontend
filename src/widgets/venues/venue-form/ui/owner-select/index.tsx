import { useTranslation } from "react-i18next";

import { useAdminMerchantsQuery } from "@entities/merchant";

import { ChipSelect } from "@shared/ui";

interface Props {
  value: number;
  onChange: (merchantId: number) => void;
  error?: string | undefined;
}

// Admin-only: picks the merchant account that owns the venue. Inactive
// merchants are listed too — the admin may prepare a venue before activation.
export const VenueFormOwnerSelect = ({ value, onChange, error }: Props) => {
  const { t } = useTranslation();

  const { merchants } = useAdminMerchantsQuery({ search: "", isActive: null });

  return (
    <ChipSelect
      label={t("venueForm.owner")}
      items={merchants.map((merchant) => ({ value: merchant.id, label: merchant.name }))}
      isSelected={(id) => id === value}
      onSelect={onChange}
      error={error}
    />
  );
};
