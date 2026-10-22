import { useTranslation } from "react-i18next";

import { PillButton, StatusScreen } from "@shared/ui";

interface Props {
  onRetry: () => void;
}

// The first log-in failed for a reason other than expired initData (network,
// 5xx, the backend waking up) — retrying usually helps.
export const ConnectionFailedPage = ({ onRetry }: Props) => {
  const { t } = useTranslation();

  return (
    <StatusScreen
      title={t("connectionFailed.title")}
      description={t("connectionFailed.description")}
      action={<PillButton onClick={onRetry}>{t("errors.retry")}</PillButton>}
    />
  );
};
