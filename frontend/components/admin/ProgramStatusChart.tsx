"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ChartPlaceholder, BarRow } from "@/components/ui/ChartPlaceholder";
import {
  defaultTimeRange,
  TimeRangeFilter,
  type TimeRangeValue,
} from "@/components/filters/TimeRangeFilter";
import { ErrorState, LoadingState } from "@/components/ui/AsyncState";
import { listPrograms } from "@/lib/api/programs";
import { getErrorMessage } from "@/lib/api/errors";
import { countByStatus, filterProgramsByRange } from "@/lib/programTime";
import type { InternshipProgram, ProgramStatus } from "@/types";

const STATUSES: ProgramStatus[] = [
  "DRAFT",
  "ACTIVE",
  "COMPLETED",
  "ARCHIVED",
  "CANCELLED",
];

export function ProgramStatusChart() {
  const [range, setRange] = useState<TimeRangeValue>(defaultTimeRange);
  const [programs, setPrograms] = useState<InternshipProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setPrograms(await listPrograms());
    } catch (err) {
      setError(getErrorMessage(err, "Unable to load programs."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(
    () => filterProgramsByRange(programs, range.startDate, range.endDate),
    [programs, range.endDate, range.startDate],
  );

  const programByStatus = useMemo(
    () => countByStatus(filtered, STATUSES),
    [filtered],
  );

  const activeCount = filtered.filter((p) => p.status === "ACTIVE").length;
  const max = Math.max(1, ...programByStatus.map((row) => row.count));

  if (loading) return <LoadingState label="Loading program status…" />;
  if (error) return <ErrorState message={error} onRetry={() => void load()} />;

  return (
    <ChartPlaceholder
      title="Programs by status"
      metric="Count of programs per status for the selected period"
      chartType="Bar chart"
      summary={`${filtered.length} programs in range · ${activeCount} active.`}
    >
      <div className="mb-4">
        <TimeRangeFilter value={range} onChange={setRange} idPrefix="program-status" />
      </div>
      {programByStatus.map((row) => (
        <BarRow key={row.status} label={row.status} value={row.count} max={max} />
      ))}
    </ChartPlaceholder>
  );
}
