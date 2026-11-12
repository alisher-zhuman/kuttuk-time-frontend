import { useTranslation } from "react-i18next";

import { FaqList, getFaqItems } from "@widgets/faq";

export const FaqPage = () => {
  const { t } = useTranslation();

  return <FaqList title={t("faq.title")} items={getFaqItems(t)} />;
};
