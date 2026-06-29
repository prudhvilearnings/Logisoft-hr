from django.db import models
from django.contrib.auth.models import AbstractUser

class Team(models.Model):
    name = models.CharField(max_length=255, unique=True)
    leader = models.ForeignKey(
        'CustomUser',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='led_teams'
    )

    def __str__(self):
        return self.name


class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('MANAGER', 'Manager'),
        ('TEAM_LEAD', 'Team Lead'),
        ('EMPLOYEE', 'Employee'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='EMPLOYEE')
    team = models.ForeignKey(
        Team,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='members'
    )

    def __str__(self):
        return f"{self.username} ({self.role})"
