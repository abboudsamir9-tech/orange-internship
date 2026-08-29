"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ErrorState, LoadingState } from "@/components/ui/AsyncState";
import { DataTable } from "@/components/ui/DataTable";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useAuth } from "@/context/AuthContext";
import { getErrorMessage } from "@/lib/api/errors";
import { listPrograms } from "@/lib/api/programs";
import { listRoadmaps } from "@/lib/api/roadmaps";
import { roadmapScopeLabel } from "@/lib/labels";
import type { InternshipProgram, Roadmap } from "@/types";

export default function MentorRoadmapsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [programsById, setProgramsById] = useState<Record<string, InternshipProgram>>({});

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [programs, maps] = await Promise.all([listPrograms(), listRoadmaps()]);
      const myProgramIds = new Set(
        programs.filter((p) => p.mentorId === user?.id).map((p) => p.id),
      );
      const byId: Record<string, InternshipProgram> = {};
      programs.forEach((p) => {
        byId[p.id] = p;
      });
      setProgramsById(byId);
      setRoadmaps(maps.filter((r) => myProgramIds.has(r.programId)));
    } catch (err) {
      setError(getErrorMessage(err, "Could not load roadmaps."));
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <LoadingState label="Loading roadmaps…" />;
  if (error) return <ErrorState message={error} onRetry={() => void load()} />;

  return (
    <div>
      <PageHeader
        title="Roadmaps"
        description="Generate AI roadmaps as drafts, edit content, preview, and publish. Publishing creates tasks for all weeks."
        actions={
          <Link href="/mentor/roadmaps/generate" className="btn-primary">
            Generate roadmap
          </Link>
        }
      />
      <DataTable
        rows={roadmaps}
        mobileTitle={(row) => row.title}
        columns={[
          {
            key: "title",
            header: "Roadmap",
            render: (row) => (
              <Link href={`/mentor/roadmaps/${row.id}`} className="font-medium text-brand hover:underline">
                {row.title}
              </Link>
            ),
          },
          {
            key: "program",
            header: "Program",
            render: (row) => programsById[row.programId]?.title ?? "—",
          },
          {
            key: "scope",
            header: "Scope",
            render: (row) => roadmapScopeLabel[row.scope],
          },
          {
            key: "status",
            header: "Status",
            render: (row) => <StatusBadge kind="roadmap" value={row.status} />,
          },
          {
            key: "weeks",
            header: "Weeks",
            render: (row) => row.numberOfWeeks,
          },
        ]}
      />
    </div>
  );
}
