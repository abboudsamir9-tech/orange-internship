import { adaptSubmission } from "@/lib/api/adapters";
import { apiRequest, unwrapList } from "@/lib/api/client";
import type { Submission } from "@/types";

export async function listSubmissions(assignmentId?: string): Promise<Submission[]> {
  const data = await apiRequest("/api/submissions/");
  const items = unwrapList(data).map(adaptSubmission);
  return assignmentId
    ? items.filter((item) => item.taskAssignmentId === assignmentId)
    : items;
}

export async function createSubmission(payload: {
  task_assignment: number;
  written_response?: string;
  external_url?: string;
  intern_notes?: string;
  files?: File[];
}) {
  const form = new FormData();
  form.append("task_assignment", String(payload.task_assignment));
  if (payload.written_response) form.append("written_response", payload.written_response);
  if (payload.external_url) form.append("external_url", payload.external_url);
  if (payload.intern_notes) form.append("intern_notes", payload.intern_notes);
  (payload.files || []).forEach((file) => form.append("uploaded_files", file));
  const data = await apiRequest("/api/submissions/", {
    method: "POST",
    formData: form,
  });
  return adaptSubmission(data);
}
