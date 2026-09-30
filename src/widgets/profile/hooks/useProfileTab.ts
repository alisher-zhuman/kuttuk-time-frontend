import { useState } from "react";
import { useSearchParams } from "react-router";

import { PROFILE_TABS } from "../constants";
import type { Tab } from "../types";

// The tab lives in the URL, not in state: the TMA settings button navigates to
// ?tab=settings while the profile page may already be mounted, and a useState
// initializer would never see that change.
export const useProfileTab = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const requestedTab = searchParams.get("tab") as Tab | null;
  const activeTab: Tab = PROFILE_TABS.includes(requestedTab as Tab)
    ? (requestedTab as Tab)
    : "certificates";

  const [contentAnimation, setContentAnimation] = useState(
    "animate-tab-enter-right"
  );

  const handleTabChange = (tab: Tab) => {
    if (tab === activeTab) return;

    setContentAnimation(
      PROFILE_TABS.indexOf(tab) > PROFILE_TABS.indexOf(activeTab)
        ? "animate-tab-enter-right"
        : "animate-tab-enter-left"
    );
    setSearchParams(
      (prev) => {
        prev.set("tab", tab);

        return prev;
      },
      { replace: true }
    );
  };

  return { activeTab, contentAnimation, handleTabChange };
};
