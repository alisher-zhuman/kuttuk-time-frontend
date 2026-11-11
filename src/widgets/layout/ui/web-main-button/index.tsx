import { Loader2 } from "lucide-react";

import { useWebMainButtonStore } from "@shared/store";

// The website's main action (Telegram draws its own MainButton): fixed at the
// bottom over the page, with a spacer so it never hides the last content.
export const WebMainButton = () => {
  const button = useWebMainButtonStore((s) => s.button);

  if (!button) return null;

  const isOff = button.disabled || button.loading;

  return (
    <>
      <div aria-hidden="true" className="h-20 shrink-0" />

      <div className="fixed inset-x-0 bottom-0 z-20 px-4 pt-3 pb-4 bg-(--color-bg)/90 backdrop-blur">
        <button
          type="button"
          disabled={isOff}
          onClick={button.onClick}
          className="w-full max-w-md mx-auto h-12 flex items-center justify-center gap-2 rounded-2xl bg-(--color-primary) text-(--color-card) text-base font-bold cursor-pointer disabled:opacity-60"
        >
          {button.loading && <Loader2 size={18} className="animate-spin" />}
          {button.text}
        </button>
      </div>
    </>
  );
};
