export const certificateKeys = {
  all: () => ["certificates"] as const,
  my: () => ["certificates", "my"] as const,
  merchantLookup: (code: string) => ["certificates", "merchant-lookup", code] as const,
  merchantList: (status: string | null) => ["certificates", "merchant-list", status] as const
};
