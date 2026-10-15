interface Props {
  logo: string;
  name: string;
  description: string;
}

export const MerchantHeader = ({ logo, name, description }: Props) => (
  <div className="flex items-center gap-3.5">
    <img
      src={logo}
      alt={name}
      className="size-16 rounded-xl shrink-0 object-cover"
    />

    <div className="flex flex-col min-w-0">
      <span className="text-xl font-extrabold tracking-tight text-(--color-ink) leading-tight">
        {name}
      </span>
      <span className="text-sm text-(--color-slate) font-semibold mt-1 truncate">
        {description}
      </span>
    </div>
  </div>
);
