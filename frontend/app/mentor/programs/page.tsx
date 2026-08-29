"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ProgramSummary } from "@/components/programs/ProgramSummary";
import { ErrorState, LoadingState } from "@/components/ui/AsyncState";
import { PageHeader } from "@/components/ui/PageHeader";
import { useAuth } from "@/context/AuthContext";
import { getErrorMessage } from "@/lib/api/errors";
import { listPrograms } from "@/lib/api/programs";
import type { InternshipProgram } from "@/types";

export default function MentorProgramsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [programs, setPrograms] = useState<InternshipProgram[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const all = await listPrograms();
      setPrograms(all.filter((p) => p.mentorId === user?.id));
    } catch (err) {
      setError(getErrorMessage(err, "Could not load programs."));
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <LoadingState label="Loading programs…" />;
  if (error) return <ErrorState message={error} onRetry={() => void load()} />;

  return (
    <div>
      <PageHeader
        title="Programs"
        description="Create and manage internship programs you own. Program status changes are manual."
        actions={
          <Link href="/mentor/programs/new" className="btn-primary">
            Create program
          </Link>
        }
      />
      <div className="grid gap-4 lg:grid-cols-2">
        {programs.map((program) => (
          <article key={program.id} className="card p-5">
            <ProgramSummary program={program} compact />
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href={`/mentor/programs/${program.id}`} className="btn-secondary px-3 py-1.5 text-xs">
                View
              </Link>
              <Link href={`/mentor/programs/${program.id}/edit`} className="btn-secondary px-3 py-1.5 text-xs">
                Edit
              </Link>
              <Link href={`/mentor/programs/${program.id}/materials`} className="btn-secondary px-3 py-1.5 text-xs">
                Materials
              </Link>
            </div>
          </article>
        ))}
        {programs.length === 0 ? (
          <p className="text-sm text-ink-muted">No programs yet. Create your first program.</p>
        ) : null}
      </div>
    </div>
  );
}
