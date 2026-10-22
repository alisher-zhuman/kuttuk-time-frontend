import { useTranslation } from "react-i18next";

import { Logo } from "@shared/ui";

interface Props {
  onRetry: () => void;
}

// The first log-in failed for a reason other than expired initData (network,
// 5xx, the backend waking up) — retrying usually helps.
export const ConnectionFailedPage = ({ onRetry }: Props) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center gap-6 bg-(--color-card) px-8 text-center">
      <Logo />

      <div className="flex flex-col items-center gap-2">
        <span className="text-xl font-extrabold tracking-tight text-(--color-ink)">
          {t("connectionFailed.title")}
        </span>

        <p className="text-(--color-slate) text-base leading-relaxed max-w-xs">
          {t("connectionFailed.description")}
        </p>
      </div>

      <button
        type="button"
        onClick={onRetry}
        className="px-6 py-3 rounded-full bg-(--color-primary) text-(--color-card) font-semibold text-sm cursor-pointer"
      >
        {t("errors.retry")}
      </button>
    </div>
  );
};
