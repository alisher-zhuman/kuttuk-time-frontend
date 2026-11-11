import { useState } from "react";

import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@tests";
import { describe, expect, it, vi } from "vitest";

import { Combobox } from "./index";

const ALL = [
  { value: 1, label: "Coffeeroom", hint: "Telegram ID 111" },
  { value: 2, label: "Sierra Coffee", hint: "Telegram ID 222" }
];

// The caller filters by the query, like a server search would.
const Owner = ({ onChange }: { onChange: (value: number) => void }) => {
  const [query, setQuery] = useState("");
  const [value, setValue] = useState<number | null>(1);

  return (
    <Combobox
      label="Владелец"
      placeholder="Выберите владельца"
      value={value}
      selectedLabel={ALL.find((option) => option.value === value)?.label}
      query={query}
      onQueryChange={setQuery}
      options={ALL.filter((option) => option.label.toLowerCase().includes(query.toLowerCase()))}
      onChange={(next) => {
        setValue(next);
        onChange(next);
      }}
    />
  );
};

describe("Combobox - a searched pick on the page", () => {
  it("shows the chosen name; typing filters the list under the field; a tap picks and closes", async () => {
    const onChange = vi.fn();
    renderWithProviders(<Owner onChange={onChange} />);

    const field = screen.getByRole("combobox", { name: "Владелец" });
    expect(field).toHaveValue("Coffeeroom");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();

    await userEvent.click(field);
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    await userEvent.type(field, "sier");
    expect(screen.queryByText("Coffeeroom")).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /Sierra Coffee/ }));

    expect(onChange).toHaveBeenCalledWith(2);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(field).toHaveValue("Sierra Coffee");
  });

  it("nothing matching says so", async () => {
    renderWithProviders(<Owner onChange={() => {}} />);

    const field = screen.getByRole("combobox", { name: "Владелец" });
    await userEvent.click(field);
    await userEvent.type(field, "zzz");

    expect(screen.getByText("Ничего не найдено")).toBeInTheDocument();
  });

  it("leaving the field closes the list and keeps the choice", async () => {
    renderWithProviders(<Owner onChange={() => {}} />);

    const field = screen.getByRole("combobox", { name: "Владелец" });
    await userEvent.click(field);
    await userEvent.type(field, "si");
    await userEvent.tab();

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(field).toHaveValue("Coffeeroom");
  });
});
