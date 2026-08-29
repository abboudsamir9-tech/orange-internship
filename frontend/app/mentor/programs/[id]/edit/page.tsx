"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { InternChipPicker } from "@/components/interns/InternChips";
import { ErrorState, LoadingState } from "@/components/ui/AsyncState";
import { PageHeader } from "@/components/ui/PageHeader";
import { useAuth } from "@/context/AuthContext";
import { listInternProfiles } from "@/lib/api/accounts";
import { getErrorMessage } from "@/lib/api/errors";
import { getProgram, updateProgram } from "@/lib/api/programs";
import { fullName } from "@/lib/names";
import type { InternshipProgram } from "@/types";

function splitList(value: FormDataEntryValue | null) {
  return String(value || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function EditProgramPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [program, setProgram] = useState<InternshipProgram | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [selectedInternIds, setSelectedInternIds] = useState<string[]>([]);
  const [internOptions, setInternOptions] = useState<{ id: string; name: string }[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [prog, interns] = await Promise.all([getProgram(params.id), listInternProfiles()]);
      setProgram(prog);
      const options = interns
        .filter((ip) => ip.mentorId === user?.id || ip.programId === params.id)
        .map((ip) => ({ id: ip.id, name: fullName(ip.user) || ip.id }));
      setInternOptions(options);
      setSelectedInternIds(interns.filter((ip) => ip.programId === params.id).map((ip) => ip.id));
    } catch (err) {
      setError(getErrorMessage(err, "Could not load program."));
    } finally {
      setLoading(false);
    }
  }, [params.id, user?.id]);

  useEffect(() => {
    void load();
  }, [load]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!program) return;
    setSaving(true);
    setMessage("");
    const form = new FormData(e.currentTarget);
    try {
      await updateProgram(program.id, {
        title: String(form.get("title") || ""),
        description: String(form.get("description") || ""),
        role: String(form.get("role") || ""),
        department: String(form.get("department") || ""),
        startDate: String(form.get("startDate") || ""),
        endDate: String(form.get("endDate") || ""),
        durationWeeks: Number(form.get("durationWeeks") || 0),
        weeklyHours: Number(form.get("weeklyHours") || 0),
        maxInterns: Number(form.get("maxInterns") || 0),
        status: String(form.get("status") || program.status),
        skillsToDevelop: splitList(form.get("skillsToDevelop")),
        skillsNeeded: splitList(form.get("skillsNeeded")),
        goals: String(form.get("goals") || ""),
        expectedOutcome: String(form.get("expectedOutcome") || ""),
        finalProject: String(form.get("finalProject") || ""),
        additionalInstructions: String(form.get("additionalInstructions") || ""),
        assignedInternIds: selectedInternIds,
      });
      setMessage(`Saved with ${selectedInternIds.length} assigned intern(s).`);
      router.push(`/mentor/programs/${program.id}`);
    } catch (err) {
      setMessage(getErrorMessage(err, "Could not save program."));
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <LoadingState label="Loading program…" />;
  if (error) return <ErrorState message={error} onRetry={() => void load()} />;
  if (!program) return <p>Program not found.</p>;

  return (
    <div>
      <PageHeader
        title="Edit program"
        description="Update every program field you entered at creation. Mentor assignment remains automatic."
        actions={
          <Link href={`/mentor/programs/${program.id}`} className="btn-secondary">
            Cancel
          </Link>
        }
      />
      <form onSubmit={onSubmit} className="card mx-auto max-w-3xl space-y-4 p-6">
        <div>
          <label className="label" htmlFor="title">Program title</label>
          <input id="title" name="title" className="input" defaultValue={program.title} required />
        </div>
        <div>
          <label className="label" htmlFor="description">Description</label>
          <textarea id="description" name="description" className="input" rows={3} defaultValue={program.description} required />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="role">Role</label>
            <input id="role" name="role" className="input" defaultValue={program.role} required />
          </div>
          <div>
            <label className="label" htmlFor="department">Department</label>
            <input id="department" name="department" className="input" defaultValue={program.department} required />
          </div>
          <div>
            <label className="label" htmlFor="startDate">Start date</label>
            <input id="startDate" name="startDate" type="date" className="input" defaultValue={program.startDate} required />
          </div>
          <div>
            <label className="label" htmlFor="endDate">End date</label>
            <input id="endDate" name="endDate" type="date" className="input" defaultValue={program.endDate} required />
          </div>
          <div>
            <label className="label" htmlFor="durationWeeks">Duration in weeks</label>
            <input id="durationWeeks" name="durationWeeks" type="number" min={1} className="input" defaultValue={program.durationWeeks} required />
          </div>
          <div>
            <label className="label" htmlFor="weeklyHours">Weekly hours</label>
            <input id="weeklyHours" name="weeklyHours" type="number" min={1} className="input" defaultValue={program.weeklyHours} required />
          </div>
          <div>
            <label className="label" htmlFor="maxInterns">Maximum number of interns</label>
            <input id="maxInterns" name="maxInterns" type="number" min={1} className="input" defaultValue={program.maxInterns} required />
          </div>
          <div>
            <label className="label" htmlFor="status">Status</label>
            <select id="status" name="status" className="input" defaultValue={program.status}>
              <option value="DRAFT">Draft</option>
              <option value="ACTIVE">Active</option>
              <option value="COMPLETED">Completed</option>
              <option value="ARCHIVED">Archived</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>
        <div>
          <label className="label" htmlFor="skillsToDevelop">Skills to develop</label>
          <input id="skillsToDevelop" name="skillsToDevelop" className="input" defaultValue={program.skillsToDevelop.join(", ")} />
        </div>
        <div>
          <label className="label" htmlFor="skillsNeeded">Skills needed</label>
          <input id="skillsNeeded" name="skillsNeeded" className="input" defaultValue={program.skillsNeeded.join(", ")} />
        </div>
        <div>
          <label className="label" htmlFor="goals">Goals</label>
          <textarea id="goals" name="goals" className="input" rows={2} defaultValue={program.goals} />
        </div>
        <div>
          <label className="label" htmlFor="expectedOutcome">Expected outcome</label>
          <textarea id="expectedOutcome" name="expectedOutcome" className="input" rows={2} defaultValue={program.expectedOutcome} />
        </div>
        <div>
          <label className="label" htmlFor="finalProject">Final project</label>
          <input id="finalProject" name="finalProject" className="input" defaultValue={program.finalProject ?? ""} />
        </div>
        <div>
          <label className="label" htmlFor="additionalInstructions">Additional instructions</label>
          <textarea
            id="additionalInstructions"
            name="additionalInstructions"
            className="input"
            rows={2}
            defaultValue={program.additionalInstructions ?? ""}
          />
        </div>

        <div className="border-t border-line pt-4">
          <InternChipPicker
            options={internOptions}
            selectedIds={selectedInternIds}
            onChange={setSelectedInternIds}
            label="Assigned interns"
          />
        </div>

        <p className="text-sm text-ink-muted">
          Reference materials are managed on the dedicated materials page for this program.
        </p>
        {message ? (
          <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700" role="status">
            {message}
          </p>
        ) : null}
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </button>
      </form>
    </div>
  );
}
