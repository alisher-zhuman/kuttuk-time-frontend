import { useSearchParams } from "react-router";

import { CertificateRedemption } from "@widgets/merchants/redemption";

export const MerchantRedeemPage = () => {
  const [searchParams] = useSearchParams();

  return <CertificateRedemption initialCode={searchParams.get("code")} />;
};
