"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  sendOtpApi,
  verifyOtpApi,
  getMeApi,
  type AuthUser,
} from "@/lib/auth";

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  sendOtp: (email: string) => Promise<void>;
  verifyOtp: (email: string, code: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      document.cookie = "token=; path=/; max-age=0";
      setLoading(false);
      return;
    }
    getMeApi()
      .then(setUser)
      .catch(() => {
        localStorage.removeItem("token");
        document.cookie = "token=; path=/; max-age=0";
      })
      .finally(() => setLoading(false));
  }, []);

  const sendOtp = useCallback(async (email: string) => {
    await sendOtpApi(email);
  }, []);

  const verifyOtp = useCallback(async (email: string, code: string) => {
    const res = await verifyOtpApi(email, code);
    localStorage.setItem("token", res.accessToken);
    document.cookie = `token=${res.accessToken}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`;
    setUser(res.user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    document.cookie = "token=; path=/; max-age=0";
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, sendOtp, verifyOtp, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
