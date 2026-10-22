import { useState } from "react";

import { shiftIsoDate } from "@shared/helpers";

import { useHaptic } from "./tma";

// The week a report shows: null = the current one (the backend decides which
// week that is, in Bishkek time), otherwise any date inside the shown week.
// currentFrom — the current week's `from`, read from the backend's default
// response instead of the device clock; shifting back onto it returns to null
// so the current week stays one cached request.
export const useWeekParam = (currentFrom: string | undefined) => {
  const [week, setWeek] = useState<string | null>(null);

  const haptic = useHaptic();

  const shift = (from: string, days: number) => {
    haptic.selection();

    const target = shiftIsoDate(from, days);

    setWeek(target === currentFrom ? null : target);
  };

  return { week, shift };
};
