"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { InternChips } from "@/components/interns/InternChips";
import { ProgramSummary } from "@/components/programs/ProgramSummary";
import { ResourceList } from "@/components/resources/ResourceList";
import { ErrorState, LoadingState } from "@/components/ui/AsyncState";
import { PageHeader } from "@/components/ui/PageHeader";
import { listInternProfiles } from "@/lib/api/accounts";
import { getErrorMessage } from "@/lib/api/errors";
import { getProgram, listProgramMaterials } from "@/lib/api/programs";
import { listRoadmaps } from "@/lib/api/roadmaps";
import { fullName } from "@/lib/names";
import type { InternshipProgram, ReferenceMaterial, Roadmap } from "@/types";

export default function MentorProgramDetailPage() {
  const params = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [program, setProgram] = useState<InternshipProgram | null>(null);
  const [materials, setMaterials] = useState<ReferenceMaterial[]>([]);
  const [programRoadmaps, setProgramRoadmaps] = useState<Roadmap[]>([]);
  const [internChips, setInternChips] = useState<{ id: string; name: string }[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [prog, mats, maps, interns] = await Promise.all([
        getProgram(params.id),
        listProgramMaterials(params.id),
        listRoadmaps(),
        listInternProfiles(),
      ]);
      setProgram(prog);
      setMaterials(mats);
      setProgramRoadmaps(maps.filter((r) => r.programId === params.id));
      setInternChips(
        interns
          .filter((ip) => ip.programId === params.id)
          .map((ip) => ({ id: ip.id, name: fullName(ip.user) || ip.id })),
      );
    } catch (err) {
      setError(getErrorMessage(err, "Could not load program."));
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <LoadingState label="Loading program…" />;
  if (error) return <ErrorState message={error} onRetry={() => void load()} />;
  if (!program) return <p className="text-ink-muted">Program not found.</p>;

  return (
    <div>
      <PageHeader
        title={program.title}
        description="Full program overview for mentor management."
        actions={
          <>
            <Link href={`/mentor/programs/${program.id}/edit`} className="btn-primary">
              Edit program
            </Link>
            <Link href={`/mentor/programs/${program.id}/materials`} className="btn-secondary">
              Reference materials
            </Link>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="card p-5 lg:col-span-2">
          <ProgramSummary program={program} />
        </section>

        <section className="space-y-4">
          <div className="card p-5">
            <h2 className="section-title">Assigned interns</h2>
            <div className="mt-3">
              <InternChips
                items={internChips}
                emptyLabel="No interns assigned to this program."
              />
            </div>
          </div>
          <div className="card p-5">
            <h2 className="section-title">Roadmaps</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {programRoadmaps.map((r) => (
                <li key={r.id}>
                  <Link href={`/mentor/roadmaps/${r.id}`} className="font-medium text-brand hover:underline">
                    {r.title}
                  </Link>
                </li>
              ))}
              {programRoadmaps.length === 0 ? (
                <li className="text-ink-muted">No roadmaps yet.</li>
              ) : null}
            </ul>
          </div>
          <div className="card p-5">
            <h2 className="section-title">Reference materials</h2>
            <div className="mt-3">
              <ResourceList
                resources={materials}
                emptyLabel="No reference materials yet."
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
