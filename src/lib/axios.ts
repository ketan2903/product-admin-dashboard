import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const API_BASE_URL = "https://dummyjson.com";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Request Interceptor: Attach authentication token to every outgoing request
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Centralized error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    // If request was canceled by AbortController, propagate cancellation directly
    if (axios.isCancel(error) || error?.code === "ERR_CANCELED") {
      return Promise.reject(error);
    }

    if (error.response) {
      const status = error.response.status;
      const data = error.response.data as { message?: string };

      if (status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("auth_token");
          localStorage.removeItem("auth_user");
          if (window.location.pathname !== "/login") {
            window.location.href = "/login?expired=1";
          }
        }
      }

      const errorMessage = data?.message || error.message || "An unexpected error occurred.";
      return Promise.reject(new Error(errorMessage));
    } else if (error.request) {
      return Promise.reject(
        new Error("Unable to connect to the server. Please check your internet connection.")
      );
    }

    return Promise.reject(error);
  }
);

export default apiClient;
