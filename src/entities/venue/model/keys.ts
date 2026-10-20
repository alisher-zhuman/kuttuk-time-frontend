export const venueKeys = {
  list: (search: string, category: number | null, lang: string) =>
    ["venues", "list", search, category, lang] as const,
  detail: (id: string | number, lang: string) => ["venues", "detail", id, lang] as const,
  adminList: (
    search: string,
    category: number | null,
    isActive: boolean | null,
    merchantId: number | null
  ) => ["venues", "admin-list", search, category, isActive, merchantId] as const,
  adminDetail: (id: string | number) => ["venues", "admin-detail", id] as const,
  // Outside the "venues" tree on purpose: venue mutations invalidate
  // ["venues"], and the allowed values never change with a venue edit.
  options: () => ["venue-options"] as const
};
