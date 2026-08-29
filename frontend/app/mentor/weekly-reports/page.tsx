"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ErrorState, LoadingState } from "@/components/ui/AsyncState";
import { DataTable } from "@/components/ui/DataTable";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useAuth } from "@/context/AuthContext";
import { listInternProfiles } from "@/lib/api/accounts";
import { getErrorMessage } from "@/lib/api/errors";
import { listWeeklyReports } from "@/lib/api/reports";
import { fullName } from "@/lib/names";
import type { WeeklyReport } from "@/types";

export default function MentorWeeklyReportsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reports, setReports] = useState<WeeklyReport[]>([]);
  const [internNames, setInternNames] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [ips, weekly] = await Promise.all([listInternProfiles(), listWeeklyReports()]);
      const myInterns = ips.filter((ip) => ip.mentorId === user?.id);
      const internIds = new Set(myInterns.map((ip) => ip.id));
      const names: Record<string, string> = {};
      myInterns.forEach((ip) => {
        names[ip.id] = fullName(ip.user) || ip.id;
      });
      setInternNames(names);
      setReports(weekly.filter((r) => internIds.has(r.internProfileId)));
    } catch (err) {
      setError(getErrorMessage(err, "Could not load weekly reports."));
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <LoadingState label="Loading reports…" />;
  if (error) return <ErrorState message={error} onRetry={() => void load()} />;

  return (
    <div>
      <PageHeader
        title="Weekly performance reports"
        description="Generate reports manually after reviewing submissions and scores. Interns see reports only after approval."
        actions={
          <Link href="/mentor/weekly-reports/generate" className="btn-primary">
            Generate report
          </Link>
        }
      />
      <DataTable
        rows={reports}
        mobileTitle={(row) => `Week ${row.weekNumber}`}
        columns={[
          {
            key: "week",
            header: "Week",
            render: (row) => `Week ${row.weekNumber}`,
          },
          {
            key: "intern",
            header: "Intern",
            render: (row) => internNames[row.internProfileId] || "—",
          },
          {
            key: "status",
            header: "Status",
            render: (row) => <StatusBadge kind="ai" value={row.status} />,
          },
          {
            key: "action",
            header: "Action",
            render: (row) => (
              <Link href={`/mentor/weekly-reports/${row.id}`} className="btn-secondary px-3 py-1.5 text-xs">
                Open
              </Link>
            ),
          },
        ]}
      />
    </div>
  );
}
