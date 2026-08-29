"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { InternChipPicker } from "@/components/interns/InternChips";
import { ErrorState, LoadingState } from "@/components/ui/AsyncState";
import { PageHeader } from "@/components/ui/PageHeader";
import { useAuth } from "@/context/AuthContext";
import { listInternProfiles } from "@/lib/api/accounts";
import { getErrorMessage } from "@/lib/api/errors";
import { createProgram } from "@/lib/api/programs";
import { fullName } from "@/lib/names";

function splitList(value: FormDataEntryValue | null) {
  return String(value || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function NewProgramPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedInternIds, setSelectedInternIds] = useState<string[]>([]);
  const [internOptions, setInternOptions] = useState<{ id: string; name: string }[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const interns = await listInternProfiles();
      setInternOptions(
        interns
          .filter((ip) => ip.mentorId === user?.id)
          .map((ip) => ({ id: ip.id, name: fullName(ip.user) || ip.id })),
      );
    } catch (err) {
      setError(getErrorMessage(err, "Could not load interns."));
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    void load();
  }, [load]);

  const pickerOptions = useMemo(() => internOptions, [internOptions]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setSaving(true);
    const form = new FormData(e.currentTarget);
    try {
      const created = await createProgram({
        title: String(form.get("title") || ""),
        description: String(form.get("description") || ""),
        role: String(form.get("role") || ""),
        department: String(form.get("department") || ""),
        startDate: String(form.get("startDate") || ""),
        endDate: String(form.get("endDate") || ""),
        durationWeeks: Number(form.get("durationWeeks") || 0),
        weeklyHours: Number(form.get("weeklyHours") || 0),
        maxInterns: Number(form.get("maxInterns") || 0),
        status: String(form.get("status") || "DRAFT"),
        skillsToDevelop: splitList(form.get("skillsToDevelop")),
        skillsNeeded: splitList(form.get("skillsNeeded")),
        goals: String(form.get("goals") || ""),
        expectedOutcome: String(form.get("expectedOutcome") || ""),
        finalProject: String(form.get("finalProject") || ""),
        additionalInstructions: String(form.get("additionalInstructions") || ""),
        assignedInternIds: selectedInternIds,
      });
      setMessage(`Program created with ${selectedInternIds.length} assigned intern(s).`);
      router.push(`/mentor/programs/${created.id}`);
    } catch (err) {
      setMessage(getErrorMessage(err, "Could not create program."));
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <LoadingState label="Loading form…" />;
  if (error) return <ErrorState message={error} onRetry={() => void load()} />;

  return (
    <div>
      <PageHeader
        title="Create internship program"
        description="Mentor is assigned automatically from the logged-in mentor account."
        actions={<Link href="/mentor/programs" className="btn-secondary">Cancel</Link>}
      />
      <form onSubmit={onSubmit} className="card mx-auto max-w-3xl space-y-4 p-6">
        <div>
          <label className="label" htmlFor="title">Program title</label>
          <input id="title" name="title" required className="input" />
        </div>
        <div>
          <label className="label" htmlFor="description">Description</label>
          <textarea id="description" name="description" required rows={3} className="input" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="role">Role</label>
            <input id="role" name="role" required className="input" placeholder="e.g. Frontend Engineering Intern" />
          </div>
          <div>
            <label className="label" htmlFor="department">Department</label>
            <input id="department" name="department" required className="input" />
          </div>
          <div>
            <label className="label" htmlFor="startDate">Start date</label>
            <input id="startDate" name="startDate" type="date" required className="input" />
          </div>
          <div>
            <label className="label" htmlFor="endDate">End date</label>
            <input id="endDate" name="endDate" type="date" required className="input" />
          </div>
          <div>
            <label className="label" htmlFor="durationWeeks">Duration in weeks</label>
            <input id="durationWeeks" name="durationWeeks" type="number" min={1} required className="input" />
          </div>
          <div>
            <label className="label" htmlFor="weeklyHours">Weekly hours</label>
            <input id="weeklyHours" name="weeklyHours" type="number" min={1} required className="input" />
          </div>
          <div>
            <label className="label" htmlFor="maxInterns">Maximum number of interns</label>
            <input id="maxInterns" name="maxInterns" type="number" min={1} required className="input" />
          </div>
          <div>
            <label className="label" htmlFor="status">Status</label>
            <select id="status" name="status" className="input" defaultValue="DRAFT">
              <option value="DRAFT">Draft</option>
              <option value="ACTIVE">Active</option>
            </select>
          </div>
        </div>
        <div>
          <label className="label" htmlFor="skillsToDevelop">Skills to develop</label>
          <input id="skillsToDevelop" name="skillsToDevelop" className="input" placeholder="Comma-separated" />
        </div>
        <div>
          <label className="label" htmlFor="skillsNeeded">Skills needed</label>
          <input id="skillsNeeded" name="skillsNeeded" className="input" placeholder="Comma-separated" />
        </div>
        <div>
          <label className="label" htmlFor="goals">Goals</label>
          <textarea id="goals" name="goals" rows={2} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="expectedOutcome">Expected outcome</label>
          <textarea id="expectedOutcome" name="expectedOutcome" rows={2} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="finalProject">Final project (optional)</label>
          <input id="finalProject" name="finalProject" className="input" />
        </div>
        <div>
          <label className="label" htmlFor="additionalInstructions">Additional instructions (optional)</label>
          <textarea id="additionalInstructions" name="additionalInstructions" rows={2} className="input" />
        </div>

        <div className="border-t border-line pt-4">
          <InternChipPicker
            options={pickerOptions}
            selectedIds={selectedInternIds}
            onChange={setSelectedInternIds}
            label="Assigned interns"
          />
        </div>

        {message ? (
          <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700" role="status">
            {message}
          </p>
        ) : null}
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? "Saving…" : "Save program"}
        </button>
      </form>
    </div>
  );
}
