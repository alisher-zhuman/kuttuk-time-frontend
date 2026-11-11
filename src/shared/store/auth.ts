import { create } from "zustand";

import type { UserRole } from "@shared/types";

export interface AuthState {
  accessToken: string | null;
  role: UserRole | null;
  isReady: boolean;
  // initData rejected by log-in (401, older than 24h) - only a relaunch helps.
  isSessionExpired: boolean;
  // The website's guest (no Telegram account linked yet) - offered «Войти
  // через Telegram». Always false in the Mini App.
  isGuest: boolean;
  setAuth: (accessToken: string, role: UserRole, isGuest?: boolean) => void;
  clearAuth: () => void;
  setReady: () => void;
  setSessionExpired: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  role: null,
  isReady: false,
  isSessionExpired: false,
  isGuest: false,
  setAuth: (accessToken, role, isGuest = false) => set({ accessToken, role, isGuest }),
  clearAuth: () => set({ accessToken: null, role: null, isGuest: false }),
  setReady: () => set({ isReady: true }),
  setSessionExpired: () => set({ isSessionExpired: true })
}));
