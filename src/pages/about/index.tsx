import { useTranslation } from "react-i18next";

import { ROUTE_PATTERNS } from "@shared/constants";
import { resolveLang } from "@shared/helpers";
import { useNavigateTo } from "@shared/hooks";
import { getAboutText } from "@shared/legal";
import { Markdown } from "@shared/ui";

// The text is the backend's (docs/legal/about.md), one section per language.
export const AboutPage = () => {
  const { t, i18n } = useTranslation();

  const navigateTo = useNavigateTo();

  const openOffer = () => navigateTo(ROUTE_PATTERNS.OFFER);
  const openPrivacy = () => navigateTo(ROUTE_PATTERNS.PRIVACY);

  return (
    <article className="flex flex-col gap-4 py-6">
      <h1 className="text-2xl font-extrabold tracking-tight text-(--color-ink)">{t("site.about.title")}</h1>
      <Markdown
        text={getAboutText(resolveLang(i18n.language))}
        // The labels as the text writes them, in every language.
        links={{
          "Публичная оферта": openOffer,
          "Политика конфиденциальности": openPrivacy,
          "Ачык оферта": openOffer,
          "Купуялуулук саясаты": openPrivacy,
          "Public offer": openOffer,
          "Privacy policy": openPrivacy
        }}
      />
    </article>
  );
};
