import { useTranslation } from "react-i18next";

import { resolveLang } from "@shared/helpers";
import { LEGAL_TEXTS } from "@shared/legal";
import { Markdown } from "@shared/ui";

// Russian only (the backend's docs/legal/offer.ru.md) - other languages get a
// note above it.
export const OfferPage = () => {
  const { t, i18n } = useTranslation();

  return (
    <article className="flex flex-col gap-4 py-6">
      {resolveLang(i18n.language) !== "ru" && <p className="text-sm font-semibold text-(--color-hint)">{t("site.russianOnly")}</p>}
      <Markdown text={LEGAL_TEXTS.offer} />
    </article>
  );
};
