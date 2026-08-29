"use client";

export interface InternOption {
  id: string;
  name: string;
}

export function InternChips({
  items,
  onRemove,
  emptyLabel = "No interns selected.",
}: {
  items: InternOption[];
  onRemove?: (id: string) => void;
  emptyLabel?: string;
}) {
  if (!items.length) {
    return <p className="text-sm text-ink-muted">{emptyLabel}</p>;
  }

  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li
          key={item.id}
          className="inline-flex max-w-full items-center gap-2 rounded-xl border border-brand/30 bg-brand-soft px-3 py-1.5 text-sm font-medium text-ink"
        >
          <span className="truncate">{item.name}</span>
          {onRemove ? (
            <button
              type="button"
              className="rounded-md px-1 text-brand-dark hover:bg-white/80"
              onClick={() => onRemove(item.id)}
              aria-label={`Remove ${item.name}`}
            >
              ×
            </button>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

/** Checkbox-style multi-select with selected interns shown as removable chips. */
export function InternChipPicker({
  options,
  selectedIds,
  onChange,
  label = "Assigned interns",
}: {
  options: InternOption[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  label?: string;
}) {
  const selected = options.filter((o) => selectedIds.includes(o.id));

  function toggle(id: string) {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((value) => value !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  }

  return (
    <div className="space-y-3">
      <p className="label">{label}</p>
      <InternChips
        items={selected}
        onRemove={(id) => onChange(selectedIds.filter((value) => value !== id))}
        emptyLabel="Select one or more interns below."
      />
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((option) => {
          const checked = selectedIds.includes(option.id);
          return (
            <label
              key={option.id}
              className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm transition ${
                checked
                  ? "border-brand bg-brand-soft"
                  : "border-line bg-white hover:border-brand/40"
              }`}
            >
              <input
                type="checkbox"
                className="accent-[var(--brand)]"
                checked={checked}
                onChange={() => toggle(option.id)}
              />
              <span className="truncate">{option.name}</span>
            </label>
          );
        })}
      </div>
      {!options.length ? (
        <p className="text-sm text-ink-muted">No interns available for this mentor.</p>
      ) : null}
    </div>
  );
}
