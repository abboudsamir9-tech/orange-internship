from datetime import date

from django.core.management.base import BaseCommand
from django.utils import timezone

from apps.accounts.models import MentorProfile, User
from apps.programs.models import (
    InternProfile,
    InternSkill,
    InternshipProgram,
    ProgramReferenceMaterial,
)
from apps.reports.models import FinalInternshipSummary, WeeklyReport
from apps.roadmaps.models import Roadmap, RoadmapWeek
from apps.submissions.models import Submission
from apps.tasks.models import Task, TaskAssignment, TaskResource
from common.constants import (
    AiContentStatus,
    ProgramStatus,
    RequirementType,
    ResourceType,
    RoadmapScope,
    RoadmapStatus,
    Role,
    TaskAssignmentStatus,
    TaskDifficulty,
    TaskSource,
)
from services.weekly_score import calculate_overall_weekly_score


class Command(BaseCommand):
    help = "Seed development data consistent with the frontend mock dataset."

    def handle(self, *args, **options):
        if User.objects.filter(email="admin@company.com").exists():
            self.stdout.write(self.style.WARNING("Seed data already exists. Skipping."))
            return

        admin = User.objects.create_user(
            email="admin@company.com",
            username="admin",
            password="admin123",
            full_name="System Admin",
            phone_number="+962-7-9000-0001",
            role=Role.ADMIN,
            is_staff=True,
            is_superuser=True,
        )

        mentor1 = User.objects.create_user(
            email="mentor@company.com",
            username="mentor",
            password="mentor123",
            full_name="Sara Khalil",
            phone_number="+962-7-9000-1001",
            role=Role.MENTOR,
        )
        MentorProfile.objects.create(
            user=mentor1,
            department="Product Engineering",
            job_title="Senior Frontend Engineer",
        )

        mentor2 = User.objects.create_user(
            email="omar.mentor@company.com",
            username="omar.mentor",
            password="mentor123",
            full_name="Omar Nasser",
            phone_number="+962-7-9000-1002",
            role=Role.MENTOR,
        )
        MentorProfile.objects.create(
            user=mentor2,
            department="Platform",
            job_title="Backend Engineering Lead",
        )

        prog1 = InternshipProgram.objects.create(
            mentor=mentor1,
            title="Frontend Engineering Internship",
            description="A structured internship focused on modern React and Next.js product development.",
            role="Frontend Engineering Intern",
            start_date=date(2026, 6, 1),
            end_date=date(2026, 8, 24),
            duration_weeks=12,
            department="Product Engineering",
            weekly_hours=30,
            maximum_interns=4,
            skills_needed=["HTML", "CSS", "JavaScript basics"],
            skills_to_develop=["React", "TypeScript", "Accessibility", "UI Systems"],
            goals="Build production-ready UI features and collaborate with mentors on real product work.",
            expected_outcome="Confident delivery of frontend features with mentor-reviewed quality.",
            final_project="Intern dashboard redesign with accessible components",
            additional_instructions="Prioritize clean UX and documentation of decisions.",
            status=ProgramStatus.ACTIVE,
        )
        prog2 = InternshipProgram.objects.create(
            mentor=mentor1,
            title="UX Research Internship",
            description="Internship covering user interviews, synthesis, and research ops.",
            role="UX Research Intern",
            start_date=date(2026, 7, 1),
            end_date=date(2026, 9, 23),
            duration_weeks=12,
            department="Design",
            weekly_hours=25,
            maximum_interns=2,
            skills_needed=["Communication", "Curiosity"],
            skills_to_develop=["Interviewing", "Affinity mapping", "Reporting"],
            goals="Produce actionable research insights for product teams.",
            expected_outcome="Two completed research studies with stakeholder presentations.",
            status=ProgramStatus.DRAFT,
        )
        prog3 = InternshipProgram.objects.create(
            mentor=mentor2,
            title="Backend Platform Internship",
            description="API design, data modeling, and reliability fundamentals.",
            role="Backend Engineering Intern",
            start_date=date(2026, 5, 1),
            end_date=date(2026, 7, 24),
            duration_weeks=12,
            department="Platform",
            weekly_hours=30,
            maximum_interns=3,
            skills_needed=["Python", "SQL basics"],
            skills_to_develop=["Django", "PostgreSQL", "API design"],
            goals="Ship reliable API endpoints with tests and documentation.",
            expected_outcome="Intern can own a small API feature end to end.",
            final_project="Task submission service module",
            status=ProgramStatus.COMPLETED,
        )
        InternshipProgram.objects.create(
            mentor=mentor2,
            title="Data Analytics Internship",
            description="Archived analytics internship from previous cycle.",
            role="Data Analytics Intern",
            start_date=date(2025, 9, 1),
            end_date=date(2025, 11, 24),
            duration_weeks=12,
            department="Analytics",
            weekly_hours=20,
            maximum_interns=2,
            skills_needed=["Excel", "Basic statistics"],
            skills_to_develop=["SQL", "Dashboards", "Storytelling"],
            goals="Support weekly product metrics reporting.",
            expected_outcome="Intern delivers recurring metric reports.",
            status=ProgramStatus.ARCHIVED,
        )

        intern1_user = User.objects.create_user(
            email="intern@company.com",
            username="intern",
            password="intern123",
            full_name="Lina Farouk",
            phone_number="+962-7-9000-2001",
            role=Role.INTERN,
        )
        intern1 = InternProfile.objects.create(
            user=intern1_user,
            mentor=mentor1,
            program=prog1,
            major="Computer Science",
            university="University of Jordan",
            learning_goals="Grow as a frontend engineer with strong accessibility habits.",
        )
        InternSkill.objects.bulk_create(
            [
                InternSkill(intern=intern1, skill_name="React", skill_level=3),
                InternSkill(intern=intern1, skill_name="TypeScript", skill_level=2),
                InternSkill(intern=intern1, skill_name="CSS", skill_level=3),
            ]
        )

        intern2_user = User.objects.create_user(
            email="yousef.intern@company.com",
            username="yousef.intern",
            password="intern123",
            full_name="Yousef Haddad",
            phone_number="+962-7-9000-2002",
            role=Role.INTERN,
        )
        intern2 = InternProfile.objects.create(
            user=intern2_user,
            mentor=mentor1,
            program=prog1,
            major="Software Engineering",
            university="German Jordanian University",
            learning_goals="Improve UI engineering and collaboration skills.",
        )
        InternSkill.objects.bulk_create(
            [
                InternSkill(intern=intern2, skill_name="JavaScript", skill_level=3),
                InternSkill(intern=intern2, skill_name="React", skill_level=2),
            ]
        )

        intern3_user = User.objects.create_user(
            email="maya.intern@company.com",
            username="maya.intern",
            password="intern123",
            full_name="Maya Rahman",
            phone_number="+962-7-9000-2003",
            role=Role.INTERN,
            is_active=False,
        )
        intern3 = InternProfile.objects.create(
            user=intern3_user,
            mentor=mentor2,
            program=prog3,
            major="Computer Science",
            university="Princess Sumaya University",
            learning_goals="Build backend ownership skills.",
        )
        InternSkill.objects.bulk_create(
            [
                InternSkill(intern=intern3, skill_name="Python", skill_level=3),
                InternSkill(intern=intern3, skill_name="SQL", skill_level=2),
            ]
        )

        ProgramReferenceMaterial.objects.bulk_create(
            [
                ProgramReferenceMaterial(
                    program=prog1,
                    title="Frontend Coding Standards",
                    resource_type=ResourceType.PDF,
                    external_url="https://example.com/frontend-standards.pdf",
                ),
                ProgramReferenceMaterial(
                    program=prog1,
                    title="Design System Guidelines",
                    resource_type=ResourceType.LINK,
                    external_url="https://example.com/design-system",
                ),
                ProgramReferenceMaterial(
                    program=prog1,
                    title="Accessibility Checklist",
                    resource_type=ResourceType.DOCX,
                    external_url="https://example.com/a11y-checklist.docx",
                ),
            ]
        )

        roadmap = Roadmap.objects.create(
            program=prog1,
            title="Frontend Internship Learning Roadmap",
            summary="Twelve-week plan covering foundations, feature delivery, accessibility, and a final project.",
            assignment_scope=RoadmapScope.PROGRAM,
            number_of_weeks=12,
            status=RoadmapStatus.PUBLISHED,
            generated_by_ai=True,
            approved_by=mentor1,
            approved_at=timezone.now(),
            published_at=timezone.now(),
        )
        roadmap.assigned_interns.set([intern1, intern2])

        week1 = RoadmapWeek.objects.create(
            roadmap=roadmap,
            week_number=1,
            weekly_focus="Environment and codebase orientation",
            learning_objectives=[
                "Set up local development",
                "Understand repo structure",
                "Review coding standards",
            ],
            expected_skills_gained=["Git workflow", "Repo navigation"],
            mentor_notes="Schedule a 30-minute orientation call.",
            start_date=date(2026, 6, 1),
            end_date=date(2026, 6, 7),
            display_order=1,
        )
        week2 = RoadmapWeek.objects.create(
            roadmap=roadmap,
            week_number=2,
            weekly_focus="Component fundamentals",
            learning_objectives=[
                "Build reusable UI components",
                "Apply accessible form patterns",
            ],
            expected_skills_gained=["Component design", "Accessibility basics"],
            display_order=2,
            start_date=date(2026, 6, 8),
            end_date=date(2026, 6, 14),
        )
        week3 = RoadmapWeek.objects.create(
            roadmap=roadmap,
            week_number=3,
            weekly_focus="Task board layout",
            learning_objectives=["Implement Kanban columns"],
            expected_skills_gained=["Layout systems"],
            display_order=3,
            start_date=date(2026, 6, 15),
            end_date=date(2026, 6, 21),
        )

        task1 = Task.objects.create(
            roadmap_week=week1,
            program=prog1,
            created_by=mentor1,
            title="Local setup and first PR",
            description=(
                "Clone the internship frontend repository, install dependencies, and confirm "
                "the app runs locally. Open a small documentation pull request."
            ),
            difficulty=TaskDifficulty.EASY,
            estimated_time_minutes=360,
            deliverable="Merged setup notes PR",
            success_criteria="App runs locally and PR follows standards",
            due_date=date(2026, 6, 7),
            requirement_type=RequirementType.REQUIRED,
            source=TaskSource.AI_GENERATED,
            display_order=1,
        )
        TaskResource.objects.bulk_create(
            [
                TaskResource(
                    task=task1,
                    title="Internship Handbook.pdf",
                    resource_type=ResourceType.PDF,
                    external_url="https://example.com/handbook.pdf",
                    display_order=1,
                ),
                TaskResource(
                    task=task1,
                    title="React Documentation",
                    resource_type=ResourceType.LINK,
                    external_url="https://react.dev/",
                    display_order=2,
                ),
            ]
        )

        task2 = Task.objects.create(
            roadmap_week=week2,
            program=prog1,
            created_by=mentor1,
            title="Build a summary card component",
            description="Create a reusable metric/summary card component with props and states.",
            difficulty=TaskDifficulty.MEDIUM,
            estimated_time_minutes=480,
            deliverable="Component with usage examples",
            success_criteria="Keyboard accessible and visually consistent",
            due_date=date(2026, 6, 14),
            requirement_type=RequirementType.REQUIRED,
            source=TaskSource.AI_GENERATED,
            display_order=1,
        )
        TaskResource.objects.create(
            task=task2,
            title="UI Guidelines.pdf",
            resource_type=ResourceType.PDF,
            external_url="https://example.com/ui-guidelines.pdf",
        )

        task3 = Task.objects.create(
            roadmap_week=week3,
            program=prog1,
            created_by=mentor1,
            title="Kanban column layout",
            description="Implement responsive task columns for five statuses.",
            difficulty=TaskDifficulty.MEDIUM,
            estimated_time_minutes=600,
            deliverable="Working board layout",
            success_criteria="All statuses visible and responsive",
            due_date=date(2026, 6, 21),
            requirement_type=RequirementType.REQUIRED,
            source=TaskSource.AI_GENERATED,
            display_order=1,
        )

        task4 = Task.objects.create(
            roadmap_week=week2,
            program=prog1,
            created_by=mentor1,
            title="Document accessibility checklist",
            description="Manually assigned task to document a11y checks for forms.",
            difficulty=TaskDifficulty.EASY,
            estimated_time_minutes=240,
            deliverable="Checklist markdown file",
            success_criteria="Covers keyboard, labels, and contrast",
            due_date=date(2026, 6, 16),
            requirement_type=RequirementType.OPTIONAL,
            source=TaskSource.MANUAL,
            display_order=2,
        )

        ta1 = TaskAssignment.objects.create(
            task=task1,
            intern=intern1,
            status=TaskAssignmentStatus.COMPLETED,
            score=92,
            mentor_feedback="Excellent setup notes and clear PR description.",
            reviewed_at=timezone.now(),
            completed_at=timezone.now(),
        )
        TaskAssignment.objects.create(
            task=task2,
            intern=intern1,
            status=TaskAssignmentStatus.SUBMITTED,
        )
        TaskAssignment.objects.create(
            task=task3,
            intern=intern1,
            status=TaskAssignmentStatus.IN_PROGRESS,
        )
        TaskAssignment.objects.create(
            task=task4,
            intern=intern1,
            status=TaskAssignmentStatus.TO_DO,
        )
        ta5 = TaskAssignment.objects.create(
            task=task1,
            intern=intern2,
            status=TaskAssignmentStatus.COMPLETED,
            score=85,
            mentor_feedback="Solid work. Add more screenshots next time.",
            reviewed_at=timezone.now(),
            completed_at=timezone.now(),
        )
        TaskAssignment.objects.create(
            task=task2,
            intern=intern2,
            status=TaskAssignmentStatus.NEEDS_REVISION,
            mentor_feedback="Please improve empty-state handling before resubmitting.",
        )
        TaskAssignment.objects.create(
            task=task3,
            intern=intern2,
            status=TaskAssignmentStatus.TO_DO,
        )

        Submission.objects.create(
            task_assignment=ta1,
            version_number=1,
            written_response="Completed setup and documented steps in SETUP.md.",
            external_url="",
        )
        Submission.objects.create(
            task_assignment=ta5,
            version_number=1,
            written_response="Local environment ready. Added onboarding notes.",
        )

        wr1 = WeeklyReport.objects.create(
            intern=intern1,
            program=prog1,
            roadmap_week=week1,
            performance_summary="Strong start with timely setup delivery and clear communication.",
            achievements=["Completed setup PR", "Documented local workflow"],
            learning_progress="Building confidence with repository navigation and PR etiquette.",
            productivity_analysis="Completed required week-1 tasks on schedule.",
            mentor_focus_suggestions=["Introduce component patterns early in week 2"],
            recommended_next_focus="Reusable UI components and accessibility basics",
            additional_mentor_notes="Great communication during onboarding week.",
            status=AiContentStatus.APPROVED,
            approved_by=mentor1,
            approved_at=timezone.now(),
            overall_weekly_score=calculate_overall_weekly_score(intern1, week1),
        )
        WeeklyReport.objects.create(
            intern=intern2,
            program=prog1,
            roadmap_week=week1,
            performance_summary="Good progress with room to improve documentation detail.",
            achievements=["Environment setup complete"],
            learning_progress="Comfortable with basics; needs more TypeScript practice.",
            productivity_analysis="Finished core task; optional work not started.",
            mentor_focus_suggestions=["Pair on TypeScript types mid-week"],
            recommended_next_focus="Component implementation with mentor checkpoints",
            status=AiContentStatus.APPROVED,
            approved_by=mentor1,
            approved_at=timezone.now(),
            overall_weekly_score=calculate_overall_weekly_score(intern2, week1),
        )
        WeeklyReport.objects.create(
            intern=intern1,
            program=prog1,
            roadmap_week=week2,
            performance_summary="Draft analysis of week-2 submissions pending mentor edits.",
            achievements=["Submitted summary card component"],
            learning_progress="Applying component composition patterns.",
            productivity_analysis="On track for required work; optional task outstanding.",
            mentor_focus_suggestions=["Review accessibility labels before approval"],
            recommended_next_focus="Kanban board layout and status UX",
            status=AiContentStatus.DRAFT,
            overall_weekly_score=calculate_overall_weekly_score(intern1, week2),
        )

        FinalInternshipSummary.objects.create(
            intern=intern3,
            program=prog3,
            overall_performance_summary="Maya completed the backend internship with consistent delivery.",
            learning_journey="Progressed from guided tasks to independently owned endpoints.",
            main_achievements=["Shipped submission service module", "Improved API docs"],
            goal_achievement="Met core internship goals for API ownership.",
            final_performance_summary="Ready for junior backend responsibilities with mentoring.",
            final_score=88,
            mentor_comments="Reliable contributor with strong API fundamentals.",
            additional_mentor_notes="Strong ownership on the submission service module.",
            status=AiContentStatus.APPROVED,
            approved_by=mentor2,
            approved_at=timezone.now(),
        )
        FinalInternshipSummary.objects.create(
            intern=intern1,
            program=prog1,
            overall_performance_summary="Draft final summary placeholder for mid-program review.",
            learning_journey="Building UI systems expertise across early weeks.",
            main_achievements=["Setup excellence", "Component delivery in progress"],
            goal_achievement="On track toward program goals.",
            final_performance_summary="Pending completion of remaining weeks.",
            status=AiContentStatus.DRAFT,
        )

        self.stdout.write(self.style.SUCCESS("Seed data created successfully."))
        self.stdout.write("Admin: admin@company.com / admin123")
        self.stdout.write("Mentor: mentor@company.com / mentor123")
        self.stdout.write("Intern: intern@company.com / intern123")
        self.stdout.write(f"Weekly report sample score (Lina week 1): {wr1.overall_weekly_score}")
