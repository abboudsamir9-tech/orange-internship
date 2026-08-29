"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { dashboardPath, navigationByRole } from "@/lib/navigation";
import { roleLabel } from "@/lib/labels";
import { fullName } from "@/lib/names";
import type { UserRole } from "@/types";

export function AppShell({
  role,
  children,
}: {
  role: UserRole;
  children: React.ReactNode;
}) {
  const { user, isReady, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isReady) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (user.role !== role) {
      router.replace(dashboardPath(user.role));
    }
  }, [isReady, user, role, router]);

  if (!isReady || !user || user.role !== role) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-soft text-ink-muted">
        Loading workspace…
      </div>
    );
  }

  const items = navigationByRole[role];

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[260px_1fr]">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-[260px] transform border-r border-line bg-white transition lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="border-b border-line px-5 py-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">
              Internship Platform
            </p>
            <p className="mt-1 text-lg font-bold text-ink">AI Mentorship Hub</p>
          </div>
          <nav className="flex-1 space-y-1 p-3" aria-label="Primary">
            {items.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    active
                      ? "bg-brand text-white shadow-soft"
                      : "text-ink-muted hover:bg-brand-light hover:text-brand-dark"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-line p-4">
            <p className="text-sm font-semibold text-ink">{fullName(user)}</p>
            <p className="text-xs text-ink-muted">{roleLabel[user.role]}</p>
          </div>
        </div>
      </aside>

      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-ink/30 lg:hidden"
          aria-label="Close navigation"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <div className="min-w-0">
        <header className="sticky top-0 z-20 border-b border-line bg-white/90 backdrop-blur">
          <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="btn-secondary px-3 py-2 lg:hidden"
                onClick={() => setOpen(true)}
                aria-expanded={open}
                aria-controls="mobile-nav"
              >
                Menu
              </button>
              <div>
                <p className="text-sm font-semibold text-ink">
                  {roleLabel[role]} workspace
                </p>
                <p className="text-xs text-ink-muted">Connected to Django API</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium text-ink">{fullName(user)}</p>
                <p className="text-xs text-ink-muted">{user.email}</p>
              </div>
              <button
                type="button"
                className="btn-secondary"
                onClick={async () => {
                  await logout();
                  router.push("/login");
                }}
              >
                Sign out
              </button>
            </div>
          </div>
        </header>
        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
