"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { RoadmapReadOnlyView } from "@/components/roadmaps/RoadmapWeekView";
import { ErrorState, LoadingState } from "@/components/ui/AsyncState";
import { PageHeader } from "@/components/ui/PageHeader";
import { getErrorMessage } from "@/lib/api/errors";
import { getRoadmap } from "@/lib/api/roadmaps";
import type { Roadmap } from "@/types";

export default function RoadmapPreviewPage() {
  const params = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setRoadmap(await getRoadmap(params.id));
    } catch (err) {
      setError(getErrorMessage(err, "Could not load roadmap preview."));
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <LoadingState label="Loading preview…" />;
  if (error) return <ErrorState message={error} onRetry={() => void load()} />;
  if (!roadmap) return <p>Roadmap not found.</p>;

  return (
    <div>
      <PageHeader
        title="Intern preview"
        description="Preview how assigned interns will see weekly focus, objectives, and tasks."
        actions={
          <Link href={`/mentor/roadmaps/${roadmap.id}`} className="btn-secondary">
            Back to roadmap
          </Link>
        }
      />
      <div className="mx-auto max-w-3xl">
        <RoadmapReadOnlyView roadmap={roadmap} />
      </div>
    </div>
  );
}
