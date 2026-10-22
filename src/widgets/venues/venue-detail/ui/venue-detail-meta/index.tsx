import { useTranslation } from "react-i18next";

import { ChevronRight } from "lucide-react";

import { formatDate } from "@shared/helpers";
import { useHaptic } from "@shared/hooks";
import { MetaField } from "@shared/ui";

interface Props {
  validityMonths: number;
  createdAt: string;
  owner?: { name: string; onOpen: () => void } | undefined;
}

export const VenueDetailMeta = ({ validityMonths, createdAt, owner }: Props) => {
  const { t } = useTranslation();

  const haptic = useHaptic();

  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-4">
      <MetaField
        label={t("admin.venues.detail.validity")}
        value={t("admin.venues.detail.validityValue", { months: validityMonths })}
      />

      <MetaField
        label={t("admin.venues.detail.createdAt")}
        value={formatDate(createdAt)}
      />

      {owner && (
        <button
          type="button"
          onClick={() => {
            haptic.light();
            owner.onOpen();
          }}
          className="col-span-2 text-left cursor-pointer"
        >
          <MetaField
            label={t("admin.venues.detail.owner")}
            value={
              <span className="inline-flex items-center gap-1 text-(--color-primary)">
                {owner.name}
                <ChevronRight size={14} />
              </span>
            }
          />
        </button>
      )}
    </div>
  );
};
