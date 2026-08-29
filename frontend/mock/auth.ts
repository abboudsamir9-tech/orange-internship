/**
 * Frontend-only mock authentication credentials.
 * Single source of truth — do not duplicate in page components.
 */

export interface MockCredential {
  /** Accepted username or email (case-insensitive) */
  identifiers: string[];
  password: string;
  userId: string;
}

export const MOCK_CREDENTIALS: MockCredential[] = [
  {
    identifiers: ["admin@company.com", "admin"],
    password: "admin123",
    userId: "u-admin",
  },
  {
    identifiers: ["mentor@company.com", "mentor"],
    password: "mentor123",
    userId: "u-mentor-1",
  },
  {
    identifiers: ["intern@company.com", "intern"],
    password: "intern123",
    userId: "u-intern-1",
  },
];

export const DEMO_ACCESS_HINT =
  "Demo access: admin@company.com / admin123 · mentor@company.com / mentor123 · intern@company.com / intern123";

export function resolveMockLogin(
  identifier: string,
  password: string,
): { userId: string } | { error: string } {
  const trimmed = identifier.trim().toLowerCase();
  if (!trimmed || !password) {
    return { error: "Please enter both username/email and password." };
  }

  const match = MOCK_CREDENTIALS.find((cred) =>
    cred.identifiers.some((id) => id.toLowerCase() === trimmed),
  );

  if (!match || match.password !== password) {
    return { error: "Incorrect username/email or password." };
  }

  return { userId: match.userId };
}
