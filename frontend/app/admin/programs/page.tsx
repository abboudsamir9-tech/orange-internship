"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ErrorState, LoadingState } from "@/components/ui/AsyncState";
import { DataTable } from "@/components/ui/DataTable";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { listMentors } from "@/lib/api/accounts";
import { listPrograms } from "@/lib/api/programs";
import { getErrorMessage } from "@/lib/api/errors";
import { formatDate } from "@/lib/labels";
import { fullName } from "@/lib/names";
import type { InternshipProgram } from "@/types";

export default function AdminProgramsPage() {
  const [programs, setPrograms] = useState<InternshipProgram[]>([]);
  const [mentorNames, setMentorNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [programRows, mentorRows] = await Promise.all([listPrograms(), listMentors()]);
      setPrograms(programRows);
      const names: Record<string, string> = {};
      mentorRows.forEach((row) => {
        names[row.user.id] = fullName(row.user);
      });
      setMentorNames(names);
    } catch (err) {
      setError(getErrorMessage(err, "Unable to load programs."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div>
      <PageHeader
        title="Programs"
        description="Admin can view all internship programs and content in read-only mode. Editing program content is a Mentor-only action."
      />

      {loading ? <LoadingState label="Loading programs…" /> : null}
      {error ? <ErrorState message={error} onRetry={() => void load()} /> : null}

      {!loading && !error ? (
        <DataTable
          rows={programs}
          mobileTitle={(row) => row.title}
          columns={[
            {
              key: "title",
              header: "Program",
              render: (row) => (
                <Link href={`/admin/programs/${row.id}`} className="font-medium text-brand hover:underline">
                  {row.title}
                </Link>
              ),
            },
            {
              key: "mentor",
              header: "Mentor",
              render: (row) => mentorNames[row.mentorId] ?? "—",
            },
            {
              key: "status",
              header: "Status",
              render: (row) => <StatusBadge kind="program" value={row.status} />,
            },
            {
              key: "dates",
              header: "Dates",
              render: (row) =>
                `${formatDate(row.startDate)} – ${formatDate(row.endDate)}`,
            },
            {
              key: "actions",
              header: "Actions",
              render: (row) => (
                <Link href={`/admin/programs/${row.id}`} className="btn-secondary px-3 py-1.5 text-xs">
                  View
                </Link>
              ),
            },
          ]}
        />
      ) : null}
    </div>
  );
}
