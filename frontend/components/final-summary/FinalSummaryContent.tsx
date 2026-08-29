import type { FinalSummary } from "@/types";

type Content = FinalSummary["content"];

export function FinalSummaryContent({
  content,
  editable = false,
  onChange,
}: {
  content: Content;
  editable?: boolean;
  onChange?: (next: Content) => void;
}) {
  function update<K extends keyof Content>(key: K, value: Content[K]) {
    onChange?.({ ...content, [key]: value });
  }

  if (!editable) {
    return (
      <div className="space-y-4 text-sm">
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
      </div>
    );
  }

  return (
    <div className="space-y-4 text-sm">
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
    </div>
  );
}
