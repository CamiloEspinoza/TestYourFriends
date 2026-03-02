import { apiFetch } from "./api";

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
}

interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

export async function loginApi(
  email: string,
  password: string,
): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function registerApi(
  email: string,
  password: string,
  name?: string,
): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password, name }),
  });
}

export async function getMeApi(): Promise<AuthUser> {
  return apiFetch<AuthUser>("/auth/me");
}
