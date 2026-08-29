"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useCallback, useEffect, useState } from "react";
import { ErrorState, LoadingState } from "@/components/ui/AsyncState";
import { PageHeader } from "@/components/ui/PageHeader";
import { createIntern, createMentor, listMentors } from "@/lib/api/accounts";
import { getErrorMessage } from "@/lib/api/errors";
import { fullName } from "@/lib/names";
import type { User } from "@/types";

function CreateUserForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole =
    searchParams.get("role") === "MENTOR" ? "MENTOR" : "INTERN";
  const [role, setRole] = useState<"MENTOR" | "INTERN">(initialRole);
  const [mentors, setMentors] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadMentors = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const rows = await listMentors();
      setMentors(rows.map((row) => row.user).filter((u) => u.isActive));
    } catch (err) {
      setLoadError(getErrorMessage(err, "Unable to load mentors."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadMentors();
  }, [loadMentors]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setFormError(null);
    setSubmitting(true);
    const form = new FormData(e.currentTarget);
    const full_name = `${String(form.get("firstName") || "").trim()} ${String(form.get("lastName") || "").trim()}`.trim();
    const email = String(form.get("email") || "");
    const username = String(form.get("username") || "");
    const password = String(form.get("password") || "");
    const phone_number = String(form.get("phoneNumber") || "");

    try {
      if (role === "MENTOR") {
        await createMentor({
          full_name,
          email,
          username,
          password,
          phone_number,
          department: String(form.get("department") || ""),
          job_title: String(form.get("jobTitle") || ""),
        });
      } else {
        const skillsRaw = String(form.get("skills") || "");
        const skills = skillsRaw
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
          .map((skill_name) => ({ skill_name, skill_level: 3 }));
        await createIntern({
          full_name,
          email,
          username,
          password,
          phone_number,
          mentor_id: Number(form.get("mentorId")),
          major: String(form.get("major") || ""),
          university: String(form.get("university") || ""),
          learning_goals: String(form.get("learningGoals") || ""),
          skills,
        });
      }
      setMessage("Account created successfully.");
      setTimeout(() => router.push("/admin/users"), 1200);
    } catch (err) {
      setFormError(getErrorMessage(err, "Unable to create account."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Create account"
        description="Admin can create Mentor and Intern accounts and assign interns to mentors."
        actions={
          <Link href="/admin/users" className="btn-secondary">
            Back to users
          </Link>
        }
      />

      {loading ? <LoadingState label="Loading form…" /> : null}
      {loadError && !loading ? (
        <div className="mb-4">
          <ErrorState message={loadError} onRetry={() => void loadMentors()} />
        </div>
      ) : null}

      {!loading && !loadError ? (
        <form onSubmit={onSubmit} className="card mx-auto max-w-2xl space-y-5 p-6">
          <div>
            <label className="label" htmlFor="role">
              Role
            </label>
            <select
              id="role"
              className="input"
              value={role}
              onChange={(e) => setRole(e.target.value as "MENTOR" | "INTERN")}
            >
              <option value="MENTOR">Mentor</option>
              <option value="INTERN">Intern</option>
            </select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="firstName">
                First name
              </label>
              <input id="firstName" name="firstName" required className="input" />
            </div>
            <div>
              <label className="label" htmlFor="lastName">
                Last name
              </label>
              <input id="lastName" name="lastName" required className="input" />
            </div>
          </div>

          <div>
            <label className="label" htmlFor="email">
              Email
            </label>
            <input id="email" name="email" type="email" required className="input" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="username">
                Username
              </label>
              <input id="username" name="username" required className="input" />
            </div>
            <div>
              <label className="label" htmlFor="password">
                Password
              </label>
              <input id="password" name="password" type="password" required className="input" />
            </div>
          </div>

          <div>
            <label className="label" htmlFor="phoneNumber">
              Phone number
            </label>
            <input id="phoneNumber" name="phoneNumber" type="tel" required className="input" />
          </div>

          {role === "MENTOR" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="department">
                  Department
                </label>
                <input id="department" name="department" required className="input" />
              </div>
              <div>
                <label className="label" htmlFor="jobTitle">
                  Job title
                </label>
                <input id="jobTitle" name="jobTitle" required className="input" />
              </div>
            </div>
          ) : (
            <>
              <div>
                <label className="label" htmlFor="mentorId">
                  Assign to mentor
                </label>
                <select id="mentorId" name="mentorId" required className="input">
                  {mentors.length === 0 ? (
                    <option value="">No active mentors available</option>
                  ) : (
                    mentors.map((m) => (
                      <option key={m.id} value={m.id}>
                        {fullName(m)}
                      </option>
                    ))
                  )}
                </select>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label" htmlFor="major">
                    Major
                  </label>
                  <input id="major" name="major" required className="input" />
                </div>
                <div>
                  <label className="label" htmlFor="university">
                    University
                  </label>
                  <input id="university" name="university" required className="input" />
                </div>
              </div>
              <div>
                <label className="label" htmlFor="skills">
                  Skills
                </label>
                <input
                  id="skills"
                  name="skills"
                  className="input"
                  placeholder="Comma-separated, e.g. React, TypeScript, CSS"
                  required
                />
              </div>
              <div>
                <label className="label" htmlFor="learningGoals">
                  Learning goals
                </label>
                <textarea id="learningGoals" name="learningGoals" rows={3} className="input" required />
              </div>
            </>
          )}

          {formError ? (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
              {formError}
            </p>
          ) : null}
          {message ? (
            <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700" role="status">
              {message}
            </p>
          ) : null}
          <div className="flex gap-2">
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? "Creating…" : "Create account"}
            </button>
            <Link href="/admin/users" className="btn-secondary">
              Cancel
            </Link>
          </div>
        </form>
      ) : null}
    </div>
  );
}

export default function CreateUserPage() {
  return (
    <Suspense fallback={<LoadingState label="Loading form…" />}>
      <CreateUserForm />
    </Suspense>
  );
}
