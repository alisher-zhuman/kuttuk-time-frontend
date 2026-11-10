import { useCallback, useEffect, useState } from "react";

import { addToHomeScreen, checkHomeScreenStatus, on } from "@tma.js/sdk-react";

// hidden - can't be added here (Mini Apps < 8.0, desktop, or the check failed);
// missing - can be added (also "unknown": Telegram can't tell, so we offer it).
type HomeScreenState = "hidden" | "missing" | "added";

export const useHomeScreen = () => {
  const [state, setState] = useState<HomeScreenState>("hidden");

  useEffect(() => {
    if (!checkHomeScreenStatus.isAvailable()) return;

    let isActive = true;

    checkHomeScreenStatus()
      .then((status) => {
        if (!isActive) return;

        if (status === "added") setState("added");
        else if (status === "missed" || status === "unknown") setState("missing");
      })
      .catch(() => {
        // Stays hidden - better no button than one that does nothing.
      });

    // The prompt answers with an event, not a return value.
    const offAdded = on("home_screen_added", () => setState("added"));

    return () => {
      isActive = false;
      offAdded();
    };
  }, []);

  const add = useCallback(() => {
    if (addToHomeScreen.isAvailable()) addToHomeScreen();
  }, []);

  return { state, add };
};
