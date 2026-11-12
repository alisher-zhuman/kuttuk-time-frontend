import { Outlet, useLocation, useMatches } from "react-router";

import { ROUTE_PATTERNS } from "@shared/constants";
import {
  useBackButton,
  useSafeArea,
  useSettingsButton,
  useSwipeNavigation
} from "@shared/hooks";
import { useAppModeStore, useViewModeStore } from "@shared/store";

import { NAV_TABS } from "../../constants";
import { BottomNav } from "../bottom-nav";
import { Footer } from "../footer";
import { Header } from "../header";
import { TopBlur } from "../top-blur";
import { WebMainButton } from "../web-main-button";

export const AppLayout = () => {
  useSettingsButton();
  useBackButton();

  const insets = useSafeArea();

  const swipe = useSwipeNavigation();

  const { pathname } = useLocation();

  const matches = useMatches();

  const isNotFound = matches.some((match) => match.id === "not-found");

  const viewMode = useViewModeStore((s) => s.viewMode);
  const isWeb = useAppModeStore((s) => s.mode === "web");

  // Only on the mode's root screens; nested ones (forms, details) get the
  // native Back button instead.
  const navTabs = NAV_TABS[viewMode];
  const showNav = navTabs?.some((tab) => tab.path === pathname) && !isNotFound;

  return (
    <>
      <TopBlur height={insets.top} />

      <div
        className="min-h-dvh flex flex-col bg-(--color-bg) text-(--color-ink)"
        onTouchStart={swipe.onTouchStart}
        onTouchEnd={swipe.onTouchEnd}
        style={{
          paddingTop: insets.top,
          paddingRight: insets.right,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left
        }}
      >
        <Header />

        <main
          key={pathname}
          className="flex-1 flex flex-col px-4 animate-page-enter"
        >
          <Outlet />
        </main>

        {!isNotFound &&
          (showNav && navTabs ? (
            <div className="sticky z-10" style={{ bottom: insets.bottom }}>
              <BottomNav tabs={navTabs} />
            </div>
          ) : (
            // The Mini App's profile ends with its own content - no brand strip.
            // The website keeps its footer everywhere (the offer, the policy).
            (isWeb || pathname !== ROUTE_PATTERNS.PROFILE) && <Footer />
          ))}

        <WebMainButton />
      </div>
    </>
  );
};
