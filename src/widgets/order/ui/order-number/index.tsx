import { useState } from "react";

import { useTranslation } from "react-i18next";

import { useCopyToClipboard, useHaptic } from "@shared/hooks";

interface Props {
  number: string;
}

// «Заказ №A1B2C3D4» - what the buyer tells support. Small, and copied on a
// tap (just the 8 characters - support's search takes them as is).
export const OrderNumber = ({ number }: Props) => {
  const [copied, setCopied] = useState(false);

  const { t } = useTranslation();

  const haptic = useHaptic();

  const copyToClipboard = useCopyToClipboard();

  const handleCopy = async () => {
    haptic.light();

    if (await copyToClipboard(number)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <button
      type="button"
      onClick={() => void handleCopy()}
      className="self-center mb-4 px-2 py-1 text-xs font-semibold text-(--color-hint) cursor-pointer"
    >
      {copied ? t("orders.numberCopied") : t("orders.number", { number })}
    </button>
  );
};
