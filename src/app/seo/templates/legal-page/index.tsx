import { Markdown } from "@shared/ui";

interface Props {
  title: string;
  text: string;
  // Shown above a Russian-only text in another language.
  note?: string;
  links?: Record<string, string>;
}

export const LegalPage = ({ title, text, note, links }: Props) => (
  <article className="flex flex-col gap-4 py-6">
    <h1 className="text-2xl font-extrabold tracking-tight">{title}</h1>
    {note && <p className="text-sm text-(--color-hint)">{note}</p>}
    <Markdown text={text} {...(links && { links })} />
  </article>
);
