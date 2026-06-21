import { useTranslation } from "react-i18next";

import { SegmentedControl } from "@shared/ui";

import { PROFILE_TABS } from "../../constants";
import type { Tab } from "../../types";

interface Props {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export const ProfileTabs = ({ activeTab, onTabChange }: Props) => {
  const { t } = useTranslation();

  const items = PROFILE_TABS.map((tab) => ({
    value: tab,
    label: t(`profile.tabs.${tab}`),
  }));

  return <SegmentedControl items={items} value={activeTab} onChange={onTabChange} />;
};
