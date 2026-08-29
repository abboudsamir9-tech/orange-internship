import { ACCESS_TOKEN_KEY, API_BASE_URL, REFRESH_TOKEN_KEY } from "@/lib/api/config";
import { ApiError } from "@/lib/api/errors";

type RequestOptions = {
  method?: string;
  body?: unknown;
  formData?: FormData;
  auth?: boolean;
  headers?: Record<string, string>;
  signal?: AbortSignal;
};

function getAccessToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

function getRefreshToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setTokens(access: string, refresh?: string) {
  window.localStorage.setItem(ACCESS_TOKEN_KEY, access);
  if (refresh) window.localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
}

export function clearTokens() {
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function unwrapList<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[];
  if (data && typeof data === "object" && Array.isArray((data as { results?: unknown }).results)) {
    return (data as { results: T[] }).results;
  }
  return [];
}

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const refresh = getRefreshToken();
      if (!refresh) return null;
      const response = await fetch(`${API_BASE_URL}/api/auth/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
      });
      if (!response.ok) {
        clearTokens();
        return null;
      }
      const data = (await response.json()) as { access: string; refresh?: string };
      setTokens(data.access, data.refresh);
      return data.access;
    })().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

async function parseBody(response: Response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function apiRequest<T = unknown>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const {
    method = "GET",
    body,
    formData,
    auth = true,
    headers = {},
    signal,
  } = options;

  const url = path.startsWith("http") ? path : `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;

  async function send(token: string | null) {
    const requestHeaders: Record<string, string> = { ...headers };
    if (!formData) {
      requestHeaders["Content-Type"] = requestHeaders["Content-Type"] || "application/json";
    }
    if (auth && token) {
      requestHeaders.Authorization = `Bearer ${token}`;
    }

    return fetch(url, {
      method,
      headers: requestHeaders,
      body: formData ? formData : body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    });
  }

  let token = auth ? getAccessToken() : null;
  let response = await send(token);

  if (response.status === 401 && auth) {
    token = await refreshAccessToken();
    if (token) {
      response = await send(token);
    }
  }

  const payload = await parseBody(response);
  if (!response.ok) {
    const looksLikeHtml =
      typeof payload === "string" &&
      (/^\s*<(!doctype|html)/i.test(payload) || payload.toLowerCase().includes("traceback"));
    const detail =
      typeof payload === "object" && payload && "detail" in payload
        ? String((payload as { detail: unknown }).detail)
        : null;
    throw new ApiError(
      detail && !/^\s*</.test(detail) ? detail : `Request failed (${response.status})`,
      response.status,
      looksLikeHtml ? undefined : payload,
    );
  }
  return payload as T;
}

export async function apiDownload(path: string, filename: string) {
  const token = getAccessToken();
  let response = await fetch(`${API_BASE_URL}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (response.status === 401) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      response = await fetch(`${API_BASE_URL}${path}`, {
        headers: { Authorization: `Bearer ${refreshed}` },
      });
    }
  }
  if (!response.ok) {
    throw new ApiError("Download failed.", response.status);
  }
  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(objectUrl);
}
