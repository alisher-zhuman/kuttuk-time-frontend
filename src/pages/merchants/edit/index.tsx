import { useParams } from "react-router";

import { MerchantNotFound } from "@widgets/merchants/merchant-detail";
import { MerchantForm } from "@widgets/merchants/merchant-form";

import { useAdminMerchantQuery } from "@entities/merchant";

import { PageLoader } from "@shared/ui";

export const MerchantEditPage = () => {
  const { id } = useParams<{ id: string }>();

  const { merchant, isLoading, isError } = useAdminMerchantQuery(id);

  if (isLoading) {
    return <PageLoader />;
  }

  if (isError || !merchant) return <MerchantNotFound />;

  return <MerchantForm variant={{ kind: "edit", merchant }} />;
};
