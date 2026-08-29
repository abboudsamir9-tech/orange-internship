from django.contrib.auth import get_user_model
from django.db import IntegrityError
from rest_framework import generics, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from apps.accounts.models import MentorProfile
from apps.accounts.serializers import (
    InternCreateSerializer,
    InternProfileSerializer,
    LoginSerializer,
    MentorCreateSerializer,
    MentorProfileSerializer,
    UserSerializer,
)
from apps.programs.models import InternProfile
from common.constants import Role
from permissions.roles import IsAdmin, IsAdminOrMentor

User = get_user_model()


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": UserSerializer(user).data,
            }
        )


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh = request.data.get("refresh")
        if not refresh:
            return Response(
                {"detail": "Refresh token is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            token = RefreshToken(refresh)
            token.blacklist()
        except Exception:
            return Response(
                {"detail": "Invalid refresh token."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response({"detail": "Logged out."})


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        data = UserSerializer(request.user).data
        if request.user.role == Role.MENTOR and hasattr(request.user, "mentor_profile"):
            data["mentor_profile"] = MentorProfileSerializer(request.user.mentor_profile).data
        if request.user.role == Role.INTERN and hasattr(request.user, "intern_profile"):
            data["intern_profile"] = InternProfileSerializer(request.user.intern_profile).data
        return Response(data)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by("full_name")
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]
    http_method_names = ["get", "patch", "delete", "head", "options"]

    def partial_update(self, request, *args, **kwargs):
        # Admin may deactivate/reactivate only via is_active.
        allowed = {"is_active"}
        data = {k: v for k, v in request.data.items() if k in allowed}
        user = self.get_object()
        for key, value in data.items():
            setattr(user, key, value)
        user.save(update_fields=list(data.keys()) + ["updated_at"])
        return Response(UserSerializer(user).data)

    def destroy(self, request, *args, **kwargs):
        user = self.get_object()
        if user.id == request.user.id:
            return Response(
                {"detail": "You cannot delete your own account."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class MentorCreateView(generics.CreateAPIView):
    permission_classes = [IsAdmin]
    serializer_class = MentorCreateSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            user = serializer.save()
        except IntegrityError:
            return Response(
                {"detail": "Unable to create account. Username or email may already be in use."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)


class InternCreateView(generics.CreateAPIView):
    permission_classes = [IsAdmin]
    serializer_class = InternCreateSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            user = serializer.save()
        except IntegrityError:
            return Response(
                {"detail": "Unable to create account. Username or email may already be in use."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)


class MentorListView(generics.ListAPIView):
    permission_classes = [IsAdmin]
    serializer_class = MentorProfileSerializer
    queryset = MentorProfile.objects.select_related("user").all()


class InternListView(generics.ListAPIView):
    permission_classes = [IsAdminOrMentor]
    serializer_class = InternProfileSerializer

    def get_queryset(self):
        qs = InternProfile.objects.select_related("user", "mentor", "program").prefetch_related(
            "skills"
        )
        user = self.request.user
        if user.role == Role.ADMIN:
            return qs
        return qs.filter(mentor=user)
