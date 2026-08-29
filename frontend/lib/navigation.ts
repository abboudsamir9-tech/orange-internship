import type { UserRole } from "@/types";

export interface NavItem {
  href: string;
  label: string;
}

export const navigationByRole: Record<UserRole, NavItem[]> = {
  ADMIN: [
    { href: "/admin/dashboard", label: "Dashboard" },
    { href: "/admin/analytics", label: "Analytics" },
    { href: "/admin/users", label: "Users" },
    { href: "/admin/mentors", label: "Mentors" },
    { href: "/admin/interns", label: "Interns" },
    { href: "/admin/programs", label: "Programs" },
  ],
  MENTOR: [
    { href: "/mentor/dashboard", label: "Dashboard" },
    { href: "/mentor/programs", label: "Programs" },
    { href: "/mentor/roadmaps", label: "Roadmaps" },
    { href: "/mentor/tasks", label: "Tasks" },
    { href: "/mentor/reviews", label: "Reviews" },
    { href: "/mentor/weekly-reports", label: "Weekly Reports" },
    { href: "/mentor/final-summaries", label: "Final Summaries" },
  ],
  INTERN: [
    { href: "/intern/dashboard", label: "Dashboard" },
    { href: "/intern/program", label: "My Program" },
    { href: "/intern/objectives", label: "Weekly Objectives" },
    { href: "/intern/tasks", label: "My Tasks" },
    { href: "/intern/reports", label: "Weekly Reports" },
    { href: "/intern/final-summary", label: "Final Summary" },
  ],
};

export function dashboardPath(role: UserRole) {
  if (role === "ADMIN") return "/admin/dashboard";
  if (role === "MENTOR") return "/mentor/dashboard";
  return "/intern/dashboard";
}
