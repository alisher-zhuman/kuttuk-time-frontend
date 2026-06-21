import { useState } from "react";
import { useSearchParams } from "react-router";

import { PROFILE_TABS } from "../constants";
import type { Tab } from "../types";

const isValidTab = (value: string | null): value is Tab =>
  PROFILE_TABS.includes(value as Tab);

export const useProfileTab = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const tabParam = searchParams.get("tab");
  const activeTab: Tab = isValidTab(tabParam) ? tabParam : "certificates";

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
    setSearchParams({ tab });
  };

  return { activeTab, contentAnimation, handleTabChange };
};
