import { type FaqItem } from "../../model/items";

interface Props {
  title: string;
  items: FaqItem[];
}

export const FaqList = ({ title, items }: Props) => (
  <article className="flex flex-col gap-5 py-6">
    <h1 className="text-2xl font-extrabold tracking-tight text-(--color-ink)">{title}</h1>

    {items.map(({ question, answer }) => (
      <section key={question} className="flex flex-col gap-1.5">
        <h2 className="text-lg font-extrabold text-(--color-ink)">{question}</h2>
        <p className="text-base leading-relaxed text-(--color-slate)">{answer}</p>
      </section>
    ))}
  </article>
);
