import { useState } from "react";

import { useSearchParamState } from "@shared/hooks";

import { PROFILE_TABS } from "../constants";
import type { Tab } from "../types";

// The tab lives in the URL, not in state: the TMA settings button navigates to
// ?tab=settings while the profile page may already be mounted, and a useState
// initializer would never see that change.
export const useProfileTab = () => {
  const [contentAnimation, setContentAnimation] = useState(
    "animate-tab-enter-right"
  );

  const [requestedTab, setTabParam] = useSearchParamState("tab");

  const activeTab = PROFILE_TABS.find((tab) => tab === requestedTab) ?? "certificates";

  const handleTabChange = (tab: Tab) => {
    if (tab === activeTab) return;

    setContentAnimation(
      PROFILE_TABS.indexOf(tab) > PROFILE_TABS.indexOf(activeTab)
        ? "animate-tab-enter-right"
        : "animate-tab-enter-left"
    );
    setTabParam(tab);
  };

  return { activeTab, contentAnimation, handleTabChange };
};
