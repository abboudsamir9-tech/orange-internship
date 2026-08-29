export class ApiError extends Error {
  status: number;
  payload: unknown;

  constructor(message: string, status: number, payload?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

function looksLikeHtml(value: string): boolean {
  const trimmed = value.trim().toLowerCase();
  return (
    trimmed.startsWith("<!doctype") ||
    trimmed.startsWith("<html") ||
    trimmed.includes("<title>") ||
    trimmed.includes("traceback")
  );
}

function firstStringMessage(value: unknown): string | null {
  if (typeof value === "string" && value.trim() && !looksLikeHtml(value)) {
    return value;
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      const message = firstStringMessage(item);
      if (message) return message;
    }
  }
  if (value && typeof value === "object") {
    for (const nested of Object.values(value as Record<string, unknown>)) {
      const message = firstStringMessage(nested);
      if (message) return message;
    }
  }
  return null;
}

export function getErrorMessage(error: unknown, fallback = "Something went wrong.") {
  if (error instanceof ApiError) {
    const payload = error.payload;

    if (typeof payload === "string") {
      if (looksLikeHtml(payload)) return fallback;
      return payload;
    }

    if (payload && typeof payload === "object") {
      const data = payload as Record<string, unknown>;

      // Prefer field-specific validation messages (username/email/password first).
      for (const key of ["username", "email", "password", "non_field_errors", "detail"]) {
        const message = firstStringMessage(data[key]);
        if (message) return message;
      }

      const anyMessage = firstStringMessage(data);
      if (anyMessage) return anyMessage;
    }

    if (error.status === 401) return "Please sign in again.";
    if (error.status === 403) return "You do not have permission to do that.";
    if (error.status === 404) return "The requested item was not found.";
    if (typeof error.message === "string" && !looksLikeHtml(error.message)) {
      return error.message || fallback;
    }
    return fallback;
  }
  if (error instanceof Error) {
    if (looksLikeHtml(error.message)) return fallback;
    return error.message;
  }
  return fallback;
}
