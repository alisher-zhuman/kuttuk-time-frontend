export const merchantKeys = {
  list: (search: string, category: number | null, lang: string) =>
    ["merchants", "list", search, category, lang] as const,
  adminList: (
    search: string,
    category: number | null,
    isActive: boolean | null,
    lang: string
  ) => ["merchants", "admin-list", search, category, isActive, lang] as const,
  detail: (id: string | number, lang: string) =>
    ["merchants", "detail", id, lang] as const,
  adminDetail: (id: string | number) => ["merchants", "admin-detail", id] as const,
  me: () => ["merchants", "me"] as const,
  // null = the current week (the backend decides which week that is).
  summary: (week: string | null) => ["merchants", "me", "summary", week] as const,
  // Outside the "merchants" tree on purpose: merchant mutations invalidate
  // ["merchants"], and the allowed values never change with a merchant edit.
  options: () => ["merchant-options"] as const
};
