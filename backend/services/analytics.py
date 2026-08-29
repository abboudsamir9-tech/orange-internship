from collections import defaultdict

from django.db.models import Count, Q

from apps.programs.models import InternshipProgram
from common.constants import ProgramStatus


def programs_overlapping_range(queryset, start_date=None, end_date=None):
    qs = queryset
    start_date = start_date or None
    end_date = end_date or None
    if start_date and end_date:
        qs = qs.filter(start_date__lte=end_date, end_date__gte=start_date)
    elif start_date:
        qs = qs.filter(end_date__gte=start_date)
    elif end_date:
        qs = qs.filter(start_date__lte=end_date)
    return qs


def build_program_analytics(queryset, start_date=None, end_date=None, status=None, department=None):
    qs = programs_overlapping_range(queryset, start_date, end_date)
    if status:
        qs = qs.filter(status=status)
    if department:
        qs = qs.filter(department__iexact=department)

    qs = qs.select_related("mentor").annotate(intern_count=Count("interns", distinct=True))

    by_department = defaultdict(int)
    by_status = {choice[0]: 0 for choice in ProgramStatus.CHOICES}
    mentor_ids = set()
    total_interns = 0

    rows = []
    for program in qs:
        by_department[program.department] += 1
        by_status[program.status] = by_status.get(program.status, 0) + 1
        mentor_ids.add(program.mentor_id)
        total_interns += program.intern_count
        rows.append(
            {
                "id": program.id,
                "title": program.title,
                "department": program.department,
                "mentor": program.mentor.full_name,
                "mentor_id": program.mentor_id,
                "role": program.role,
                "start_date": program.start_date,
                "end_date": program.end_date,
                "status": program.status,
                "number_of_interns": program.intern_count,
            }
        )

    total_programs = qs.count()
    avg_interns = round(total_interns / total_programs, 1) if total_programs else 0

    return {
        "filters": {
            "start_date": start_date,
            "end_date": end_date,
            "status": status,
            "department": department,
        },
        "metrics": {
            "total_programs": total_programs,
            "active_programs": qs.filter(status=ProgramStatus.ACTIVE).count(),
            "completed_programs": qs.filter(status=ProgramStatus.COMPLETED).count(),
            "total_interns": total_interns,
            "mentors_involved": len(mentor_ids),
            "average_interns_per_program": avg_interns,
        },
        "programs_by_department": [
            {"department": name, "count": count}
            for name, count in sorted(by_department.items())
        ],
        "programs_by_status": [
            {"status": key, "count": value} for key, value in by_status.items()
        ],
        "programs": rows,
    }
