import { useTranslation } from "react-i18next";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { shareMessage, shareURL } from "@tma.js/sdk-react";
import { isAxiosError } from "axios";

import { BOT_URL } from "@shared/constants";
import { formatMoney } from "@shared/helpers";
import { useHaptic, useMainButton, usePopup } from "@shared/hooks";

import { prepareGift } from "../api";
import { formatCertificateCode } from "../model/code";
// …/share answers 409 with the same body as …/redeem.
import { RedeemConflictSchema } from "../model/schemas";

interface Options {
  // The certificate's id — needed for "Подарить"; without it, plain-text share.
  id: string | undefined;
  code: string;
  amount: number;
  venueName: string | undefined;
  hidden?: boolean;
}

// MainButton for an active certificate.
// "Подарить" (Mini Apps 8.0+): the backend prepares a card (venue, amount, code,
// "Open <venue>" / "Copy code" buttons), shareMessage sends it from the buyer
// to the chat they pick, and the Mini App stays open.
// Older clients: "Поделиться" — a text via shareURL, which closes the Mini App,
// so it's offered only where the code is already on screen to copy first.
export const useCertificateShareButton = ({
  id,
  code,
  amount,
  venueName,
  hidden = false
}: Options) => {
  const { t } = useTranslation();

  const haptic = useHaptic();

  const showPopup = usePopup();

  const queryClient = useQueryClient();

  const canGift = id !== undefined && shareMessage.isAvailable();

  // A new card per tap — it expires, so never cached.
  const { mutate: gift, isPending } = useMutation({ mutationFn: prepareGift });

  const handleGift = (certificateId: string) => {
    gift(certificateId, {
      onSuccess: ({ preparedMessageId }) => {
        // Rejects when the user closes the chat picker — nothing to do then.
        shareMessage(preparedMessageId).then(
          () => haptic.success(),
          () => undefined
        );
      },
      onError: (error) => {
        haptic.error();

        // Used / expired meanwhile: refresh so the screen shows it (and the
        // button hides).
        if (isAxiosError(error) && error.response?.status === 409 && RedeemConflictSchema.safeParse(error.response.data).success) {
          void queryClient.invalidateQueries({ queryKey: ["certificates"] });
          void showPopup({ message: t("certificate.giftUnavailable") });
          return;
        }

        // 502: Telegram didn't store the card; anything else — same advice.
        void showPopup({ message: t("certificate.giftFailed") });
      }
    });
  };

  const handleShareText = () => {
    if (!shareURL.isAvailable()) return;

    shareURL(
      BOT_URL,
      t("certificate.shareText", {
        venue: venueName ?? "",
        amount: formatMoney(amount, t("certificate.currency")),
        code: formatCertificateCode(code)
      })
    );
  };

  useMainButton({
    text: t(canGift ? "certificate.gift" : "certificate.share"),
    onClick: () => {
      haptic.light();

      if (canGift) {
        handleGift(id);
      } else {
        handleShareText();
      }
    },
    loading: isPending,
    hidden: hidden || (!canGift && !shareURL.isAvailable())
  });
};
