import { useTranslation } from "react-i18next";

import { MerchantCard, MERCHANTS } from "@entities/merchant";

interface Props {
  category: string;
  search: string;
}

export const MerchantList = ({ category, search }: Props) => {
  const { t } = useTranslation();
  
  const query = search.trim().toLowerCase();
  const merchants = MERCHANTS.filter(
    (m) =>
      (category === "Все" || m.category === category) &&
      (!query || m.name.toLowerCase().includes(query)),
  );

  return (
    <section aria-label={t('home.merchantsSection')}>
      <h2 className="text-xs font-bold text-(--color-hint) tracking-wider pt-5.5 pb-2.5 px-5">
        {t('home.merchantsSection')}
      </h2>

      <ul className="px-4 pb-5 flex flex-col gap-2.5 list-none">
        {merchants.map((merchant) => (
          <li key={merchant.id}>
            <MerchantCard merchant={merchant} />
          </li>
        ))}
      </ul>
    </section>
  );
};
