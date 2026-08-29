"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ErrorState, LoadingState } from "@/components/ui/AsyncState";
import { PageHeader } from "@/components/ui/PageHeader";
import { useAuth } from "@/context/AuthContext";
import { listInternProfiles } from "@/lib/api/accounts";
import { getErrorMessage } from "@/lib/api/errors";
import { listPrograms } from "@/lib/api/programs";
import { listAssignments, listTasks } from "@/lib/api/tasks";
import { formatDate, taskStatusLabel } from "@/lib/labels";
import { fullName } from "@/lib/names";
import type { Task, TaskAssignment, TaskStatus } from "@/types";

const columns: TaskStatus[] = [
  "TO_DO",
  "IN_PROGRESS",
  "SUBMITTED",
  "NEEDS_REVISION",
  "COMPLETED",
];

export default function MentorTasksPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assignments, setAssignments] = useState<TaskAssignment[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [internNames, setInternNames] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [programs, ips, assigns, taskList] = await Promise.all([
        listPrograms(),
        listInternProfiles(),
        listAssignments(),
        listTasks(),
      ]);
      const myProgramIds = new Set(
        programs.filter((p) => p.mentorId === user?.id).map((p) => p.id),
      );
      const myInterns = ips.filter((ip) => ip.mentorId === user?.id);
      const internIds = new Set(myInterns.map((ip) => ip.id));
      const names: Record<string, string> = {};
      myInterns.forEach((ip) => {
        names[ip.id] = fullName(ip.user) || ip.id;
      });
      setInternNames(names);
      setAssignments(assigns.filter((ta) => internIds.has(ta.internProfileId)));
      setTasks(taskList.filter((t) => myProgramIds.has(t.programId)));
    } catch (err) {
      setError(getErrorMessage(err, "Could not load tasks."));
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <LoadingState label="Loading tasks…" />;
  if (error) return <ErrorState message={error} onRetry={() => void load()} />;

  return (
    <div>
      <PageHeader
        title="Task board"
        description="Kanban pipeline for intern task assignments. Mentors can create tasks manually and manage deadlines."
        actions={
          <Link href="/mentor/tasks/new" className="btn-primary">
            Create task
          </Link>
        }
      />

      <div className="flex gap-4 overflow-x-auto pb-2">
        {columns.map((status) => {
          const items = assignments.filter((ta) => ta.status === status);
          return (
            <section
              key={status}
              className="min-w-[260px] flex-1 rounded-2xl border border-line bg-white/80 p-3"
              aria-label={taskStatusLabel[status]}
            >
              <header className="mb-3 flex items-center justify-between px-1">
                <h2 className="text-sm font-semibold text-ink">{taskStatusLabel[status]}</h2>
                <span className="rounded-full bg-brand-light px-2 py-0.5 text-xs font-semibold text-brand-dark">
                  {items.length}
                </span>
              </header>
              <ul className="space-y-3">
                {items.map((ta) => {
                  const task = tasks.find((t) => t.id === ta.taskId);
                  return (
                    <li key={ta.id}>
                      <Link
                        href={`/mentor/tasks/${ta.id}`}
                        className="block rounded-xl border border-line bg-white p-3 shadow-soft transition hover:border-brand/40"
                      >
                        <p className="font-semibold text-ink">{task?.title}</p>
                        <p className="mt-1 text-xs text-ink-muted">
                          {internNames[ta.internProfileId] || "Intern"} · Week {task?.weekNumber}
                        </p>
                        <p className="mt-2 text-xs text-ink-muted">Due {formatDate(ta.deadline)}</p>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>

      <section className="card mt-6 p-5">
        <h2 className="section-title">All program tasks</h2>
        <ul className="mt-4 divide-y divide-line">
          {tasks.map((task) => (
            <li key={task.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium text-ink">{task.title}</p>
                <p className="text-sm text-ink-muted">
                  Week {task.weekNumber} · {task.source} · {task.requirementType}
                </p>
              </div>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                {task.difficulty}
              </span>
            </li>
          ))}
          {tasks.length === 0 ? (
            <li className="py-3 text-sm text-ink-muted">No tasks yet.</li>
          ) : null}
        </ul>
      </section>
    </div>
  );
}
