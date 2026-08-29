export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="card p-6 text-sm text-ink-muted" role="status">
      {label}
    </div>
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="card space-y-3 p-6" role="alert">
      <p className="font-semibold text-ink">Unable to load data</p>
      <p className="text-sm text-ink-muted">{message}</p>
      {onRetry ? (
        <button type="button" className="btn-secondary" onClick={onRetry}>
          Try again
        </button>
      ) : null}
    </div>
  );
}
