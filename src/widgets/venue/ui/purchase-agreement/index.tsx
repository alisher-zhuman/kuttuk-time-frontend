import { Trans } from "react-i18next";

import { ROUTE_PATTERNS } from "@shared/constants";
import { useNavigateTo } from "@shared/hooks";

const LINK = "font-semibold text-(--color-primary) underline cursor-pointer";

// Right above «Купить» (the main button): paying accepts both texts.
export const PurchaseAgreement = () => {
  const navigateTo = useNavigateTo();

  return (
    <p className="text-xs text-(--color-hint) px-1">
      <Trans
        i18nKey="venue.agreement"
        // Trans puts the translated words into these buttons.
        components={{
          offer: <button type="button" className={LINK} onClick={() => navigateTo(ROUTE_PATTERNS.OFFER)} />,
          privacy: <button type="button" className={LINK} onClick={() => navigateTo(ROUTE_PATTERNS.PRIVACY)} />
        }}
      />
    </p>
  );
};
