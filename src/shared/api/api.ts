import i18n from "i18next";

import { retrieveRawInitData } from "@tma.js/sdk-react";
import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

import { API_URL } from "@shared/constants";
import { useAuthStore } from "@shared/store";

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

        useAuthStore.getState().setAuth(accessToken, role);
        original.headers.Authorization = `Bearer ${accessToken}`;
        return api.request(original);
      } catch {
        useAuthStore.getState().clearAuth();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);
