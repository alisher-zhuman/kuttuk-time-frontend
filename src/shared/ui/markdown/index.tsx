import { Fragment, type ReactNode } from "react";

type Block =
  | { kind: "heading"; level: 1 | 2 | 3; text: string }
  | { kind: "paragraph"; text: string }
  | { kind: "list"; ordered: boolean; items: string[] };

interface Props {
  text: string;
  // «[Публичная оферта]» → what a tap on it does (our own pages), or the
  // address it leads to (the pre-rendered website - a plain link).
  links?: Record<string, (() => void) | string>;
}

// The legal texts' Markdown (../backend docs/legal): headings, paragraphs,
// **bold**, «- » and «1. » lists, [label] / [label](url) links. Rendered as
// React elements - no HTML injected.
const parse = (text: string): Block[] => {
  const blocks: Block[] = [];
  let paragraph: string[] = [];

  const flush = () => {
    if (paragraph.length > 0) blocks.push({ kind: "paragraph", text: paragraph.join(" ") });
    paragraph = [];
  };

  const addItem = (ordered: boolean, item: string) => {
    flush();
    const last = blocks.at(-1);

    if (last?.kind === "list" && last.ordered === ordered) last.items.push(item);
    else blocks.push({ kind: "list", ordered, items: [item] });
  };

  for (const raw of text.split("\n")) {
    const line = raw.trim();
    const heading = /^(#{1,3})\s+(.*)$/.exec(line);
    const bullet = /^-\s+(.*)$/.exec(line);
    // «1. Item», not a clause number like «1.1. Text».
    const numbered = /^\d+\.\s+(.*)$/.exec(line);

    if (line === "") flush();
    else if (heading) {
      flush();
      blocks.push({ kind: "heading", level: heading[1]!.length as 1 | 2 | 3, text: heading[2]! });
    } else if (bullet) addItem(false, bullet[1]!);
    else if (numbered) addItem(true, numbered[1]!);
    else {
      // A line right after a list starts a new paragraph.
      if (paragraph.length === 0 && blocks.at(-1)?.kind === "list") flush();
      paragraph.push(line);
    }
  }

  flush();

  return blocks;
};

const inline = (text: string, links: Props["links"] = {}): ReactNode[] =>
  text.split(/(\*\*[^*]+\*\*|\[[^\]]+\](?:\([^)]+\))?)/g).map((part, index) => {
    const bold = /^\*\*([^*]+)\*\*$/.exec(part);
    const link = /^\[([^\]]+)\](?:\(([^)]+)\))?$/.exec(part);

    if (bold) return <strong key={index} className="font-bold text-(--color-ink)">{bold[1]}</strong>;

    if (link) {
      const [, label, url] = link;
      const onOpen = links[label!];

      if (typeof onOpen === "string") {
        return (
          <a key={index} href={onOpen} className="font-bold text-(--color-primary)">
            {label}
          </a>
        );
      }

      if (onOpen) {
        return (
          <button key={index} type="button" onClick={onOpen} className="font-bold text-(--color-primary) cursor-pointer">
            {label}
          </button>
        );
      }

      if (url) {
        return (
          <a key={index} href={url} target="_blank" rel="noreferrer" className="font-bold text-(--color-primary)">
            {label}
          </a>
        );
      }

      return <Fragment key={index}>{label}</Fragment>;
    }

    return <Fragment key={index}>{part}</Fragment>;
  });

export const Markdown = ({ text, links }: Props) => (
  <div className="flex flex-col gap-3 text-base leading-relaxed text-(--color-slate) wrap-break-word">
    {parse(text).map((block, index) => {
      if (block.kind === "heading") {
        const Tag = (["h1", "h2", "h3"] as const)[block.level - 1]!;

        return (
          <Tag
            key={index}
            className={
              block.level === 1
                ? "text-2xl font-extrabold tracking-tight text-(--color-ink)"
                : "mt-2 text-lg font-extrabold text-(--color-ink)"
            }
          >
            {inline(block.text, links)}
          </Tag>
        );
      }

      if (block.kind === "list") {
        const List = block.ordered ? "ol" : "ul";

        return (
          <List key={index} className={`flex flex-col gap-1.5 pl-5 ${block.ordered ? "list-decimal" : "list-disc"}`}>
            {block.items.map((item, itemIndex) => (
              <li key={itemIndex}>{inline(item, links)}</li>
            ))}
          </List>
        );
      }

      return <p key={index}>{inline(block.text, links)}</p>;
    })}
  </div>
);
