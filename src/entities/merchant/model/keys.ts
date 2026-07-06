export const merchantKeys = {
  list: (search: string, category: number | null, lang: string) =>
    ["merchants", "list", search, category, lang] as const,
  adminList: (
    search: string,
    category: number | null,
    isActive: boolean | null,
    lang: string,
  ) => ["merchants", "admin-list", search, category, isActive, lang] as const,
  categories: (lang: string) => ["merchants", "categories", lang] as const,
  detail: (id: string | number, lang: string) =>
    ["merchants", "detail", id, lang] as const,
};
