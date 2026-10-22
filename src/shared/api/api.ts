import i18n from "i18next";

import { retrieveRawInitData } from "@tma.js/sdk-react";
import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
  isAxiosError
} from "axios";

import { API_URL } from "@shared/constants";
import { useAuthStore, useViewModeStore } from "@shared/store";

import { logIn } from "./auth";

export const api = axios.create({ baseURL: API_URL });

// Shared across concurrent 401s: when the token expires, every in-flight
// request fails at once — they should all wait on a single re-login.
let pendingLogIn: ReturnType<typeof logIn> | null = null;

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  config.headers["Accept-Language"] = i18n.language;

  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      try {
        const initData = retrieveRawInitData();

        if (!initData) {
          return Promise.reject(error);
        }

        pendingLogIn ??= logIn({ initData }).finally(() => {
          pendingLogIn = null;
        });

        const { accessToken, role } = await pendingLogIn;

        // The role can change while the app is open (a merchant deactivated
        // or created meanwhile) — the screens follow it, like on a fresh start.
        if (role !== useAuthStore.getState().role) {
          useViewModeStore.getState().setViewMode(role);
        }

        useAuthStore.getState().setAuth(accessToken, role);
        original.headers.Authorization = `Bearer ${accessToken}`;
        return api.request(original);
      } catch (logInError) {
        // Only a rejected initData ends the session. A network error, 5xx,
        // 429 or a cold-starting backend keeps the token and role: dropping
        // them would kick an owner out of the cabinet mid-redemption.
        if (isAxiosError(logInError) && logInError.response?.status === 401) {
          useAuthStore.getState().clearAuth();
          useAuthStore.getState().setSessionExpired();
        }

        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);
