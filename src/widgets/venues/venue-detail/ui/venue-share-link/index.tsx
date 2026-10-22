import { type ReactNode, useState } from "react";

import { useTranslation } from "react-i18next";

import { shareURL } from "@tma.js/sdk-react";
import { Check, ChevronRight, Copy, Download, QrCode as QrIcon, Share2 } from "lucide-react";

import { getVenueShareLink } from "@shared/constants";
import { canDownloadFiles, downloadQrPng } from "@shared/helpers";
import { useCopyToClipboard, useHaptic } from "@shared/hooks";
import { BottomSheet, QrCode } from "@shared/ui";

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
      <button
        type="button"
        onClick={() => {
          haptic.light();
          setIsOpen(true);
        }}
        className="flex items-center gap-3 p-3 rounded-2xl bg-(--color-card) border border-(--color-line) text-left cursor-pointer"
      >
        <span className="flex items-center justify-center size-10 shrink-0 rounded-xl bg-(--color-primary-tint) text-(--color-primary)">
          <QrIcon size={20} />
        </span>

        <span className="flex-1 min-w-0 text-sm font-bold text-(--color-ink)">{t("venueLink.title")}</span>

        <ChevronRight size={18} className="shrink-0 text-(--color-hint)" />
      </button>

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
