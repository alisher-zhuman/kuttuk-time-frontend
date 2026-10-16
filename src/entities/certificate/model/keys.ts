export const certificateKeys = {
  all: () => ["certificates"] as const,
  my: () => ["certificates", "my"] as const
};
