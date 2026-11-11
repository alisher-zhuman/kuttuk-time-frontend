import { useState } from "react";

import { useTranslation } from "react-i18next";

import { useAdminMerchantQuery, useAdminMerchantsQuery } from "@entities/merchant";

import { useDebounce } from "@shared/hooks";
import { Select } from "@shared/ui";

interface Props {
  value: number;
  onChange: (merchantId: number) => void;
  error?: string | undefined;
}

// Admin-only: picks the merchant account that owns the venue - searched by
// name on the server, the Telegram ID under each to tell namesakes apart.
// Inactive merchants are listed too - the admin may prepare a venue before
// activation.
export const VenueFormOwnerSelect = ({ value, onChange, error }: Props) => {
  const [search, setSearch] = useState("");

  const { t } = useTranslation();

  const debouncedSearch = useDebounce(search);

  const { merchants, isFetching } = useAdminMerchantsQuery({ search: debouncedSearch.trim(), isActive: null });

  // The chosen owner's name even when the search narrowed the list past it.
  const { merchant: chosen } = useAdminMerchantQuery(value > 0 ? String(value) : undefined);

  return (
    <Select
      label={t("venueForm.owner")}
      placeholder={t("venueForm.ownerPlaceholder")}
      options={merchants.map((merchant) => ({
        value: merchant.id,
        label: merchant.name,
        hint: `Telegram ID ${merchant.telegramId}`
      }))}
      value={value > 0 ? [value] : []}
      onChange={([merchantId]) => {
        if (merchantId !== undefined) onChange(merchantId);
      }}
      search={{ value: search, onChange: setSearch, placeholder: t("admin.merchants.searchPlaceholder") }}
      isLoading={isFetching}
      selectedLabel={chosen?.name}
      error={error}
    />
  );
};
