"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { dashboardPath } from "@/lib/navigation";

export default function LoginPage() {
  const { user, isReady, login } = useAuth();
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isReady && user) router.replace(dashboardPath(user.role));
  }, [isReady, user, router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!identifier.trim() || !password) {
      setError("Please enter both username/email and password.");
      return;
    }
    setSubmitting(true);
    const result = await login(identifier, password);
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.push(dashboardPath(result.user.role));
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_#ffedd5,_#fff7ed_40%,_#f3f4f6)] px-4 py-10">
      <div className="w-full max-w-md">
        <div className="card px-6 py-8 sm:px-8">
          <div className="flex flex-col items-center text-center">
            <Image
              src="/branding/orange-logo.jpeg"
              alt="Orange"
              width={120}
              height={120}
              className="h-20 w-20 object-contain sm:h-24 sm:w-24"
              priority
            />
            <h1 className="mt-5 text-2xl font-bold tracking-tight text-ink sm:text-[1.65rem]">
              AI Internship Management Platform
            </h1>
            <p className="mt-2 text-sm text-ink-muted">
              Sign in to access your internship workspace.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4" noValidate>
            <div>
              <label className="label" htmlFor="identifier">
                Username or Email
              </label>
              <input
                id="identifier"
                name="identifier"
                type="text"
                autoComplete="username"
                className="input"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="label" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className="input pr-20"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-2 my-auto rounded-lg px-2 text-xs font-semibold text-brand hover:text-brand-dark"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-pressed={showPassword}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {error ? (
              <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-danger" role="alert">
                {error}
              </p>
            ) : null}

            <button type="submit" className="btn-primary w-full" disabled={submitting}>
              {submitting ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-[11px] leading-relaxed text-ink-muted">
            Use your platform account credentials provided by Admin.
          </p>
        </div>
      </div>
    </div>
  );
}
