export const merchantKeys = {
  list: (search: string, category: string, lang: string) =>
    ["merchants", "list", search, category, lang] as const,
  categories: () => ["merchants", "categories"] as const,
  detail: (id: string | number, lang: string) =>
    ["merchants", "detail", id, lang] as const,
};
