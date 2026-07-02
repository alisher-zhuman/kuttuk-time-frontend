import { create } from "zustand";

export interface AuthState {
  accessToken: string | null;
  role: string | null;
  isReady: boolean;
  setAuth: (accessToken: string, role: string) => void;
  clearAuth: () => void;
  setReady: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  role: null,
  isReady: false,
  setAuth: (accessToken, role) => set({ accessToken, role }),
  clearAuth: () => set({ accessToken: null, role: null }),
  setReady: () => set({ isReady: true }),
}));
