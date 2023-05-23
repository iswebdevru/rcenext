from django.db import models
from django.db.models import Q
from apps.groups.models import Group
from apps.subjects.models import Subject
from apps.teachers.models import Teacher
from apps.core.models import TimestampModel


class ClassesSchedule(TimestampModel):
    class ScheduleType(models.TextChoices):
        CHANGES = 'changes'
        MAIN = 'main'
    class ViewMode(models.TextChoices):
        TABLE = 'table'
        MESSAGE = 'message'
    class WeekDay(models.TextChoices):
        MONDAY = 'ПН'
        TUESDAY = 'ВТ'
        WEDNESDAY = 'СР'
        THURSDAY = 'ЧТ'
        FRIDAY = 'ПТ'
        SATURDAY = 'СБ'
        SUNDAY = 'ВС'
    class WeekType(models.TextChoices):
        DENOMINATOR = 'ЗНАМ'
        NUMERATOR = 'ЧИСЛ'

    type = models.CharField(max_length=7, choices=ScheduleType.choices)
    view = models.CharField(max_length=7, choices=ViewMode.choices)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)

    date = models.DateField(null=True, blank=True)
    week_day = models.CharField(max_length=2, choices=WeekDay.choices, null=True, blank=True)
    week_type = models.CharField(max_length=4, choices=WeekType.choices, null=True, blank=True)

    message = models.CharField(max_length=400, null=True, blank=True)

    class Meta:
        constraints = [
            models.constraints.CheckConstraint(
                check=Q(type='main') & Q(view='table') & Q(week_day__isnull=False) & Q(week_type__isnull=False)
                | Q(type='changes') & Q(date__isnull=False),
                name="Целостность данных в зависимости от состояния"
            ),
            models.constraints.UniqueConstraint(
                'group',
                'date',
                condition=Q(type='changes'),
                name="Группа может иметь только одно изменение в расписании на один день"
            ),
            models.constraints.UniqueConstraint(
                'group',
                'week_type',
                'week_day',
                condition=Q(type='main'),
                name="Группа может иметь только одно расписание на один день"
            ),
        ]


class ClassesSchedulePeriod(TimestampModel):
    timetable = models.ForeignKey(
        ClassesSchedule,
        on_delete=models.CASCADE,
        related_name='periods'
    )
    index = models.PositiveSmallIntegerField()
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    teachers = models.ManyToManyField(Teacher)
    cabinet = models.CharField(max_length=255)

    class Meta:
        constraints = [
            models.constraints.UniqueConstraint(
                'timetable',
                'index',
                name="Номер пары должен быть уникальным",
            ),
        ]
        ordering = ['index']
