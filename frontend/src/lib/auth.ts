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

interface SendOtpResponse {
  message: string;
}

export async function sendOtpApi(email: string): Promise<SendOtpResponse> {
  return apiFetch<SendOtpResponse>("/auth/send-otp", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function verifyOtpApi(
  email: string,
  code: string,
): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/auth/verify-otp", {
    method: "POST",
    body: JSON.stringify({ email, code }),
  });
}

export async function getMeApi(): Promise<AuthUser> {
  return apiFetch<AuthUser>("/auth/me");
}
