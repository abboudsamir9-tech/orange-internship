"use client";

export type TimePreset = "THIS_YEAR" | "LAST_YEAR" | "CUSTOM";

export interface TimeRangeValue {
  preset: TimePreset;
  startDate: string;
  endDate: string;
}

export function yearRange(year: number): { startDate: string; endDate: string } {
  return {
    startDate: `${year}-01-01`,
    endDate: `${year}-12-31`,
  };
}

export function defaultTimeRange(now = new Date()): TimeRangeValue {
  const year = now.getFullYear();
  return { preset: "THIS_YEAR", ...yearRange(year) };
}

export function TimeRangeFilter({
  value,
  onChange,
  idPrefix = "time",
}: {
  value: TimeRangeValue;
  onChange: (next: TimeRangeValue) => void;
  idPrefix?: string;
}) {
  const currentYear = new Date().getFullYear();

  function setPreset(preset: TimePreset) {
    if (preset === "THIS_YEAR") {
      onChange({ preset, ...yearRange(currentYear) });
      return;
    }
    if (preset === "LAST_YEAR") {
      onChange({ preset, ...yearRange(currentYear - 1) });
      return;
    }
    onChange({
      preset: "CUSTOM",
      startDate: value.startDate,
      endDate: value.endDate,
    });
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-line bg-surface-muted/60 p-3 sm:flex-row sm:flex-wrap sm:items-end">
      <div className="min-w-[10rem] flex-1">
        <label className="label" htmlFor={`${idPrefix}-preset`}>
          Time period
        </label>
        <select
          id={`${idPrefix}-preset`}
          className="input"
          value={value.preset}
          onChange={(e) => setPreset(e.target.value as TimePreset)}
        >
          <option value="THIS_YEAR">This Year</option>
          <option value="LAST_YEAR">Last Year</option>
          <option value="CUSTOM">Custom Range</option>
        </select>
      </div>
      {value.preset === "CUSTOM" ? (
        <>
          <div className="min-w-[9rem] flex-1">
            <label className="label" htmlFor={`${idPrefix}-start`}>
              Start date
            </label>
            <input
              id={`${idPrefix}-start`}
              type="date"
              className="input"
              value={value.startDate}
              onChange={(e) =>
                onChange({ ...value, preset: "CUSTOM", startDate: e.target.value })
              }
            />
          </div>
          <div className="min-w-[9rem] flex-1">
            <label className="label" htmlFor={`${idPrefix}-end`}>
              End date
            </label>
            <input
              id={`${idPrefix}-end`}
              type="date"
              className="input"
              value={value.endDate}
              onChange={(e) =>
                onChange({ ...value, preset: "CUSTOM", endDate: e.target.value })
              }
            />
          </div>
        </>
      ) : (
        <p className="pb-2 text-sm text-ink-muted">
          Showing {value.startDate} → {value.endDate}
        </p>
      )}
    </div>
  );
}
