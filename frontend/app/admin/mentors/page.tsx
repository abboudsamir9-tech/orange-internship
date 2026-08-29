"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ErrorState, LoadingState } from "@/components/ui/AsyncState";
import { DataTable } from "@/components/ui/DataTable";
import { PageHeader } from "@/components/ui/PageHeader";
import { listInternProfiles, listMentors } from "@/lib/api/accounts";
import { listPrograms } from "@/lib/api/programs";
import { getErrorMessage } from "@/lib/api/errors";
import { fullName } from "@/lib/names";
import type { InternProfile, InternshipProgram, User } from "@/types";

export default function AdminMentorsPage() {
  const [mentors, setMentors] = useState<User[]>([]);
  const [programs, setPrograms] = useState<InternshipProgram[]>([]);
  const [internProfiles, setInternProfiles] = useState<InternProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [mentorRows, programRows, internRows] = await Promise.all([
        listMentors(),
        listPrograms(),
        listInternProfiles(),
      ]);
      setMentors(mentorRows.map((row) => row.user));
      setPrograms(programRows);
      setInternProfiles(internRows);
    } catch (err) {
      setError(getErrorMessage(err, "Unable to load mentors."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const rows = useMemo(() => mentors, [mentors]);

  return (
    <div>
      <PageHeader
        title="Mentors"
        description="View all mentors and how interns and programs are grouped under them."
        actions={
          <Link href="/admin/users/new?role=MENTOR" className="btn-primary">
            Create Mentor
          </Link>
        }
      />

      {loading ? <LoadingState label="Loading mentors…" /> : null}
      {error ? <ErrorState message={error} onRetry={() => void load()} /> : null}

      {!loading && !error ? (
        <DataTable
          rows={rows}
          mobileTitle={(row) => fullName(row)}
          columns={[
            {
              key: "name",
              header: "Mentor",
              render: (row) => (
                <div>
                  <p className="font-medium">{fullName(row)}</p>
                  <p className="text-xs text-ink-muted">{row.email}</p>
                </div>
              ),
            },
            {
              key: "programs",
              header: "Programs",
              render: (row) => programs.filter((p) => p.mentorId === row.id).length,
            },
            {
              key: "interns",
              header: "Assigned interns",
              render: (row) =>
                internProfiles.filter((ip) => ip.mentorId === row.id).length,
            },
            {
              key: "status",
              header: "Account",
              render: (row) => (row.isActive ? "Active" : "Deactivated"),
            },
          ]}
        />
      ) : null}
    </div>
  );
}
