"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ChartPlaceholder, BarRow } from "@/components/ui/ChartPlaceholder";
import { ErrorState, LoadingState } from "@/components/ui/AsyncState";
import { MetricCard } from "@/components/ui/MetricCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProgramSummary } from "@/components/programs/ProgramSummary";
import { useAuth } from "@/context/AuthContext";
import { listInternProfiles } from "@/lib/api/accounts";
import { getErrorMessage } from "@/lib/api/errors";
import { listPrograms } from "@/lib/api/programs";
import { listSubmissions } from "@/lib/api/submissions";
import { listAssignments, listTasks } from "@/lib/api/tasks";
import { listWeeklyReports } from "@/lib/api/reports";
import { fullName } from "@/lib/names";
import type {
  InternshipProgram,
  InternProfile,
  Submission,
  Task,
  TaskAssignment,
  User,
  WeeklyReport,
} from "@/types";

type InternRow = InternProfile & { user: User };

export default function MentorDashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [programs, setPrograms] = useState<InternshipProgram[]>([]);
  const [interns, setInterns] = useState<InternRow[]>([]);
  const [assignments, setAssignments] = useState<TaskAssignment[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [reports, setReports] = useState<WeeklyReport[]>([]);
  const [subs, setSubs] = useState<Submission[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [prog, ips, assigns, taskList, weekly, submissions] = await Promise.all([
        listPrograms(),
        listInternProfiles(),
        listAssignments(),
        listTasks(),
        listWeeklyReports(),
        listSubmissions(),
      ]);
      const mentorId = user?.id;
      const myPrograms = prog.filter((p) => p.mentorId === mentorId);
      const myInterns = ips.filter((ip) => ip.mentorId === mentorId);
      const internIds = new Set(myInterns.map((ip) => ip.id));
      const myAssignments = assigns.filter((ta) => internIds.has(ta.internProfileId));
      setPrograms(myPrograms);
      setInterns(myInterns);
      setAssignments(myAssignments);
      setTasks(taskList);
      setReports(weekly.filter((r) => internIds.has(r.internProfileId)));
      setSubs(
        submissions.filter((s) =>
          myAssignments.some((ta) => ta.id === s.taskAssignmentId),
        ),
      );
    } catch (err) {
      setError(getErrorMessage(err, "Could not load dashboard."));
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <LoadingState label="Loading dashboard…" />;
  if (error) return <ErrorState message={error} onRetry={() => void load()} />;

  const waitingReview = assignments.filter((ta) => ta.status === "SUBMITTED");
  const waitingReports = reports.filter((r) => r.status === "DRAFT");
  const recentSubs = subs
    .slice()
    .sort((a, b) => (b.submittedAt || "").localeCompare(a.submittedAt || ""))
    .slice(0, 4);

  return (
    <div>
      <PageHeader
        title="Mentor Dashboard"
        description="Manage programs, review submissions, and approve AI-generated reports for your assigned interns."
        actions={
          <>
            <Link href="/mentor/programs/new" className="btn-primary">
              Create program
            </Link>
            <Link href="/mentor/reviews" className="btn-secondary">
              Review queue
            </Link>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Assigned interns" value={interns.length} accent />
        <MetricCard label="Programs managed" value={programs.length} />
        <MetricCard label="Tasks waiting for review" value={waitingReview.length} />
        <MetricCard
          label="Weekly reports waiting for approval"
          value={waitingReports.length}
        />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        <ChartPlaceholder
          title="Task completion progress"
          metric="Assignments by status"
          chartType="Bar chart"
        >
          {(["TO_DO", "IN_PROGRESS", "SUBMITTED", "NEEDS_REVISION", "COMPLETED"] as const).map(
            (status) => (
              <BarRow
                key={status}
                label={status}
                value={assignments.filter((ta) => ta.status === status).length}
                max={assignments.length || 1}
              />
            ),
          )}
        </ChartPlaceholder>

        <ChartPlaceholder
          title="Submission status"
          metric="Review pipeline snapshot"
          chartType="Status bars"
          summary={`${recentSubs.length} recent submissions in queue view.`}
        >
          <BarRow label="Awaiting review" value={waitingReview.length} max={5} />
          <BarRow
            label="Needs revision"
            value={assignments.filter((ta) => ta.status === "NEEDS_REVISION").length}
            max={5}
            color="bg-warning"
          />
          <BarRow
            label="Completed"
            value={assignments.filter((ta) => ta.status === "COMPLETED").length}
            max={5}
            color="bg-success"
          />
        </ChartPlaceholder>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        <section className="card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="section-title">Recent submissions</h2>
            <Link href="/mentor/reviews" className="text-sm font-semibold text-brand">
              Open reviews
            </Link>
          </div>
          <ul className="space-y-3">
            {recentSubs.map((sub) => {
              const assignment = assignments.find((ta) => ta.id === sub.taskAssignmentId);
              const task = tasks.find((t) => t.id === assignment?.taskId);
              const intern = interns.find((ip) => ip.id === assignment?.internProfileId);
              return (
                <li key={sub.id} className="rounded-xl border border-line p-3">
                  <p className="font-medium text-ink">{task?.title}</p>
                  <p className="text-sm text-ink-muted">
                    {intern ? fullName(intern.user) : "Intern"} · v{sub.submissionVersion}
                  </p>
                </li>
              );
            })}
            {recentSubs.length === 0 ? (
              <li className="text-sm text-ink-muted">No recent submissions.</li>
            ) : null}
          </ul>
        </section>

        <section className="card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="section-title">Programs managed</h2>
            <Link href="/mentor/programs" className="text-sm font-semibold text-brand">
              View programs
            </Link>
          </div>
          <div className="space-y-3">
            {programs.map((program) => (
              <Link
                key={program.id}
                href={`/mentor/programs/${program.id}`}
                className="block rounded-xl border border-line p-4 transition hover:border-brand/40 hover:bg-brand-soft/50"
              >
                <ProgramSummary program={program} compact />
              </Link>
            ))}
            {programs.length === 0 ? (
              <p className="text-sm text-ink-muted">No programs yet.</p>
            ) : null}
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link href="/mentor/roadmaps" className="btn-secondary">
              Manage roadmaps
            </Link>
            <Link href="/mentor/weekly-reports" className="btn-secondary">
              Weekly reports
            </Link>
            <Link href="/mentor/final-summaries" className="btn-secondary">
              Final summaries
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
