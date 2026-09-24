import apiClient from "@/lib/axios";
import { LoginCredentials, LoginResponse, User } from "@/types/auth";

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>("/auth/login", {
      username: credentials.username.trim(),
      password: credentials.password,
      expiresInMins: credentials.expiresInMins || 60,
    });
    return response.data;
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>("/auth/me");
    return response.data;
  },
};
