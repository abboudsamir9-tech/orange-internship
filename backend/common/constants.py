class Role:
    ADMIN = "ADMIN"
    MENTOR = "MENTOR"
    INTERN = "INTERN"
    CHOICES = [
        (ADMIN, "Admin"),
        (MENTOR, "Mentor"),
        (INTERN, "Intern"),
    ]


class ProgramStatus:
    DRAFT = "DRAFT"
    ACTIVE = "ACTIVE"
    COMPLETED = "COMPLETED"
    ARCHIVED = "ARCHIVED"
    CANCELLED = "CANCELLED"
    CHOICES = [
        (DRAFT, "Draft"),
        (ACTIVE, "Active"),
        (COMPLETED, "Completed"),
        (ARCHIVED, "Archived"),
        (CANCELLED, "Cancelled"),
    ]


class RoadmapScope:
    PROGRAM = "PROGRAM"
    GROUP = "GROUP"
    INDIVIDUAL = "INDIVIDUAL"
    CHOICES = [
        (PROGRAM, "Entire Program"),
        (GROUP, "Selected Interns"),
        (INDIVIDUAL, "Individual Intern"),
    ]


class RoadmapStatus:
    DRAFT = "DRAFT"
    PUBLISHED = "PUBLISHED"
    ARCHIVED = "ARCHIVED"
    CHOICES = [
        (DRAFT, "Draft"),
        (PUBLISHED, "Published"),
        (ARCHIVED, "Archived"),
    ]


class TaskDifficulty:
    EASY = "EASY"
    MEDIUM = "MEDIUM"
    HARD = "HARD"
    CHOICES = [
        (EASY, "Easy"),
        (MEDIUM, "Medium"),
        (HARD, "Hard"),
    ]


class RequirementType:
    REQUIRED = "REQUIRED"
    OPTIONAL = "OPTIONAL"
    CHOICES = [
        (REQUIRED, "Required"),
        (OPTIONAL, "Optional"),
    ]


class TaskSource:
    AI_GENERATED = "AI_GENERATED"
    MANUAL = "MANUAL"
    CHOICES = [
        (AI_GENERATED, "AI Generated"),
        (MANUAL, "Manual"),
    ]


class TaskAssignmentStatus:
    TO_DO = "TO_DO"
    IN_PROGRESS = "IN_PROGRESS"
    SUBMITTED = "SUBMITTED"
    NEEDS_REVISION = "NEEDS_REVISION"
    COMPLETED = "COMPLETED"
    CHOICES = [
        (TO_DO, "To Do"),
        (IN_PROGRESS, "In Progress"),
        (SUBMITTED, "Submitted"),
        (NEEDS_REVISION, "Needs Revision"),
        (COMPLETED, "Completed"),
    ]


class AiContentStatus:
    DRAFT = "DRAFT"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    CHOICES = [
        (DRAFT, "Draft"),
        (APPROVED, "Approved"),
        (REJECTED, "Rejected"),
    ]


class ResourceType:
    PDF = "PDF"
    DOC = "DOC"
    DOCX = "DOCX"
    PPT = "PPT"
    PPTX = "PPTX"
    IMAGE = "IMAGE"
    ZIP = "ZIP"
    LINK = "LINK"
    CHOICES = [
        (PDF, "PDF"),
        (DOC, "DOC"),
        (DOCX, "DOCX"),
        (PPT, "PPT"),
        (PPTX, "PPTX"),
        (IMAGE, "Image"),
        (ZIP, "ZIP"),
        (LINK, "Link"),
    ]


class SkillLevel:
    BEGINNER = 1
    BASIC = 2
    INTERMEDIATE = 3
    ADVANCED = 4
    EXPERT = 5
    CHOICES = [
        (BEGINNER, "Beginner"),
        (BASIC, "Basic"),
        (INTERMEDIATE, "Intermediate"),
        (ADVANCED, "Advanced"),
        (EXPERT, "Expert"),
    ]
