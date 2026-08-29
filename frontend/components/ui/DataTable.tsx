export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  className?: string;
}

export function DataTable<T extends { id: string }>({
  columns,
  rows,
  mobileTitle,
}: {
  columns: Column<T>[];
  rows: T[];
  mobileTitle: (row: T) => string;
}) {
  return (
    <>
      <div className="card hidden overflow-hidden md:block">
        <table className="min-w-full divide-y divide-line text-left text-sm">
          <thead className="bg-surface-muted/80">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 font-semibold text-ink-muted"
                  scope="col"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line bg-white">
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-brand-soft/40">
                {columns.map((col) => (
                  <td key={col.key} className={`px-4 py-3 text-ink ${col.className ?? ""}`}>
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="space-y-3 md:hidden">
        {rows.map((row) => (
          <li key={row.id} className="card p-4">
            <p className="mb-3 font-semibold text-ink">{mobileTitle(row)}</p>
            <dl className="space-y-2">
              {columns.map((col) => (
                <div key={col.key} className="flex items-start justify-between gap-3 text-sm">
                  <dt className="text-ink-muted">{col.header}</dt>
                  <dd className="text-right text-ink">{col.render(row)}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
    </>
  );
}
