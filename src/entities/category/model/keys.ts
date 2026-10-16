export const categoryKeys = {
  list: (lang: string) => ["categories", "list", lang] as const,
  adminList: () => ["categories", "admin-list"] as const
};
