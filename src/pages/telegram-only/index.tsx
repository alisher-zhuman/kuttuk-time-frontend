import { useTranslation } from "react-i18next";

import { Send } from "lucide-react";

import { BOT_URL } from "@shared/constants";
import { goToUrl } from "@shared/helpers";
import { EmptyState, PillButton } from "@shared/ui";

// The website for an owner / admin: the cabinet and the admin panel live in
// the Mini App only.
export const TelegramOnlyPage = () => {
  const { t } = useTranslation();

  return (
    <EmptyState
      variant="page"
      icon={<Send size={32} strokeWidth={1.5} />}
      message={t("site.telegramOnly.title")}
      action={
        <PillButton onClick={() => goToUrl(`${BOT_URL}/app`)}>
          {t("site.telegramOnly.open")}
        </PillButton>
      }
    />
  );
};
