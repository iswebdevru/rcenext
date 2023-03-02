from django.db import models
from api.subjects.models import Subject


class Teacher(models.Model):
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    patronymic = models.CharField(max_length=255)
    subjects = models.ManyToManyField(Subject, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
