import { create } from "zustand";

import type { UserRole } from "@shared/types";

export interface AuthState {
  accessToken: string | null;
  role: UserRole | null;
  isReady: boolean;
  setAuth: (accessToken: string, role: UserRole) => void;
  clearAuth: () => void;
  setReady: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  role: null,
  isReady: false,
  setAuth: (accessToken, role) => set({ accessToken, role }),
  clearAuth: () => set({ accessToken: null, role: null }),
  setReady: () => set({ isReady: true })
}));
