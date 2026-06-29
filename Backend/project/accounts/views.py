from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model

from .serializers import (
    CustomTokenObtainPairSerializer,
    UserRegisterSerializer,
    UserSerializer,
    AssignRoleSerializer,
    TeamSerializer
)
from .permissions import IsManager, IsTeamLead
from .services import create_user_service, assign_role_and_team_service
from .models import Team

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    """
    Public endpoint for registering a user.
    """
    permission_classes = [AllowAny]
    serializer_class = UserRegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = create_user_service(
            username=serializer.validated_data['username'],
            email=serializer.validated_data['email'],
            password=serializer.validated_data['password'],
            role=serializer.validated_data.get('role', 'EMPLOYEE'),
            team_id=serializer.validated_data.get('team').id if serializer.validated_data.get('team') else None,
            first_name=serializer.validated_data.get('first_name', ''),
            last_name=serializer.validated_data.get('last_name', '')
        )
        
        response_serializer = UserSerializer(user)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)


class LoginView(TokenObtainPairView):
    """
    Public endpoint for logging in. Returns access + refresh tokens and custom user payload.
    """
    permission_classes = [AllowAny]
    serializer_class = CustomTokenObtainPairSerializer


class LogoutView(APIView):
    """
    Authenticated endpoint to blacklist refresh token on logout.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            if not refresh_token:
                return Response({"detail": "Refresh token is required."}, status=status.HTTP_400_BAD_REQUEST)
            
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"detail": "Successfully logged out."}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(generics.RetrieveAPIView):
    """
    Returns the authenticated user's profile.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class UserListView(generics.ListAPIView):
    """
    Lists users based on RBAC requirements:
    - Manager: Can view all employees and team leads.
    - TeamLead: Can view assigned employees only.
    - Employee: Cannot access (handled by permission_classes).
    """
    permission_classes = [IsTeamLead]
    serializer_class = UserSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role == 'MANAGER':
            return User.objects.all().order_by('-date_joined')
        elif user.role == 'TEAM_LEAD':
            # View employees that are in teams where this user is the leader
            return User.objects.filter(team__leader=user).exclude(id=user.id).order_by('-date_joined')
        return User.objects.none()


class AssignRoleView(APIView):
    """
    Manager only endpoint to assign roles and teams to users.
    """
    permission_classes = [IsManager]

    def post(self, request, pk):
        try:
            target_user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = AssignRoleSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        role = serializer.validated_data.get('role')
        team_id = serializer.validated_data.get('team_id')

        updated_user = assign_role_and_team_service(target_user, role=role, team_id=team_id)
        
        return Response(UserSerializer(updated_user).data, status=status.HTTP_200_OK)


class TeamListCreateView(generics.ListCreateAPIView):
    """
    Endpoint for Managers to create/list teams.
    """
    permission_classes = [IsManager]
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
