"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ChartPlaceholder, BarRow } from "@/components/ui/ChartPlaceholder";
import { ErrorState, LoadingState } from "@/components/ui/AsyncState";
import { MetricCard } from "@/components/ui/MetricCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useAuth } from "@/context/AuthContext";
import { getErrorMessage } from "@/lib/api/errors";
import { getInternContext, type InternContext } from "@/lib/intern";
import { formatDate } from "@/lib/labels";
import { fullName } from "@/lib/names";

function isOverdue(deadline: string, status: string) {
  if (status === "COMPLETED") return false;
  const due = new Date(deadline);
  const today = new Date();
  due.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return due < today;
}

export default function InternDashboardPage() {
  const { user } = useAuth();
  const [ctx, setCtx] = useState<InternContext | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) {
      setCtx(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      setCtx(await getInternContext(user.id));
    } catch (err) {
      setError(getErrorMessage(err, "Unable to load dashboard."));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <LoadingState label="Loading dashboard…" />;
  if (error) return <ErrorState message={error} onRetry={() => void load()} />;

  if (!ctx || !ctx.program || !ctx.mentor) {
    return (
      <div className="card p-6">
        <h1 className="text-xl font-semibold">No program assigned</h1>
        <p className="mt-2 text-sm text-ink-muted">
          Your intern profile is not linked to an active program yet.
        </p>
      </div>
    );
  }

  const { program, mentor, myTasks, assignments, approvedReports } = ctx;
  const completed = assignments.filter((ta) => ta.status === "COMPLETED").length;
  const upcoming = assignments
    .filter((ta) => ta.status !== "COMPLETED")
    .slice()
    .sort((a, b) => a.deadline.localeCompare(b.deadline));
  const overdue = assignments.filter((ta) => isOverdue(ta.deadline, ta.status));
  const recentFeedback = assignments.filter((ta) => ta.mentorFeedback).slice(0, 3);

  return (
    <div>
      <PageHeader
        title="Intern Dashboard"
        description={`Welcome back. You are enrolled in ${program.title} with mentor ${fullName(mentor)}.`}
        actions={
          <Link href="/intern/tasks" className="btn-primary">
            Open my tasks
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard label="Current assigned tasks" value={assignments.length} accent />
        <MetricCard label="Upcoming deadlines" value={upcoming.length} />
        <MetricCard label="Completed tasks" value={completed} />
        <MetricCard label="Recent mentor feedback" value={recentFeedback.length} />
        <MetricCard label="Approved weekly reports" value={approvedReports.length} />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        <ChartPlaceholder
          title="Completed versus remaining tasks"
          metric="Assignment completion split"
          chartType="Comparison bars"
        >
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-white p-4 text-center">
              <p className="text-3xl font-bold text-success">{completed}</p>
              <p className="text-xs text-ink-muted">Completed</p>
            </div>
            <div className="rounded-xl bg-white p-4 text-center">
              <p className="text-3xl font-bold text-brand">{assignments.length - completed}</p>
              <p className="text-xs text-ink-muted">Remaining</p>
            </div>
          </div>
        </ChartPlaceholder>

        <ChartPlaceholder
          title="Weekly learning progress"
          metric="Tasks by week number"
          chartType="Bar chart"
        >
          {[1, 2, 3].map((week) => (
            <BarRow
              key={week}
              label={`Week ${week}`}
              value={myTasks.filter((row) => row.task.weekNumber === week).length}
              max={3}
            />
          ))}
        </ChartPlaceholder>

        <section className="card p-5">
          <h2 className="section-title">Current program</h2>
          <p className="mt-3 font-semibold text-ink">{program.title}</p>
          <p className="mt-1 text-sm text-ink-muted">{program.role}</p>
          <p className="mt-3 text-sm text-ink-muted">Mentor: {fullName(mentor)}</p>
          <div className="mt-3">
            <StatusBadge kind="program" value={program.status} />
          </div>
          <Link href="/intern/program" className="mt-4 inline-flex text-sm font-semibold text-brand">
            View program details
          </Link>
        </section>
      </div>

      <section className="card mt-6 p-5">
        <h2 className="section-title">Tasks requiring attention</h2>
        <p className="mt-1 text-sm text-ink-muted">Overdue tasks for your account only.</p>
        {overdue.length === 0 ? (
          <p className="mt-4 text-sm text-ink-muted">No overdue tasks.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {overdue.map((ta) => {
              const task = myTasks.find((row) => row.assignment.id === ta.id)?.task;
              return (
                <li
                  key={ta.id}
                  className="flex flex-col gap-3 rounded-xl border border-line p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium text-ink">{task?.title ?? "Task"}</p>
                    <p className="mt-1 text-xs text-ink-muted">
                      Due {formatDate(ta.deadline)}
                      {task ? ` · Week ${task.weekNumber}` : ""}
                      {` · ${program.title}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
                      Overdue
                    </span>
                    <Link
                      href={`/intern/tasks/${ta.id}`}
                      className="text-sm font-semibold text-brand"
                    >
                      Open
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
