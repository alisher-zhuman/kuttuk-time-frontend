import { create } from "zustand";

const TOKEN_KEY = "kt_access_token";
const ROLE_KEY = "kt_role";

export interface AuthState {
  accessToken: string | null;
  role: string | null;
  isReady: boolean;
  setAuth: (accessToken: string, role: string) => void;
  clearAuth: () => void;
  setReady: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: localStorage.getItem(TOKEN_KEY),
  role: localStorage.getItem(ROLE_KEY),
  isReady: false,
  setAuth: (accessToken, role) => {
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(ROLE_KEY, role);
    set({ accessToken, role });
  },
  clearAuth: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
    set({ accessToken: null, role: null });
  },
  setReady: () => set({ isReady: true }),
}));
