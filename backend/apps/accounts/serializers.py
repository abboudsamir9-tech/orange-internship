from django.contrib.auth import authenticate, password_validation
from django.core.exceptions import ValidationError as DjangoValidationError
from django.db import transaction
from rest_framework import serializers

from apps.accounts.models import MentorProfile, User
from apps.programs.models import InternProfile, InternSkill, InternshipProgram
from common.constants import Role, SkillLevel


def validate_unique_email(value: str) -> str:
    email = value.strip()
    if User.objects.filter(email__iexact=email).exists():
        raise serializers.ValidationError("This email is already in use.")
    return email


def validate_unique_username(value: str) -> str:
    username = value.strip()
    if User.objects.filter(username__iexact=username).exists():
        raise serializers.ValidationError("This username is already in use.")
    return username


def validate_account_password(value: str) -> str:
    try:
        password_validation.validate_password(value)
    except DjangoValidationError as exc:
        raise serializers.ValidationError(list(exc.messages)) from exc
    return value


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "username",
            "full_name",
            "phone_number",
            "role",
            "is_active",
            "date_joined",
            "created_at",
            "updated_at",
        ]
        read_only_fields = fields


class MentorProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = MentorProfile
        fields = [
            "id",
            "user",
            "department",
            "job_title",
            "created_at",
            "updated_at",
        ]
        read_only_fields = fields


class InternSkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = InternSkill
        fields = ["id", "skill_name", "skill_level", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]


class InternProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    skills = InternSkillSerializer(many=True, read_only=True)
    mentor_name = serializers.CharField(source="mentor.full_name", read_only=True)
    program_title = serializers.CharField(source="program.title", read_only=True)

    class Meta:
        model = InternProfile
        fields = [
            "id",
            "user",
            "mentor",
            "mentor_name",
            "program",
            "program_title",
            "major",
            "university",
            "learning_goals",
            "skills",
            "created_at",
            "updated_at",
        ]
        read_only_fields = fields


class LoginSerializer(serializers.Serializer):
    email = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        identifier = attrs.get("email", "").strip()
        password = attrs.get("password")
        user = authenticate(
            request=self.context.get("request"),
            username=identifier,
            password=password,
        )
        if user is None:
            # Allow username login as well as email.
            try:
                found = User.objects.get(username__iexact=identifier)
            except User.DoesNotExist:
                found = None
            if found is not None:
                user = authenticate(
                    request=self.context.get("request"),
                    username=found.email,
                    password=password,
                )
        if user is None or not user.is_active:
            raise serializers.ValidationError("Invalid credentials or inactive account.")
        attrs["user"] = user
        return attrs


class MentorCreateSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=255)
    email = serializers.EmailField()
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(write_only=True)
    phone_number = serializers.CharField(max_length=50, allow_blank=True, required=False)
    department = serializers.CharField(max_length=255)
    job_title = serializers.CharField(max_length=255)

    def validate_email(self, value):
        return validate_unique_email(value)

    def validate_username(self, value):
        return validate_unique_username(value)

    def validate_password(self, value):
        return validate_account_password(value)

    @transaction.atomic
    def create(self, validated_data):
        profile_data = {
            "department": validated_data.pop("department"),
            "job_title": validated_data.pop("job_title"),
        }
        password = validated_data.pop("password")
        user = User.objects.create_user(
            role=Role.MENTOR,
            password=password,
            **validated_data,
        )
        MentorProfile.objects.create(user=user, **profile_data)
        return user


class InternSkillInputSerializer(serializers.Serializer):
    skill_name = serializers.CharField(max_length=100)
    skill_level = serializers.ChoiceField(choices=SkillLevel.CHOICES)


class InternCreateSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=255)
    email = serializers.EmailField()
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(write_only=True)
    phone_number = serializers.CharField(max_length=50, allow_blank=True, required=False)
    mentor_id = serializers.IntegerField()
    program_id = serializers.IntegerField(required=False, allow_null=True)
    major = serializers.CharField(max_length=255, allow_blank=True, required=False)
    university = serializers.CharField(max_length=255, allow_blank=True, required=False)
    learning_goals = serializers.CharField(allow_blank=True, required=False)
    skills = InternSkillInputSerializer(many=True)

    def validate_email(self, value):
        return validate_unique_email(value)

    def validate_username(self, value):
        return validate_unique_username(value)

    def validate_password(self, value):
        return validate_account_password(value)

    def validate_mentor_id(self, value):
        if not User.objects.filter(id=value, role=Role.MENTOR, is_active=True).exists():
            raise serializers.ValidationError("Mentor not found.")
        return value

    def validate_program_id(self, value):
        if value is None:
            return value
        if not InternshipProgram.objects.filter(id=value).exists():
            raise serializers.ValidationError("Program not found.")
        return value

    @transaction.atomic
    def create(self, validated_data):
        skills = validated_data.pop("skills", [])
        mentor_id = validated_data.pop("mentor_id")
        program_id = validated_data.pop("program_id", None)
        password = validated_data.pop("password")
        major = validated_data.pop("major", "")
        university = validated_data.pop("university", "")
        learning_goals = validated_data.pop("learning_goals", "")

        user = User.objects.create_user(
            role=Role.INTERN,
            password=password,
            **validated_data,
        )
        profile = InternProfile.objects.create(
            user=user,
            mentor_id=mentor_id,
            program_id=program_id,
            major=major,
            university=university,
            learning_goals=learning_goals,
        )
        for skill in skills:
            InternSkill.objects.create(intern=profile, **skill)
        return user
