import { fireEvent, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@tests";
import { describe, expect, it, vi } from "vitest";

import { Select } from "./index";

const OPTIONS = [
  { value: 1, label: "Coffeeroom", hint: "Telegram ID 111" },
  { value: 2, label: "Sierra Coffee" }
];

// The sheet closes when its slide-out ends - jsdom has no transitions.
const endSlide = () => {
  const sheet = screen.queryByRole("dialog");
  if (sheet) fireEvent.transitionEnd(sheet, { propertyName: "transform" });
};

describe("Select - one picker for lists", () => {
  it("one choice: opens a sheet, a tap picks and closes", async () => {
    const onChange = vi.fn();
    renderWithProviders(<Select label="Владелец" placeholder="Выберите владельца" options={OPTIONS} value={[]} onChange={onChange} />);

    await userEvent.click(screen.getByRole("button", { name: "Владелец" }));
    const sheet = screen.getByRole("dialog", { name: "Владелец" });
    expect(within(sheet).getByText("Telegram ID 111")).toBeInTheDocument();

    await userEvent.click(within(sheet).getByRole("button", { name: /Sierra Coffee/ }));
    endSlide();

    expect(onChange).toHaveBeenCalledWith([2]);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("many: taps toggle, the chosen show inside the field, «Готово» closes", async () => {
    const onChange = vi.fn();
    renderWithProviders(
      <Select multiple label="Номиналы" placeholder="Выберите номиналы" options={OPTIONS} value={[1]} onChange={onChange} />
    );

    expect(screen.getByRole("button", { name: "Номиналы: Coffeeroom" })).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Номиналы: Coffeeroom" }));
    const sheet = screen.getByRole("dialog");
    await userEvent.click(within(sheet).getByRole("button", { name: /Sierra Coffee/ }));
    expect(onChange).toHaveBeenLastCalledWith([1, 2]);

    await userEvent.click(within(sheet).getByRole("button", { name: /Coffeeroom/ }));
    expect(onChange).toHaveBeenLastCalledWith([]);

    await userEvent.click(within(sheet).getByRole("button", { name: "Готово" }));
    endSlide();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("the search box hands the text to the caller; nothing found says so", async () => {
    const onSearch = vi.fn();
    renderWithProviders(
      <Select
        label="Владелец"
        placeholder="Выберите"
        options={[]}
        value={[]}
        onChange={() => {}}
        search={{ value: "", onChange: onSearch, placeholder: "Поиск" }}
      />
    );

    await userEvent.click(screen.getByRole("button", { name: "Владелец" }));
    await userEvent.type(screen.getByRole("searchbox", { name: "Поиск" }), "к");

    expect(onSearch).toHaveBeenCalledWith("к");
    expect(screen.getByText("Ничего не найдено")).toBeInTheDocument();
  });

  it("a filter pill shows the choice and resets with ×", async () => {
    const onChange = vi.fn();
    renderWithProviders(
      <Select variant="filter" clearable label="Заведение" placeholder="Все" options={OPTIONS} value={[1]} onChange={onChange} />
    );

    expect(screen.getByText("Заведение: Coffeeroom")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Заведение: сбросить" }));

    expect(onChange).toHaveBeenCalledWith([]);
  });

  it("names a chosen value the current options don't have (a server search narrowed them)", () => {
    renderWithProviders(
      <Select label="Владелец" placeholder="Выберите" options={[]} value={[7]} onChange={() => {}} selectedLabel="ИП Асанов" />
    );

    expect(screen.getByRole("button", { name: "Владелец: ИП Асанов" })).toBeInTheDocument();
  });
});
