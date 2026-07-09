interface Props {
  children: string;
}

export const FieldLabel = ({ children }: Props) => (
  <p className="text-xs font-bold text-(--color-hint) tracking-widest px-1">{children}</p>
);
