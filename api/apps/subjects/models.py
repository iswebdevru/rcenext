from django.db import models
from apps.core.models import TimestampModel


class Subject(TimestampModel):
    name = models.CharField(max_length=255, unique=True)
