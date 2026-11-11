import { useRef } from "react";

import { useTranslation } from "react-i18next";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { shareMessage, shareURL } from "@tma.js/sdk-react";
import { isAxiosError } from "axios";

import { BOT_URL } from "@shared/constants";
import { formatMoney } from "@shared/helpers";
import { useCopyToClipboard, useHaptic, useMainButton, usePopup } from "@shared/hooks";
import { useAppModeStore } from "@shared/store";

import { createGiftLink, prepareGift } from "../api";
import { formatCertificateCode } from "../model/code";
// …/share answers 409 with the same body as …/redeem.
import { RedeemConflictSchema } from "../model/schemas";

interface Options {
  // The certificate's id - needed for "Подарить"; without it, plain-text share.
  id: string | undefined;
  code: string;
  amount: number;
  venueName: string | undefined;
  hidden?: boolean;
}

// MainButton for an active certificate.
// "Подарить" (Mini Apps 8.0+): the backend prepares a card (the code's QR,
// «Забрать подарок» / «Скопировать код» buttons), shareMessage sends it from
// the buyer to the private chat they pick, and the Mini App stays open. A new
// card replaces the previous unclaimed «Забрать подарок» link.
// Older clients: "Поделиться" - a text via shareURL, which closes the Mini App,
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

  const copyToClipboard = useCopyToClipboard();

  const isWeb = useAppModeStore((s) => s.mode === "web");

  // The website gifts by a link («Забрать подарок» on the site), the Mini App
  // by the bot's card.
  const canGift = id !== undefined && (isWeb || shareMessage.isAvailable());

  // A new card / link per tap - a new one replaces the open one, never cached.
  const { mutate: gift, isPending: isPreparing } = useMutation({ mutationFn: prepareGift });
  const { mutate: giftLink, isPending: isLinking } = useMutation({ mutationFn: createGiftLink });

  const isPending = isPreparing || isLinking;

  // isPending lands a render late - a double tap would prepare two cards and
  // open the chat picker twice.
  const isGiftingRef = useRef(false);

  // 409 - used / expired meanwhile: refresh so the screen shows it (and the
  // button hides); anything else - try again.
  const onGiftError = (error: unknown) => {
    haptic.error();

    if (isAxiosError(error) && error.response?.status === 409 && RedeemConflictSchema.safeParse(error.response.data).success) {
      void queryClient.invalidateQueries({ queryKey: ["certificates"] });
      void showPopup({ message: t("certificate.giftUnavailable") });
      return;
    }

    void showPopup({ message: t("certificate.giftFailed") });
  };

  // The phone's share menu (WhatsApp, Instagram, SMS…) with the buyer's own
  // words; without one - or when the browser refuses it after the request -
  // the link is copied.
  const shareLink = async (url: string) => {
    const text = t("certificate.webGiftText", {
      venue: venueName ?? "",
      amount: formatMoney(amount, t("certificate.currency"))
    });

    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title: "KuttukTime", text, url });
        haptic.success();
        return;
      } catch (error) {
        // Closed by the buyer - nothing to do.
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }

    if (await copyToClipboard(`${text}\n${url}`)) {
      void showPopup({ message: t("certificate.linkCopied") });
    }
  };

  const handleGift = (certificateId: string) => {
    if (isGiftingRef.current) return;

    isGiftingRef.current = true;

    if (isWeb) {
      giftLink(certificateId, {
        onSettled: () => {
          isGiftingRef.current = false;
        },
        onSuccess: ({ url }) => void shareLink(url),
        onError: onGiftError
      });
      return;
    }

    gift(certificateId, {
      onSettled: () => {
        isGiftingRef.current = false;
      },
      onSuccess: ({ preparedMessageId }) => {
        // Rejects when the user closes the chat picker - nothing to do then.
        shareMessage(preparedMessageId).then(
          () => haptic.success(),
          () => undefined
        );
      },
      onError: onGiftError
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

  // The screen explains «Подарить» only where it sends the claimable card.
  return { canGift: canGift && !hidden };
};
