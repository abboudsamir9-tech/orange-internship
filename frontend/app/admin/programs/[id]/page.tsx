"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ProgramSummary } from "@/components/programs/ProgramSummary";
import { ResourceList } from "@/components/resources/ResourceList";
import { ErrorState, LoadingState } from "@/components/ui/AsyncState";
import { PageHeader } from "@/components/ui/PageHeader";
import { listMentors } from "@/lib/api/accounts";
import { getProgram, listProgramMaterials } from "@/lib/api/programs";
import { getErrorMessage } from "@/lib/api/errors";
import { fullName } from "@/lib/names";
import type { InternshipProgram, ReferenceMaterial } from "@/types";

export default function AdminProgramDetailPage() {
  const params = useParams<{ id: string }>();
  const [program, setProgram] = useState<InternshipProgram | null>(null);
  const [mentorName, setMentorName] = useState<string | undefined>();
  const [materials, setMaterials] = useState<ReferenceMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!params.id) return;
    setLoading(true);
    setError(null);
    try {
      const [programData, materialRows, mentorRows] = await Promise.all([
        getProgram(params.id),
        listProgramMaterials(params.id),
        listMentors(),
      ]);
      setProgram(programData);
      setMaterials(materialRows);
      const mentor = mentorRows.find((row) => row.user.id === programData.mentorId);
      setMentorName(mentor ? fullName(mentor.user) : undefined);
    } catch (err) {
      setError(getErrorMessage(err, "Unable to load program."));
      setProgram(null);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <LoadingState label="Loading program…" />;
  if (error) return <ErrorState message={error} onRetry={() => void load()} />;
  if (!program) {
    return (
      <div className="card p-6">
        <p className="font-semibold">Program not found</p>
        <Link href="/admin/programs" className="btn-secondary mt-4 inline-flex">
          Back
        </Link>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={program.title}
        description="Read-only program content. Admin cannot edit internship program details."
        actions={
          <Link href="/admin/programs" className="btn-secondary">
            Back
          </Link>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="card p-5 lg:col-span-2">
          <ProgramSummary program={program} mentorName={mentorName} />
        </section>

        <section className="card p-5">
          <h2 className="section-title">Reference materials</h2>
          <div className="mt-4">
            <ResourceList
              resources={materials}
              emptyLabel="No reference materials."
            />
          </div>
        </section>
      </div>
    </div>
  );
}
