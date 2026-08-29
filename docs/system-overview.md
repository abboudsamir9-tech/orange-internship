# System Overview

## Business Purpose

The AI-Powered Internship Management Platform helps organizations run structured internship programs. Mentors define programs, generate personalized learning roadmaps with AI assistance, assign and review tasks, and produce performance reports. Interns follow their roadmap, submit work, and receive feedback. Admins oversee users, programs, and system activity.

## Primary Users

| Role | Purpose |
|------|---------|
| **Admin** | Manage accounts, assign interns to mentors, monitor system activity |
| **Mentor** | Create programs, generate and approve AI content, manage tasks and reviews |
| **Intern** | Follow assigned program, complete tasks, view feedback and approved reports |

## Main Workflow

1. Admin sets up Mentor and Intern accounts and assigns interns to mentors.
2. Mentor creates an internship program and generates an AI roadmap.
3. Mentor reviews, edits, and publishes the roadmap.
4. Tasks appear for assigned interns on a Kanban board.
5. Interns work on tasks, submit responses and files, and receive mentor feedback and scores.
6. Mentor generates, reviews, and approves AI weekly performance reports.
7. At program end, Mentor generates, reviews, and approves a final internship summary.
8. Approved summaries can be downloaded as PDF. Intern accounts are deactivated after completion.

## AI Role in the System

AI assists with three features using a **two-stage architecture**:

1. **Prompt Builder** — assembles structured context into one optimized prompt
2. **LLM Generation** — sends the prompt to OpenAI; validates JSON response
3. **Mentor approval** — draft content reviewed before it affects interns

Features:

1. **Initial roadmap generation** — structured weekly learning plans from program and intern data
2. **Weekly performance reports** — analysis of task activity, scores, and feedback
3. **Final internship summary** — comprehensive end-of-program report

All AI output is generated as **drafts**. Nothing AI-generated is visible to interns or treated as final until a Mentor reviews and approves it.

## Human Approval Principle

- AI generates suggestions; humans decide what becomes official.
- Mentors can edit, regenerate, approve, or reject AI content before it affects interns.
- The OpenAI API key stays on the backend only; the frontend never calls AI directly.
- AI does not make hiring decisions or automatic recommendations.
