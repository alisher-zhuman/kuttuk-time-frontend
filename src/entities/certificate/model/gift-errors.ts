import { isAxiosError } from "axios";

import { GiftConflictSchema } from "./schemas";

// The link is unknown, malformed or replaced by a newer «Подарить».
export const isGiftNotFound = (error: unknown) =>
  isAxiosError(error) && error.response?.status === 404;

// Claimed / used / expired / own since the screen loaded - the caller
// re-fetches the gift and the screen shows why.
export const isGiftConflict = (error: unknown) =>
  isAxiosError(error) &&
  error.response?.status === 409 &&
  GiftConflictSchema.safeParse(error.response.data).success;
