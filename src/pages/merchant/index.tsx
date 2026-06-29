import { useParams } from "react-router";

import {
  MerchantContent,
  MerchantNotFound,
  MerchantSkeleton,
} from "@widgets/merchant";

import { useMerchantQuery } from "@entities/merchant";

export const MerchantPage = () => {
  const { merchantId } = useParams<{ merchantId: string }>();

  const { merchant, isLoading, isError } = useMerchantQuery(Number(merchantId));

  if (isLoading) return <MerchantSkeleton />;
  if (isError || !merchant) return <MerchantNotFound />;

  return <MerchantContent merchant={merchant} />;
};
