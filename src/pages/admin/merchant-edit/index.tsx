import { useParams } from "react-router";

import { Loader2 } from "lucide-react";

import { AdminMerchantNotFound } from "@widgets/admin/merchants";

import { MerchantForm } from "@features/admin/merchant-form";

import { useAdminMerchantQuery } from "@entities/merchant";

export const AdminMerchantEditPage = () => {
  const { id } = useParams<{ id: string }>();

  const { merchant, isLoading, isError } = useAdminMerchantQuery(id);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 size={28} color="var(--color-hint)" className="animate-spin" />
      </div>
    );
  }

  if (isError || !merchant) return <AdminMerchantNotFound />;

  return <MerchantForm merchant={merchant} />;
};
