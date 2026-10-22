export const payoutKeys = {
  // week null = the current week (the backend decides which week that is).
  week: (week: string | null) => ["payouts", week] as const
};
