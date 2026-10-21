import { useTranslation } from "react-i18next";

import { shareURL } from "@tma.js/sdk-react";

import { BOT_URL } from "@shared/constants";
import { formatMoney } from "@shared/helpers";
import { useHaptic, useMainButton } from "@shared/hooks";

import { formatCertificateCode } from "../model/code";

interface Options {
  code: string;
  amount: number;
  venueName: string | undefined;
  hidden?: boolean;
}

// MainButton "Share" for a certificate code. shareURL closes the Mini App once
// a chat is picked — so only offer it where the code is already on screen to
// copy first.
export const useCertificateShareButton = ({
  code,
  amount,
  venueName,
  hidden = false
}: Options) => {
  const { t } = useTranslation();

  const haptic = useHaptic();

  useMainButton({
    text: t("certificate.share"),
    onClick: () => {
      haptic.light();

      if (shareURL.isAvailable()) {
        shareURL(
          BOT_URL,
          t("certificate.shareText", {
            venue: venueName ?? "",
            amount: formatMoney(amount, t("certificate.currency")),
            code: formatCertificateCode(code)
          })
        );
      }
    },
    hidden: hidden || !shareURL.isAvailable()
  });
};
