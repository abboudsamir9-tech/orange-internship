from io import BytesIO

from django.http import HttpResponse
from openpyxl import Workbook
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.programs.models import InternshipProgram, ProgramReferenceMaterial
from apps.programs.serializers import (
    InternshipProgramSerializer,
    ProgramReferenceMaterialSerializer,
)
from common.constants import Role
from permissions.roles import IsAdmin, IsMentor
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas as pdf_canvas
from rest_framework.exceptions import PermissionDenied

from services.analytics import build_program_analytics


class InternshipProgramViewSet(viewsets.ModelViewSet):
    serializer_class = InternshipProgramSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        qs = InternshipProgram.objects.select_related("mentor").prefetch_related(
            "reference_materials",
            "interns",
        )
        if user.role == Role.ADMIN:
            return qs
        if user.role == Role.MENTOR:
            return qs.filter(mentor=user)
        if user.role == Role.INTERN and hasattr(user, "intern_profile"):
            return qs.filter(id=user.intern_profile.program_id)
        return qs.none()

    def get_permissions(self):
        if self.action in {"create", "update", "partial_update", "destroy"}:
            return [IsMentor()]
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(mentor=self.request.user)

    def update(self, request, *args, **kwargs):
        if request.user.role == Role.ADMIN:
            return Response(
                {"detail": "Admin cannot edit program content."},
                status=status.HTTP_403_FORBIDDEN,
            )
        program = self.get_object()
        if program.mentor_id != request.user.id:
            return Response({"detail": "Not your program."}, status=status.HTTP_403_FORBIDDEN)
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        program = self.get_object()
        if program.mentor_id != request.user.id:
            return Response({"detail": "Not your program."}, status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)


class ProgramReferenceMaterialViewSet(viewsets.ModelViewSet):
    serializer_class = ProgramReferenceMaterialSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        qs = ProgramReferenceMaterial.objects.select_related("program")
        if user.role == Role.ADMIN:
            return qs
        if user.role == Role.MENTOR:
            return qs.filter(program__mentor=user)
        if user.role == Role.INTERN and hasattr(user, "intern_profile"):
            return qs.filter(program_id=user.intern_profile.program_id)
        return qs.none()

    def get_permissions(self):
        if self.action in {"create", "update", "partial_update", "destroy"}:
            return [IsMentor()]
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        program = serializer.validated_data["program"]
        if program.mentor_id != self.request.user.id:
            raise PermissionDenied("Not your program.")
        serializer.save()


class ProgramAnalyticsView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        data = build_program_analytics(
            InternshipProgram.objects.all(),
            start_date=request.query_params.get("start_date"),
            end_date=request.query_params.get("end_date"),
            status=request.query_params.get("status"),
            department=request.query_params.get("department"),
        )
        return Response(data)


class ProgramAnalyticsExportExcelView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        data = build_program_analytics(
            InternshipProgram.objects.all(),
            start_date=request.query_params.get("start_date"),
            end_date=request.query_params.get("end_date"),
            status=request.query_params.get("status"),
            department=request.query_params.get("department"),
        )
        wb = Workbook()
        ws = wb.active
        ws.title = "Programs"
        ws.append(
            [
                "Program title",
                "Department",
                "Mentor",
                "Role",
                "Start date",
                "End date",
                "Status",
                "Number of interns",
            ]
        )
        for row in data["programs"]:
            ws.append(
                [
                    row["title"],
                    row["department"],
                    row["mentor"],
                    row["role"],
                    str(row["start_date"]),
                    str(row["end_date"]),
                    row["status"],
                    row["number_of_interns"],
                ]
            )
        buffer = BytesIO()
        wb.save(buffer)
        buffer.seek(0)
        response = HttpResponse(
            buffer.getvalue(),
            content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        )
        response["Content-Disposition"] = 'attachment; filename="programs-overview.xlsx"'
        return response


class ProgramAnalyticsExportPdfView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        data = build_program_analytics(
            InternshipProgram.objects.all(),
            start_date=request.query_params.get("start_date"),
            end_date=request.query_params.get("end_date"),
            status=request.query_params.get("status"),
            department=request.query_params.get("department"),
        )
        buffer = BytesIO()
        pdf = pdf_canvas.Canvas(buffer, pagesize=letter)
        y = 750
        pdf.setFont("Helvetica-Bold", 14)
        pdf.drawString(50, y, "Programs Analytics Overview")
        y -= 30
        pdf.setFont("Helvetica", 10)
        metrics = data["metrics"]
        for key, value in metrics.items():
            pdf.drawString(50, y, f"{key}: {value}")
            y -= 16
        y -= 10
        for row in data["programs"]:
            if y < 60:
                pdf.showPage()
                y = 750
            pdf.drawString(
                50,
                y,
                f"{row['title']} | {row['department']} | {row['mentor']} | {row['status']}",
            )
            y -= 14
        pdf.save()
        buffer.seek(0)
        response = HttpResponse(buffer.getvalue(), content_type="application/pdf")
        response["Content-Disposition"] = 'attachment; filename="programs-overview.pdf"'
        return response
