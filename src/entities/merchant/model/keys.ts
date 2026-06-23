export const merchantKeys = {
  list: (search: string, category: string) =>
    ["merchants", "list", search, category] as const,
  categories: () => ["merchants", "categories"] as const,
};
