import { useEffect } from "react";
import { createPortal } from "react-dom";

import { useTranslation } from "react-i18next";

import { canDownloadFiles } from "@shared/helpers";
import { useSafeArea } from "@shared/hooks";
import { QrCode } from "@shared/ui";

interface Props {
  link: string;
  shownLink: string;
  label: string;
  venueName: string;
  onClose: () => void;
}

// The link's QR as large as the screen allows, on white — to scan off the
// phone, or to screenshot and print where the PNG can't be downloaded.
// Portaled to <body> like BottomSheet: inside <main> it would sit under the nav.
export const QrFullscreen = ({ link, shownLink, label, venueName, onClose }: Props) => {
  const { t } = useTranslation();

  const insets = useSafeArea();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={label}
      onClick={onClose}
      style={{ paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 px-6 bg-white text-black"
    >
      <QrCode value={link} label={label} className="w-full max-w-sm h-auto p-0 rounded-none" />

      <span className="text-2xl font-extrabold text-center">{venueName}</span>
      <span className="text-sm text-black/60 text-center break-all">{shownLink}</span>

      {!canDownloadFiles() && (
        <span className="text-sm text-black/60 text-center">{t("venueLink.screenshotHint")}</span>
      )}

      <button
        type="button"
        onClick={onClose}
        className="mt-2 px-6 py-3 rounded-full bg-black text-white text-sm font-bold cursor-pointer"
      >
        {t("venueLink.close")}
      </button>
    </div>,
    document.body
  );
};
