"use client";

import { useCallback, useEffect, useState } from "react";
import { ProgramSummary } from "@/components/programs/ProgramSummary";
import { ErrorState, LoadingState } from "@/components/ui/AsyncState";
import { PageHeader } from "@/components/ui/PageHeader";
import { useAuth } from "@/context/AuthContext";
import { getErrorMessage } from "@/lib/api/errors";
import { getInternContext, type InternContext } from "@/lib/intern";
import { fullName } from "@/lib/names";

export default function InternProgramPage() {
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
      setError(getErrorMessage(err, "Unable to load program."));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <LoadingState label="Loading program…" />;
  if (error) return <ErrorState message={error} onRetry={() => void load()} />;
  if (!ctx?.program || !ctx.mentor) return <p>No program assigned.</p>;

  return (
    <div>
      <PageHeader
        title="My program"
        description="You belong to one internship program and one mentor during the MVP."
      />
      <section className="card p-5">
        <ProgramSummary program={ctx.program} mentorName={fullName(ctx.mentor)} />
      </section>
    </div>
  );
}
