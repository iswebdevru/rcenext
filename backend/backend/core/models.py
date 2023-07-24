from django.db import models


class TimestampModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class ScheduleType(models.TextChoices):
    CHANGES = 'changes'
    MAIN = 'main'


class WeekDay(models.TextChoices):
    MONDAY = 'ПН'
    TUESDAY = 'ВТ'
    WEDNESDAY = 'СР'
    THURSDAY = 'ЧТ'
    FRIDAY = 'ПТ'
    SATURDAY = 'СБ'
    SUNDAY = 'ВС'
