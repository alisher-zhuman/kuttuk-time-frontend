import { useTranslation } from "react-i18next";

import { MapPin } from "lucide-react";

import { cn, openExternalLink } from "@shared/helpers";
import { useHaptic } from "@shared/hooks";

interface Props {
  address: string | null;
  mapUrl: string | null;
  // Centered under centered content (certificate, gift), else left.
  align?: "start" | "center";
}

// Where the venue is: its address and «Открыть на карте» (2GIS / Google /
// Yandex link - Telegram opens it in the browser or the maps app). Nothing
// when neither is filled in.
export const VenuePlace = ({ address, mapUrl, align = "start" }: Props) => {
  const { t } = useTranslation();

  const haptic = useHaptic();

  if (!address && !mapUrl) return null;

  return (
    <div className={cn("flex flex-col gap-1.5", align === "center" ? "items-center text-center" : "items-start")}>
      {address && (
        <span className="flex items-start gap-1.5 text-sm font-semibold text-(--color-slate)">
          <MapPin size={16} className="shrink-0 mt-0.5 text-(--color-hint)" />
          <span className="wrap-break-word">{address}</span>
        </span>
      )}

      {mapUrl && (
        <button
          type="button"
          onClick={() => {
            haptic.light();
            openExternalLink(mapUrl);
          }}
          className="text-sm font-bold text-(--color-primary) cursor-pointer"
        >
          {t("venue.openMap")}
        </button>
      )}
    </div>
  );
};
