"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useMockAuth } from "@/context/MockAuthContext";
import { dashboardPath } from "@/lib/navigation";

export default function HomePage() {
  const { user, isReady } = useMockAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isReady) return;
    if (!user) router.replace("/login");
    else router.replace(dashboardPath(user.role));
  }, [isReady, user, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-soft text-ink-muted">
      Redirecting…
    </div>
  );
}
