import { useState } from "react";

import { useTranslation } from "react-i18next";

import { type MerchantDetail } from "@entities/merchant";

import { useMainButton } from "@shared/hooks";

import { CertPreviewCard } from "../cert-preview-card";
import { MerchantHeader } from "../merchant-header";
import { NominalList } from "../nominal-list";

interface Props {
  merchant: MerchantDetail;
}

export const MerchantContent = ({ merchant }: Props) => {
  const { t } = useTranslation();

  const [selectedNominal, setSelectedNominal] = useState<number | null>(null);

  const activeNominal = selectedNominal ?? merchant.nominals[0]!;

  useMainButton({
    text: t("merchantDetail.buy"),
    onClick: () => {
      // TODO: payment flow
    },
  });

  return (
    <div className="flex-1 flex flex-col py-4 gap-5">
      <MerchantHeader
        logo={merchant.logo}
        name={merchant.name}
        description={merchant.description}
      />

      <CertPreviewCard
        merchantName={merchant.name}
        amount={activeNominal}
        validityMonths={merchant.validityMonths}
      />

      <NominalList
        nominals={merchant.nominals}
        selected={activeNominal}
        onSelect={setSelectedNominal}
      />
    </div>
  );
};
