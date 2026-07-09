import { useTranslation } from "react-i18next";

import { Store } from "lucide-react";

import {
  MerchantCard,
  MerchantCardSkeleton,
  useMerchantsQuery
} from "@entities/merchant";

import { EmptyState } from "@shared/ui";

interface Props {
  category: number | null;
  search: string;
}

export const MerchantList = ({ category, search }: Props) => {
  const { t } = useTranslation();

  const { merchants, isLoading } = useMerchantsQuery({ search, category });

  return (
    <section aria-label={t("home.merchantsSection")}>
      <h2 className="text-xs font-bold text-(--color-hint) tracking-wider pt-5.5 pb-2.5 px-1">
        {t("home.merchantsSection")}
      </h2>

      {isLoading ? (
        <ul className="pb-5 flex flex-col gap-2.5 list-none">
          {Array.from({ length: 6 }).map((_, i) => (
            <li key={i}>
              <MerchantCardSkeleton />
            </li>
          ))}
        </ul>
      ) : merchants.length === 0 ? (
        <EmptyState
          icon={<Store size={32} strokeWidth={1.5} />}
          message={t("home.empty")}
        />
      ) : (
        <ul className="pb-5 flex flex-col gap-2.5 list-none">
          {merchants.map((merchant) => (
            <li key={merchant.id}>
              <MerchantCard merchant={merchant} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
