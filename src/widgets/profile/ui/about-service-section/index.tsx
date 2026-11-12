import { useTranslation } from "react-i18next";

import { CircleHelp, FileText, Info, Shield } from "lucide-react";

import { ROUTE_PATTERNS } from "@shared/constants";
import { useNavigateTo } from "@shared/hooks";
import { RowButton, RowGroup } from "@shared/ui";

// How it works, who runs it, the offer and the policy - the website has them
// in the catalog's footer; the Mini App here.
export const AboutServiceSection = () => {
  const { t } = useTranslation();

  const navigateTo = useNavigateTo();

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-semibold text-(--color-slate) uppercase tracking-wider px-1">
        {t("profile.aboutService")}
      </span>

      <RowGroup>
        <RowButton icon={<CircleHelp size={20} />} label={t("faq.title")} onClick={() => navigateTo(ROUTE_PATTERNS.FAQ)} />
        <RowButton icon={<Info size={20} />} label={t("site.about.title")} onClick={() => navigateTo(ROUTE_PATTERNS.ABOUT)} />
        <RowButton icon={<FileText size={20} />} label={t("site.offer.title")} onClick={() => navigateTo(ROUTE_PATTERNS.OFFER)} />
        <RowButton icon={<Shield size={20} />} label={t("site.privacy.title")} onClick={() => navigateTo(ROUTE_PATTERNS.PRIVACY)} />
      </RowGroup>
    </div>
  );
};
