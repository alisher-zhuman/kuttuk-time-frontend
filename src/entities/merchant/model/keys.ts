export const merchantKeys = {
  me: () => ["merchants", "me"] as const,
  // week null = the current week (the backend decides which week that is);
  // venueId null = all the merchant's venues.
  summary: (week: string | null, venueId: number | null) =>
    ["merchants", "me", "summary", week, venueId] as const,
  adminList: (search: string, isActive: boolean | null) =>
    ["merchants", "admin-list", search, isActive] as const,
  adminDetail: (id: string | number) => ["merchants", "admin-detail", id] as const
};
