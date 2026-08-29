"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ErrorState, LoadingState } from "@/components/ui/AsyncState";
import { DataTable } from "@/components/ui/DataTable";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { listInternProfiles, listMentors, listUsers } from "@/lib/api/accounts";
import { listPrograms } from "@/lib/api/programs";
import { getErrorMessage } from "@/lib/api/errors";
import { fullName } from "@/lib/names";
import type { InternshipProgram, InternProfile, User } from "@/types";

type InternRow = {
  id: string;
  intern: User;
  mentor: User;
  program: InternshipProgram | null;
};

export default function AdminInternsPage() {
  const [profiles, setProfiles] = useState<InternProfile[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [mentors, setMentors] = useState<User[]>([]);
  const [programs, setPrograms] = useState<InternshipProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [internRows, userRows, mentorRows, programRows] = await Promise.all([
        listInternProfiles(),
        listUsers(),
        listMentors(),
        listPrograms(),
      ]);
      setProfiles(internRows);
      setUsers(userRows);
      setMentors(mentorRows.map((row) => row.user));
      setPrograms(programRows);
    } catch (err) {
      setError(getErrorMessage(err, "Unable to load interns."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const rows: InternRow[] = useMemo(() => {
    const byId = new Map(users.map((u) => [u.id, u]));
    const programById = new Map(programs.map((p) => [p.id, p]));
    return profiles
      .map((ip) => {
        const intern = byId.get(ip.userId);
        const mentor = byId.get(ip.mentorId);
        if (!intern || !mentor) return null;
        return {
          id: ip.id,
          intern,
          mentor,
          program: ip.programId ? programById.get(ip.programId) ?? null : null,
        };
      })
      .filter((row): row is InternRow => row !== null);
  }, [profiles, programs, users]);

  return (
    <div>
      <PageHeader
        title="Interns"
        description="Interns grouped under each mentor. Admin can view assignments and account status."
        actions={
          <Link href="/admin/users/new?role=INTERN" className="btn-primary">
            Create Intern
          </Link>
        }
      />

      {loading ? <LoadingState label="Loading interns…" /> : null}
      {error ? <ErrorState message={error} onRetry={() => void load()} /> : null}

      {!loading && !error ? (
        <>
          <div className="mb-6 grid gap-4 lg:grid-cols-2">
            {mentors.map((mentor) => {
              const assigned = rows.filter((r) => r.mentor.id === mentor.id);
              return (
                <section key={mentor.id} className="card p-5">
                  <h2 className="section-title">{fullName(mentor)}</h2>
                  <p className="mt-1 text-sm text-ink-muted">
                    {assigned.length} intern{assigned.length === 1 ? "" : "s"}
                  </p>
                  <ul className="mt-4 space-y-2">
                    {assigned.map((row) => (
                      <li
                        key={row.id}
                        className="flex items-center justify-between rounded-xl bg-surface-muted px-3 py-2 text-sm"
                      >
                        <span className="font-medium text-ink">{fullName(row.intern)}</span>
                        {row.program ? (
                          <StatusBadge kind="program" value={row.program.status} />
                        ) : (
                          <span className="text-xs text-ink-muted">No program</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>

          <DataTable
            rows={rows}
            mobileTitle={(row) => fullName(row.intern)}
            columns={[
              {
                key: "intern",
                header: "Intern",
                render: (row) => fullName(row.intern),
              },
              {
                key: "mentor",
                header: "Mentor",
                render: (row) => fullName(row.mentor),
              },
              {
                key: "program",
                header: "Program",
                render: (row) => row.program?.title ?? "—",
              },
              {
                key: "account",
                header: "Account",
                render: (row) => (row.intern.isActive ? "Active" : "Deactivated"),
              },
            ]}
          />
        </>
      ) : null}
    </div>
  );
}
