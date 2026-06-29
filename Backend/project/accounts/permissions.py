from rest_framework.permissions import BasePermission

class IsManager(BasePermission):
    """
    Allows access only to users with the MANAGER role.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.role == 'MANAGER'
        )


class IsTeamLead(BasePermission):
    """
    Allows access to users with the TEAM_LEAD role or MANAGER role.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.role in ['TEAM_LEAD', 'MANAGER']
        )


class IsEmployee(BasePermission):
    """
    Allows access to all authenticated users with valid roles (lowest role).
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.role in ['EMPLOYEE', 'TEAM_LEAD', 'MANAGER']
        )
