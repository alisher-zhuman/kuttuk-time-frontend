import { useRef } from "react";

import { useTranslation } from "react-i18next";

import { CircleCheck, Gift as GiftIcon } from "lucide-react";

import {
  type Gift,
  isGiftConflict,
  isGiftNotFound,
  useClaimGiftMutation
} from "@entities/certificate";

import { getCertificateRoute, ROUTE_PATTERNS } from "@shared/constants";
import { formatDate, formatMoney, logoUrl, requestBotMessages } from "@shared/helpers";
import { useHaptic, useMainButton, useNavigateTo, usePopup } from "@shared/hooks";
import { PillButton } from "@shared/ui";

interface Props {
  token: string;
  gift: Gift;
}

// What the person who opened the link sees, by the link's state and the
// certificate's effective status.
const getMessageKey = ({ state, status }: Gift) => {
  if (state === "own") return "gift.own";
  if (state === "received") return "gift.received";
  if (state === "claimed") return "gift.claimed";
  if (status === "used") return "gift.used";
  if (status === "expired") return "gift.expired";

  return "gift.title";
};

// «Забрать подарок»: a friend's gift link. Claiming moves the certificate to
// whoever opened it; the code only comes with the claim.
export const GiftScreen = ({ token, gift }: Props) => {
  const { t } = useTranslation();

  const navigateTo = useNavigateTo();

  const haptic = useHaptic();

  const showPopup = usePopup();

  const { mutate: claim, isPending } = useClaimGiftMutation(token);

  // isPending lands a render late - a double tap would ask for bot messages
  // twice; a second claim is harmless (same 200) but pointless.
  const isClaimingRef = useRef(false);

  const canClaim = gift.state === "available" && gift.status === "active";

  const handleClaim = async () => {
    if (isClaimingRef.current) return;

    isClaimingRef.current = true;
    haptic.light();

    // So the bot can remind about the expiry date. Never throws, a refusal
    // blocks nothing.
    await requestBotMessages({ oncePerSession: true });

    claim(undefined, {
      onSuccess: (certificate) => {
        haptic.success();
        // Replace: Back from the certificate shouldn't return to a claimed link.
        navigateTo(getCertificateRoute(certificate.id), { replace: true });
      },
      onError: (error) => {
        // The link changed since it was shown - the mutation looks it up
        // again and the screen shows why.
        if (isGiftConflict(error) || isGiftNotFound(error)) {
          haptic.warning();
          return;
        }

        haptic.error();
        void showPopup({ message: t("errors.generic") });
      },
      onSettled: () => {
        isClaimingRef.current = false;
      }
    });
  };

  useMainButton({
    text: t("gift.claim"),
    onClick: () => void handleClaim(),
    loading: isPending,
    hidden: !canClaim
  });

  const toMyCertificates = gift.state === "own" || gift.state === "received";

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-5 py-8 text-center">
      <span className="size-16 rounded-2xl flex items-center justify-center bg-(--color-green-tint) text-(--color-green)">
        {gift.state === "received" ? (
          <CircleCheck size={32} strokeWidth={1.5} />
        ) : (
          <GiftIcon size={32} strokeWidth={1.5} />
        )}
      </span>

      <h1 className="text-xl font-extrabold tracking-tight text-(--color-ink) max-w-xs">
        {t(getMessageKey(gift))}
      </h1>

      <div className="w-full max-w-sm flex items-center gap-3 px-4 py-3 rounded-2xl bg-(--color-card) border border-(--color-line) text-left">
        <img
          src={logoUrl(gift.venue.logo, 48)}
          width={48}
          height={48}
          alt=""
          className="size-12 rounded-xl shrink-0 object-cover"
        />

        <span className="flex flex-col gap-0.5 min-w-0">
          <span className="text-sm font-semibold text-(--color-slate) line-clamp-2 wrap-break-word">
            {gift.venue.name}
          </span>
          <span className="text-2xl font-extrabold text-(--color-ink)">
            {formatMoney(gift.amount, t("certificate.currency"))}
          </span>
        </span>
      </div>

      {canClaim && (
        <span className="text-sm text-(--color-slate)">
          {t("certificate.validUntil", { date: formatDate(gift.validUntil) })}
        </span>
      )}

      {!canClaim && (
        <PillButton
          onClick={() => {
            haptic.light();
            navigateTo(toMyCertificates ? ROUTE_PATTERNS.PROFILE : ROUTE_PATTERNS.HOME, { replace: true });
          }}
        >
          {t(toMyCertificates ? "gift.toMyCertificates" : "certificates.toCatalog")}
        </PillButton>
      )}
    </div>
  );
};
