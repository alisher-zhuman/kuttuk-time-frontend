import { useState } from "react";

import { PROFILE_TABS } from "../constants";
import type { Tab } from "../types";

export const useProfileTab = () => {
  const [activeTab, setActiveTab] = useState<Tab>("certificates");
  const [contentAnimation, setContentAnimation] = useState(
    "animate-tab-enter-right",
  );

  const handleTabChange = (tab: Tab) => {
    if (tab === activeTab) return;

    setContentAnimation(
      PROFILE_TABS.indexOf(tab) > PROFILE_TABS.indexOf(activeTab)
        ? "animate-tab-enter-right"
        : "animate-tab-enter-left",
    );
    setActiveTab(tab);
  };

  return { activeTab, contentAnimation, handleTabChange };
};
