export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="card flex flex-col items-start gap-3 p-8 text-left">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-light text-brand-dark">
        <span aria-hidden>•</span>
      </div>
      <h2 className="text-lg font-semibold text-ink">{title}</h2>
      <p className="max-w-lg text-sm text-ink-muted">{description}</p>
      {action}
    </div>
  );
}
