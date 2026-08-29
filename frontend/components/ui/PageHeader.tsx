export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-start sm:justify-between">
      <div className="max-w-3xl">
        <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 text-sm leading-relaxed text-ink-muted sm:text-base">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </div>
  );
}
