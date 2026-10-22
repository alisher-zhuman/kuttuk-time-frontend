import { useTranslation } from "react-i18next";

import { useOpenSupport } from "@shared/hooks";

// "Contact support" under an order that needs a person (on review, refunded).
export const SupportButton = () => {
  const { t } = useTranslation();

  const { canOpen, open } = useOpenSupport();

  if (!canOpen) return null;

  return (
    <button
      type="button"
      onClick={open}
      className="px-5 py-2.5 rounded-full border border-(--color-line) bg-(--color-card) text-(--color-ink) text-sm font-semibold cursor-pointer"
    >
      {t("support.contact")}
    </button>
  );
};
