import { retrieveLaunchParams } from "@tma.js/sdk-react";
import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

import { useAuthStore } from "@shared/store";

const API_URL = import.meta.env["VITE_API_URL"] as string;

export const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const telegramId = retrieveLaunchParams().tgWebAppData?.user?.id;
        if (!telegramId) return Promise.reject(error);

        const { data } = await axios.post<{ accessToken: string; role: string }>(
          `${API_URL}/auth/login`,
          { telegramId },
        );

        useAuthStore.getState().setAuth(data.accessToken, data.role);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api.request(original);
      } catch {
        useAuthStore.getState().clearAuth();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);
