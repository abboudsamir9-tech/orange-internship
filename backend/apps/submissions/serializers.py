from django.db.models import Max
from rest_framework import serializers

from apps.submissions.models import Submission, SubmissionFile
from apps.tasks.models import TaskAssignment
from common.constants import TaskAssignmentStatus
from common.validators import validate_upload_file


class SubmissionFileSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = SubmissionFile
        fields = [
            "id",
            "file",
            "file_url",
            "original_file_name",
            "file_type",
            "file_size",
            "uploaded_at",
        ]
        read_only_fields = ["id", "file_size", "uploaded_at", "file_url"]

    def get_file_url(self, obj):
        request = self.context.get("request")
        if obj.file and request:
            return request.build_absolute_uri(obj.file.url)
        if obj.file:
            return obj.file.url
        return None


class SubmissionSerializer(serializers.ModelSerializer):
    files = SubmissionFileSerializer(many=True, read_only=True)
    uploaded_files = serializers.ListField(
        child=serializers.FileField(),
        write_only=True,
        required=False,
    )

    class Meta:
        model = Submission
        fields = [
            "id",
            "task_assignment",
            "version_number",
            "written_response",
            "external_url",
            "intern_notes",
            "files",
            "uploaded_files",
            "submitted_at",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "version_number",
            "submitted_at",
            "created_at",
            "updated_at",
            "files",
        ]

    def validate(self, attrs):
        written = attrs.get("written_response", "")
        external = attrs.get("external_url", "")
        files = attrs.get("uploaded_files") or []
        for uploaded in files:
            validate_upload_file(uploaded)
        if not written and not external and not files:
            raise serializers.ValidationError(
                "Provide a written response, external URL, or at least one file."
            )
        return attrs

    def create(self, validated_data):
        files = validated_data.pop("uploaded_files", [])
        assignment: TaskAssignment = validated_data["task_assignment"]
        latest = assignment.submissions.aggregate(v=Max("version_number"))["v"] or 0
        submission = Submission.objects.create(
            version_number=latest + 1,
            **validated_data,
        )
        for uploaded in files:
            SubmissionFile.objects.create(
                submission=submission,
                file=uploaded,
                original_file_name=uploaded.name,
                file_type=uploaded.content_type or "",
                file_size=uploaded.size,
            )
        assignment.status = TaskAssignmentStatus.SUBMITTED
        assignment.save(update_fields=["status", "updated_at"])
        return submission
