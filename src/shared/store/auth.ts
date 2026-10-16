import { create } from "zustand";

import type { UserRole } from "@shared/types";

export interface AuthState {
  accessToken: string | null;
  role: UserRole | null;
  isReady: boolean;
  // initData rejected by log-in (401, older than 24h) — only a relaunch helps.
  isSessionExpired: boolean;
  setAuth: (accessToken: string, role: UserRole) => void;
  clearAuth: () => void;
  setReady: () => void;
  setSessionExpired: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  role: null,
  isReady: false,
  isSessionExpired: false,
  setAuth: (accessToken, role) => set({ accessToken, role }),
  clearAuth: () => set({ accessToken: null, role: null }),
  setReady: () => set({ isReady: true }),
  setSessionExpired: () => set({ isSessionExpired: true })
}));
