"use client";

import { useCallback, useEffect, useState } from "react";
import {
  defaultTimeRange,
  TimeRangeFilter,
  type TimeRangeValue,
} from "@/components/filters/TimeRangeFilter";
import { ChartPlaceholder, BarRow } from "@/components/ui/ChartPlaceholder";
import { DataTable } from "@/components/ui/DataTable";
import { ErrorState, LoadingState } from "@/components/ui/AsyncState";
import { MetricCard } from "@/components/ui/MetricCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  exportAnalyticsExcel,
  exportAnalyticsPdf,
  fetchProgramAnalytics,
} from "@/lib/api/programs";
import { getErrorMessage } from "@/lib/api/errors";
import { formatDate } from "@/lib/labels";
import type { ProgramStatus } from "@/types";

interface ProgramRow {
  id: string;
  title: string;
  department: string;
  mentorName: string;
  role: string;
  startDate: string;
  endDate: string;
  status: ProgramStatus;
  internCount: number;
}

interface AnalyticsMetrics {
  activePrograms: number;
  totalPrograms: number;
  totalInterns: number;
  completedPrograms: number;
  mentorsInvolved: number;
  avgInterns: number;
  byDepartment: { department: string; count: number }[];
  byStatus: { status: string; count: number }[];
}

const EMPTY_METRICS: AnalyticsMetrics = {
  activePrograms: 0,
  totalPrograms: 0,
  totalInterns: 0,
  completedPrograms: 0,
  mentorsInvolved: 0,
  avgInterns: 0,
  byDepartment: [],
  byStatus: [],
};

export default function AdminAnalyticsPage() {
  const [range, setRange] = useState<TimeRangeValue>(defaultTimeRange);
  const [rows, setRows] = useState<ProgramRow[]>([]);
  const [metrics, setMetrics] = useState<AnalyticsMetrics>(EMPTY_METRICS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = (await fetchProgramAnalytics({
        start_date: range.startDate,
        end_date: range.endDate,
      })) as {
        metrics?: Record<string, number>;
        programs_by_department?: { department: string; count: number }[];
        programs_by_status?: { status: string; count: number }[];
        programs?: Array<{
          id: number | string;
          title: string;
          department: string;
          mentor: string;
          role: string;
          start_date: string;
          end_date: string;
          status: ProgramStatus;
          number_of_interns: number;
        }>;
      };

      const m = data.metrics || {};
      setMetrics({
        activePrograms: Number(m.active_programs ?? 0),
        totalPrograms: Number(m.total_programs ?? 0),
        totalInterns: Number(m.total_interns ?? 0),
        completedPrograms: Number(m.completed_programs ?? 0),
        mentorsInvolved: Number(m.mentors_involved ?? 0),
        avgInterns: Number(m.average_interns_per_program ?? 0),
        byDepartment: data.programs_by_department || [],
        byStatus: data.programs_by_status || [],
      });
      setRows(
        (data.programs || []).map((program) => ({
          id: String(program.id),
          title: program.title,
          department: program.department,
          mentorName: program.mentor,
          role: program.role,
          startDate: program.start_date,
          endDate: program.end_date,
          status: program.status,
          internCount: program.number_of_interns,
        })),
      );
    } catch (err) {
      setError(getErrorMessage(err, "Unable to load analytics."));
    } finally {
      setLoading(false);
    }
  }, [range.endDate, range.startDate]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleExcelExport() {
    setExportError(null);
    try {
      await exportAnalyticsExcel({
        start_date: range.startDate,
        end_date: range.endDate,
      });
    } catch (err) {
      setExportError(getErrorMessage(err, "Unable to export Excel."));
    }
  }

  async function handlePdfExport() {
    setExportError(null);
    try {
      await exportAnalyticsPdf({
        start_date: range.startDate,
        end_date: range.endDate,
      });
    } catch (err) {
      setExportError(getErrorMessage(err, "Unable to export PDF."));
    }
  }

  const exportActions = (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        className="btn-secondary inline-flex items-center gap-2"
        onClick={() => void handleExcelExport()}
      >
        <span aria-hidden>📊</span>
        Export to Excel
      </button>
      <button
        type="button"
        className="btn-secondary inline-flex items-center gap-2"
        onClick={() => void handlePdfExport()}
      >
        <span aria-hidden>📄</span>
        Export to PDF
      </button>
    </div>
  );

  const deptMax = Math.max(1, ...metrics.byDepartment.map((d) => d.count), 0);
  const statusMax = Math.max(1, ...metrics.byStatus.map((s) => s.count), 0);

  return (
    <div>
      <PageHeader
        title="Programs analytics"
        description="Management overview of internship programs for a selected time range."
        actions={exportActions}
      />

      <div className="mb-6">
        <TimeRangeFilter value={range} onChange={setRange} idPrefix="analytics" />
      </div>

      {exportError ? (
        <p className="mb-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {exportError}
        </p>
      ) : null}

      {loading ? <LoadingState label="Loading analytics…" /> : null}
      {error ? <ErrorState message={error} onRetry={() => void load()} /> : null}

      {!loading && !error ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <MetricCard label="Active programs" value={metrics.activePrograms} accent />
            <MetricCard label="Total programs" value={metrics.totalPrograms} />
            <MetricCard label="Total interns" value={metrics.totalInterns} />
            <MetricCard label="Completed programs" value={metrics.completedPrograms} />
            <MetricCard label="Mentors involved" value={metrics.mentorsInvolved} />
            <MetricCard label="Avg interns per program" value={metrics.avgInterns} />
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <ChartPlaceholder
              title="Programs by department"
              metric="Programs in selected range"
              chartType="Bar chart"
            >
              {metrics.byDepartment.length === 0 ? (
                <p className="text-sm text-ink-muted">No programs in this range.</p>
              ) : (
                metrics.byDepartment.map((row) => (
                  <BarRow
                    key={row.department}
                    label={row.department}
                    value={row.count}
                    max={deptMax}
                  />
                ))
              )}
            </ChartPlaceholder>

            <ChartPlaceholder
              title="Programs by status"
              metric="Programs in selected range"
              chartType="Bar chart"
            >
              {metrics.byStatus.map((row) => (
                <BarRow key={row.status} label={row.status} value={row.count} max={statusMax} />
              ))}
            </ChartPlaceholder>
          </div>

          <section className="mt-6">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="section-title">Program details</h2>
                <p className="mt-1 text-sm text-ink-muted">
                  Internship programs that overlap the selected time range.
                </p>
              </div>
              {exportActions}
            </div>
            {rows.length === 0 ? (
              <div className="card p-6 text-sm text-ink-muted">
                No internship programs found for the selected time range.
              </div>
            ) : (
              <DataTable
                rows={rows}
                mobileTitle={(row) => row.title}
                columns={[
                  { key: "title", header: "Program title", render: (row) => row.title },
                  { key: "department", header: "Department", render: (row) => row.department },
                  { key: "mentor", header: "Mentor", render: (row) => row.mentorName },
                  { key: "role", header: "Role", render: (row) => row.role },
                  {
                    key: "start",
                    header: "Start date",
                    render: (row) => formatDate(row.startDate),
                  },
                  {
                    key: "end",
                    header: "End date",
                    render: (row) => formatDate(row.endDate),
                  },
                  {
                    key: "status",
                    header: "Status",
                    render: (row) => <StatusBadge kind="program" value={row.status} />,
                  },
                  {
                    key: "interns",
                    header: "Number of interns",
                    render: (row) => row.internCount,
                  },
                ]}
              />
            )}
          </section>
        </>
      ) : null}
    </div>
  );
}
