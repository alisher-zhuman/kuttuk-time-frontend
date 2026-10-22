import { useTranslation } from "react-i18next";

import { resolveLang } from "@shared/helpers";
import { FieldLabel } from "@shared/ui";

interface Props {
  description: { ru: string; kg: string; en: string };
}

export const VenueDetailDescription = ({ description }: Props) => {
  const { t, i18n } = useTranslation();

  return (
    <div className="flex flex-col gap-1">
      <FieldLabel>{t("admin.venues.detail.description")}</FieldLabel>

      <p className="text-sm text-(--color-ink) font-medium px-1">
        {description[resolveLang(i18n.language)]}
      </p>
    </div>
  );
};
