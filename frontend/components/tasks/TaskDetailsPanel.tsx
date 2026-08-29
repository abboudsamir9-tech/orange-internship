import type { ReactNode } from "react";
import { InternChips } from "@/components/interns/InternChips";
import { ResourceList } from "@/components/resources/ResourceList";
import { formatDate } from "@/lib/labels";
import type { LearningResource, Task, TaskRequirementType } from "@/types";

function requirementLabel(value: TaskRequirementType) {
  return value === "REQUIRED" ? "Required" : "Optional";
}

export function TaskDetailsPanel({
  task,
  dueDate,
  assignedInternNames,
  resources,
  showResources = true,
  resourcesEditable = false,
  resourcesSlot,
}: {
  task: Task;
  dueDate?: string;
  /** Mentor view only */
  assignedInternNames?: string[];
  resources?: LearningResource[];
  showResources?: boolean;
  resourcesEditable?: boolean;
  /** When editing, pass ResourceManager (or similar) instead of read-only list */
  resourcesSlot?: ReactNode;
}) {
  const list = resources ?? task.resources ?? [];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="section-title">Description</h2>
        <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink">
          {task.description}
        </p>
      </div>

      <dl className="grid gap-3 sm:grid-cols-2 text-sm">
        <div>
          <dt className="font-semibold text-ink-muted">Difficulty</dt>
          <dd>{task.difficulty || "—"}</dd>
        </div>
        <div>
          <dt className="font-semibold text-ink-muted">Estimated time</dt>
          <dd>{task.estimatedTime || "—"}</dd>
        </div>
        <div>
          <dt className="font-semibold text-ink-muted">Due date</dt>
          <dd>{formatDate(dueDate || task.defaultDeadline)}</dd>
        </div>
        <div>
          <dt className="font-semibold text-ink-muted">Status</dt>
          <dd>{requirementLabel(task.requirementType)}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="font-semibold text-ink-muted">Deliverables</dt>
          <dd className="mt-1">{task.deliverable || "—"}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="font-semibold text-ink-muted">Success criteria</dt>
          <dd className="mt-1">{task.successCriteria || "—"}</dd>
        </div>
        {assignedInternNames ? (
          <div className="sm:col-span-2">
            <dt className="font-semibold text-ink-muted">Assigned interns</dt>
            <dd className="mt-2">
              <InternChips
                items={assignedInternNames.map((name, index) => ({
                  id: `${name}-${index}`,
                  name,
                }))}
                emptyLabel="No interns assigned"
              />
            </dd>
          </div>
        ) : null}
      </dl>

      {showResources ? (
        <div className="border-t border-line pt-5">
          {resourcesSlot ? (
            resourcesSlot
          ) : (
            <>
              <h2 className="section-title">Task Resources</h2>
              <p className="mt-1 mb-3 text-sm text-ink-muted">
                Learning materials for this task. Open or download items below.
              </p>
              <ResourceList
                resources={list}
                emptyLabel={
                  resourcesEditable
                    ? "No resources yet."
                    : "No resources attached to this task."
                }
              />
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}
