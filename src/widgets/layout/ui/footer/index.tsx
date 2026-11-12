import { useLocation } from "react-router";

import { useTranslation } from "react-i18next";

import { ROUTE_PATTERNS, SUPPORT_URL } from "@shared/constants";
import { openExternalLink } from "@shared/helpers";
import { useNavigateTo } from "@shared/hooks";
import { useAppModeStore } from "@shared/store";

export const Footer = () => {
  const { t } = useTranslation();

  const navigateTo = useNavigateTo();

  const { pathname } = useLocation();

  const isWeb = useAppModeStore((s) => s.mode === "web");

  // The website's catalog is a stranger's first sight of the service: who runs
  // it, how to reach them, how payment works. Other screens stay clean - the
  // venue page links the offer and the policy above «Купить».
  if (isWeb && pathname === ROUTE_PATTERNS.HOME) {
    const link = "text-xs font-semibold text-(--color-slate) cursor-pointer";

    return (
      <footer className="flex flex-col items-center gap-2 py-4 px-4 text-center">
        <nav className="flex flex-wrap justify-center gap-x-4 gap-y-1">
          <button type="button" className={link} onClick={() => navigateTo(ROUTE_PATTERNS.ABOUT)}>
            {t("site.about.title")}
          </button>
          <button type="button" className={link} onClick={() => navigateTo(ROUTE_PATTERNS.OFFER)}>
            {t("site.offer.title")}
          </button>
          <button type="button" className={link} onClick={() => navigateTo(ROUTE_PATTERNS.PRIVACY)}>
            {t("site.privacy.title")}
          </button>
          <button type="button" className={link} onClick={() => openExternalLink(SUPPORT_URL)}>
            {t("site.support")}
          </button>
        </nav>
        <span className="text-xs text-(--color-hint)">{t("site.payment")}</span>
      </footer>
    );
  }

  if (isWeb) return null;

  return (
    <footer className="flex justify-center py-3">
      <span className="text-xs text-(--color-hint)">{t("footer.madeWithLove")}</span>
    </footer>
  );
};
