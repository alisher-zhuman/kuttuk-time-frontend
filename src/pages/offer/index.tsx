import { useTranslation } from "react-i18next";

// «Оферта» - a placeholder until Alisher sends the offer's text.
export const OfferPage = () => {
  const { t } = useTranslation();

  return (
    <article className="flex flex-col gap-4 py-6">
      <h1 className="text-2xl font-extrabold tracking-tight text-(--color-ink)">{t("site.offer.title")}</h1>
      <p className="text-base text-(--color-slate)">{t("site.offer.soon")}</p>
    </article>
  );
};
