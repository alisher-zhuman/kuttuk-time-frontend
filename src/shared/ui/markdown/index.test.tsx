import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Markdown } from "./index";

const TEXT = `# Оферта

Редакция от 11 ноября 2026 года.
Вторая строка того же абзаца.

## 1. Кто мы

1.1. Предприниматель **Жуманов**:
- ИНН: 1;
- ОКПО: 2.

После списка - новый абзац.

**Как это работает**
1. Оплатите.
2. Получите код.

[Публичная оферта] · [Сайт](https://example.com) · [Без ссылки]`;

describe("Markdown", () => {
  it("headings, paragraphs, bold, lists - clause numbers stay text", () => {
    const { container } = render(<Markdown text={TEXT} />);

    expect(screen.getByRole("heading", { level: 1, name: "Оферта" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "1. Кто мы" })).toBeInTheDocument();
    expect(screen.getByText("Редакция от 11 ноября 2026 года. Вторая строка того же абзаца.")).toBeInTheDocument();
    expect(screen.getByText("Жуманов").tagName).toBe("STRONG");
    expect(screen.getByText(/^1\.1\. Предприниматель/).tagName).toBe("P");

    const [bullets, steps] = screen.getAllByRole("list");
    expect(bullets!.tagName).toBe("UL");
    expect(within(bullets!).getAllByRole("listitem").map((item) => item.textContent)).toEqual(["ИНН: 1;", "ОКПО: 2."]);
    expect(steps!.tagName).toBe("OL");
    expect(within(steps!).getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByText("После списка - новый абзац.").tagName).toBe("P");
    expect(container.innerHTML).not.toContain("**");
  });

  it("[label] opens our page, [label](url) is a link, an unknown [label] is text", async () => {
    const onOffer = vi.fn();
    render(<Markdown text={TEXT} links={{ "Публичная оферта": onOffer }} />);

    await userEvent.click(screen.getByRole("button", { name: "Публичная оферта" }));
    expect(onOffer).toHaveBeenCalledOnce();
    expect(screen.getByRole("link", { name: "Сайт" })).toHaveAttribute("href", "https://example.com");
    expect(screen.queryByRole("button", { name: "Без ссылки" })).not.toBeInTheDocument();
    expect(screen.getByText(/Без ссылки/)).toBeInTheDocument();
  });
});
