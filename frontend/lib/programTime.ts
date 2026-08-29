import type { InternshipProgram, ProgramStatus } from "@/types";

/** Program overlaps [startDate, endDate] if its dates intersect the range. */
export function programOverlapsRange(
  program: InternshipProgram,
  startDate: string,
  endDate: string,
) {
  if (!startDate || !endDate) return false;
  return program.startDate <= endDate && program.endDate >= startDate;
}

export function filterProgramsByRange(
  programs: InternshipProgram[],
  startDate: string,
  endDate: string,
) {
  return programs.filter((p) => programOverlapsRange(p, startDate, endDate));
}

export function countByStatus(
  programs: InternshipProgram[],
  statuses: ProgramStatus[] = ["DRAFT", "ACTIVE", "COMPLETED", "ARCHIVED", "CANCELLED"],
) {
  return statuses.map((status) => ({
    status,
    count: programs.filter((p) => p.status === status).length,
  }));
}
