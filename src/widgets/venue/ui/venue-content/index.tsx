import { useRef, useState } from "react";

import { useTranslation } from "react-i18next";

import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";

import { getOrderErrorKey, useCreateOrderMutation } from "@entities/order";
import { type VenueDetail, VenuePlace } from "@entities/venue";

import { getOrderRoute } from "@shared/constants";
import { goToUrl, openExternalLink, requestBotMessages } from "@shared/helpers";
import { useHaptic, useMainButton, useNavigateTo, usePopup } from "@shared/hooks";
import { isWebsite } from "@shared/store";

import { CertPreviewCard } from "../cert-preview-card";
import { NominalList } from "../nominal-list";
import { VenueHeader } from "../venue-header";

interface Props {
  venue: VenueDetail;
}

export const VenueContent = ({ venue }: Props) => {
  const [selectedNominal, setSelectedNominal] = useState<number | null>(null);

  const { t } = useTranslation();

  const navigateTo = useNavigateTo();

  const haptic = useHaptic();

  const showPopup = usePopup();

  const queryClient = useQueryClient();

  // The pending flag only lands on the next render, so two taps in the same
  // frame would both see it false and create two orders - guard with a ref.
  const isSubmittingRef = useRef(false);

  const { mutate: createOrder, isPending } = useCreateOrderMutation();

  // nominals can change under the selection (refetch after a language switch,
  // the owner editing them) - never buy an amount that's no longer offered.
  const activeNominal =
    selectedNominal !== null && venue.nominals.includes(selectedNominal)
      ? selectedNominal
      : venue.nominals[0]!;

  const handleBuy = async () => {
    if (isSubmittingRef.current) {
      return;
    }

    isSubmittingRef.current = true;
    haptic.medium();

    // The bot sends the code after payment - a backup if the buyer closes the
    // app. Asked here, not on first launch: the purchase is the context that
    // makes "allow messages" make sense. The answer doesn't matter for buying.
    await requestBotMessages({ oncePerSession: true });

    const isWeb = isWebsite();

    createOrder(
      { venueId: venue.id, nominal: activeNominal, ...(isWeb && { channel: "web" as const }) },
      {
        onSuccess: ({ orderId, paymentUrl }) => {
          // The website goes to the bank's page in this tab; Finik brings the
          // buyer back to <site>/orders/<id>.
          if (isWeb) {
            goToUrl(paymentUrl);
            return;
          }

          openExternalLink(paymentUrl);
          // Push, not replace: Back from the order screen returns here.
          navigateTo(getOrderRoute(orderId));
        },
        onError: (error) => {
          haptic.error();

          // 400: the nominal was removed or the venue switched off while the
          // buyer was on the page. Reload it - the page shows today's nominals,
          // or «not found» - instead of failing every «Купить» the same way.
          // A literal key: the detail is keyed by language too.
          if (isAxiosError(error) && error.response?.status === 400) {
            void queryClient.invalidateQueries({ queryKey: ["venues", "detail"] });
          }

          void showPopup({
            title: t("errors.genericTitle"),
            message: t(getOrderErrorKey(error))
          });
        },
        onSettled: () => {
          isSubmittingRef.current = false;
        }
      }
    );
  };

  useMainButton({
    text: t("venue.buy"),
    onClick: () => void handleBuy(),
    disabled: isPending,
    loading: isPending
  });

  return (
    <div className="flex-1 flex flex-col py-4 gap-5">
      <VenueHeader
        logo={venue.logo}
        name={venue.name}
        description={venue.description}
      />

      <VenuePlace address={venue.address} mapUrl={venue.mapUrl} />

      <CertPreviewCard
        venueName={venue.name}
        amount={activeNominal}
        validityMonths={venue.validityMonths}
      />

      <NominalList
        nominals={venue.nominals}
        selected={activeNominal}
        onSelect={setSelectedNominal}
      />

      {/* Many buy for themselves, not knowing it can be a gift. */}
      <p className="text-sm text-(--color-slate) px-1">{t("venue.giftHint")}</p>
    </div>
  );
};
