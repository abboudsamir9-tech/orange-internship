import { adaptInternProfile, splitNameSafe } from "@/lib/api/adapters";
import { apiRequest } from "@/lib/api/client";
import { getProgram, listPrograms } from "@/lib/api/programs";
import { listFinalSummaries, listWeeklyReports } from "@/lib/api/reports";
import { listRoadmaps } from "@/lib/api/roadmaps";
import { listSubmissions } from "@/lib/api/submissions";
import { listAssignments, listTasks } from "@/lib/api/tasks";
import type {
  FinalSummary,
  InternshipProgram,
  InternProfile,
  Roadmap,
  Submission,
  Task,
  TaskAssignment,
  User,
  WeeklyReport,
} from "@/types";

export type InternContext = {
  profile: InternProfile;
  program: InternshipProgram | null;
  mentor: User | null;
  assignments: TaskAssignment[];
  myTasks: { assignment: TaskAssignment; task: Task }[];
  approvedReports: WeeklyReport[];
  finalSummary: FinalSummary | undefined;
  roadmap: Roadmap | undefined;
  mySubmissions: Submission[];
};

export async function getInternContext(userId: string): Promise<InternContext | null> {
  const me = await apiRequest<Record<string, unknown>>("/api/auth/me/");
  if (!me.intern_profile) return null;
  if (String(me.id) !== String(userId)) return null;

  const profile = adaptInternProfile(me.intern_profile);
  const mentorName =
    typeof (me.intern_profile as { mentor_name?: string }).mentor_name === "string"
      ? (me.intern_profile as { mentor_name: string }).mentor_name
      : "";
  const mentorId = profile.mentorId;
  const nameParts = splitNameSafe(mentorName);
  const mentor: User | null = mentorId
    ? {
        id: mentorId,
        email: "",
        username: "",
        firstName: nameParts.firstName || "Mentor",
        lastName: nameParts.lastName,
        role: "MENTOR",
        isActive: true,
      }
    : null;

  const [assignments, tasks, programs, weeklyReports, finalSummaries, roadmaps, submissions] =
    await Promise.all([
      listAssignments(),
      listTasks(),
      listPrograms(),
      listWeeklyReports(),
      listFinalSummaries(),
      listRoadmaps(),
      listSubmissions(),
    ]);

  let program: InternshipProgram | null =
    (profile.programId && programs.find((p) => p.id === profile.programId)) || null;
  if (profile.programId && !program) {
    try {
      program = await getProgram(profile.programId);
    } catch {
      program = null;
    }
  }

  const myAssignments = assignments.filter((ta) => ta.internProfileId === profile.id);
  const myTasks = myAssignments
    .map((ta) => {
      const task = tasks.find((t) => t.id === ta.taskId);
      return task ? { assignment: ta, task } : null;
    })
    .filter((row): row is { assignment: TaskAssignment; task: Task } => row !== null);

  const approvedReports = weeklyReports.filter(
    (r) => r.internProfileId === profile.id && r.status === "APPROVED",
  );
  const finalSummary = finalSummaries.find(
    (fs) => fs.internProfileId === profile.id && fs.status === "APPROVED",
  );
  const roadmap = roadmaps.find(
    (r) => r.programId === profile.programId && r.status === "PUBLISHED",
  );
  const mySubmissions = submissions.filter((s) =>
    myAssignments.some((ta) => ta.id === s.taskAssignmentId),
  );

  return {
    profile,
    program,
    mentor,
    assignments: myAssignments,
    myTasks,
    approvedReports,
    finalSummary,
    roadmap,
    mySubmissions,
  };
}
