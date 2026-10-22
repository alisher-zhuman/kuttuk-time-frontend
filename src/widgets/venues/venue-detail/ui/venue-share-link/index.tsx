import { type ReactNode, useState } from "react";

import { useTranslation } from "react-i18next";

import { shareURL } from "@tma.js/sdk-react";
import { Check, Copy, Download, Share2 } from "lucide-react";

import { getVenueShareLink } from "@shared/constants";
import { canDownloadFiles, downloadQrPng } from "@shared/helpers";
import { useCopyToClipboard, useHaptic } from "@shared/hooks";
import { FieldLabel, QrCode } from "@shared/ui";

import { QrFullscreen } from "../qr-fullscreen";

interface Props {
  slug: string;
  venueName: string;
}

const ActionButton = ({ icon, label, onClick }: { icon: ReactNode; label: string; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex-1 min-w-0 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-(--color-primary-tint) text-(--color-primary) text-sm font-bold cursor-pointer"
  >
    {icon}
    <span className="truncate">{label}</span>
  </button>
);

// The venue's link for the owner to put in Instagram, stories, WhatsApp, or to
// print as a QR at the counter. The owner and the admin see the same block.
export const VenueShareLink = ({ slug, venueName }: Props) => {
  const [copied, setCopied] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);

  const { t } = useTranslation();

  const haptic = useHaptic();

  const copyToClipboard = useCopyToClipboard();

  const link = getVenueShareLink(slug);
  const shownLink = link.replace(/^https:\/\//, "");
  const qrLabel = t("venueLink.qr", { venue: venueName });

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
    <div className="flex flex-col gap-2.5">
      <FieldLabel>{t("venueLink.title")}</FieldLabel>

      <div className="flex flex-col gap-3 p-3 rounded-2xl bg-(--color-card) border border-(--color-line)">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              haptic.light();
              setIsQrOpen(true);
            }}
            aria-label={t("venueLink.enlargeQr")}
            className="shrink-0 cursor-pointer"
          >
            <QrCode value={link} label={qrLabel} className="size-20 rounded-xl p-1 border border-(--color-line)" />
          </button>

          <div className="flex flex-col gap-1 min-w-0">
            <span className="text-sm font-bold text-(--color-ink) truncate">{shownLink}</span>
            <span className="text-xs text-(--color-slate)">{t("venueLink.hint")}</span>
          </div>
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
      </div>

      {isQrOpen && (
        <QrFullscreen
          link={link}
          shownLink={shownLink}
          label={qrLabel}
          venueName={venueName}
          onClose={() => setIsQrOpen(false)}
        />
      )}
    </div>
  );
};
