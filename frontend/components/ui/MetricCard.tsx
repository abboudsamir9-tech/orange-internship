export function MetricCard({
  label,
  value,
  hint,
  accent = false,
}: {
  label: string;
  value: string | number;
  hint?: string;
  accent?: boolean;
}) {
  return (
    <article
      className={`card p-5 ${accent ? "border-brand/30 bg-gradient-to-br from-white to-brand-soft" : ""}`}
    >
      <p className="text-sm font-medium text-ink-muted">{label}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight text-ink">{value}</p>
      {hint ? <p className="mt-2 text-xs text-ink-muted">{hint}</p> : null}
    </article>
  );
}
