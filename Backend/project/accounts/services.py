from django.contrib.auth import get_user_model
from .models import Team

User = get_user_model()

def create_user_service(username, email, password, role='EMPLOYEE', team_id=None, first_name='', last_name=''):
    """
    Handles business logic for creating a new user with role and optional team mapping.
    """
    team = None
    if team_id:
        try:
            team = Team.objects.get(id=team_id)
        except Team.DoesNotExist:
            pass

    user = User(
        username=username,
        email=email,
        role=role,
        team=team,
        first_name=first_name,
        last_name=last_name
    )
    user.set_password(password)
    user.save()
    return user


def assign_role_and_team_service(user, role=None, team_id=None):
    """
    Handles assigning roles and updating team membership for a user.
    """
    if role:
        user.role = role
    
    if team_id is not None:
        try:
            team = Team.objects.get(id=team_id)
            user.team = team
        except Team.DoesNotExist:
            user.team = None
    elif team_id == '':
        user.team = None

    user.save()
    return user
