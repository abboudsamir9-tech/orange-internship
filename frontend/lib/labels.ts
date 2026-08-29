import type {
  AiContentStatus,
  ProgramStatus,
  RoadmapScope,
  RoadmapStatus,
  SkillLevel,
  TaskStatus,
  UserRole,
} from "@/types";

export const roleLabel: Record<UserRole, string> = {
  ADMIN: "Admin",
  MENTOR: "Mentor",
  INTERN: "Intern",
};

export const programStatusLabel: Record<ProgramStatus, string> = {
  DRAFT: "Draft",
  ACTIVE: "Active",
  COMPLETED: "Completed",
  ARCHIVED: "Archived",
  CANCELLED: "Cancelled",
};

export const roadmapStatusLabel: Record<RoadmapStatus, string> = {
  DRAFT: "Draft",
  PUBLISHED: "Published",
  ARCHIVED: "Archived",
};

export const roadmapScopeLabel: Record<RoadmapScope, string> = {
  PROGRAM: "Entire Program",
  GROUP: "Selected Interns",
  INDIVIDUAL: "Individual Intern",
};

export const taskStatusLabel: Record<TaskStatus, string> = {
  TO_DO: "To Do",
  IN_PROGRESS: "In Progress",
  SUBMITTED: "Submitted",
  NEEDS_REVISION: "Needs Revision",
  COMPLETED: "Completed",
};

export const aiStatusLabel: Record<AiContentStatus, string> = {
  DRAFT: "Draft",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

export const skillLevelLabel: Record<SkillLevel, string> = {
  1: "Beginner",
  2: "Basic",
  3: "Intermediate",
  4: "Advanced",
  5: "Expert",
};

export function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(value: string) {
  return new Date(value).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
