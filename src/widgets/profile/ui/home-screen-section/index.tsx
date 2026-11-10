import { useTranslation } from "react-i18next";

import { CircleCheck, Smartphone } from "lucide-react";

import { useHaptic, useHomeScreen } from "@shared/hooks";

// Merchant only: an icon on the phone's home screen opens the app (and so the
// cabinet) in one tap - at the counter, without looking for the bot.
// Hidden where Telegram can't add one.
export const HomeScreenSection = () => {
  const { t } = useTranslation();

  const haptic = useHaptic();

  const { state, add } = useHomeScreen();

  if (state === "hidden") return null;

  const isAdded = state === "added";

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-semibold text-(--color-slate) uppercase tracking-wider px-1">
        {t("merchant.homeScreen.title")}
      </span>

      <div className="flex items-center gap-3 p-3 rounded-2xl bg-(--color-card) border border-(--color-line)">
        {isAdded ? (
          <CircleCheck size={20} className="text-(--color-green) shrink-0" />
        ) : (
          <Smartphone size={20} className="text-(--color-primary) shrink-0" />
        )}

        <span className="flex-1 min-w-0 text-sm text-(--color-ink)">
          {t(isAdded ? "merchant.homeScreen.added" : "merchant.homeScreen.hint")}
        </span>

        {!isAdded && (
          <button
            type="button"
            onClick={() => {
              haptic.light();
              add();
            }}
            className="shrink-0 px-3.5 py-2 rounded-full bg-(--color-primary) text-(--color-card) text-sm font-bold cursor-pointer"
          >
            {t("merchant.homeScreen.add")}
          </button>
        )}
      </div>
    </div>
  );
};
