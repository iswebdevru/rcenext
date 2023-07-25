from django.db import models
from backend.shared.models import TimestampModel
from backend.subjects.models import Subject


class Teacher(TimestampModel):
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    patronymic = models.CharField(max_length=255)
    subjects = models.ManyToManyField(Subject, blank=True)
