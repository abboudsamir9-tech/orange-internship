"use client";

import { AppShell } from "@/components/layout/AppShell";
import type { UserRole } from "@/types";

export function RoleGate({
  role,
  children,
}: {
  role: UserRole;
  children: React.ReactNode;
}) {
  return <AppShell role={role}>{children}</AppShell>;
}
