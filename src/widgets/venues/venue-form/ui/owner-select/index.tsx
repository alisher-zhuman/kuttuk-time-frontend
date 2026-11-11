import { useState } from "react";

import { useTranslation } from "react-i18next";

import { useAdminMerchantQuery, useAdminMerchantsQuery } from "@entities/merchant";

import { useDebounce } from "@shared/hooks";
import { Combobox } from "@shared/ui";

interface Props {
  value: number;
  onChange: (merchantId: number) => void;
  error?: string | undefined;
}

// Admin-only: picks the merchant account that owns the venue - type in the
// field, the matches (searched by name on the server) open under it, the
// Telegram ID under each tells namesakes apart. Inactive merchants are listed
// too - the admin may prepare a venue before activation.
export const VenueFormOwnerSelect = ({ value, onChange, error }: Props) => {
  const [query, setQuery] = useState("");

  const { t } = useTranslation();

  const debouncedQuery = useDebounce(query);

  const { merchants, isFetching } = useAdminMerchantsQuery({ search: debouncedQuery.trim(), isActive: null });

  // The chosen owner's name for the field, whatever the list shows.
  const { merchant: chosen } = useAdminMerchantQuery(value > 0 ? String(value) : undefined);

  return (
    <Combobox
      label={t("venueForm.owner")}
      placeholder={t("venueForm.ownerPlaceholder")}
      value={value > 0 ? value : null}
      selectedLabel={chosen?.name}
      query={query}
      onQueryChange={setQuery}
      options={merchants.map((merchant) => ({
        value: merchant.id,
        label: merchant.name,
        hint: `Telegram ID ${merchant.telegramId}`
      }))}
      onChange={onChange}
      isLoading={isFetching}
      error={error}
    />
  );
};
