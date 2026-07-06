import { useState } from "react";
import { useSearchParams } from "react-router";

import { PROFILE_TABS } from "../constants";
import type { Tab } from "../types";

export const useProfileTab = () => {
  const [searchParams] = useSearchParams();

  const requestedTab = searchParams.get("tab") as Tab | null;
  const initialTab = PROFILE_TABS.includes(requestedTab as Tab)
    ? (requestedTab as Tab)
    : "certificates";

  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
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
