import { useTranslation } from "react-i18next";

import { SUPPORT_URL } from "@shared/constants";
import { openExternalLink } from "@shared/helpers";

// «О нас» - a placeholder until Alisher sends the texts and the sole
// proprietor's details.
export const AboutPage = () => {
  const { t } = useTranslation();

  return (
    <article className="flex flex-col gap-4 py-6">
      <h1 className="text-2xl font-extrabold tracking-tight text-(--color-ink)">{t("site.about.title")}</h1>
      <p className="text-base text-(--color-ink)">{t("site.about.text")}</p>
      <p className="text-sm text-(--color-slate)">{t("site.payment")}</p>
      <p className="text-sm text-(--color-slate)">{t("site.detailsSoon")}</p>
      <button
        type="button"
        onClick={() => openExternalLink(SUPPORT_URL)}
        className="self-start text-sm font-bold text-(--color-primary) cursor-pointer"
      >
        {t("site.support")}
      </button>
    </article>
  );
};
