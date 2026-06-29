import { Outlet, useLocation } from "react-router";

import { ROUTE_PATTERNS } from "@shared/constants";
import { useBackButton, useSafeArea, useSettingsButton, useSwipeNavigation } from "@shared/hooks";

import { Header } from "../header";
import { TopBlur } from "../top-blur";

export const AppLayout = () => {
  useSettingsButton();
  useBackButton();

  const insets = useSafeArea();
  const swipe = useSwipeNavigation();
  
  const { pathname } = useLocation();

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
          paddingLeft: insets.left,
        }}
      >
        {pathname !== ROUTE_PATTERNS.PROFILE && <Header />}

        <main key={pathname} className="flex-1 flex flex-col px-4 animate-page-enter">
          <Outlet />
        </main>

        <footer className="flex justify-center py-3">
          <span className="text-xs text-(--color-hint)">С любовью KuttukTime ♥</span>
        </footer>
      </div>
    </>
  );
};
