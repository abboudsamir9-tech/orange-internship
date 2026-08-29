"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ErrorState, LoadingState } from "@/components/ui/AsyncState";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { DataTable } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { deleteUser, listUsers, patchUser } from "@/lib/api/accounts";
import { getErrorMessage } from "@/lib/api/errors";
import { roleLabel } from "@/lib/labels";
import { fullName } from "@/lib/names";
import type { User } from "@/types";

type PendingAction =
  | { type: "deactivate" | "delete"; user: User }
  | null;

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [pending, setPending] = useState<PendingAction>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const rows = useMemo(() => users, [users]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setUsers(await listUsers());
    } catch (err) {
      setError(getErrorMessage(err, "Unable to load users."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function confirmAction() {
    if (!pending) return;
    setActionError(null);
    try {
      if (pending.type === "delete") {
        await deleteUser(pending.user.id);
        setUsers((prev) => prev.filter((u) => u.id !== pending.user.id));
      } else {
        const updated = await patchUser(pending.user.id, { is_active: false });
        setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
      }
      setPending(null);
    } catch (err) {
      setActionError(getErrorMessage(err, "Unable to update user."));
    }
  }

  async function reactivate(user: User) {
    setActionError(null);
    try {
      const updated = await patchUser(user.id, { is_active: true });
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    } catch (err) {
      setActionError(getErrorMessage(err, "Unable to reactivate user."));
    }
  }

  return (
    <div>
      <PageHeader
        title="User management"
        description="Create Mentor and Intern accounts. Deactivate or delete Mentor and Intern accounts using confirmation dialogs."
        actions={
          <Link href="/admin/users/new" className="btn-primary">
            Create account
          </Link>
        }
      />

      {loading ? <LoadingState label="Loading users…" /> : null}
      {error ? <ErrorState message={error} onRetry={() => void load()} /> : null}
      {actionError ? (
        <p className="mb-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {actionError}
        </p>
      ) : null}

      {!loading && !error && rows.length === 0 ? (
        <EmptyState title="No users" description="Create a Mentor or Intern account to get started." />
      ) : null}

      {!loading && !error && rows.length > 0 ? (
        <DataTable
          rows={rows}
          mobileTitle={(row) => fullName(row)}
          columns={[
            {
              key: "name",
              header: "Name",
              render: (row) => (
                <div>
                  <p className="font-medium">{fullName(row)}</p>
                  <p className="text-xs text-ink-muted">{row.email}</p>
                </div>
              ),
            },
            {
              key: "username",
              header: "Username",
              render: (row) => row.username,
            },
            {
              key: "role",
              header: "Role",
              render: (row) => roleLabel[row.role],
            },
            {
              key: "status",
              header: "Account",
              render: (row) => (
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                    row.isActive
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {row.isActive ? "Active" : "Deactivated"}
                </span>
              ),
            },
            {
              key: "actions",
              header: "Actions",
              className: "min-w-[220px]",
              render: (row) =>
                row.role === "ADMIN" ? (
                  <span className="text-xs text-ink-muted">Protected</span>
                ) : (
                  <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
                    {row.isActive ? (
                      <button
                        type="button"
                        className="btn-secondary whitespace-nowrap px-3 py-1.5 text-xs"
                        onClick={() => setPending({ type: "deactivate", user: row })}
                      >
                        Deactivate
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn-secondary whitespace-nowrap px-3 py-1.5 text-xs"
                        onClick={() => void reactivate(row)}
                      >
                        {row.role === "INTERN" ? "Reactivate" : "Activate"}
                      </button>
                    )}
                    <button
                      type="button"
                      className="btn-danger whitespace-nowrap px-3 py-1.5 text-xs"
                      onClick={() => setPending({ type: "delete", user: row })}
                    >
                      Delete
                    </button>
                  </div>
                ),
            },
          ]}
        />
      ) : null}

      <ConfirmDialog
        open={pending?.type === "deactivate"}
        title="Deactivate account?"
        description={
          pending
            ? `Deactivate ${fullName(pending.user)} (${roleLabel[pending.user.role]})? They will no longer be able to sign in.`
            : ""
        }
        confirmLabel="Deactivate"
        danger
        onCancel={() => setPending(null)}
        onConfirm={() => void confirmAction()}
      />
      <ConfirmDialog
        open={pending?.type === "delete"}
        title="Delete account?"
        description={
          pending
            ? `Permanently delete ${fullName(pending.user)}? This cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
        danger
        onCancel={() => setPending(null)}
        onConfirm={() => void confirmAction()}
      />
    </div>
  );
}
