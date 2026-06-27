import { useState } from "react";
import { useParams } from "react-router";

import {
  CertPreviewCard,
  MerchantHeader,
  MerchantNotFound,
  MerchantPageSkeleton,
  NominalList,
} from "@widgets/merchant";

import { useMerchantQuery } from "@entities/merchant";

export const MerchantPage = () => {
  const [selectedNominal, setSelectedNominal] = useState<number | null>(null);

  const { merchantId } = useParams<{ merchantId: string }>();

  const { merchant, isLoading, isError } = useMerchantQuery(Number(merchantId));

  if (isLoading) return <MerchantPageSkeleton />;
  if (isError || !merchant) return <MerchantNotFound />;

  const activeNominal = selectedNominal ?? merchant.nominals[0]!;

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
