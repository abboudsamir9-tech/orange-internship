"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { fetchCurrentUser, loginRequest, logoutRequest } from "@/lib/api/auth";
import { ACCESS_TOKEN_KEY } from "@/lib/api/config";
import { getErrorMessage } from "@/lib/api/errors";
import type { User } from "@/types";

interface AuthContextValue {
  user: User | null;
  isReady: boolean;
  login: (
    identifier: string,
    password: string,
  ) => Promise<{ ok: true; user: User } | { ok: false; error: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isReady, setIsReady] = useState(false);

  const refreshUser = useCallback(async () => {
    const token = window.localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!token) {
      setUser(null);
      return;
    }
    const me = await fetchCurrentUser();
    setUser(me);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await refreshUser();
      } catch {
        setUser(null);
      } finally {
        setIsReady(true);
      }
    })();
  }, [refreshUser]);

  const login = useCallback(async (identifier: string, password: string) => {
    try {
      const loggedIn = await loginRequest(identifier, password);
      setUser(loggedIn);
      return { ok: true as const, user: loggedIn };
    } catch (error) {
      return {
        ok: false as const,
        error: getErrorMessage(error, "Invalid credentials or inactive account."),
      };
    }
  }, []);

  const logout = useCallback(async () => {
    await logoutRequest();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, isReady, login, logout, refreshUser }),
    [user, isReady, login, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

/** @deprecated Use useAuth — kept so existing imports continue to compile during migration. */
export function useMockAuth() {
  return useAuth();
}
