import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDate } from "@/lib/labels";
import type { InternshipProgram } from "@/types";

function SkillList({ items }: { items: string[] }) {
  if (!items.length) return <span className="text-ink-muted">—</span>;
  return (
    <ul className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <li
          key={item}
          className="rounded-full bg-brand-light px-2.5 py-1 text-xs font-medium text-brand-dark"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

export function ProgramSummary({
  program,
  compact = false,
  showStatus = true,
  mentorName,
}: {
  program: InternshipProgram;
  compact?: boolean;
  showStatus?: boolean;
  mentorName?: string;
}) {
  const displayMentor = mentorName || "Mentor";

  if (compact) {
    return (
      <div className="space-y-2 text-sm">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <p className="font-semibold text-ink">{program.title}</p>
          {showStatus ? <StatusBadge kind="program" value={program.status} /> : null}
        </div>
        <p className="line-clamp-2 text-ink-muted">{program.description}</p>
        <p className="text-ink-muted">
          {program.role} · {program.department}
        </p>
        <p className="text-xs text-ink-muted">
          {formatDate(program.startDate)} – {formatDate(program.endDate)} · {program.weeklyHours} hrs/week
        </p>
        <p className="text-xs text-ink-muted">Mentor: {displayMentor}</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        {showStatus ? <StatusBadge kind="program" value={program.status} /> : null}
        <span className="text-sm text-ink-muted">{program.department}</span>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-ink">{program.title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">{program.description}</p>
      </div>

      <dl className="grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Role</dt>
          <dd className="mt-1 text-sm text-ink">{program.role}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Mentor</dt>
          <dd className="mt-1 text-sm text-ink">{displayMentor}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Start date</dt>
          <dd className="mt-1 text-sm text-ink">{formatDate(program.startDate)}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-ink-muted">End date</dt>
          <dd className="mt-1 text-sm text-ink">{formatDate(program.endDate)}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
            Maximum number of interns
          </dt>
          <dd className="mt-1 text-sm text-ink">{program.maxInterns}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Weekly hours</dt>
          <dd className="mt-1 text-sm text-ink">{program.weeklyHours} hrs/week</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Department</dt>
          <dd className="mt-1 text-sm text-ink">{program.department}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Duration</dt>
          <dd className="mt-1 text-sm text-ink">{program.durationWeeks} weeks</dd>
        </div>
      </dl>

      <div>
        <h3 className="text-sm font-semibold text-ink">Goals</h3>
        <p className="mt-1 text-sm text-ink-muted">{program.goals}</p>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-ink">Skills to develop</h3>
        <SkillList items={program.skillsToDevelop} />
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-ink">Skills needed</h3>
        <SkillList items={program.skillsNeeded} />
      </div>

      {program.expectedOutcome ? (
        <div>
          <h3 className="text-sm font-semibold text-ink">Expected outcome</h3>
          <p className="mt-1 text-sm text-ink-muted">{program.expectedOutcome}</p>
        </div>
      ) : null}

      {program.finalProject ? (
        <div>
          <h3 className="text-sm font-semibold text-ink">Final project</h3>
          <p className="mt-1 text-sm text-ink-muted">{program.finalProject}</p>
        </div>
      ) : null}

      {program.additionalInstructions ? (
        <div>
          <h3 className="text-sm font-semibold text-ink">Additional instructions</h3>
          <p className="mt-1 text-sm text-ink-muted">{program.additionalInstructions}</p>
        </div>
      ) : null}
    </div>
  );
}
