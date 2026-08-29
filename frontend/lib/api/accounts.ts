import {
  adaptInternProfile,
  adaptUser,
  fullNameFromUser,
} from "@/lib/api/adapters";
import { apiRequest, unwrapList } from "@/lib/api/client";
import type { InternProfile, User } from "@/types";

export async function listUsers(): Promise<User[]> {
  const data = await apiRequest("/api/accounts/users/");
  return unwrapList(data).map(adaptUser);
}

export async function patchUser(id: string, body: { is_active: boolean }) {
  const data = await apiRequest(`/api/accounts/users/${id}/`, {
    method: "PATCH",
    body,
  });
  return adaptUser(data);
}

export async function deleteUser(id: string) {
  await apiRequest(`/api/accounts/users/${id}/`, { method: "DELETE" });
}

export async function listMentors() {
  const data = await apiRequest("/api/accounts/mentors/");
  return unwrapList(data).map((row: any) => ({
    profileId: String(row.id),
    user: adaptUser(row.user),
    department: row.department as string,
    jobTitle: row.job_title as string,
  }));
}

export type InternProfileWithUser = InternProfile & { user: User };

export async function listInternProfiles(): Promise<InternProfileWithUser[]> {
  const data = await apiRequest("/api/accounts/interns/");
  return unwrapList(data).map((raw: any) => ({
    ...adaptInternProfile(raw),
    user: adaptUser(raw.user),
  }));
}

export async function createMentor(payload: {
  full_name: string;
  email: string;
  username: string;
  password: string;
  phone_number?: string;
  department: string;
  job_title: string;
}) {
  const data = await apiRequest("/api/accounts/mentors/create/", {
    method: "POST",
    body: payload,
  });
  return adaptUser(data);
}

export async function createIntern(payload: {
  full_name: string;
  email: string;
  username: string;
  password: string;
  phone_number?: string;
  mentor_id: number;
  program_id?: number | null;
  major?: string;
  university?: string;
  learning_goals?: string;
  skills: { skill_name: string; skill_level: number }[];
}) {
  const data = await apiRequest("/api/accounts/interns/create/", {
    method: "POST",
    body: payload,
  });
  return adaptUser(data);
}

export { fullNameFromUser };
