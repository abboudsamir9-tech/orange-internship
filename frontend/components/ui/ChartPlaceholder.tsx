export function ChartPlaceholder({
  title,
  metric,
  chartType,
  summary,
  children,
}: {
  title: string;
  metric: string;
  chartType: string;
  summary?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="card flex h-full flex-col p-5" aria-label={`${title} chart`}>
      <div className="mb-4">
        <h2 className="section-title">{title}</h2>
        <p className="mt-1 text-sm text-ink-muted">
          Metric: {metric} · Chart type: {chartType}
        </p>
        {summary ? (
          <p className="mt-2 text-sm text-ink">{summary}</p>
        ) : null}
      </div>
      <div className="flex min-h-[180px] flex-1 flex-col justify-end gap-3 rounded-xl bg-surface-muted/80 p-4">
        {children}
      </div>
    </section>
  );
}

export function BarRow({
  label,
  value,
  max,
  color = "bg-brand",
}: {
  label: string;
  value: number;
  max: number;
  color?: string;
}) {
  const width = max === 0 ? 0 : Math.round((value / max) * 100);
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="font-medium text-ink">{label}</span>
        <span className="text-ink-muted">{value}</span>
      </div>
      <div
        className="h-2.5 overflow-hidden rounded-full bg-white"
        role="img"
        aria-label={`${label}: ${value}`}
      >
        <div className={`h-full rounded-full ${color}`} style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}
