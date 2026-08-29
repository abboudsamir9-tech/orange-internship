import { adaptUser } from "@/lib/api/adapters";
import { apiRequest, clearTokens, setTokens } from "@/lib/api/client";
import type { User } from "@/types";

export async function loginRequest(identifier: string, password: string) {
  const data = await apiRequest<{
    access: string;
    refresh: string;
    user: unknown;
  }>("/api/auth/login/", {
    method: "POST",
    auth: false,
    body: { email: identifier, password },
  });
  setTokens(data.access, data.refresh);
  return adaptUser(data.user);
}

export async function fetchCurrentUser(): Promise<User> {
  const data = await apiRequest<any>("/api/auth/me/");
  return adaptUser(data);
}

export async function logoutRequest() {
  const refresh =
    typeof window !== "undefined"
      ? window.localStorage.getItem("aimp-refresh-token")
      : null;
  try {
    if (refresh) {
      await apiRequest("/api/auth/logout/", {
        method: "POST",
        body: { refresh },
      });
    }
  } catch {
    // Clear local session even if blacklist fails.
  } finally {
    clearTokens();
  }
}
