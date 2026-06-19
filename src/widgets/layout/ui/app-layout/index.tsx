import { Outlet } from "react-router";

import { useBackButton, useSafeArea, useSettingsButton } from "@shared/hooks";

import { Header } from "../header";
import { TopBlur } from "../top-blur";

export const AppLayout = () => {
  useSettingsButton();
  useBackButton();

  const insets = useSafeArea();

  return (
    <>
      <TopBlur height={insets.top} />

      <div
        className="min-h-dvh bg-(--color-bg) text-(--color-ink)"
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
