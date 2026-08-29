import type { User } from "@/types";

export function fullName(user: Pick<User, "firstName" | "lastName">) {
  return [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
}
