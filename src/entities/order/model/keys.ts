export const orderKeys = {
  detail: (id: string) => ["orders", "detail", id] as const
};
