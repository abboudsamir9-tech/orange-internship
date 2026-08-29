"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ErrorState, LoadingState } from "@/components/ui/AsyncState";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { useAuth } from "@/context/AuthContext";
import { getErrorMessage } from "@/lib/api/errors";
import { getInternContext, type InternContext } from "@/lib/intern";
import { formatDate } from "@/lib/labels";

export default function InternReportsPage() {
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
      setError(getErrorMessage(err, "Unable to load reports."));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <LoadingState label="Loading reports…" />;
  if (error) return <ErrorState message={error} onRetry={() => void load()} />;

  const reports = ctx?.approvedReports ?? [];

  return (
    <div>
      <PageHeader
        title="Approved weekly reports"
        description="Only mentor-approved weekly reports are visible. Draft reports are hidden."
      />
      {reports.length === 0 ? (
        <EmptyState
          title="No approved reports yet"
          description="When your mentor approves a weekly performance report, it will appear here."
        />
      ) : (
        <ul className="space-y-3">
          {reports.map((report) => (
            <li key={report.id}>
              <Link
                href={`/intern/reports/${report.id}`}
                className="card block p-5 transition hover:border-brand/40"
              >
                <p className="font-semibold text-ink">Week {report.weekNumber}</p>
                <p className="mt-2 text-sm text-ink-muted">
                  {report.content.performanceSummary}
                </p>
                {report.approvedAt ? (
                  <p className="mt-3 text-xs text-ink-muted">
                    Approved {formatDate(report.approvedAt)}
                  </p>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
