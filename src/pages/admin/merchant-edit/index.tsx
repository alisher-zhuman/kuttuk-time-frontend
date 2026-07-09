import { useParams } from "react-router";

import { MerchantForm } from "@features/admin/merchant-form";

export const AdminMerchantEditPage = () => {
  const { id } = useParams<{ id: string }>();

  return <MerchantForm merchantId={Number(id)} />;
};
