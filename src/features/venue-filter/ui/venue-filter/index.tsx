import { useTranslation } from "react-i18next";

import { useMerchantMeQuery } from "@entities/merchant";

import { ChipSelect } from "@shared/ui";

interface Props {
  active: number | null;
  onChange: (venueId: number | null) => void;
}

// "All venues" + each of the owner's venues. Renders nothing for a single
// venue — there is nothing to narrow down.
export const VenueFilter = ({ active, onChange }: Props) => {
  const { t } = useTranslation();

  const { merchant } = useMerchantMeQuery();

  const venues = merchant?.venues ?? [];

  if (venues.length < 2) return null;

  return (
    <ChipSelect<number | "all">
      items={[
        { value: "all", label: t("merchant.cabinet.allVenues") },
        ...venues.map((venue) => ({ value: venue.id, label: venue.name }))
      ]}
      isSelected={(value) => value === (active ?? "all")}
      onSelect={(value) => onChange(value === "all" ? null : value)}
    />
  );
};
