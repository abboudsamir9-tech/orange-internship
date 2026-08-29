import {
  averageWeeklyScore,
  formatScoreOutOf100,
  type WeeklyTaskScore,
} from "@/lib/weeklyScore";

export function WeeklyScoreCard({ scores }: { scores: WeeklyTaskScore[] }) {
  const average = averageWeeklyScore(scores);

  return (
    <section className="rounded-xl border border-brand/30 bg-brand-soft/70 p-4">
      <h2 className="section-title">Overall Weekly Score</h2>
      {average === null ? (
        <p className="mt-2 text-sm text-ink-muted">
          No scored tasks available for this week.
        </p>
      ) : (
        <>
          <p className="mt-2 text-3xl font-bold text-brand-dark">
            {formatScoreOutOf100(average)}
          </p>
          <ul className="mt-3 space-y-1 text-sm text-ink-muted">
            {scores.map((row) => (
              <li key={`${row.taskTitle}-${row.score}`}>
                {row.taskTitle}: {formatScoreOutOf100(row.score)}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-ink-muted">
            Average of mentor scores for reviewed tasks in this week.
          </p>
        </>
      )}
    </section>
  );
}
