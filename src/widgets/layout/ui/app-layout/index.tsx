import { Outlet, useLocation } from "react-router";

import { ROUTES } from "@shared/constants";
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
        className="min-h-dvh bg-(--color-bg) text-(--color-ink)"
        onTouchStart={swipe.onTouchStart}
        onTouchEnd={swipe.onTouchEnd}
        style={{
          paddingTop: insets.top,
          paddingRight: insets.right,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
        }}
      >
        {pathname !== ROUTES.PROFILE && <Header />}

        <main key={pathname} className="px-4 animate-page-enter">
          <Outlet />
        </main>
      </div>
    </>
  );
};
