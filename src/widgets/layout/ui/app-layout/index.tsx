import { Outlet } from "react-router";

import { useSignal, viewport } from "@tma.js/sdk-react";

import { useSettingsButton } from "@app/hooks/useSettingsButton";

import { Header } from "../header";

export const AppLayout = () => {
  useSettingsButton();

  const contentSafeAreaInsets = useSignal(viewport.contentSafeAreaInsets);
  const safeAreaInsets = useSignal(viewport.safeAreaInsets);
  const topInset = safeAreaInsets.top + contentSafeAreaInsets.top;

  return (
    <>
      <div
        aria-hidden="true"
        className="fixed top-0 inset-x-0 pointer-events-none z-20 backdrop-blur-xs mask-[linear-gradient(to_bottom,black_80%,rgba(0,0,0,0.25))]"
        style={{ height: topInset }}
      />

      <div
        className="min-h-dvh bg-(--color-bg) text-(--color-ink)"
        style={{
          paddingTop: safeAreaInsets.top + contentSafeAreaInsets.top,
          paddingRight: safeAreaInsets.right + contentSafeAreaInsets.right,
          paddingBottom: safeAreaInsets.bottom + contentSafeAreaInsets.bottom,
          paddingLeft: safeAreaInsets.left + contentSafeAreaInsets.left,
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
