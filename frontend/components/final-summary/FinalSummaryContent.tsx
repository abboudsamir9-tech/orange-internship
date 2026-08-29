import type { FinalSummary } from "@/types";

type Content = FinalSummary["content"];
type WeekEntry = Content["weeksAndTasks"][number];

function emptyWeek(): WeekEntry {
  return { weekNumber: 1, weeklyFocus: "", tasks: [] };
}

export function FinalSummaryContent({
  content,
  editable = false,
  onChange,
  mentorName = "",
}: {
  content: Content;
  editable?: boolean;
  onChange?: (next: Content) => void;
  mentorName?: string;
}) {
  function update<K extends keyof Content>(key: K, value: Content[K]) {
    onChange?.({ ...content, [key]: value });
  }

  function updateWeek(index: number, next: WeekEntry) {
    const weeks = [...(content.weeksAndTasks || [])];
    weeks[index] = next;
    update("weeksAndTasks", weeks);
  }

  const weeks = content.weeksAndTasks || [];

  const signatureBlock = (
    <div className="mt-8 border-t border-line pt-6">
      <h2 className="font-semibold text-ink">Signatures</h2>
      <div className="mt-4 grid gap-6 sm:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
            Mentor Name
          </p>
          <p className="mt-3 border-b border-ink/40 pb-1 text-sm text-ink min-h-[1.75rem]">
            {mentorName || "\u00A0"}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
            Mentor Signature
          </p>
          <p className="mt-3 border-b border-ink/40 pb-1 text-sm text-ink min-h-[1.75rem]">
            {"\u00A0"}
          </p>
        </div>
      </div>
    </div>
  );

  const weeksReadOnly = (
    <div>
      <h2 className="font-semibold text-ink">Weeks and Tasks Breakdown</h2>
      {weeks.length === 0 ? (
        <p className="mt-1 text-ink-muted">No week or task details available.</p>
      ) : (
        <div className="mt-3 space-y-4">
          {weeks.map((week) => (
            <div key={week.weekNumber} className="border-l-2 border-brand/40 pl-3">
              <p className="font-medium text-ink">
                Week {week.weekNumber}
                {week.weeklyFocus ? `: ${week.weeklyFocus}` : ""}
              </p>
              {week.tasks.length === 0 ? (
                <p className="mt-1 text-ink-muted">No tasks recorded for this week.</p>
              ) : (
                <ul className="mt-1 list-disc pl-5 text-ink-muted">
                  {week.tasks.map((task) => (
                    <li key={`${week.weekNumber}-${task.title}`}>
                      {task.title}
                      {task.status ? ` — ${task.status}` : ""}
                      {task.isCompleted ? " (completed)" : ""}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  if (!editable) {
    return (
      <div className="space-y-4 text-sm">
        {content.introduction ? (
          <div>
            <h2 className="font-semibold text-ink">Introduction</h2>
            <p className="mt-1 text-ink-muted whitespace-pre-wrap">{content.introduction}</p>
          </div>
        ) : null}
        {content.trainingSummary ? (
          <div>
            <h2 className="font-semibold text-ink">Training Summary</h2>
            <p className="mt-1 text-ink-muted whitespace-pre-wrap">{content.trainingSummary}</p>
          </div>
        ) : null}
        <div>
          <h2 className="font-semibold text-ink">Overall Performance Summary</h2>
          <p className="mt-1 text-ink-muted">{content.overallPerformanceSummary}</p>
        </div>
        <div>
          <h2 className="font-semibold text-ink">Learning Journey</h2>
          <p className="mt-1 text-ink-muted">{content.learningJourney}</p>
        </div>
        <div>
          <h2 className="font-semibold text-ink">Main Achievements</h2>
          <ul className="mt-1 list-disc pl-5 text-ink-muted">
            {content.mainAchievements.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-semibold text-ink">Goal Achievement</h2>
          <p className="mt-1 text-ink-muted">{content.goalAchievement}</p>
        </div>
        <div>
          <h2 className="font-semibold text-ink">Final Performance Summary</h2>
          <p className="mt-1 text-ink-muted">{content.finalPerformanceSummary}</p>
        </div>
        {weeksReadOnly}
        {signatureBlock}
      </div>
    );
  }

  return (
    <div className="space-y-4 text-sm">
      <div>
        <label className="label" htmlFor="introduction">Introduction</label>
        <textarea
          id="introduction"
          className="input"
          rows={3}
          value={content.introduction}
          onChange={(e) => update("introduction", e.target.value)}
        />
      </div>
      <div>
        <label className="label" htmlFor="training">Training Summary</label>
        <textarea
          id="training"
          className="input"
          rows={3}
          value={content.trainingSummary}
          onChange={(e) => update("trainingSummary", e.target.value)}
        />
      </div>
      <div>
        <label className="label" htmlFor="overall">Overall Performance Summary</label>
        <textarea
          id="overall"
          className="input"
          rows={3}
          value={content.overallPerformanceSummary}
          onChange={(e) => update("overallPerformanceSummary", e.target.value)}
        />
      </div>
      <div>
        <label className="label" htmlFor="journey">Learning Journey</label>
        <textarea
          id="journey"
          className="input"
          rows={3}
          value={content.learningJourney}
          onChange={(e) => update("learningJourney", e.target.value)}
        />
      </div>
      <div>
        <label className="label" htmlFor="achievements">
          Main Achievements (one per line)
        </label>
        <textarea
          id="achievements"
          className="input"
          rows={3}
          value={content.mainAchievements.join("\n")}
          onChange={(e) =>
            update(
              "mainAchievements",
              e.target.value
                .split("\n")
                .map((line) => line.trim())
                .filter(Boolean),
            )
          }
        />
      </div>
      <div>
        <label className="label" htmlFor="goals">Goal Achievement</label>
        <textarea
          id="goals"
          className="input"
          rows={3}
          value={content.goalAchievement}
          onChange={(e) => update("goalAchievement", e.target.value)}
        />
      </div>
      <div>
        <label className="label" htmlFor="final">Final Performance Summary</label>
        <textarea
          id="final"
          className="input"
          rows={3}
          value={content.finalPerformanceSummary}
          onChange={(e) => update("finalPerformanceSummary", e.target.value)}
        />
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <p className="label mb-0">Weeks and Tasks Breakdown</p>
          <button
            type="button"
            className="btn-secondary text-xs"
            onClick={() =>
              update("weeksAndTasks", [
                ...weeks,
                {
                  ...emptyWeek(),
                  weekNumber: (weeks[weeks.length - 1]?.weekNumber || 0) + 1,
                },
              ])
            }
          >
            Add week
          </button>
        </div>
        {weeks.length === 0 ? (
          <p className="text-ink-muted">No weeks listed yet.</p>
        ) : (
          weeks.map((week, index) => (
            <div key={`${week.weekNumber}-${index}`} className="rounded-xl border border-line p-3 space-y-2">
              <div className="grid gap-2 sm:grid-cols-2">
                <div>
                  <label className="label" htmlFor={`week-num-${index}`}>Week number</label>
                  <input
                    id={`week-num-${index}`}
                    className="input"
                    type="number"
                    min={1}
                    value={week.weekNumber}
                    onChange={(e) =>
                      updateWeek(index, {
                        ...week,
                        weekNumber: Number(e.target.value) || 1,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="label" htmlFor={`week-focus-${index}`}>Weekly focus</label>
                  <input
                    id={`week-focus-${index}`}
                    className="input"
                    value={week.weeklyFocus}
                    onChange={(e) =>
                      updateWeek(index, { ...week, weeklyFocus: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="label" htmlFor={`week-tasks-${index}`}>
                  Tasks (one per line; prefix with [x] for completed)
                </label>
                <textarea
                  id={`week-tasks-${index}`}
                  className="input"
                  rows={3}
                  value={week.tasks
                    .map((task) =>
                      `${task.isCompleted ? "[x] " : ""}${task.title}${
                        task.status ? ` | ${task.status}` : ""
                      }`,
                    )
                    .join("\n")}
                  onChange={(e) =>
                    updateWeek(index, {
                      ...week,
                      tasks: e.target.value
                        .split("\n")
                        .map((line) => line.trim())
                        .filter(Boolean)
                        .map((line) => {
                          const completed = line.startsWith("[x]");
                          const rest = completed ? line.slice(3).trim() : line;
                          const [titlePart, statusPart] = rest.split("|").map((p) => p.trim());
                          return {
                            title: titlePart || rest,
                            status: statusPart || "",
                            isCompleted: completed,
                          };
                        }),
                    })
                  }
                />
              </div>
            </div>
          ))
        )}
      </div>
      {signatureBlock}
    </div>
  );
}
