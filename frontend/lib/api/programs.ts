import {
  adaptProgram,
  adaptReferenceMaterial,
  programToApiPayload,
} from "@/lib/api/adapters";
import { apiDownload, apiRequest, unwrapList } from "@/lib/api/client";
import type { InternshipProgram, ReferenceMaterial } from "@/types";

export async function listPrograms(): Promise<InternshipProgram[]> {
  const data = await apiRequest("/api/programs/");
  return unwrapList(data).map(adaptProgram);
}

export async function getProgram(id: string): Promise<InternshipProgram> {
  const data = await apiRequest(`/api/programs/${id}/`);
  return adaptProgram(data);
}

export async function createProgram(payload: Record<string, unknown>) {
  const data = await apiRequest("/api/programs/", {
    method: "POST",
    body: programToApiPayload(payload),
  });
  return adaptProgram(data);
}

export async function updateProgram(id: string, payload: Record<string, unknown>) {
  const data = await apiRequest(`/api/programs/${id}/`, {
    method: "PATCH",
    body: programToApiPayload(payload),
  });
  return adaptProgram(data);
}

export async function listProgramMaterials(programId?: string): Promise<ReferenceMaterial[]> {
  const data = await apiRequest("/api/programs/materials/items/");
  const items = unwrapList(data).map(adaptReferenceMaterial);
  return programId ? items.filter((item) => item.programId === programId) : items;
}

export async function createProgramMaterial(payload: {
  program: number;
  title: string;
  external_url?: string;
  file?: File | null;
}) {
  const form = new FormData();
  form.append("program", String(payload.program));
  form.append("title", payload.title);
  if (payload.external_url) form.append("external_url", payload.external_url);
  if (payload.file) form.append("file", payload.file);
  const data = await apiRequest("/api/programs/materials/items/", {
    method: "POST",
    formData: form,
  });
  return adaptReferenceMaterial(data);
}

export async function deleteProgramMaterial(id: string) {
  await apiRequest(`/api/programs/materials/items/${id}/`, { method: "DELETE" });
}

export async function fetchProgramAnalytics(params: {
  start_date?: string;
  end_date?: string;
  status?: string;
  department?: string;
}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) query.set(key, value);
  });
  return apiRequest(`/api/programs/analytics/?${query.toString()}`);
}

export async function exportAnalyticsExcel(params: {
  start_date?: string;
  end_date?: string;
}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) query.set(key, value);
  });
  await apiDownload(
    `/api/programs/analytics/export/excel/?${query.toString()}`,
    "programs-overview.xlsx",
  );
}

export async function exportAnalyticsPdf(params: {
  start_date?: string;
  end_date?: string;
}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) query.set(key, value);
  });
  await apiDownload(
    `/api/programs/analytics/export/pdf/?${query.toString()}`,
    "programs-overview.pdf",
  );
}
