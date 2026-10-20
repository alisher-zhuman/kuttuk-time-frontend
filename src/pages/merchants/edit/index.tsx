import { useParams } from "react-router";

import { Loader2 } from "lucide-react";

import { MerchantNotFound } from "@widgets/merchants/merchant-detail";
import { MerchantForm } from "@widgets/merchants/merchant-form";

import { useAdminMerchantQuery } from "@entities/merchant";

export const MerchantEditPage = () => {
  const { id } = useParams<{ id: string }>();

  const { merchant, isLoading, isError } = useAdminMerchantQuery(id);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 size={28} color="var(--color-hint)" className="animate-spin" />
      </div>
    );
  }

  if (isError || !merchant) return <MerchantNotFound />;

  return <MerchantForm variant={{ kind: "edit", merchant }} />;
};
