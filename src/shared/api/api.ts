import i18n from "i18next";

import { retrieveRawInitData } from "@tma.js/sdk-react";
import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
  isAxiosError
} from "axios";

import { API_URL, REQUEST_TIMEOUT_MS } from "@shared/constants";
import { isWebsite, useAuthStore, useViewModeStore } from "@shared/store";

import { logIn } from "./auth";
import { signInOnWebsite } from "./web-auth";

export const api = axios.create({ baseURL: API_URL, timeout: REQUEST_TIMEOUT_MS });

// Shared across concurrent 401s: when the token expires, every in-flight
// request fails at once - they should all wait on a single re-login.
let pendingLogIn: Promise<{ accessToken: string; role: "user" | "merchant" | "admin"; isGuest?: boolean }> | null =
  null;

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
        // The website: the JWT was refused - a kept Telegram session goes and
        // a quiet guest takes over (the next purchase asks to sign in with
        // Telegram again). The Mini App signs in again by its initData.
        const signIn = () => {
          if (isWebsite()) return signInOnWebsite({ afterRejection: true });

          const initData = retrieveRawInitData();

          return initData ? logIn({ initData }) : null;
        };

        if (!pendingLogIn) {
          const started = signIn();

          if (!started) {
            return Promise.reject(error);
          }

          pendingLogIn = started.finally(() => {
            pendingLogIn = null;
          });
        }

        const { accessToken, role, isGuest = false } = await pendingLogIn;

        // The role can change while the app is open (a merchant deactivated
        // or created meanwhile) - the screens follow it, like on a fresh start.
        // The website always shows the buyer's screens.
        if (!isWebsite() && role !== useAuthStore.getState().role) {
          useViewModeStore.getState().setViewMode(role);
        }

        useAuthStore.getState().setAuth(accessToken, role, isGuest);
        original.headers.Authorization = `Bearer ${accessToken}`;
        return api.request(original);
      } catch (logInError) {
        // Only a rejected initData ends the session (the website falls back to
        // the guest instead). A network error, 5xx, 429 or a cold-starting
        // backend keeps the token and role: dropping them would kick an owner
        // out of the cabinet mid-redemption.
        if (!isWebsite() && isAxiosError(logInError) && logInError.response?.status === 401) {
          useAuthStore.getState().clearAuth();
          useAuthStore.getState().setSessionExpired();
        }

        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);
