import { useTranslation } from "react-i18next";

import { Loader2, WifiOff } from "lucide-react";

import { useHaptic } from "@shared/hooks";

import { EmptyState } from "../empty-state";
import { PillButton } from "../pill-button";

interface Props {
  onRetry: () => void;
  isRetrying: boolean;
}

export const ErrorState = ({ onRetry, isRetrying }: Props) => {
  const { t } = useTranslation();

  const haptic = useHaptic();

  return (
    <EmptyState
      icon={<WifiOff size={32} strokeWidth={1.5} />}
      message={t("errors.loadFailed")}
      action={
        <PillButton
          disabled={isRetrying}
          onClick={() => {
            haptic.light();
            onRetry();
          }}
          className="flex items-center gap-2 disabled:opacity-70"
        >
          {isRetrying && <Loader2 size={16} className="animate-spin" />}
          {t("errors.retry")}
        </PillButton>
      }
    />
  );
};
