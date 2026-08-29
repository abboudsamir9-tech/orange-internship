from pathlib import Path

from django.conf import settings
from django.core.exceptions import ValidationError


def validate_upload_file(uploaded_file):
    if uploaded_file is None:
        return
    if uploaded_file.size > settings.MAX_UPLOAD_SIZE_BYTES:
        raise ValidationError("File exceeds the 20 MB limit.")
    ext = Path(uploaded_file.name).suffix.lower()
    if ext not in settings.ALLOWED_UPLOAD_EXTENSIONS:
        raise ValidationError(
            f"File type '{ext}' is not allowed. "
            f"Allowed: {', '.join(sorted(settings.ALLOWED_UPLOAD_EXTENSIONS))}"
        )


def validate_score(value):
    if value is None:
        return
    if not isinstance(value, int) or value < 0 or value > 100:
        raise ValidationError("Score must be an integer from 0 to 100.")


def infer_resource_type(filename: str | None = None, external_url: str | None = None) -> str:
    from common.constants import ResourceType

    name = (filename or "").lower()
    if name.endswith(".pdf"):
        return ResourceType.PDF
    if name.endswith(".docx"):
        return ResourceType.DOCX
    if name.endswith(".doc"):
        return ResourceType.DOC
    if name.endswith(".pptx"):
        return ResourceType.PPTX
    if name.endswith(".ppt"):
        return ResourceType.PPT
    if name.endswith((".png", ".jpg", ".jpeg", ".gif", ".webp")):
        return ResourceType.IMAGE
    if name.endswith(".zip"):
        return ResourceType.ZIP
    if external_url:
        return ResourceType.LINK
    return ResourceType.PDF
