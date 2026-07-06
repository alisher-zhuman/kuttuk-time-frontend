import { Outlet, useLocation } from "react-router";

import { ADMIN_ROUTE_PREFIX, ROUTE_PATTERNS } from "@shared/constants";
import {
  useBackButton,
  useSafeArea,
  useSettingsButton,
  useSwipeNavigation,
} from "@shared/hooks";

import { AdminNav } from "../admin-nav";
import { Footer } from "../footer";
import { Header } from "../header";
import { TopBlur } from "../top-blur";

export const AppLayout = () => {
  useSettingsButton();
  useBackButton();

  const insets = useSafeArea();

  const swipe = useSwipeNavigation();

  const { pathname } = useLocation();

  const isAdminSection = pathname.startsWith(ADMIN_ROUTE_PREFIX);

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

        <main
          key={pathname}
          className="flex-1 flex flex-col px-4 animate-page-enter"
        >
          <Outlet />
        </main>

        {isAdminSection ? <AdminNav /> : <Footer />}
      </div>
    </>
  );
};
