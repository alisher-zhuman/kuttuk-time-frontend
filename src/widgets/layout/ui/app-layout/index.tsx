import { Outlet } from "react-router";

import { useBackButton, useSafeArea, useSettingsButton, useSwipeNavigation } from "@shared/hooks";

import { Header } from "../header";
import { TopBlur } from "../top-blur";

export const AppLayout = () => {
  useSettingsButton();
  useBackButton();

  const insets = useSafeArea();
  const swipe = useSwipeNavigation();

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
        <Header />

        <main className="px-4">
          <Outlet />
        </main>
      </div>
    </>
  );
};
