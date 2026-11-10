import { type ReactNode, useState } from "react";

import { useTranslation } from "react-i18next";

import { shareURL } from "@tma.js/sdk-react";
import { Check, Copy, Download, QrCode as QrIcon, Share2 } from "lucide-react";

import { getVenueShareLink } from "@shared/constants";
import { canDownloadFiles, downloadQrPng } from "@shared/helpers";
import { useCopyToClipboard, useHaptic } from "@shared/hooks";
import { BottomSheet, QrCode, RowButton } from "@shared/ui";

interface Props {
  slug: string;
  venueName: string;
}

const ActionButton = ({ icon, label, onClick }: { icon: ReactNode; label: string; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex-1 min-w-0 flex items-center justify-center gap-1.5 py-3 rounded-2xl bg-(--color-primary-tint) text-(--color-primary) text-sm font-bold cursor-pointer"
  >
    {icon}
    <span className="truncate">{label}</span>
  </button>
);

// The venue's link for the owner to put in Instagram, stories, WhatsApp, or to
// print as a QR at the counter: one row on the venue, everything in a sheet.
// The owner and the admin see the same block.
export const VenueShareLink = ({ slug, venueName }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const { t } = useTranslation();

  const haptic = useHaptic();

  const copyToClipboard = useCopyToClipboard();

  const link = getVenueShareLink(slug);
  const shownLink = link.replace(/^https:\/\//, "");

  const handleCopy = async () => {
    haptic.light();

    if (await copyToClipboard(link)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const handleShare = () => {
    haptic.light();
    shareURL(link, t("venueLink.shareText", { venue: venueName }));
  };

  const handleDownload = () => {
    haptic.light();
    downloadQrPng(link, `kuttuktime-${slug}.png`);
  };

  return (
    <>
      <RowButton icon={<QrIcon size={20} />} label={t("venueLink.title")} onClick={() => setIsOpen(true)} />

      {isOpen && (
        <BottomSheet title={t("venueLink.title")} onClose={() => setIsOpen(false)}>
          <QrCode
            value={link}
            label={t("venueLink.qr", { venue: venueName })}
            className="self-center w-full max-w-56 h-auto"
          />

          <div className="flex flex-col gap-1 text-center">
            <span className="text-sm font-bold text-(--color-ink) break-all">{shownLink}</span>
            <span className="text-xs text-(--color-slate)">{t("venueLink.hint")}</span>
          </div>

          <div className="flex gap-2">
            <ActionButton
              icon={copied ? <Check size={16} /> : <Copy size={16} />}
              label={t(copied ? "venueLink.copied" : "venueLink.copy")}
              onClick={() => void handleCopy()}
            />

            {shareURL.isAvailable() && (
              <ActionButton icon={<Share2 size={16} />} label={t("venueLink.share")} onClick={handleShare} />
            )}

            {canDownloadFiles() && (
              <ActionButton icon={<Download size={16} />} label={t("venueLink.download")} onClick={handleDownload} />
            )}
          </div>

          {!canDownloadFiles() && (
            <span className="text-xs text-(--color-hint) text-center">{t("venueLink.screenshotHint")}</span>
          )}
        </BottomSheet>
      )}
    </>
  );
};
