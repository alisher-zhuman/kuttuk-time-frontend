import { useParams } from "react-router";

export const MerchantPage = () => {
  const { merchantId } = useParams<{ merchantId: string }>();

  return <div>{merchantId}</div>;
};
