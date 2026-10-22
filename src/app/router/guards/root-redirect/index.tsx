import { useLayoutEffect } from "react";

import { getLaunchParams } from "@shared/helpers";
import { useNavigateTo } from "@shared/hooks";
import { useViewModeStore } from "@shared/store";

import { getStartRoute } from "./start-route";

// A component, not a loader: the redirect target depends on viewMode/role,
// which is only known after auth resolves. createBrowserRouter runs loaders at
// router-init time (module load) — before AuthProvider's logIn completes — so a
// loader would always read the default "user" mode. A component renders inside
// the router, i.e. after AuthProvider has unblocked, so viewMode is correct.
// useLayoutEffect + replace: true redirects before the empty "/" frame paints
// and overwrites the "/" history entry (so Back doesn't re-trigger this).
export const RootRedirect = () => {
  const navigateTo = useNavigateTo();

  useLayoutEffect(() => {
    const { viewMode } = useViewModeStore.getState();

    // The id in startapp=order_<uuid> is validated by the order page (a bad
    // one → "not found"); with replace this is the only history entry, so Back
    // falls through to the role's home instead of closing the mini app.
    navigateTo(getStartRoute(getLaunchParams()?.tgWebAppStartParam, viewMode), { replace: true });
  }, [navigateTo]);

  return null;
};
