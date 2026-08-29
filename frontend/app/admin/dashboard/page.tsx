"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ProgramStatusChart } from "@/components/admin/ProgramStatusChart";
import { ErrorState, LoadingState } from "@/components/ui/AsyncState";
import { MetricCard } from "@/components/ui/MetricCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { listInternProfiles, listMentors, listUsers } from "@/lib/api/accounts";
import { listFinalSummaries } from "@/lib/api/reports";
import { listPrograms } from "@/lib/api/programs";
import { getErrorMessage } from "@/lib/api/errors";
import { fullName } from "@/lib/names";
import type { FinalSummary, InternProfile, InternshipProgram, User } from "@/types";

export default function AdminDashboardPage() {
  const [mentors, setMentors] = useState<User[]>([]);
  const [interns, setInterns] = useState<User[]>([]);
  const [programs, setPrograms] = useState<InternshipProgram[]>([]);
  const [internProfiles, setInternProfiles] = useState<InternProfile[]>([]);
  const [finalSummaries, setFinalSummaries] = useState<FinalSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [mentorRows, userRows, programRows, profileRows, summaryRows] = await Promise.all([
        listMentors(),
        listUsers(),
        listPrograms(),
        listInternProfiles(),
        listFinalSummaries(),
      ]);
      setMentors(mentorRows.map((row) => row.user));
      setInterns(userRows.filter((u) => u.role === "INTERN"));
      setPrograms(programRows);
      setInternProfiles(profileRows);
      setFinalSummaries(summaryRows);
    } catch (err) {
      setError(getErrorMessage(err, "Unable to load dashboard."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const activePrograms = programs.filter((p) => p.status === "ACTIVE").length;
  const usersById = new Map(
    [...mentors, ...interns].map((u) => [u.id, u] as const),
  );

  return (
    <div>
      <PageHeader
        title="Admin Dashboard"
        description="System oversight across mentors, interns, programs, and final summaries. Admin cannot edit program content or approve mentor workflows."
        actions={
          <>
            <Link href="/admin/analytics" className="btn-secondary">
              Programs analytics
            </Link>
            <Link href="/admin/users" className="btn-primary">
              Manage users
            </Link>
          </>
        }
      />

      {loading ? <LoadingState label="Loading dashboard…" /> : null}
      {error ? <ErrorState message={error} onRetry={() => void load()} /> : null}

      {!loading && !error ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Total mentors" value={mentors.length} accent />
            <MetricCard label="Total interns" value={interns.length} />
            <MetricCard label="Active programs" value={activePrograms} />
            <MetricCard label="Final summary activity" value={finalSummaries.length} />
          </div>

          <div className="mt-6 grid gap-4 xl:grid-cols-3">
            <div className="xl:col-span-1">
              <ProgramStatusChart />
            </div>

            <section className="card p-5 xl:col-span-1">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="section-title">Mentors overview</h2>
                <Link href="/admin/mentors" className="text-sm font-semibold text-brand">
                  View all
                </Link>
              </div>
              <ul className="space-y-3">
                {mentors.map((mentor) => (
                  <li key={mentor.id} className="rounded-xl border border-line p-3">
                    <p className="font-semibold text-ink">{fullName(mentor)}</p>
                    <p className="text-sm text-ink-muted">
                      {programs.filter((p) => p.mentorId === mentor.id).length} programs ·{" "}
                      {internProfiles.filter((ip) => ip.mentorId === mentor.id).length} interns
                    </p>
                  </li>
                ))}
              </ul>
            </section>

            <section className="card p-5 xl:col-span-1">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="section-title">Interns by mentor</h2>
                <Link href="/admin/interns" className="text-sm font-semibold text-brand">
                  View all
                </Link>
              </div>
              <ul className="space-y-4">
                {mentors.map((mentor) => {
                  const assigned = internProfiles.filter((ip) => ip.mentorId === mentor.id);
                  return (
                    <li key={mentor.id}>
                      <p className="mb-2 text-sm font-semibold text-ink">{fullName(mentor)}</p>
                      <div className="space-y-2">
                        {assigned.map((ip) => {
                          const intern = usersById.get(ip.userId);
                          const program = programs.find((p) => p.id === ip.programId);
                          return (
                            <div
                              key={ip.id}
                              className="flex items-center justify-between rounded-lg bg-surface-muted px-3 py-2 text-sm"
                            >
                              <span>{intern ? fullName(intern) : ip.userId}</span>
                              {program ? <StatusBadge kind="program" value={program.status} /> : null}
                            </div>
                          );
                        })}
                        {assigned.length === 0 ? (
                          <p className="text-xs text-ink-muted">No interns assigned</p>
                        ) : null}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          </div>
        </>
      ) : null}
    </div>
  );
}
