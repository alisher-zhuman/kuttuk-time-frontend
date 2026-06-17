import { MerchantCard, MERCHANTS } from "@entities/merchant";

interface Props {
  category: string;
}

export const MerchantList = ({ category }: Props) => {
  const merchants =
    category === "Все"
      ? MERCHANTS
      : MERCHANTS.filter((m) => m.category === category);

  return (
    <section aria-label="Заведения">
      <h2 className="text-xs font-bold text-(--color-hint) tracking-wider pt-5.5 pb-2.5 px-5">
        ЗАВЕДЕНИЯ
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
