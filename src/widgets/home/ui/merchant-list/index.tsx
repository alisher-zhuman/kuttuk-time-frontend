import { useTranslation } from "react-i18next";

import { Store } from "lucide-react";

import { MerchantCard, MerchantCardSkeleton, useMerchantsQuery } from "@entities/merchant";

interface Props {
  category: string;
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
          {Array.from({ length: 8 }).map((_, i) => (
            <li key={i}>
              <MerchantCardSkeleton />
            </li>
          ))}
        </ul>
      ) : merchants.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-14 text-(--color-hint)">
          <span className="size-16 rounded-2xl bg-(--color-chip) flex items-center justify-center">
            <Store size={32} strokeWidth={1.5} />
          </span>
          <p className="text-sm font-semibold">{t("home.empty")}</p>
        </div>
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
