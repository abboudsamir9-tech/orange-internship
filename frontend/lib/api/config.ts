export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
  "http://127.0.0.1:8001";

export const ACCESS_TOKEN_KEY = "aimp-access-token";
export const REFRESH_TOKEN_KEY = "aimp-refresh-token";
