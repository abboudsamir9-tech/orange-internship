import {
  aiStatusLabel,
  programStatusLabel,
  roadmapStatusLabel,
  taskStatusLabel,
} from "@/lib/labels";
import type {
  AiContentStatus,
  ProgramStatus,
  RoadmapStatus,
  TaskStatus,
} from "@/types";

type BadgeKind = "program" | "task" | "roadmap" | "ai" | "neutral";

const styles: Record<string, string> = {
  DRAFT: "bg-slate-100 text-slate-700",
  ACTIVE: "bg-emerald-50 text-emerald-700",
  COMPLETED: "bg-blue-50 text-blue-700",
  ARCHIVED: "bg-slate-100 text-slate-600",
  CANCELLED: "bg-red-50 text-red-700",
  PUBLISHED: "bg-emerald-50 text-emerald-700",
  TO_DO: "bg-slate-100 text-slate-700",
  IN_PROGRESS: "bg-orange-50 text-orange-800",
  SUBMITTED: "bg-amber-50 text-amber-800",
  NEEDS_REVISION: "bg-red-50 text-red-700",
  APPROVED: "bg-emerald-50 text-emerald-700",
  REJECTED: "bg-red-50 text-red-700",
};

function labelFor(
  kind: BadgeKind,
  value: string,
) {
  if (kind === "program") return programStatusLabel[value as ProgramStatus];
  if (kind === "task") return taskStatusLabel[value as TaskStatus];
  if (kind === "roadmap") return roadmapStatusLabel[value as RoadmapStatus];
  if (kind === "ai") return aiStatusLabel[value as AiContentStatus];
  return value;
}

export function StatusBadge({
  kind,
  value,
}: {
  kind: BadgeKind;
  value: string;
}) {
  const label = labelFor(kind, value);
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${styles[value] ?? "bg-slate-100 text-slate-700"}`}
    >
      <span className="sr-only">{kind} status: </span>
      {label}
    </span>
  );
}
