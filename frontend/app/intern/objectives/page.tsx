"use client";

import { useCallback, useEffect, useState } from "react";
import { RoadmapReadOnlyView } from "@/components/roadmaps/RoadmapWeekView";
import { ErrorState, LoadingState } from "@/components/ui/AsyncState";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { useAuth } from "@/context/AuthContext";
import { getErrorMessage } from "@/lib/api/errors";
import { getInternContext, type InternContext } from "@/lib/intern";

export default function InternObjectivesPage() {
  const { user } = useAuth();
  const [ctx, setCtx] = useState<InternContext | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) {
      setCtx(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      setCtx(await getInternContext(user.id));
    } catch (err) {
      setError(getErrorMessage(err, "Unable to load objectives."));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <LoadingState label="Loading objectives…" />;
  if (error) return <ErrorState message={error} onRetry={() => void load()} />;

  const roadmap = ctx?.roadmap;

  return (
    <div>
      <PageHeader
        title="Weekly learning objectives"
        description="Read-only view of your published roadmap. Draft roadmaps and mentor editing controls are not shown."
      />
      {!roadmap ? (
        <EmptyState
          title="No published objectives yet"
          description="Your mentor will publish a roadmap before weekly objectives appear here."
        />
      ) : (
        <RoadmapReadOnlyView roadmap={roadmap} />
      )}
    </div>
  );
}
