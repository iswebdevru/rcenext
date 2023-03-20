from django.db import models
from apps.subjects.models import Subject
from apps.core.models import TimestampModel


class Teacher(TimestampModel):
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    patronymic = models.CharField(max_length=255)
    subjects = models.ManyToManyField(Subject, blank=True)
